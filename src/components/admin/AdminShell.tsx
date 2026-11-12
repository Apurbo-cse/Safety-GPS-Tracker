"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes, ExternalLink, FolderTree, HelpCircle, Images, LayoutDashboard, LockKeyhole, LogIn, LogOut, Menu, Package, ShieldAlert, Tags, Users, X, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOut } from "@/store/thunks";
import { cn } from "@/utils/format";
import { CARD, Skeleton } from "./ui";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };
const NAV: { heading?: string; items: NavItem[] }[] = [
  { items: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: "Orders", icon: Package },
    { href: "/admin/customers", label: "Customers", icon: Users },
  ] },
  { heading: "Catalogue", items: [
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/products", label: "Products", icon: Boxes },
    { href: "/admin/packages", label: "Packages", icon: Tags },
    { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
    { href: "/admin/hero", label: "Hero slides", icon: Images },
  ] },
];

function Gate({ icon: Icon, title, text, children }: { icon: LucideIcon; title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-4">
      <div className={`${CARD} w-full max-w-md p-8 text-center`}>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400"><Icon className="h-7 w-7" /></span>
        <h1 className="mt-4 text-xl font-black tracking-tight text-ink">{title}</h1>
        <p className="mt-1 text-sm text-body">{text}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">{children}</div>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-5"><Logo className="h-6" /><span className="rounded bg-brand-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-300">Admin</span></div>
      <nav aria-label="Admin" className="mt-2 flex-1 space-y-5 overflow-y-auto px-3">
        {NAV.map((g, gi) => (
          <div key={gi}>
            {g.heading && <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{g.heading}</p>}
            <div className="space-y-1">
              {g.items.map((n) => {
                const on = n.exact ? pathname === n.href : pathname.startsWith(n.href);
                return (
                  <Link key={n.href} href={n.href} onClick={onNavigate} aria-current={on ? "page" : undefined}
                    className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors", on ? "bg-brand-500 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white")}>
                    <n.icon className="h-4 w-4" />{n.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="space-y-1 p-3">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"><ExternalLink className="h-4 w-4" />View website</Link>
        <Link href="/profile" onClick={onNavigate} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"><Users className="h-4 w-4" />My account</Link>
      </div>
    </div>
  );
}

/** Admin layout: dark sidebar + top bar. Only renders for signed-in admins (the API enforces this too). */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, ready } = useAppSelector((s) => s.auth);
  const [open, setOpen] = useState(false);

  if (!ready) return <div className="min-h-screen bg-background p-8"><div className="mx-auto max-w-5xl"><Skeleton rows={5} /></div></div>;
  if (!user) return (
    <Gate icon={LockKeyhole} title="Admin sign-in" text="Log in with an administrator account to continue.">
      <Link href="/login?next=/admin" className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600"><LogIn className="h-4 w-4" />Log in</Link>
    </Gate>
  );
  if (user.role !== "admin") return (
    <Gate icon={ShieldAlert} title="No access" text="This area is for administrators only.">
      <Link href="/" className="inline-flex h-11 items-center rounded-lg bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600">Back to website</Link>
      <button onClick={() => { void dispatch(signOut()); }} className="inline-flex h-11 items-center rounded-lg bg-surface px-5 text-sm font-semibold text-ink hover:text-brand-600 dark:bg-navy-950/70">Switch account</button>
    </Gate>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 bg-navy-950 lg:block"><SidebarContent /></aside>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ duration: 0.2 }} className="fixed inset-y-0 left-0 z-50 w-60 bg-navy-950 lg:hidden" role="dialog" aria-label="Admin menu">
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-md text-slate-300 hover:bg-white/10"><X className="h-5 w-5" /></button>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 bg-surface/90 px-4 backdrop-blur-xl dark:bg-navy-950/85 sm:px-6">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-lg text-ink hover:bg-softer lg:hidden"><Menu className="h-5 w-5" /></button>
          <p className="hidden text-sm font-semibold text-body lg:block">Safety GPS Tracker · Control panel</p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden text-right sm:block"><span className="block text-sm font-semibold leading-tight text-ink">{user.name}</span><span className="block text-xs text-slate-500">Administrator</span></span>
            <button onClick={() => { void dispatch(signOut()); toast.success("Logged out"); }} aria-label="Log out" className="grid h-10 w-10 place-items-center rounded-lg text-body hover:bg-softer hover:text-ink"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>
        <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
