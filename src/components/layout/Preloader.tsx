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

const STEPS_INITIAL = ["Connecting to satellites", "Syncing your vehicles", "Fetching live positions", "Almost there"];
const STEPS_NAV = ["Loading page", "Preparing map", "Almost there"];

/** Rotating status line with a counting percentage. */
function LoaderStatus({ initial }: { initial: boolean }) {
  const steps = initial ? STEPS_INITIAL : STEPS_NAV;
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const a = window.setInterval(() => setStep((n) => Math.min(n + 1, steps.length - 1)), initial ? 380 : 260);
    const b = window.setInterval(() => setPct((p) => (p >= 99 ? 99 : p + Math.max(1, Math.round((99 - p) / 6)))), 60);
    return () => { window.clearInterval(a); window.clearInterval(b); };
  }, [initial, steps.length]);
  return (
    <div className="relative mt-1 flex w-full items-center justify-between gap-2 font-mono text-[11px] text-slate-400">
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" /><span className="relative h-1.5 w-1.5 rounded-full bg-green-400" /></span>
        <AnimatePresence mode="wait">
          <motion.span key={step} className="truncate" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
            {steps[step]}…
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="shrink-0 font-bold tabular-nums text-brand-400">{pct}%</span>
    </div>
  );
}

const ROUTE_D = "M4 22 C 40 22, 46 6, 84 8 S 130 26, 166 14 S 214 4, 236 12";

/** Mini route with a vehicle dot travelling along it. */
function RouteLine() {
  return (
    <svg viewBox="0 0 240 30" className="relative mt-3 h-8 w-full" aria-hidden>
      <path d={ROUTE_D} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="5" strokeLinecap="round" />
      <path d={ROUTE_D} fill="none" stroke="#f05a22" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6" className="route-flow" />
      <circle cx="4" cy="22" r="3.5" fill="#4ade80" />
      <g>
        <animateMotion dur="2.2s" repeatCount="indefinite" path={ROUTE_D} />
        <circle r="7" fill="#f05a22" opacity=".25" />
        <circle r="4" fill="#fff" stroke="#f05a22" strokeWidth="2" />
      </g>
      <path d="M236 4 a5 5 0 0 1 5 5 c0 4-5 9-5 9 s-5-5-5-9 a5 5 0 0 1 5-5z" fill="#f05a22" transform="translate(-5 -3)" />
    </svg>
  );
}

/** Navigation loader: top shimmer bar + spinning rings around the app icon. */
function NavLoader() {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[3px] overflow-hidden">
        <motion.div
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-brand-500 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="relative grid size-32 place-items-center" role="status" aria-label="Loading page">
        <div className="absolute size-28 rounded-full border border-dashed border-brand-500/45 animate-[spin_9s_linear_infinite]" />
        <div className="absolute flex size-28 justify-center animate-[spin_3s_linear_infinite]">
          <span className="-mt-1 size-2.5 rounded-full bg-brand-500 ring-2 ring-brand-500/25" />
        </div>
        <div className="absolute size-20 rounded-full border-2 border-transparent border-y-brand-500 animate-spin" />
        <div className="absolute size-14 rounded-full border border-brand-500/45 opacity-40 animate-ping" />
        <motion.div
          className="relative z-10 grid size-14 place-items-center  border border-line bg-surface p-2"
          animate={{ scale: [0.94, 1.05, 0.94] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src="/img/app/icon.png" alt="" width={32} height={34} priority className="h-8 w-auto" />
        </motion.div>
      </div>
    </>
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
          className={initial ? "fixed inset-0 z-[200] grid place-items-center bg-black/30" : "fixed inset-0 z-[200] grid select-none place-items-center bg-black/20"}
          initial={{ opacity: initial ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: "easeInOut" }} aria-live="polite" aria-busy="true"
        >
          {!initial ? <NavLoader /> : (
          <div className="relative  p-px">
      
            <div className="relative flex w-[17rem] flex-col items-center overflow-hidden ">
          
              <div className="relative"><PinLoader size={initial ? 52 : 46} /></div> 
            </div>
          </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
