"use client";
import { useEffect, useState } from "react";
import Container from "@/components/common/Container";
import { DynIcon } from "@/lib/icons";
import { solutions } from "@/data/solutions";
import { cn } from "@/utils/format";

/** Sticky chip bar that jumps to each industry and highlights the one in view. */
export default function IndustryNav() {
  const [active, setActive] = useState(solutions[0].id);
  useEffect(() => {
    const els = solutions.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => { entries.forEach((e) => e.isIntersecting && setActive(e.target.id)); }, { rootMargin: "-30% 0px -60% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return (
    <div className="sticky top-14 z-30 border-b border-line bg-background/85 backdrop-blur lg:top-[4.25rem]">
      <Container>
        <nav aria-label="Industries" className="flex gap-2 overflow-x-auto py-2.5 [scrollbar-width:none]">
          {solutions.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id} className={cn("flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors", active === s.id ? "border-brand-600 bg-brand-600 text-white" : "border-line-strong bg-surface text-body-strong hover:border-brand-400")}>
              <DynIcon name={s.icon} className="h-3.5 w-3.5" />{s.title}
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}
