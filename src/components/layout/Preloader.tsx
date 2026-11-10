"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_START_EVENT } from "@/lib/navigate";

/** Animated pin used by the full-screen loader. */
export function PinLoader({ size = 64 }: { size?: number }) {
  return (
    <div className="relative grid place-items-center" style={{ width: size * 2.2, height: size * 2.2 }} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span key={i} className="ring-pulse absolute rounded-full border-2 border-brand-500/60" style={{ width: size * 2, height: size * 2, animationDelay: `${i}s` }} />
      ))}
      <span className="absolute bottom-[22%] h-2 w-10 rounded-full bg-black/25 blur-[3px] pin-shadow" />
      <Image src="/img/app/icon.png" alt="" width={size} height={Math.round(size * 1.07)} priority className="pin-bounce relative drop-shadow-lg" />
    </div>
  );
}

const MIN_INITIAL_MS = 1100; // first page load
const SHOW_DELAY_MS = 120;   // don't flash the loader for instant navigations
const MIN_NAV_MS = 450;      // once shown, keep it long enough to read as a loader
const FAILSAFE_MS = 8000;

/**
 * Full-screen loader.
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
      window.setTimeout(() => { shownAt.current = 0; setNavigating(false); }, Math.max(0, MIN_NAV_MS - visibleFor));
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
          className={initial ? "fixed inset-0 z-[200] grid place-items-center bg-background" : "fixed inset-0 z-[200] grid place-items-center bg-background/75 backdrop-blur-md"}
          initial={{ opacity: initial ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} aria-live="polite" aria-busy="true"
        >
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-600/15 blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-center">
            <PinLoader size={initial ? 72 : 60} />
            <p className="mt-2 text-sm font-semibold tracking-wide text-ink">Safety GPS Tracker</p>
            <p className="mt-0.5 text-xs text-body">{initial ? "Locating your fleet…" : "Loading page…"}</p>
            <div className="mt-5 h-1 w-44 overflow-hidden rounded-full bg-line" aria-hidden>
              <motion.div className="h-full w-1/2 rounded-full bg-gradient-to-r from-brand-400 to-brand-600" animate={{ x: ["-100%", "220%"] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
