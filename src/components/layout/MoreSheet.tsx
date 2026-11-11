"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, CreditCard, Info, LogIn, LogOut, Mail, Phone, Search, ShoppingCart, UserPlus, Briefcase, X, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { announceNavigation } from "@/lib/navigate";
import ThemeToggle from "./ThemeToggle";
import { SITE } from "@/lib/site";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCartOpen, setMobileNav, setPalette } from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";

const Tile = ({ icon: Icon, label, onClick, href }: { icon: LucideIcon; label: string; onClick?: () => void; href?: string }) => {
  const cls = "flex flex-col items-center gap-2 rounded-md border border-line bg-soft p-3.5 text-center text-xs font-semibold text-ink transition-transform active:scale-95";
  const body = (<><span className="grid h-11 w-11 place-items-center rounded-md bg-brand-50 text-brand-text"><Icon className="h-5 w-5" /></span>{label}</>);
  return href ? <Link href={href} onClick={onClick} className={cls}>{body}</Link> : <button onClick={onClick} className={cls}>{body}</button>;
};

/** Left-side drawer opened from the "More" tab / menu button on phones and tablets. */
export default function MoreSheet() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const open = useAppSelector((s) => s.ui.mobileNavOpen);
  const user = useAppSelector((s) => s.auth.user);
  const cartCount = useAppSelector((s) => s.cart.items.reduce((n, i) => n + i.qty, 0));
  const close = () => dispatch(setMobileNav(false));

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={close} />
          <motion.div
            role="dialog" aria-modal="true" aria-label="More"
            className="absolute inset-y-0 left-0 flex w-[84%] max-w-sm flex-col overflow-y-auto border-r border-line bg-surface px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] shadow-2xl"
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 380, damping: 38 }}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0.6, right: 0 }} onDragEnd={(_, i) => { if (i.offset.x < -90 || i.velocity.x < -600) close(); }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0"><p className="truncate text-base font-bold text-ink">{user ? user.name : "Safety GPS Tracker"}</p><p className="text-xs text-body">{user ? "Signed in (demo)" : "Real-time GPS vehicle tracking"}</p></div>
              <button onClick={close} aria-label="Close menu" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-body transition-colors hover:bg-softer hover:text-ink"><X className="h-4 w-4" /></button>
            </div>
            <div className="mb-4"><ThemeToggle showLabels /></div>
            <div className="mb-4 grid grid-cols-3 gap-2.5">
              <Tile icon={Building2} label="Solutions" href="/solutions" onClick={close} />
              <Tile icon={Info} label="About Us" href="/about" onClick={close} />
              <Tile icon={Mail} label="Contact" href="/contact" onClick={close} />
              <Tile icon={CreditCard} label="Pay Bill" href="/pay-bill" onClick={close} />
              <Tile icon={Search} label="Search" onClick={() => { close(); dispatch(setPalette(true)); }} />
              <Tile icon={ShoppingCart} label={cartCount ? `Cart (${cartCount})` : "Cart"} onClick={() => { close(); dispatch(setCartOpen(true)); }} />
              {user ? (
                <Tile icon={LogOut} label="Logout" onClick={() => { dispatch(logout()); close(); toast.success("Signed out (demo)"); announceNavigation(); router.push("/"); }} />
              ) : (<>
                <Tile icon={LogIn} label="Login" href="/login" onClick={close} />
                <Tile icon={UserPlus} label="Get Started" href="/register" onClick={close} />
              </>)}
              <Tile icon={Briefcase} label="Sales" href={`tel:${SITE.phone}`} onClick={close} />
            </div>
            <a href={`tel:${SITE.phone}`} className="mt-auto flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-brand-500 to-brand-700 py-3.5 text-sm font-bold text-white     active:scale-[.98]"><Phone className="h-4 w-4" />Call {SITE.phone}</a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
