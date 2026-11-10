"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export default function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed bottom-[calc(4.6rem+env(safe-area-inset-bottom))] right-4 z-40 lg:bottom-5 flex flex-col items-end gap-3 sm:right-6">
      <AnimatePresence>
        {show && (
          <motion.button
            key="top" initial={{ opacity: 0, scale: 0.6, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"
            className="grid h-11 w-11 place-items-center rounded-full glass border border-white/60 dark:border-white/10 text-ink shadow-lg hover:border-brand-400 hover:text-brand-text">
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <a href={`tel:${SITE.phone}`} aria-label={`Call ${SITE.phone}`}
        className="group relative flex h-12 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 pl-3.5 pr-3.5 text-white shadow-lg shadow-brand-600/30 transition-all hover:pr-5">
        <span className="relative grid h-5 w-5 place-items-center"><span className="animate-ping-slow absolute inset-0 rounded-full bg-white/50" /><Phone className="relative h-5 w-5" /></span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-40 group-hover:opacity-100">{SITE.phone}</span>
      </a>
    </div>
  );
}
