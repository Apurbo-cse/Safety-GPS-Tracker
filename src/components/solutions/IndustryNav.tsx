"use client";
import { useEffect, useRef, useState } from "react";
import Container from "@/components/common/Container";
import { DynIcon } from "@/lib/icons";
import { solutions } from "@/data/solutions";
import { cn } from "@/utils/format";

/** Sticky chip bar that jumps to each industry and highlights the one in view. */
export default function IndustryNav() {
  const [active, setActive] = useState(solutions[0].id);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = solutions.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  // Auto-scroll active chip into center view in the sticky nav
  useEffect(() => {
    if (!navRef.current) return;
    const activeChip = navRef.current.querySelector<HTMLElement>(`[data-nav-id="${active}"]`);
    if (activeChip) {
      activeChip.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [active]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      window.history.replaceState(null, "", `#${id}`);
      setActive(id);
    }
  };

  return (
    <div className="sticky top-14 z-30 bg-surface/90 dark:bg-navy-950/90 backdrop-blur-md lg:top-[4.25rem]">
      <Container>
        <nav
          ref={navRef}
          aria-label="Industries"
          className="-mx-3 px-3 sm:mx-0 sm:px-0 flex items-center gap-1.5 overflow-x-auto py-2.5 sm:py-3 [scrollbar-width:none]"
        >
          {solutions.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-nav-id={s.id}
              onClick={(e) => handleScrollTo(e, s.id)}
              aria-current={active === s.id}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm transition-all",
                active === s.id
                  ? "bg-brand-500 text-white font-bold"
                  : "bg-softer/80 dark:bg-navy-900/80 text-body hover:text-ink font-semibold hover:bg-softer"
              )}
            >
              <DynIcon name={s.icon} className="h-3.5 w-3.5" />
              <span>{s.title}</span>
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}
