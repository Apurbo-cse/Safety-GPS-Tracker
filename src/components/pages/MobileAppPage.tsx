"use client";
/**
 * Mobile App page — service-landing layout: hero with device, why-choose cards,
 * platform strip, app-experience block with screens, and a core-features grid.
 * All content is Safety GPS Tracker's own (features come from data/features).
 */
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BellRing, ChevronRight, Globe, Home, Lock, MapPin, Smartphone, Sparkles, Tablet, Zap,
  BarChart3, Gauge, Power, Fence,
} from "lucide-react";
import Container from "@/components/common/Container";
import { GooglePlayStoreBadge, AppleAppStoreBadge } from "@/components/common/AppStoreBadges";
import { DynIcon } from "@/lib/icons";
import { features } from "@/data/features";
import { SITE } from "@/lib/site";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";
import { cn } from "@/utils/format";

const CARD = "rounded-lg bg-softer/80 dark:bg-navy-900/90";
const ROUTE = "M0 30 C 160 30, 220 8, 380 10 S 620 44, 820 26 S 1080 4, 1240 18 S 1400 34, 1440 30";

const WHY = [
  { icon: Smartphone, t: "Android & iOS apps", d: "Native apps for both stores, plus a full web console." },
  { icon: BellRing, t: "Instant push alerts", d: "Ignition, geo-fence, speed and SOS alerts in seconds." },
  { icon: Sparkles, t: "Simple, clean design", d: "Built so anyone in the family or fleet can use it." },
  { icon: Lock, t: "Control from your phone", d: "Lock or unlock the engine with one secure tap." },
];

const PLATFORMS = [
  { icon: Smartphone, t: "Android", d: "Google Play" },
  { icon: Tablet, t: "iOS", d: "App Store" },
  { icon: Globe, t: "Web", d: "Any modern browser" },
  { icon: BellRing, t: "Email & popup", d: "Alerts everywhere" },
];

const CORE_TITLES = [
  "Live Vehicle Location", "10-Second Location Updates", "Remote Engine Lock",
  "Geo-fencing Alerts", "Route History Playback", "Daily Mileage Reports",
  "Panic / SOS Button", "Speed Violation Alerts", "BRTA Document Expiry Alerts",
];
const CORE = CORE_TITLES.map((t) => features.find((f) => f.title === t)).filter((f): f is NonNullable<typeof f> => !!f);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">{children}</span>
);

/* ------------------------------------------------ illustrated phone screens */
export function Phone({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[220px] rounded-[2rem] bg-navy-950 p-2 shadow-2xl shadow-black/20", className)}>
      <div className="relative overflow-hidden rounded-[1.6rem] bg-surface dark:bg-navy-900">
        <div className="flex items-center justify-between px-4 pb-1 pt-2.5 text-[9px] font-semibold text-ink">
          <span>9:41</span>
          <span className="h-3.5 w-14 rounded-full bg-navy-950" aria-hidden />
          <span>●●●</span>
        </div>
        <p className="px-4 pb-2 text-xs font-bold text-ink">{title}</p>
        <div className="h-[340px]">{children}</div>
      </div>
    </div>
  );
}

export function MapScreen() {
  return (
    <div className="relative h-full bg-[#e8eef3] dark:bg-[#1b2531]">
      <svg viewBox="0 0 200 340" className="absolute inset-0 h-full w-full" aria-hidden>
        {[40, 110, 180, 250, 310].map((y) => <line key={y} x1="0" x2="200" y1={y} y2={y - 20} stroke="currentColor" className="text-white dark:text-white/10" strokeWidth="8" />)}
        {[30, 100, 165].map((x) => <line key={x} x1={x} x2={x + 15} y1="0" y2="340" stroke="currentColor" className="text-white dark:text-white/10" strokeWidth="6" />)}
        <path d="M20 300 C 60 260, 50 200, 100 180 S 150 110, 170 60" fill="none" stroke="#f05a22" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 0" />
        <path d="M20 300 C 60 260, 50 200, 100 180 S 150 110, 170 60" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="4 6" className="route-flow" />
      </svg>
      <span className="absolute left-[78%] top-[14%] grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-brand-500 text-white shadow-lg ring-4 ring-brand-500/25"><MapPin className="h-4 w-4" /></span>
      <div className="absolute inset-x-2.5 bottom-2.5 rounded-xl bg-surface p-2.5 shadow-lg dark:bg-navy-950">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-ink">Dhaka Metro-GA 12</p>
          <span className="rounded-full bg-green-500/15 px-1.5 text-[9px] font-semibold text-green-600">Moving</span>
        </div>
        <p className="mt-0.5 text-[9px] text-body">Mirpur Rd · 42 km/h · updated 8s ago</p>
      </div>
    </div>
  );
}

export function LockScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-5 text-center">
      <span className="grid h-24 w-24 place-items-center rounded-full bg-brand-500/10">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/40"><Lock className="h-7 w-7" /></span>
      </span>
      <div>
        <p className="text-sm font-bold text-ink">Engine locked</p>
        <p className="mt-1 text-[10px] text-body">Command confirmed by the device. The vehicle cannot start until you unlock it.</p>
      </div>
      <span className="w-full rounded-lg bg-softer py-2 text-[11px] font-semibold text-ink dark:bg-navy-950">Unlock engine</span>
    </div>
  );
}

export function AlertsScreen() {
  const rows = [
    { icon: Power, t: "Ignition ON", d: "Metro-GA 12 · 2 min ago", c: "text-green-600 bg-green-500/15" },
    { icon: Fence, t: "Left geo-fence", d: "Office zone · 14 min ago", c: "text-amber-600 bg-amber-500/15" },
    { icon: Zap, t: "Speed 82 km/h", d: "Limit 60 · 31 min ago", c: "text-red-600 bg-red-500/15" },
    { icon: BellRing, t: "Insurance due", d: "In 7 days", c: "text-brand-600 bg-brand-500/15" },
  ];
  return (
    <ul className="space-y-2 px-3">
      {rows.map((r) => (
        <li key={r.t} className="flex items-center gap-2.5 rounded-xl bg-softer/80 p-2.5 dark:bg-navy-950">
          <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", r.c)}><r.icon className="h-4 w-4" /></span>
          <span className="min-w-0"><span className="block text-[11px] font-semibold text-ink">{r.t}</span><span className="block truncate text-[9px] text-body">{r.d}</span></span>
        </li>
      ))}
    </ul>
  );
}

export function ReportsScreen() {
  const bars = [40, 65, 52, 80, 58, 90, 72];
  return (
    <div className="px-3">
      <div className="grid grid-cols-2 gap-2">
        {[["214 km", "This week"], ["18 h", "Engine on"]].map(([v, l]) => (
          <div key={l} className="rounded-xl bg-softer/80 p-2.5 dark:bg-navy-950"><p className="text-sm font-black text-ink">{v}</p><p className="text-[9px] text-body">{l}</p></div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-softer/80 p-3 dark:bg-navy-950">
        <p className="text-[10px] font-semibold text-ink">Daily mileage</p>
        <div className="mt-2 flex h-28 items-end gap-1.5">
          {bars.map((h, i) => <span key={i} className={cn("flex-1 rounded-t", i === 5 ? "bg-brand-500" : "bg-brand-500/30")} style={{ height: `${h}%` }} />)}
        </div>
        <div className="mt-1 flex justify-between text-[8px] text-slate-400">{["S", "S", "M", "T", "W", "T", "F"].map((d, i) => <span key={i}>{d}</span>)}</div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-softer/80 p-2.5 dark:bg-navy-950"><Gauge className="h-4 w-4 text-brand-500" /><span className="text-[10px] text-ink">Avg speed 34 km/h</span></div>
    </div>
  );
}

const SCREENS = [
  { t: "Live map", el: <MapScreen /> },
  { t: "Engine control", el: <LockScreen /> },
  { t: "Alerts", el: <AlertsScreen /> },
  { t: "Reports", el: <ReportsScreen /> },
];

/* ================================================================ page */
export default function MobileAppPage() {
  const dispatch = useAppDispatch();
  const demo = () => dispatch(openDemoModal("Mobile app demo request"));

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] text-white">
        <Image src="/img/hero-car.jpg" alt="" fill priority sizes="100vw" className="-z-30 object-cover opacity-40" />
        <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-r from-[#0c1e31]/95 via-[#0c1e31]/80 to-[#0c1e31]/40" />
        <div aria-hidden className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-30" />
        <Container className="grid items-center gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:pb-16">
          <div>
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-slate-300">
              <Link href="/" className="inline-flex items-center gap-1 hover:text-white"><Home className="h-3.5 w-3.5" />Home</Link>
              <ChevronRight className="h-3 w-3 text-slate-400" /><span className="font-medium text-slate-100">Mobile App</span>
            </nav>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Your Vehicles, Live{" "}
              <span className="bg-gradient-to-r from-brand-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">In Your Pocket</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
              The {SITE.name} app shows every vehicle on a live map, sends instant alerts and lets you lock the engine from anywhere — on Android, iPhone and the web.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <GooglePlayStoreBadge />
              <AppleAppStoreBadge />
            </div>
            <button onClick={demo} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-white">
              Or book a live demo <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="relative mx-auto flex w-full max-w-md items-end justify-center gap-4">
            <Phone title="Live map" className="relative z-10 -rotate-3"><MapScreen /></Phone>
            <Phone title="Alerts" className="hidden translate-y-8 rotate-3 sm:block"><AlertsScreen /></Phone>
          </div>
        </Container>
        <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-6 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d={ROUTE} fill="none" stroke="#f05a22" strokeOpacity=".3" strokeWidth="5" vectorEffect="non-scaling-stroke" />
          <path d={ROUTE} fill="none" stroke="#f98a55" strokeWidth="1.5" strokeDasharray="6 10" className="route-flow" vectorEffect="non-scaling-stroke" />
        </svg>
      </section>

      {/* why choose */}
      <section className="bg-surface py-12 sm:py-16">
        <Container>
          <div className="text-center">
            <Pill>Why choose our app</Pill>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Built For Everyday Peace Of Mind</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-body">One account works across every device, so owners, managers and drivers all see the same live picture.</p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.t} className={`${CARD} p-6 text-center transition-all hover:-translate-y-1`}>
                <w.icon className="mx-auto h-12 w-12 text-brand-500" strokeWidth={1.5} />
                <h3 className="mt-3 text-lg font-bold text-ink">{w.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-body">{w.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* platforms strip */}
      <section className="bg-soft py-10">
        <Container>
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Available on</p>
          <ul className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {PLATFORMS.map((p) => (
              <li key={p.t} className={`${CARD} flex items-center gap-3 p-4`}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><p.icon className="h-5 w-5" /></span>
                <span><b className="block text-sm text-ink">{p.t}</b><span className="text-xs text-body">{p.d}</span></span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* experience + screens */}
      <section className="bg-surface py-12 sm:py-16">
        <Container>
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <Pill>Inside the app</Pill>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Everything You Need, Three Taps Away</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
                Open the app to see where each vehicle is and how fast it is moving. Get a push alert the moment something changes, and check daily reports without opening a laptop.
              </p>
            </div>
            <button onClick={demo} className="inline-flex h-11 items-center gap-2 justify-self-start rounded-lg bg-brand-500 px-6 text-sm font-bold text-white transition-all hover:bg-brand-600 active:scale-95">
              <Sparkles className="h-4 w-4" />Schedule a demo
            </button>
          </div>
          <div className="-mx-3 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-3 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {SCREENS.map((s) => (
              <figure key={s.t} className="w-[70%] shrink-0 snap-center sm:w-auto">
                <Phone title={s.t}>{s.el}</Phone>
                <figcaption className="mt-3 text-center text-sm font-semibold text-ink">{s.t}</figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* core features */}
      <section className="bg-soft py-12 sm:py-16">
        <Container>
          <div className="text-center">
            <Pill>Core features</Pill>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">What You Can Do In The App</h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CORE.map((f) => (
              <div key={f.id} className={`${CARD} flex gap-4 p-6 transition-all hover:-translate-y-1`}>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><DynIcon name={f.icon} className="h-6 w-6" /></span>
                <div>
                  <h3 className="text-base font-bold text-ink">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-body">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/features" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">See all {features.length} features <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] text-white">
        <Image src="/img/hero-truck.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-50" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0c1e31]/95 via-[#0c1e31]/75 to-[#0c1e31]/30" />
        <Container className="flex flex-col items-start justify-between gap-5 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight sm:text-4xl">Download the app today</h2>
            <p className="mt-2 text-sm text-slate-200">Already a customer? Log in with your account. New? Pick a package and we&apos;ll set you up.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/pricing" className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white transition-all hover:bg-brand-600">
              <BarChart3 className="h-4 w-4" />See packages
            </Link>
            <button onClick={demo} className="inline-flex h-11 items-center gap-2 rounded-lg bg-white/10 px-5 text-sm font-semibold backdrop-blur-md transition-all hover:bg-white/20">Book a demo</button>
          </div>
        </Container>
      </section>
    </>
  );
}
