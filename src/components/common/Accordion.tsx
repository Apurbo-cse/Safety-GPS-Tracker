"use client";
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
              "overflow-hidden rounded-md border bg-surface transition-all duration-200",
              isOpen
                ? "border-brand-500/60 shadow-sm ring-1 ring-brand-500/20"
                : "border-line hover:border-brand-400/50"
            )}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-ink transition-colors hover:bg-soft/60 sm:text-base"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{it.q}</span>
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-all duration-200",
                  isOpen
                    ? "border-brand-500 bg-brand-500/10 text-brand-text rotate-180"
                    : "border-line bg-soft text-slate-400"
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
                  <p className="border-t border-line/60 bg-soft/30 px-5 py-4 text-xs leading-relaxed text-body sm:text-sm">
                    {it.a}
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
