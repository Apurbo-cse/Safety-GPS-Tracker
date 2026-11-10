"use client";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, type ThemeMode } from "@/store/slices/uiSlice";

export const THEME_KEY = "sgt-theme";

/** Applies a theme to <html> immediately (idempotent with the effect below). */
export function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
}

/** Keeps the `dark` class on <html> in sync with the Redux theme and remembers the choice. */
export default function ThemeSync() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);

  // First load: saved choice, otherwise the device preference.
  useEffect(() => {
    let initial: ThemeMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") initial = saved;
    } catch { /* storage unavailable */ }
    dispatch(setTheme(initial));
  }, [dispatch]);

  useEffect(() => {
    applyTheme(theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  return <Toaster position="top-right" richColors closeButton theme={theme} />;
}
