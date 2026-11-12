"use client";
import RichText, { isHtml } from "@/components/common/RichText";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/types";
import { cn } from "@/utils/format";

export default function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={it.q}
            className={cn(
              "overflow-hidden rounded-md bg-softer/80 dark:bg-navy-900/90 transition-all duration-200",
              isOpen
                ? "[&>button]:text-brand-text"
                : "hover:-translate-y-0.5"
            )}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-ink transition-colors sm:text-base"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{it.q}</span>
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-all duration-200",
                  isOpen
                    ? "bg-brand-500/10 text-brand-text rotate-180"
                    : "bg-surface text-slate-400 dark:bg-navy-950/70"
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-xs leading-relaxed text-body sm:text-sm">
                    {isHtml(it.a) ? <RichText html={it.a} /> : it.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
