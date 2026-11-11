"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

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
            className="grid h-11 w-11 place-items-center rounded-full glass border border-line text-ink   hover:border-brand-400 hover:text-brand-text">
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence> 
    </div>
  );
}
