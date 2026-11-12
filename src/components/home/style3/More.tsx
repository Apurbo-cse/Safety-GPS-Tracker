"use client";
/**
 * Extra home-page sections in the site's borderless theme: live numbers, an interactive platform tour,
 * a step-by-step "how it works", an industries carousel and a closing call-to-action.
 * Everything stated here is something the site already promises elsewhere (10-second updates, remote engine lock,
 * 64-district installation, 24×7 helpline); the screens in the tour are illustrations, not real customer data.
 */
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BarChart3, Bell, Check, ChevronRight, Fence, Headset, Lock, MapPin, PackageCheck, Phone, ShieldCheck, Smartphone, Unlock, Wrench, type LucideIcon,
} from "lucide-react";
import Container from "@/components/common/Container";
import { DynIcon } from "@/lib/icons";
import { solutions } from "@/data/solutions";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { useSite } from "@/components/providers/SiteProvider";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";
import { cn } from "@/utils/format";

const SOFT = "rounded-lg bg-softer/80 dark:bg-navy-900/90";
const Pill = ({ children }: { children: React.ReactNode }) => <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">{children}</span>;

/** Counts up to `to` once it scrolls into view (jumps straight to the number if the visitor prefers reduced motion). */
function useCountUp(to: number, active: boolean, ms = 1400) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active || reduce) return;
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / ms); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active, ms, reduce]);
  return !active ? 0 : reduce ? to : n; // reduced motion: show the final number straight away
}

/* ============================================================= stats band */
function Stat({ to, suffix, label, active }: { to: number; suffix?: string; label: string; active: boolean }) {
  const n = useCountUp(to, active);
  return (
    <div className="px-2 text-center">
      <p className="text-4xl font-black tracking-tight text-white sm:text-5xl"><span className="tabular-nums">{n}</span><span className="text-brand-400">{suffix}</span></p>
      <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-slate-300">{label}</p>
    </div>
  );
}

export function StatsBand() {
  const { plans, devices } = useCatalog();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-80px" });
  const items = [
    { to: 10, suffix: "s", label: "Live location refresh" },
    { to: 64, suffix: "", label: "Districts we install in" },
    { to: plans.length, suffix: "", label: "Tracking packages" },
    { to: devices.length, suffix: "+", label: "Devices & accessories" },
  ];
  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-gradient-to-r from-[#0c1e31] via-[#122b46] to-[#0c1e31] py-10 sm:py-14">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-30" />
      <Container>
        <dl className="grid grid-cols-2 gap-y-8 divide-white/10 md:grid-cols-4 md:divide-x">
          {items.map((s) => <Stat key={s.label} {...s} active={seen} />)}
        </dl>
      </Container>
    </section>
  );
}

/* ========================================================= platform tour */
type TourId = "map" | "alerts" | "reports" | "lock" | "fence";
const TOUR: { id: TourId; label: string; icon: LucideIcon; title: string; text: string; points: string[] }[] = [
  { id: "map", label: "Live map", icon: MapPin, title: "See every vehicle, right now", text: "Position, speed and ignition status on one map, refreshed about every 10 seconds, with route history to replay any trip.", points: ["Live position and speed", "Route history playback", "Web, Android and iOS views"] },
  { id: "alerts", label: "Smart alerts", icon: Bell, title: "Know the moment something changes", text: "Choose which events matter — ignition, speed, geo-fence, device removal, panic button — and get them as notifications.", points: ["Engine on / off alerts", "Speed violation alerts", "Panic button and tamper alerts"] },
  { id: "reports", label: "Reports", icon: BarChart3, title: "Plain reports that cut running cost", text: "Daily mileage, travel history, parking time and working hours — clear numbers instead of guesswork.", points: ["Daily mileage report", "Parking and idle time", "Working hours per vehicle"] },
  { id: "lock", label: "Engine lock", icon: Lock, title: "Stop an unauthorised trip", text: "If a vehicle is moving when it shouldn't, lock the engine from your phone, then unlock it when it's safe.", points: ["Remote engine lock & unlock", "Works from the Android, iOS and web apps", "Alert if the device is removed"] },
  { id: "fence", label: "Geo-fence", icon: Fence, title: "Draw a boundary, get an alert", text: "Set zones around a depot, a site or a neighbourhood and be told when a vehicle enters or leaves.", points: ["Enter and exit alerts", "Zones for sites and depots", "Destination alert"] },
];

/** The five illustrative "screens". Plain shapes and text — not data from any real vehicle. */
function Screen({ id }: { id: TourId }) {
  const reduce = useReducedMotion();
  const shell = "relative h-full min-h-[320px] overflow-hidden rounded-lg bg-[#0c1e31] text-white";
  if (id === "map") return (
    <div className={shell}>
      <div aria-hidden className="grid-bg absolute inset-0 opacity-40" />
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M0 220 C80 210 120 120 200 130 S330 200 400 90" fill="none" stroke="#38bdf8" strokeOpacity=".25" strokeWidth="14" strokeLinecap="round" />
        <path id="tour-route" d="M0 220 C80 210 120 120 200 130 S330 200 400 90" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="7 7" strokeLinecap="round" />
        <circle r="9" fill="#f97316"><animateMotion dur={reduce ? "0s" : "9s"} repeatCount="indefinite"><mpath href="#tour-route" /></animateMotion></circle>
        <circle r="18" fill="#f97316" fillOpacity=".25"><animateMotion dur={reduce ? "0s" : "9s"} repeatCount="indefinite"><mpath href="#tour-route" /></animateMotion></circle>
      </svg>
      <div className="absolute left-4 top-4 rounded-lg bg-white/10 p-3 text-xs backdrop-blur">
        <p className="font-bold">Delivery van 03</p>
        <p className="mt-0.5 text-slate-300">42 km/h · Ignition ON</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Updated 3s ago</p>
      </div>
    </div>
  );
  if (id === "alerts") return (
    <div className={`${shell} space-y-2.5 p-4`}>
      {([[Unlock, "Engine started", "Delivery van 03 · 08:02", "text-emerald-300"], [Bell, "Speed limit exceeded (84 km/h)", "Truck 11 · 08:14", "text-amber-300"], [Fence, "Left depot zone", "Pickup 07 · 08:31", "text-sky-300"], [ShieldCheck, "Device removal alert", "Car 02 · 09:05", "text-red-300"]] as const).map(([Icon, t, s, c], i) => (
        <motion.div key={t} initial={reduce ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="flex items-center gap-3 rounded-lg bg-white/[0.07] p-3">
          <span className={cn("grid h-9 w-9 place-items-center rounded-md bg-white/10", c)}><Icon className="h-4 w-4" /></span>
          <span className="min-w-0"><span className="block truncate text-sm font-semibold">{t}</span><span className="block text-xs text-slate-300">{s}</span></span>
        </motion.div>
      ))}
    </div>
  );
  if (id === "reports") return (
    <div className={`${shell} p-5`}>
      <p className="text-sm font-bold">Daily mileage <span className="font-normal text-slate-300">· last 7 days (km)</span></p>
      <div className="mt-4 flex h-52 items-end gap-3">
        {[62, 88, 71, 104, 96, 38, 77].map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <motion.div initial={reduce ? false : { height: 0 }} animate={{ height: `${(v / 110) * 100}%` }} transition={{ delay: i * 0.07, duration: 0.6 }} className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400" />
            <span className="text-[10px] text-slate-300">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
  if (id === "lock") return <LockScreen shell={shell} />;
  return (
    <div className={shell}>
      <div aria-hidden className="grid-bg absolute inset-0 opacity-40" />
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="200" cy="150" r="95" fill="#38bdf8" fillOpacity=".12" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6" />
        <g>
          <circle r="8" fill="#f97316"><animateMotion dur={reduce ? "0s" : "7s"} repeatCount="indefinite" path="M60 150 L340 150" /></circle>
        </g>
      </svg>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs backdrop-blur"><Fence className="h-4 w-4 text-sky-300" />Zone “Main depot” · alert on exit</div>
    </div>
  );
}

function LockScreen({ shell }: { shell: string }) {
  const [locked, setLocked] = useState(false);
  return (
    <div className={`${shell} grid place-items-center p-6`}>
      <div className="text-center">
        <motion.span animate={{ scale: locked ? 1.06 : 1 }} className={cn("mx-auto grid h-24 w-24 place-items-center rounded-full transition-colors", locked ? "bg-red-500" : "bg-emerald-500")}>
          {locked ? <Lock className="h-11 w-11" /> : <Unlock className="h-11 w-11" />}
        </motion.span>
        <p className="mt-4 text-lg font-bold">{locked ? "Engine locked" : "Engine unlocked"}</p>
        <p className="text-xs text-slate-300">Try it — this is a demo, no vehicle is connected</p>
        <button type="button" onClick={() => setLocked((v) => !v)} className="mt-4 inline-flex h-10 items-center rounded-lg bg-white/10 px-5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20">{locked ? "Unlock engine" : "Lock engine"}</button>
      </div>
    </div>
  );
}

export function PlatformTour() {
  const [tab, setTab] = useState<TourId>("map");
  const cur = TOUR.find((t) => t.id === tab)!;
  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Pill>Platform tour</Pill>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Everything about your vehicles, in one app</h2>
          <p className="mt-3 text-sm leading-relaxed text-body">Pick a feature to see how it works. Screens are illustrations.</p>
        </div>
        <div role="tablist" aria-label="Platform features" className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:justify-center">
          {TOUR.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors", tab === t.id ? "bg-brand-500 text-white" : `${SOFT} text-body hover:text-ink`)}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </div>
        <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-2">
          <AnimatePresence mode="wait">
            <motion.div key={cur.id} role="tabpanel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className={`${SOFT} flex flex-col justify-center p-6 sm:p-9`}>
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><cur.icon className="h-6 w-6" /></span>
              <h3 className="mt-4 text-2xl font-black tracking-tight text-ink">{cur.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{cur.text}</p>
              <ul className="mt-5 space-y-2.5">
                {cur.points.map((p) => <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-ink"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/15 text-emerald-600"><Check className="h-3 w-3" /></span>{p}</li>)}
              </ul>
              <Link href="/features" className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">All features <ArrowRight className="h-4 w-4" /></Link>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div key={`s-${cur.id}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><Screen id={cur.id} /></motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}

/* ========================================================= how it works */
const STEPS: { icon: LucideIcon; t: string; d: string; bullets: string[]; cta?: { label: string; href: string } }[] = [
  { icon: PackageCheck, t: "Choose a package", d: "Pick the device and monthly plan that fit your vehicle. Pay a one-time device price and a simple monthly charge.", bullets: ["Packages for cars, bikes, trucks and equipment", "Voice and video monitoring options", "No hidden charges"], cta: { label: "Compare packages", href: "/pricing" } },
  { icon: Wrench, t: "We install it", d: "Our technicians fit and test the tracker at your doorstep, in all 64 districts.", bullets: ["Doorstep installation", "Tested before we leave", "Pick your preferred date at checkout"] },
  { icon: Smartphone, t: "Open the app", d: "Log in on Android, iOS or the web, add your vehicles and drivers, and switch on the alerts you want.", bullets: ["Android, iOS and web apps", "Add drivers and documents", "Choose your alerts"], cta: { label: "See the app", href: "/mobile-app" } },
  { icon: Headset, t: "Stay in control", d: "Watch live, replay trips, lock the engine if needed — and call our 24×7 helpline any time.", bullets: ["Live tracking and reports", "Remote engine lock", "24×7 human helpline"] },
];

export function HowItWorksStepper() {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  return (
    <section className="bg-soft py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Pill>How it works</Pill>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">From order to live tracking in four steps</h2>
        </div>
        <ol className="relative mx-auto mt-10 grid max-w-4xl grid-cols-4 gap-2">
          <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-6 h-0.5 bg-line-strong/50" />
          <motion.span aria-hidden className="absolute left-[12.5%] top-6 h-0.5 bg-brand-500" animate={{ width: `${(i / (STEPS.length - 1)) * 75}%` }} transition={{ duration: 0.4 }} />
          {STEPS.map((s, n) => (
            <li key={s.t} className="relative flex flex-col items-center text-center">
              <button type="button" onClick={() => setI(n)} aria-current={i === n ? "step" : undefined} aria-label={`Step ${n + 1}: ${s.t}`}
                className={cn("relative z-10 grid h-12 w-12 place-items-center rounded-full transition-all", n <= i ? "bg-brand-500 text-white" : "bg-surface text-slate-400 dark:bg-navy-900", i === n && "scale-110 ring-4 ring-brand-500/25")}>
                <s.icon className="h-5 w-5" />
              </button>
              <span className={cn("mt-2 hidden text-xs font-semibold sm:block", i === n ? "text-ink" : "text-slate-500")}>{s.t}</span>
            </li>
          ))}
        </ol>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className={`${SOFT} mx-auto mt-8 grid max-w-4xl gap-6 p-6 sm:grid-cols-[1.2fr_1fr] sm:p-9`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Step {i + 1} of {STEPS.length}</p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-ink">{step.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{step.d}</p>
              {step.cta && <Link href={step.cta.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">{step.cta.label}<ChevronRight className="h-4 w-4" /></Link>}
            </div>
            <ul className="space-y-2.5 self-center">
              {step.bullets.map((b) => <li key={b} className="flex items-center gap-2.5 rounded-lg bg-surface p-3 text-sm font-medium text-ink dark:bg-navy-950/70"><Check className="h-4 w-4 shrink-0 text-emerald-600" />{b}</li>)}
            </ul>
          </motion.div>
        </AnimatePresence>
        <div className="mt-5 flex justify-center gap-2">
          <button type="button" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-surface px-4 text-sm font-semibold text-ink hover:text-brand-600 disabled:opacity-40 dark:bg-navy-900"><ArrowLeft className="h-4 w-4" />Back</button>
          <button type="button" onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))} disabled={i === STEPS.length - 1} className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-500 px-5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-40">Next<ArrowRight className="h-4 w-4" /></button>
        </div>
      </Container>
    </section>
  );
}

/* ====================================================== industries slider */
export function IndustriesSlider() {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const measure = useCallback(() => {
    const el = track.current; if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);
  useEffect(() => { measure(); window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); }, [measure]);
  const by = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * Math.min(track.current.clientWidth * 0.8, 640), behavior: "smooth" });

  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><Pill>Industries</Pill><h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Built for the way you move</h2></div>
          <div className="flex gap-2">
            <button type="button" onClick={() => by(-1)} disabled={edge.start} aria-label="Previous industries" className={`${SOFT} grid h-11 w-11 place-items-center text-ink hover:text-brand-600 disabled:opacity-40`}><ArrowLeft className="h-5 w-5" /></button>
            <button type="button" onClick={() => by(1)} disabled={edge.end} aria-label="Next industries" className="grid h-11 w-11 place-items-center rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40"><ArrowRight className="h-5 w-5" /></button>
          </div>
        </div>
        <ul ref={track} onScroll={measure} className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {solutions.map((s) => (
            <li key={s.id} className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[30%]">
              <Link href={`/solutions#${s.id}`} className="group relative isolate block aspect-[4/5] overflow-hidden rounded-lg bg-navy-950">
                <Image src={s.image} alt="" fill sizes="(min-width:1024px) 30vw, 78vw" quality={80} className="-z-10 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-transparent" />
                <span className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-lg bg-white/15 text-white backdrop-blur"><DynIcon name={s.icon} className="h-5 w-5" /></span>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-lg font-black leading-snug">{s.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-300">{s.description}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">{s.features.slice(0, 3).map((f) => <li key={f} className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur">{f}</li>)}</ul>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-300">Explore<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ============================================================ closing CTA */
export function CtaBand() {
  const site = useSite();
  const dispatch = useAppDispatch();
  return (
    <section className="bg-surface py-12 sm:py-16">
      <Container>
        <div className="relative isolate overflow-hidden rounded-lg bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-30" />
          <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 -z-10 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 -z-10 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Ready to keep your vehicles safe?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">Order online, or call our team — we&apos;ll help you choose the right package and book the installation.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/pricing" className="inline-flex h-12 items-center gap-2 rounded-lg bg-brand-500 px-7 text-sm font-bold transition-colors hover:bg-brand-600">See packages<ArrowRight className="h-4 w-4" /></Link>
            <a href={`tel:${site.phone}`} className="inline-flex h-12 items-center gap-2 rounded-lg bg-white/10 px-7 text-sm font-bold backdrop-blur transition-colors hover:bg-white/20"><Phone className="h-4 w-4" />{site.phone}</a>
            <button type="button" onClick={() => dispatch(openDemoModal("Call-back request (home)"))} className="inline-flex h-12 items-center rounded-lg px-5 text-sm font-semibold text-slate-200 hover:text-white">Request a call-back</button>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-300">
            {["Doorstep installation", "24×7 helpline", "Android, iOS & web apps"].map((t) => <li key={t} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" />{t}</li>)}
          </ul>
        </div>
      </Container>
    </section>
  );
}
