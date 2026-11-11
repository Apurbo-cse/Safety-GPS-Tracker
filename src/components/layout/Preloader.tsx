"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_START_EVENT } from "@/lib/navigate";

/** Radar-style GPS loader: sweeping beam, pulsing rings, orbiting satellite and the app pin. */
export function PinLoader({ size = 64 }: { size?: number }) {
  const d = size * 2.4;
  return (
    <div className="relative grid place-items-center" style={{ width: d, height: d }} role="status" aria-label="Loading">
      {/* radar disc */}
      <div className="absolute inset-0 rounded-full border border-brand-500/30 bg-[radial-gradient(circle,rgb(240_90_34/0.14),transparent_70%)]" />
      <div className="absolute inset-[18%] rounded-full border border-brand-500/20" />
      <div className="absolute inset-[36%] rounded-full border border-brand-500/20" />
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-brand-500/15" />
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-brand-500/15" />
      {/* sweep */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgb(240_90_34/0.55),rgb(240_90_34/0)_25%,transparent)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
      {/* blips */}
      {[[22, 30, 0], [70, 26, 0.6], [62, 72, 1.2]].map(([x, y, delay]) => (
        <motion.span
          key={`${x}-${y}`}
          aria-hidden
          className="absolute h-2 w-2 rounded-full bg-green-400"
          style={{ left: `${x}%`, top: `${y}%` }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, delay }}
        />
      ))}
      {/* orbiting satellite */}
      <motion.div aria-hidden className="absolute inset-[-6px]" animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white ring-4 ring-brand-500/40" />
      </motion.div>
      {/* pin */}
      <span className="pin-shadow absolute bottom-[34%] h-1.5 w-8 rounded-full bg-black/30 blur-[2px]" />
      <Image src="/img/app/icon.png" alt="" width={size} height={Math.round(size * 1.07)} priority className="pin-bounce relative" />
    </div>
  );
}

const MIN_INITIAL_MS = 1100; // first page load
const SHOW_DELAY_MS = 120;   // don't flash the loader for instant navigations
const MIN_NAV_MS = 450;      // once shown, keep it long enough to read as a loader
const FAILSAFE_MS = 8000;

/**
 * Full-screen loader — the same radar pin loader for first load and page navigation.
 *  - first load: solid overlay until the page has loaded
 *  - navigation: translucent overlay on top of the *previous* page, shown from the click
 *    until the new route has rendered
 */
export default function Preloader() {
  const pathname = usePathname();
  const [initial, setInitial] = useState(true);
  const [navigating, setNavigating] = useState(false);

  const pending = useRef(false);
  const shownAt = useRef(0);
  const showTimer = useRef<number | undefined>(undefined);
  const failsafe = useRef<number | undefined>(undefined);
  const lastPath = useRef(pathname);

  /* first load */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const hide = () => window.setTimeout(() => setInitial(false), Math.max(0, (reduced ? 150 : MIN_INITIAL_MS) - (performance.now() - start)));
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });
    const guard = window.setTimeout(() => setInitial(false), 6000);
    return () => { window.removeEventListener("load", hide); window.clearTimeout(guard); };
  }, []);

  const finish = useCallback(() => {
    pending.current = false;
    window.clearTimeout(showTimer.current);
    window.clearTimeout(failsafe.current);
    // wait for the new page to paint, and for the loader to have been visible long enough
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const visibleFor = shownAt.current ? performance.now() - shownAt.current : MIN_NAV_MS;
      window.setTimeout(() => {
        shownAt.current = 0;
        setNavigating(false);
        if (!window.location.hash) {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      }, Math.max(0, MIN_NAV_MS - visibleFor));
    }));
  }, []);

  const start = useCallback(() => {
    if (pending.current) return;
    pending.current = true;
    showTimer.current = window.setTimeout(() => { if (pending.current) { shownAt.current = performance.now(); setNavigating(true); } }, SHOW_DELAY_MS);
    failsafe.current = window.setTimeout(finish, FAILSAFE_MS);
  }, [finish]);

  /* internal link clicks + programmatic navigations */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || a.target === "_blank" || a.hasAttribute("download") || !href.startsWith("/") || href.startsWith("//")) return;
      if (new URL(href, location.href).pathname === location.pathname) return;
      start();
    };
    document.addEventListener("click", onClick);
    window.addEventListener(NAV_START_EVENT, start);
    return () => { document.removeEventListener("click", onClick); window.removeEventListener(NAV_START_EVENT, start); };
  }, [start]);

  /* new route committed -> hide */
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    finish();
  }, [pathname, finish]);

  const visible = initial || navigating;
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="preloader" key="preloader"
          className="fixed inset-0 z-[200] grid select-none place-items-center bg-black/30"
          initial={{ opacity: initial ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: "easeInOut" }} aria-live="polite" aria-busy="true"
        >
          <PinLoader size={50} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
