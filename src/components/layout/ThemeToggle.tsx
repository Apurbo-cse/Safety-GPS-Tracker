"use client";
import { useId, useRef } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, type ThemeMode } from "@/store/slices/uiSlice";
import { applyTheme } from "./ThemeSync";
import { cn } from "@/utils/format";

const OPTIONS = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
] as const;

/**
 * Animated light/dark switch.
 * - sliding pill (shared layout animation)
 * - arrow-key navigation (radiogroup semantics)
 * - circular reveal from the click point via the View Transitions API
 */
export default function ThemeToggle({ className, showLabels = false }: { className?: string; showLabels?: boolean }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const choose = (mode: ThemeMode, el?: HTMLElement | null) => {
    if (mode === theme) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || reduced || !el) { dispatch(setTheme(mode)); return; }

    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = doc.startViewTransition(() => { applyTheme(mode); dispatch(setTheme(mode)); });
    t.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
      );
    }).catch(() => {});
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + OPTIONS.length) % OPTIONS.length;
    refs.current[n]?.focus();
    choose(OPTIONS[n].id, refs.current[n]);
  };

  return (
    <div role="radiogroup" aria-label="Color theme" className={cn("relative inline-flex items-center rounded-full border border-line bg-soft p-1 shadow-inner", className)}>
      {OPTIONS.map((o, i) => {
        const active = theme === o.id;
        return (
          <button
            key={o.id}
            ref={(el) => { refs.current[i] = el; }}
            role="radio"
            aria-checked={active}
            aria-label={`${o.label} theme`}
            tabIndex={active ? 0 : -1}
            onClick={(e) => choose(o.id, e.currentTarget)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn("group relative z-10 flex h-8 items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-colors focus-visible:outline-offset-1", showLabels ? "px-3" : "w-8", active ? "text-white" : "text-body hover:text-ink")}
          >
            {active && (
              <motion.span layoutId={`theme-pill-${uid}`} className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 shadow-md shadow-brand-600/30" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
            )}
            <motion.span
              animate={{ rotate: active && o.id === "light" ? 90 : 0, scale: active ? 1.1 : 1 }}
              whileHover={{ rotate: o.id === "light" ? 45 : 0, scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="grid place-items-center"
            >
              <o.icon className="h-4 w-4" />
            </motion.span>
            {showLabels && <span>{o.label}</span>}
            {!showLabels && (
              <span role="tooltip" className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy-950 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {o.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** One-tap icon version for the compact mobile app bar. */
export function ThemeQuickToggle({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button onClick={() => { applyTheme(next); dispatch(setTheme(next)); }} aria-label={`Switch to ${next} theme`}
      className={cn("grid h-10 w-10 place-items-center rounded-full text-body-strong active:scale-90 hover:bg-softer", className)}>
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
