"use client";
import { useEffect, useState } from "react";
import { cn } from "@/utils/format";

const ITEMS = [["plans", "Packages"], ["finder", "Find my plan"], ["timeline", "Cost over time"], ["compare", "Compare"], ["faq", "FAQ"]] as const;

/** Sticky section tabs for the pricing page, highlighting the section in view. */
export default function PricingSubNav() {
  const [active, setActive] = useState<string>("plans");

  useEffect(() => {
    const els = ITEMS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <nav aria-label="Pricing sections" className="glass sticky top-14 z-30 border-y border-white/60 dark:border-white/10 lg:top-16">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:px-6 lg:px-8">
        {ITEMS.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={go(id)} aria-current={active === id ? "true" : undefined}
            className={cn("shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors", active === id ? "bg-brand-600 text-white" : "text-body hover:bg-softer hover:text-ink")}>{label}</a>
        ))}
      </div>
    </nav>
  );
}
