"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, LogIn, LogOut, Package, Settings, UserRound, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import Container from "@/components/common/Container";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { cn } from "@/utils/format";

export const CARD = "rounded-lg bg-softer/80 dark:bg-navy-900/90";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** Name shown across the account area: profile name → logged-in name → "Guest". */
export function useDisplayName() {
  const profile = useAppSelector((s) => s.account.profile);
  const user = useAppSelector((s) => s.auth.user);
  return profile.name || user?.name || "Guest";
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "G";
}

export function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">{children}</span>;
}

/** Accessible on/off switch. */
export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange}
      className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors", on ? "bg-brand-500" : "bg-line-strong dark:bg-navy-700")}>
      <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow transition-transform", on ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}

/** Dark page header + sidebar navigation shared by Profile, Orders and Settings. */
export default function AccountShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const name = useDisplayName();
  const orders = useAppSelector((s) => s.orders.list.length);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] text-white">
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-30" />
        <div aria-hidden className="pointer-events-none absolute -left-20 top-0 -z-10 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <Container className="py-8 sm:py-10">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs text-slate-300">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-white"><Home className="h-3.5 w-3.5" />Home</Link>
            <ChevronRight className="h-3 w-3 text-slate-400" /><span className="font-medium text-slate-100">My account</span>
          </nav>
          <div className="flex flex-wrap items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-lg font-black shadow-lg shadow-brand-500/30">{initials(name)}</span>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-0.5 text-sm text-slate-300">{subtitle}</p>
            </div>
            {user ? (
              <button onClick={() => { dispatch(logout()); toast.success("Logged out"); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-white/10 px-4 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/20"><LogOut className="h-4 w-4" />Log out</button>
            ) : (
              <Link href="/login" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold transition-colors hover:bg-brand-600"><LogIn className="h-4 w-4" />Log in</Link>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-8 sm:py-12">
        <Container className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="Account" className="-mx-3 flex gap-2 overflow-x-auto px-3 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:px-0">
              {NAV.map((n) => {
                const on = pathname.startsWith(n.href);
                return (
                  <Link key={n.href} href={n.href} aria-current={on ? "page" : undefined}
                    className={cn("flex shrink-0 items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                      on ? "bg-brand-500/10 text-brand-600 dark:text-brand-400" : "text-body hover:bg-softer/80 hover:text-ink dark:hover:bg-navy-900/90")}>
                    <n.icon className="h-4 w-4" />{n.label}
                    {n.href === "/orders" && orders > 0 && <span className="ml-auto rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-white">{orders}</span>}
                  </Link>
                );
              })}
            </nav>
            {!user && (
              <div className={`${CARD} mt-4 hidden p-4 text-sm lg:block`}>
                <p className="font-semibold text-ink">Browsing as guest</p>
                <p className="mt-1 text-xs text-body">Your details and orders are saved in this browser. Log in to keep them with your account.</p>
              </div>
            )}
          </aside>
          <div className="min-w-0">{children}</div>
        </Container>
      </section>
    </>
  );
}
