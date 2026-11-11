"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2, ChevronRight, Cpu, CreditCard, HelpCircle, Home, Info, LayoutGrid, LogIn, LogOut, Mail, Phone, Tag, UserPlus, X, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/common/Logo";
import { announceNavigation } from "@/lib/navigate";
import ThemeToggle from "./ThemeToggle";
import { SITE } from "@/lib/site";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileNav } from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";
import { cn } from "@/utils/format";

const LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/features", label: "Features", icon: LayoutGrid },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/devices", label: "Tracking Devices", icon: Cpu },
  { href: "/solutions", label: "Solutions", icon: Building2 },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/pay-bill", label: "Pay Bill", icon: CreditCard },
];

/** Left-side app drawer opened from the "More" tab / menu button on phones and tablets. */
export default function MoreSheet() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const open = useAppSelector((s) => s.ui.mobileNavOpen);
  const user = useAppSelector((s) => s.auth.user);
  const close = () => dispatch(setMobileNav(false));

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={close} />
          <motion.div
            role="dialog" aria-modal="true" aria-label="Menu"
            className="absolute inset-y-0 left-0 flex w-[70%] max-w-sm flex-col border-r border-line bg-surface shadow-2xl"
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 380, damping: 38 }}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0.6, right: 0 }} onDragEnd={(_, i) => { if (i.offset.x < -90 || i.velocity.x < -600) close(); }}
          >
            {/* ---------- header ---------- */}
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
              <div className="min-w-0">
                <Logo />
                <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  <span className="relative flex h-1.5 w-1.5"><span className="animate-ping-slow absolute inset-0 rounded-full bg-green-500" /><span className="relative h-1.5 w-1.5 rounded-full bg-green-500" /></span>
                  Live · 24/7 support
                </p>
              </div>
              <button onClick={close} aria-label="Close menu" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-body transition-colors hover:bg-softer hover:text-ink"><X className="h-4 w-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2">
              <motion.nav aria-label="Pages" initial="hide" animate="show" variants={{ show: { transition: { staggerChildren: 0.035, delayChildren: 0.08 } } }}>
                {LINKS.map((l) => {
                  const on = isActive(l.href);
                  return (
                    <motion.div key={l.href} variants={{ hide: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.22, ease: "easeOut" }}>
                      <Link
                        href={l.href}
                        onClick={close}
                        aria-current={on ? "page" : undefined}
                        className={cn("group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors", on ? "bg-brand-500/10 text-brand-text" : "text-ink hover:bg-soft active:bg-softer")}
                      >
                        {on && <span aria-hidden className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-brand-600" />}
                        <l.icon className={cn("h-4 w-4 transition-colors", on ? "text-brand-text" : "text-slate-400 group-hover:text-brand-text")} />
                        <span className="flex-1">{l.label}</span>
                        {on && <ChevronRight className="h-4 w-4" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              <div className="mx-3 my-3 h-px bg-line" />

              {user ? (
                <div className="flex items-center justify-between gap-2 px-3">
                  <span className="truncate text-sm font-semibold text-ink">{user.name}</span>
                  <button onClick={() => { dispatch(logout()); close(); toast.success("Signed out (demo)"); announceNavigation(); router.push("/"); }} className="flex items-center gap-1.5 text-sm font-semibold text-body"><LogOut className="h-4 w-4" />Logout</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-3">
                  <Link href="/login" onClick={close} className="flex items-center justify-center gap-1.5 rounded-md border border-line-strong py-2 text-sm font-semibold text-ink"><LogIn className="h-4 w-4" />Login</Link>
                  <Link href="/register" onClick={close} className="gloss-btn flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-semibold text-white"><UserPlus className="h-4 w-4" />Get started</Link>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between px-3">
                <span className="text-sm text-body">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            {/* ---------- footer ---------- */}
            <div className="border-t border-line p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <a href={`tel:${SITE.phone}`} className="gloss-btn flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-bold text-white active:scale-[.98]">
                <span className="relative grid h-5 w-5 place-items-center"><span className="animate-ping-slow absolute inset-0 rounded-full bg-white/40" /><Phone className="relative h-4 w-4" /></span>
                Call {SITE.phone}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
