"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/types";

export default function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line rounded-lg glass border border-white/60 dark:border-white/10">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[14px] md:text-base font-semibold text-ink hover:bg-soft"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {it.q}
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <p className="px-5 pb-4 text-sm leading-relaxed text-body">{it.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
