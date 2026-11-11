"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Cpu, Home, LayoutGrid, Menu, Tag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileNav } from "@/store/slices/uiSlice";
import { cn } from "@/utils/format";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/features", label: "Features", icon: LayoutGrid },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/devices", label: "Devices", icon: Cpu },
] as const;

/** Native-app style tab bar, shown below the lg breakpoint. */
export default function BottomNav() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const moreOpen = useAppSelector((s) => s.ui.mobileNavOpen);
  const moreActive = moreOpen || ["/solutions", "/about", "/contact", "/pay-bill"].some((h) => pathname.startsWith(h));

  /* Hide while scrolling down, show again when scrolling up or near the top */
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastY.current;
        if (y < 80) setHidden(false);
        else if (dy > 8) setHidden(true);
        else if (dy < -8) setHidden(false);
        if (Math.abs(dy) > 8 || y < 80) lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // show again after navigating to a new page
  const [shownFor, setShownFor] = useState(pathname);
  if (shownFor !== pathname) {
    setShownFor(pathname);
    setHidden(false);
  }

  const isHidden = hidden && !moreOpen;
  useEffect(() => {
    document.documentElement.toggleAttribute("data-nav-hidden", isHidden);
    return () => document.documentElement.removeAttribute("data-nav-hidden");
  }, [isHidden]);

  const item = "relative flex flex-1 flex-col items-center justify-center gap-0.5 pt-1.5 text-xs font-semibold transition-colors active:scale-95";
  return (
    <nav aria-label="Primary" className={cn("fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden", isHidden && "translate-y-full")}>
      <div className="mx-auto flex h-[3.6rem] max-w-xl items-stretch">
        {TABS.map((t) => {
          const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <Link key={t.href} href={t.href} aria-current={active ? "page" : undefined} className={cn(item, active ? "text-brand-text" : "text-body")}>
              {active && <motion.span layoutId="tab-pill" className="absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-brand-600" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <t.icon className={cn("h-[22px] w-[22px] transition-transform", active && "scale-110")} strokeWidth={active ? 2.4 : 2} />
              {t.label}
            </Link>
          );
        })}
        <button onClick={() => dispatch(setMobileNav(!moreOpen))} aria-expanded={moreOpen} aria-label="More" className={cn(item, moreActive ? "text-brand-text" : "text-body")}>
          <Menu className="h-[22px] w-[22px]" strokeWidth={moreActive ? 2.4 : 2} />
          More
        </button>
      </div>
    </nav>
  );
}
