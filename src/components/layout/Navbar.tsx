"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  ArrowRight, BarChart3, Bell, ChevronDown, CreditCard, HelpCircle, Info, LayoutGrid, Mail, Phone,
  Search, Shield, ShieldCheck, ShoppingCart, Smartphone, Sparkles, Heart, UserRound, Wrench, Navigation,
  type LucideIcon,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import ThemeToggle from "./ThemeToggle";
import Container from "@/components/common/Container";
import { DynIcon } from "@/lib/icons";
import { SITE } from "@/lib/site";
import { features, featureCategories } from "@/data/features";
import { catalogue, categoryUrl, deviceUrl } from "@/data/catalogue";
import { devices } from "@/data/devices";
import { solutions } from "@/data/solutions";
import { plans } from "@/data/pricing";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openDemoModal, setCartOpen, setPalette } from "@/store/slices/uiSlice";
import { cn, formatBDT } from "@/utils/format";

/* ------------------------------------------------------------------ data */
type MenuKey = "Features" | "Products" | "Solutions" | "Company";

const NAV: { label: string; menu?: MenuKey; href?: string; match: string[] }[] = [
  { label: "Features", menu: "Features", match: ["/features"] },
  { label: "Products", menu: "Products", match: ["/products"] },
  { label: "Solutions", menu: "Solutions", match: ["/solutions"] },
  { label: "Pricing", href: "/pricing", match: ["/pricing"] },
  { label: "Company", menu: "Company", match: ["/about", "/contact", "/pay-bill", "/faq"] },
];

const FEATURE_ICONS: Record<string, LucideIcon> = {
  "Vehicle Tracking": Navigation,
  "Vehicle Security": Shield,
  "Reports & Analytics": BarChart3,
  "Driver Monitoring": UserRound,
  "Maintenance & Reminders": Wrench,
  Platform: LayoutGrid,
};

const COMPANY: { href: string; icon: LucideIcon; t: string; d: string }[] = [
  { href: "/about", icon: Info, t: "About us", d: "Who we are and why customers choose us." },
  { href: "/contact", icon: Phone, t: "Contact & support", d: "Sales, support and billing — 24×7." },
  { href: "/pay-bill", icon: CreditCard, t: "Pay bill online", d: "bKash, Nagad, Rocket or bank transfer." },
  { href: "/faq", icon: HelpCircle, t: "Help centre", d: "Answers about tracking, devices and billing." },
];

const featuredDevice = devices.find((d) => d.price && d.image) ?? devices[0];
const minMonthly = Math.min(...plans.map((p) => p.monthlyCharge));

/* ------------------------------------------------------------------ bits */
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{children}</p>
);

function Promo({ image, tag, title, text, children }: { image: string; tag: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="relative isolate flex h-full flex-col overflow-hidden rounded-lg bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] p-5 text-white">
      <Image src={image} alt="" fill sizes="320px" className="-z-20 object-cover opacity-35" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0c1e31] via-[#0c1e31]/70 to-transparent" />
      <span className="self-start rounded-full bg-brand-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-brand-300">{tag}</span>
      <p className="mt-auto pt-16 text-lg font-black leading-tight tracking-tight">{title}</p>
      <p className="mt-1 text-xs text-slate-300">{text}</p>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const promoBtn = "inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-brand-600";
const promoGhost = "inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/10 px-3.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20";
const tile = "group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-softer/80 dark:hover:bg-navy-900/90";
const tileIcon = "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-400";

/* ------------------------------------------------------------------ navbar */
export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector((s) => s.cart.items.reduce((n, i) => n + i.qty, 0));
  const wishCount = useAppSelector((s) => s.wishlist.ids.length);

  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setActiveMenu(null);
  }

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  // reading-progress bar along the bottom edge
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close on outside click / Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (headerRef.current && !headerRef.current.contains(e.target as Node)) setActiveMenu(null); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveMenu(null); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, []);

  const open = (m: MenuKey | null) => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setActiveMenu(m); };
  const leave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => { setActiveMenu(null); setHovered(null); }, 150);
  };
  const close = () => setActiveMenu(null);
  const isActive = (match: string[]) => match.some((p) => pathname.startsWith(p));

  return (
    <header
      ref={headerRef}
      onMouseLeave={leave}
      className={cn(
        "sticky top-0 z-50 bg-surface/90 backdrop-blur-xl transition-shadow duration-300 dark:bg-navy-950/85",
        scrolled && "shadow-lg shadow-black/5 dark:shadow-black/30",
        // phones/tablets: full navbar only on the home page; inner pages use MobilePageBar
        pathname !== "/" && "max-lg:hidden",
      )}
    >
      {/* ---------- utility strip (desktop, hides on scroll) ---------- */}
      <div className={cn("hidden overflow-hidden bg-navy-950 text-slate-300 transition-[height] duration-300 lg:block", scrolled ? "h-0" : "h-8")}>
        <Container className="flex h-8 items-center justify-between text-[11px]">
          <div className="flex items-center gap-5">
            <a href={`tel:${SITE.phone}`} className="inline-flex items-center gap-1.5 hover:text-white">
              <span className="relative flex h-1.5 w-1.5"><span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" /><span className="relative h-1.5 w-1.5 rounded-full bg-green-400" /></span>
              24/7 Helpline <b className="font-semibold text-white">{SITE.phone}</b>
            </a>
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-1.5 hover:text-white"><Mail className="h-3 w-3" />{SITE.email}</a>
          </div>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-brand-400" />BTRC approved</span>
            <Link href="/pay-bill" className="hover:text-white">Pay bill</Link>
            <Link href="/faq" className="hover:text-white">Help centre</Link>
            <Link href="/login" className="inline-flex items-center gap-1 font-semibold text-white hover:text-brand-300"><UserRound className="h-3 w-3" />Log in</Link>
          </div>
        </Container>
      </div>

      {/* ---------- main bar ---------- */}
      <Container className={cn("flex items-center justify-between gap-4 transition-[height] duration-300", scrolled ? "h-14" : "h-14 lg:h-16")}>
        <div className="shrink-0"><Logo className="h-6 sm:h-7 md:h-7.5" /></div>

        <nav aria-label="Main navigation" className="hidden items-center lg:flex" onMouseLeave={() => setHovered(null)}>
          {NAV.map((n) => {
            const active = isActive(n.match) || activeMenu === n.menu;
            const cls = cn("relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors", active ? "text-brand-600 dark:text-brand-400" : "text-ink hover:text-brand-600 dark:hover:text-brand-400");
            const inner = (
              <>
                {hovered === n.label && (
                  <motion.span layoutId="nav-hover" className="absolute inset-0 -z-10 rounded-full bg-softer/90 dark:bg-navy-900/90" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
                )}
                {n.label}
                {n.menu && <ChevronDown className={cn("h-3.5 w-3.5 opacity-60 transition-transform duration-200", activeMenu === n.menu && "rotate-180 opacity-100")} />}
                {isActive(n.match) && <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-brand-500" />}
              </>
            );
            return n.href ? (
              <Link key={n.label} href={n.href} onMouseEnter={() => { setHovered(n.label); open(null); }} className={cls} aria-current={pathname === n.href ? "page" : undefined}>{inner}</Link>
            ) : (
              <button key={n.label} type="button" onMouseEnter={() => { setHovered(n.label); open(n.menu!); }} onClick={() => setActiveMenu(activeMenu === n.menu ? null : n.menu!)} aria-expanded={activeMenu === n.menu} aria-haspopup="true" className={cls}>{inner}</button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => dispatch(setPalette(true))}
            aria-label="Search (Ctrl K)"
            className="hidden h-9 items-center gap-2 rounded-full bg-softer/80 pl-3 pr-1.5 text-xs text-slate-500 transition-colors hover:text-ink dark:bg-navy-900/90 xl:inline-flex"
          >
            <Search className="h-3.5 w-3.5" />Search
            <kbd className="rounded-full bg-surface px-1.5 py-0.5 font-sans text-[10px] font-semibold text-slate-500 dark:bg-navy-950">⌘K</kbd>
          </button>
          <button type="button" onClick={() => dispatch(setPalette(true))} aria-label="Search" className="grid h-9 w-9 place-items-center rounded-full text-body-strong transition-colors hover:bg-softer xl:hidden dark:hover:bg-navy-900">
            <Search className="h-4.5 w-4.5" />
          </button>
          <ThemeToggle />
          <Link href="/products#wishlist" aria-label={`Wishlist, ${wishCount} items`} className="relative grid h-9 w-9 place-items-center rounded-full text-body-strong transition-colors hover:bg-softer dark:hover:bg-navy-900">
            <Heart className="h-4.5 w-4.5" />
            {wishCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">{wishCount}</span>}
          </Link>
          <button type="button" onClick={() => dispatch(setCartOpen(true))} aria-label={`Cart, ${cartCount} items`} className="relative grid h-9 w-9 place-items-center rounded-full text-body-strong transition-colors hover:bg-softer dark:hover:bg-navy-900">
            <ShoppingCart className="h-4.5 w-4.5" />
            {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">{cartCount}</span>}
          </button>
          <button
            type="button"
            onClick={() => dispatch(openDemoModal("Demo request (navbar)"))}
            className="ml-1 hidden h-9 items-center gap-1.5 rounded-full bg-brand-500 px-4 text-xs font-semibold text-white transition-all hover:bg-brand-600 active:scale-95 lg:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5" />Book a demo
          </button>
        </div>
      </Container>

      {/* scroll progress */}
      <motion.div aria-hidden style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-brand-600 to-brand-400" />

      {/* ---------- mega menu ---------- */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            key="mega"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onMouseEnter={() => timeoutRef.current && clearTimeout(timeoutRef.current)}
            onMouseLeave={leave}
            className="absolute inset-x-0 top-full z-40 hidden bg-surface shadow-2xl shadow-black/10 dark:bg-navy-950 lg:block"
          >
            <Container className="py-6">
              <AnimatePresence mode="wait">
                <motion.div key={activeMenu} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.14 }} className="grid grid-cols-[1fr_300px] gap-6">
                  {activeMenu === "Features" && (
                    <>
                      <div>
                        <Eyebrow>{features.length} platform features</Eyebrow>
                        <div className="grid grid-cols-3 gap-1">
                          {featureCategories.map((c) => {
                            const Icon = FEATURE_ICONS[c] ?? Bell;
                            const items = features.filter((f) => f.category === c);
                            return (
                              <Link key={c} href="/features#all-features" onClick={close} className={tile}>
                                <span className={tileIcon}><Icon className="h-4 w-4" /></span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-semibold text-ink">{c} <span className="text-xs font-normal text-slate-400">· {items.length}</span></span>
                                  <span className="mt-0.5 block truncate text-xs text-slate-500">{items.slice(0, 2).map((f) => f.title).join(", ")}</span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                        <div className="mt-4 flex items-center gap-5">
                          <Link href="/features" onClick={close} className="inline-flex items-center gap-1.5 px-3 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400">View all features <ArrowRight className="h-3.5 w-3.5" /></Link>
                          <Link href="/mobile-app" onClick={close} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"><Smartphone className="h-3.5 w-3.5" />Mobile app</Link>
                        </div>
                      </div>
                      <Promo image="/img/hero-truck.jpg" tag="Live demo" title="See your fleet on one map" text="10-second updates, engine lock and smart alerts — on web, Android and iOS.">
                        <button type="button" onClick={() => { close(); dispatch(openDemoModal("Demo request (features menu)")); }} className={promoBtn}><Sparkles className="h-3.5 w-3.5" />Book a demo</button>
                      </Promo>
                    </>
                  )}

                  {activeMenu === "Products" && (
                    <>
                      <div>
                        <Eyebrow>Shop by category</Eyebrow>
                        <div className="grid grid-cols-3 gap-x-6 gap-y-5 px-3">
                          {catalogue.map((c) => (
                            <div key={c.slug}>
                              <Link href={categoryUrl(c.name)} onClick={close} className="text-sm font-semibold text-ink hover:text-brand-600 dark:hover:text-brand-400">{c.name} <span className="text-xs font-normal text-slate-400">· {c.count}</span></Link>
                              <ul className="mt-1.5 space-y-1">
                                {c.subs.map((s) => (
                                  <li key={s.slug}><Link href={categoryUrl(c.name, s.name)} onClick={close} className="text-xs text-body transition-colors hover:text-brand-600 dark:hover:text-brand-400">{s.name}</Link></li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <Link href="/products" onClick={close} className="mt-5 inline-flex items-center gap-1.5 px-3 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400">All {devices.length} products <ArrowRight className="h-3.5 w-3.5" /></Link>
                      </div>
                      <div className="flex flex-col rounded-lg bg-softer/80 p-4 dark:bg-navy-900/90">
                        <span className="self-start rounded-full bg-brand-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-600 dark:text-brand-400">Featured</span>
                        {featuredDevice.image && (
                          <div className="relative mt-2 aspect-[858/600] w-full"><Image src={featuredDevice.image} alt={featuredDevice.name} fill sizes="280px" className="object-contain" /></div>
                        )}
                        <p className="mt-2 truncate text-sm font-semibold text-ink">{featuredDevice.name}</p>
                        <p className="text-xs text-body">{featuredDevice.price ? formatBDT(featuredDevice.price) : "Price on request"}{featuredDevice.monthly ? ` + ${formatBDT(featuredDevice.monthly)}/mo` : ""}</p>
                        <Link href={deviceUrl(featuredDevice)} onClick={close} className="mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-brand-500 text-xs font-semibold text-white transition-colors hover:bg-brand-600">View product <ArrowRight className="h-3.5 w-3.5" /></Link>
                      </div>
                    </>
                  )}

                  {activeMenu === "Solutions" && (
                    <>
                      <div>
                        <Eyebrow>{solutions.length} industries</Eyebrow>
                        <div className="grid grid-cols-4 gap-2">
                          {solutions.map((s) => (
                            <Link key={s.id} href={`/solutions#${s.id}`} onClick={close} className="group overflow-hidden rounded-lg bg-softer/80 transition-all hover:-translate-y-0.5 dark:bg-navy-900/90">
                              <span className="relative block h-16 overflow-hidden">
                                <Image src={s.image} alt="" fill sizes="200px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                <span className="absolute bottom-1.5 left-1.5 grid h-6 w-6 place-items-center rounded-md bg-surface/90 text-brand-600 dark:bg-navy-950/90 dark:text-brand-400"><DynIcon name={s.icon} className="h-3.5 w-3.5" /></span>
                              </span>
                              <span className="block truncate px-2.5 py-2 text-xs font-semibold text-ink group-hover:text-brand-600 dark:group-hover:text-brand-400">{s.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <Promo image="/img/industries/business-fleet-v3.jpg" tag="For business" title="Running a fleet?" text={`Packages from ${formatBDT(minMonthly)}/month per vehicle, with volume pricing for fleets.`}>
                        <Link href="/pricing" onClick={close} className={promoBtn}>See pricing</Link>
                        <Link href="/solutions" onClick={close} className={promoGhost}>All solutions</Link>
                      </Promo>
                    </>
                  )}

                  {activeMenu === "Company" && (
                    <>
                      <div>
                        <Eyebrow>Company & support</Eyebrow>
                        <div className="grid grid-cols-2 gap-1">
                          {COMPANY.map((c) => (
                            <Link key={c.href} href={c.href} onClick={close} className={tile}>
                              <span className={tileIcon}><c.icon className="h-4 w-4" /></span>
                              <span className="min-w-0">
                                <span className="block text-sm font-semibold text-ink">{c.t}</span>
                                <span className="mt-0.5 block text-xs text-slate-500">{c.d}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <Promo image="/img/hero-car.jpg" tag="24/7 helpline" title="Need help right now?" text="Our team answers day and night — emergencies, engine lock and support.">
                        <a href={`tel:${SITE.phone}`} className={promoBtn}><Phone className="h-3.5 w-3.5" />{SITE.phone}</a>
                      </Promo>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
