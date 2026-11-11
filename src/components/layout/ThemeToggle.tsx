"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme } from "@/store/slices/uiSlice";
import { applyTheme } from "./ThemeSync";
import { cn } from "@/utils/format";

/**
 * One button that shows the icon of the theme that is active right now
 * (sun = light, moon = dark). Click to switch; the new theme reveals as a
 * circle growing from the button (View Transitions API, instant where unsupported).
 */
export default function ThemeToggle({ className, showLabels = false }: { className?: string; showLabels?: boolean }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const next = theme === "dark" ? "light" : "dark";

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || reduced) { applyTheme(next); dispatch(setTheme(next)); return; }

    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = doc.startViewTransition(() => { applyTheme(next); dispatch(setTheme(next)); });
    t.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
      );
    }).catch(() => {});
  };

  return (
    <button
      onClick={onClick}
      aria-label={`${theme === "dark" ? "Dark" : "Light"} theme active. Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cn(
        "glass relative flex h-8 w-8 md:h-10 md:w-10 items-center justify-center gap-2 overflow-hidden rounded-full border border-line-strong text-ink transition-transform hover:border-brand-400 active:scale-90",
        showLabels ? "px-4" : "",
        className,
      )}
    >
      <span className="relative grid h-5 w-5 place-items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            {theme === "dark" ? <Moon className=" md:h-[18px] md:w-[18px] text-brand-400" /> : <Sun className="h-[18px] w-[18px] text-brand-600" />}
          </motion.span>
        </AnimatePresence>
      </span>
      {showLabels && <span className="text-xs font-semibold">{theme === "dark" ? "Dark" : "Light"}</span>}
    </button>
  );
}

/** Kept for existing imports; same single-icon button. */
export const ThemeQuickToggle = ThemeToggle;
