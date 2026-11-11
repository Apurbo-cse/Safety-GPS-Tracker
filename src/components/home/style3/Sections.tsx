"use client";
/**
 * Home page sections following a white-label GPS landing-page layout:
 * dark hero → product wheel → software block → app block → categories →
 * tabbed device catalogue → why-us checklist → partner grid → FAQ → enquiry.
 * All text, data and images are Safety GPS Tracker's own.
 */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import {
  ArrowRight, BarChart3, Bell, Bike, CalendarCheck, ChevronDown, Fence, Fuel, Globe,
  Lock, Mail, MapPin, Phone, Route, Shield, ShieldCheck, Smartphone, Truck, Car, User, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import Container from "@/components/common/Container";
import ContactForm from "@/components/forms/ContactForm";
import { DeviceTile } from "@/components/devices/ProductTile";
import PlanTile from "@/components/pricing/PlanTile";
import { plans } from "@/data/pricing";
import { productImage } from "@/data/catalogue";
import { devices } from "@/data/devices";
import { FAQS } from "@/data/faqs";
import { DEVICE_PARTNER_LOGOS, SITE, TELECOM_PARTNER_LOGOS } from "@/lib/site";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";
import { cn, formatBDT } from "@/utils/format";

const clean = (l: string) => l.replace("/img/partners/", "/img/partners/clean/");



/* ================================================================ 1. hero */
interface TelematicsData {
  vehicle: string;
  plate: string;
  place: string;
  speed: string;
  ignition: "ON" | "OFF" | "LOCKED";
  status: string;
  route: string;
  sensor: string;
  fuel: string;
}

const HERO_SLIDES = [
  {
    id: "car-tracking",
    tab: "Private cars",
    badge: "Bangladesh's Leading GPS Platform",
    badgeIcon: Shield,
    titleMain: "Monitor Your Vehicle & Keep It",
    titleHighlight: "Out Of The Stolen List",
    text: "Track your vehicle in real time with 10s updates, shut down the engine remotely from your smartphone, and receive instant anti-theft alerts.",
    bgImage: "/img/hero-car.jpg",
    accentGlow: "from-brand-500/35 via-orange-500/20 to-sky-500/15",
    primaryCta: { label: "Explore Products", href: "/products" },
    telematics: {
      vehicle: "Toyota Premio 2022",
      plate: "Dhaka Metro Ga 32-1142",
      place: "Mirpur Road, Dhanmondi",
      speed: "44 km/h",
      ignition: "ON" as const,
      status: "In Transit",
      route: "M10 160 C 80 150, 120 70, 230 70 S 300 120, 310 120",
      sensor: "AC: ON · Door: Closed",
      fuel: "78% Fuel",
    },
  },
  {
    id: "bike-security",
    tab: "Motorcycles",
    badge: "Motorcycle Security & Alarm",
    badgeIcon: Bike,
    titleMain: "Compact Waterproof GPS for",
    titleHighlight: "Bikes & Scooters",
    text: "Hidden compact tracker with vibration shock alert, ignition notification, and remote engine lock from your smartphone to stop bike theft cold.",
    bgImage: "/img/hero-bike.jpg",
    accentGlow: "from-amber-500/35 via-orange-500/20 to-brand-500/15",
    primaryCta: { label: "View Bike Trackers", href: "/products/category/gps-tracking-devices/bike-trackers" },
    telematics: {
      vehicle: "Yamaha R15 V4",
      plate: "Dhaka Metro Ha 19-4820",
      place: "Bashundhara R/A, Dhaka",
      speed: "0 km/h",
      ignition: "OFF" as const,
      status: "Parked & Armed",
      route: "M20 40 H280 V140 H60 Z",
      sensor: "Shock Sensor: Armed",
      fuel: "12.8V Battery",
    },
  },
  {
    id: "fleet-management",
    tab: "Fleets",
    badge: "Fleet & Heavy Commercial",
    badgeIcon: Truck,
    titleMain: "Complete Fleet Control &",
    titleHighlight: "Fuel Rod Monitoring",
    text: "Ultrasonic fuel rods to detect theft, trip mileage logs, speed violation alerts, and automated BRTA reminders.",
    bgImage: "/img/hero-truck.jpg",
    accentGlow: "from-sky-500/35 via-blue-500/20 to-cyan-500/15",
    primaryCta: { label: "Fleet Solutions", href: "/solutions" },
    telematics: {
      vehicle: "Isuzu 5-Ton Covered Van",
      plate: "Dhaka Metro Ta 14-8831",
      place: "Gazipur Bypass, Highway",
      speed: "58 km/h",
      ignition: "ON" as const,
      status: "Highway Route",
      route: "M10 40 C 90 40, 160 160, 250 160 S 300 40, 310 40",
      sensor: "BRTA Tax & Fitness: Valid",
      fuel: "86% (Ultrasonic)",
    },
  },
];

const ROADS = ["M0 40 H320", "M0 120 H320", "M70 0 V180", "M230 0 V180", "M0 160 C 100 150, 180 60, 320 70"];

function InteractiveTelematicsCard({ t }: { t: TelematicsData }) {
  const [locked, setLocked] = useState(t.ignition === "LOCKED");
  const isMoving = !locked && t.ignition === "ON";

  const handleToggleLock = () => {
    if (!locked) {
      setLocked(true);
      toast.error(`Engine Locked: Immobilizer command sent to ${t.plate}`);
    } else {
      setLocked(false);
      toast.success(`Engine Restored: Normal ignition enabled for ${t.plate}`);
    }
  };

  return (
    <div className="w-full max-w-[360px] overflow-hidden rounded-xl bg-[#0c2033]/80 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
      {/* Top telemetry bar */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3 bg-white/[0.04]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", locked ? "bg-amber-400" : "bg-emerald-400")} />
            <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", locked ? "bg-amber-400" : "bg-emerald-400")} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{t.vehicle}</p>
            <p className="font-mono text-[11px] text-slate-400">{t.plate}</p>
          </div>
        </div>
        <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border",
          locked ? "border-amber-500/30 bg-amber-500/15 text-amber-300" : isMoving ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300" : "border-slate-500/30 bg-slate-500/15 text-slate-300")}>
          {locked ? "Engine Locked" : t.status}
        </span>
      </div>

      {/* SVG Map Screen */}
      <div className="relative h-44 bg-[#0e273e]" aria-hidden>
        <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
          <rect width="320" height="180" fill="#0b2034" />
          {[[10, 52, 50, 56], [88, 8, 128, 24], [88, 52, 128, 56], [246, 52, 64, 56], [10, 132, 50, 40], [246, 132, 64, 40]].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#38bdf8" fillOpacity=".04" />
          ))}
          <g stroke="#1e293b" strokeWidth="8" fill="none" strokeLinecap="round">
            {ROADS.map((d) => <path key={d} d={d} />)}
          </g>
          <path d={t.route} fill="none" stroke="#f05a22" strokeOpacity=".3" strokeWidth="6" strokeLinecap="round" />
          <path d={t.route} fill="none" stroke="#fb923c" strokeWidth="2.5" strokeDasharray="6 7" strokeLinecap="round" className="route-flow" />
          <g>
            <circle r="12" fill={locked ? "#f59e0b" : "#f05a22"} fillOpacity=".3">
              <animate attributeName="r" values="8;16;8" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle r="5" fill={locked ? "#f59e0b" : "#f05a22"} stroke="#fff" strokeWidth="2" />
            {isMoving && <animateMotion dur="8s" repeatCount="indefinite" path={t.route} />}
          </g>
        </svg>

        <MapPin className="absolute right-3 top-3 h-5 w-5 fill-brand-500 text-white drop-shadow" />
        <span className="absolute bottom-2.5 left-2.5 flex max-w-[90%] items-center gap-1.5 truncate rounded-md bg-black/70 px-2 py-1 text-[11px] text-slate-200 backdrop-blur-md border border-white/10">
          <MapPin className="h-3 w-3 shrink-0 text-brand-400" />
          <span className="truncate">{t.place}</span>
        </span>
      </div>

      {/* Streamlined Live Controls Bar */}
      <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#091d30] px-4 py-3">
        <div className="flex items-center gap-3 text-xs">
          <div>
            <span className="text-[10px] font-semibold uppercase text-slate-400 block">Speed</span>
            <span className="font-bold text-white">{locked ? "0 km/h" : t.speed}</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <span className="text-[10px] font-semibold uppercase text-slate-400 block">Engine</span>
            <span className={cn("font-bold", locked ? "text-amber-400" : t.ignition === "ON" ? "text-emerald-400" : "text-slate-400")}>
              {locked ? "LOCKED" : t.ignition}
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleLock}
          type="button"
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all active:scale-95",
            locked
              ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/30"
              : "bg-red-600 text-white hover:bg-red-500 shadow-red-600/30"
          )}
        >
          <Lock className="h-3.5 w-3.5" />
          <span>{locked ? "Unlock" : "Lock Engine"}</span>
        </button>
      </div>
    </div>
  );
}

export function HeroDark() {
  const dispatch = useAppDispatch();
  const swiperRef = useRef<SwiperType | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  return (
    <section className="relative bg-[#0c1f33] text-white" aria-roledescription="carousel" aria-label="Hero highlights">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={700}
        autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        onSwiper={(sw) => { swiperRef.current = sw; }}
        onSlideChange={(sw) => setActive(sw.realIndex)}
        onAutoplayTimeLeft={(_, __, pct) => setProgress(1 - pct)}
      >
        {HERO_SLIDES.map((s, idx) => (
          <SwiperSlide key={s.id}>
            <div className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] sm:min-h-[580px]">
              <Image src={s.bgImage} alt="" fill priority={idx === 0} sizes="100vw" className="-z-30 object-cover object-center opacity-60" />
              <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-r from-[#0c1e31]/95 via-[#0c1e31]/70 to-[#0c1e31]/20" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#0c1e31] to-transparent" />
              <div aria-hidden className={cn("pointer-events-none absolute right-[5%] top-1/4 -z-10 h-[420px] w-[420px] rounded-full bg-gradient-to-tr opacity-70 blur-3xl", s.accentGlow)} />
              <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-20" />

              <Container className="grid items-center gap-10 pb-28 pt-12 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-300 backdrop-blur-md">
                    <s.badgeIcon className="h-3.5 w-3.5" />{s.badge}
                  </span>
                  <h1 className="mt-4 text-3xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[54px]">
                    {s.titleMain}{" "}
                    <span className="bg-gradient-to-r from-brand-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">{s.titleHighlight}</span>
                  </h1>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">{s.text}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href={s.primaryCta.href} className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-0.5 hover:bg-brand-600">
                      {s.primaryCta.label}<ArrowRight className="h-4 w-4" />
                    </Link>
                    <button onClick={() => dispatch(openDemoModal("Hero live demo"))} className="inline-flex h-11 items-center gap-2 rounded-lg bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20">
                      <CalendarCheck className="h-4 w-4 text-brand-300" />Book a demo
                    </button>
                  </div>
                </div>
                <div className="hidden justify-center sm:flex lg:col-span-5 lg:justify-end">
                  <InteractiveTelematicsCard t={s.telematics} />
                </div>
              </Container>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* slide tabs with autoplay progress */}
      <div className="absolute inset-x-0 bottom-6 z-20">
        <Container>
          <div role="tablist" aria-label="Choose slide" className="grid max-w-md grid-cols-3 gap-3">
            {HERO_SLIDES.map((s, i) => (
              <button key={s.id} role="tab" aria-selected={active === i} onClick={() => swiperRef.current?.slideToLoop(i)} className="group text-left">
                <span className="block h-1 overflow-hidden rounded-full bg-white/15">
                  <span className="block h-full rounded-full bg-brand-500 transition-[width] duration-100" style={{ width: active === i ? `${progress * 100}%` : i < active ? "100%" : "0%" }} />
                </span>
                <span className={cn("mt-2 block truncate text-xs font-semibold transition-colors", active === i ? "text-white" : "text-slate-400 group-hover:text-slate-200")}>{s.tab}</span>
              </button>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

/* ================================================================ 2. wheel */
const WHEEL: { icon: LucideIcon; t: string; d: string; href: string }[] = [
  { icon: Car, t: "Car Tracker", d: "Live location & engine lock", href: "/solutions#private-cars" },
  { icon: Bike, t: "Bike Tracker", d: "Theft alerts for riders", href: "/solutions#motorcycles" },
  { icon: Truck, t: "Truck Tracker", d: "Routes, mileage & fuel", href: "/solutions#logistics" },
  { icon: Fuel, t: "CNG Tracker", d: "Daily usage for owners", href: "/solutions#cng" },
  { icon: Smartphone, t: "Mobile App", d: "Android & iOS", href: "/mobile-app" },
  { icon: Globe, t: "Web Platform", d: "Full fleet console", href: "/features" },
];
const R = 40; // orbit radius, % of the box

export function ProductWheel() {
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (hover) return;
    const id = setInterval(() => setActive((i) => (i + 1) % WHEEL.length), 2600);
    return () => clearInterval(id);
  }, [hover]);

  const cur = WHEEL[active];
  const pos = WHEEL.map((_, i) => {
    const a = (i / WHEEL.length) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
  });

  return (
    <section className="bg-soft py-12 sm:py-16">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">All in one platform</span>
          <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight text-ink sm:text-5xl">We&apos;re Here To Keep Your Vehicles Safe</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-body">One platform for cars, bikes, trucks and whole fleets — live tracking, alerts and remote engine control.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => dispatch(openDemoModal("Book a schedule"))} className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-600">
              <CalendarCheck className="h-4 w-4" />Book a schedule
            </button>
            <Link href="/products" className="inline-flex h-11 items-center gap-2 rounded-lg bg-softer/80 px-5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:text-brand-600 dark:bg-navy-900/90">
              Explore products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="orbit-wrap relative mx-auto aspect-square w-full max-w-[440px]" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          {/* soft rings */}
          <div aria-hidden className="absolute inset-[10%] rounded-full bg-softer/60 dark:bg-navy-900/50" />
          <div aria-hidden className="absolute inset-[22%] rounded-full bg-softer/80 dark:bg-navy-900/80" />

          {/* rotating layer: lines + nodes */}
          <div className="orbit absolute inset-0">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
              <circle cx="50" cy="50" r={R} fill="none" stroke="currentColor" className="text-line-strong" strokeWidth=".4" strokeDasharray="1 2" />
              {pos.map((p, i) => (
                <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} stroke={i === active ? "#f05a22" : "currentColor"} className={cn(i === active ? "route-flow" : "text-line-strong")} strokeWidth={i === active ? ".7" : ".35"} strokeDasharray="2 2" />
              ))}
            </svg>
            {WHEEL.map((w, i) => {
              const on = i === active;
              return (
                <button
                  key={w.t}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-label={w.t}
                  aria-pressed={on}
                  className="absolute h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%` }}
                >
                  <span className={cn("orbit-rev grid h-full w-full place-items-center rounded-full shadow-lg transition-all duration-300",
                    on ? "scale-110 bg-brand-500 text-white shadow-brand-500/40" : "bg-surface text-brand-600 shadow-black/5 hover:scale-105 dark:bg-navy-950 dark:text-brand-400")}>
                    <w.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* centre hub */}
          <div className="absolute inset-[30%] grid place-items-center rounded-full bg-surface text-center shadow-xl shadow-black/5 dark:bg-navy-950">
            <span aria-hidden className="ring-pulse absolute inset-0 rounded-full bg-brand-500/10" />
            <div className="relative px-3">
              <Image src="/logo.png" alt="Safety GPS Tracker" width={140} height={46} className="mx-auto h-auto w-[62%] object-contain" />
              <AnimatePresence mode="wait">
                <motion.div key={cur.t} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                  <p className="mt-2 text-xs font-bold text-ink sm:text-sm">{cur.t}</p>
                  <p className="text-[10px] text-body sm:text-[11px]">{cur.d}</p>
                  <Link href={cur.href} className="mt-1 inline-flex items-center gap-0.5 text-[10px] font-semibold text-brand-600 hover:underline dark:text-brand-400 sm:text-[11px]">Learn more <ArrowRight className="h-3 w-3" /></Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================================================ 3. software */
const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">{children}</span>
);

function PointGrid({ items }: { items: { icon: LucideIcon; t: string }[] }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <li key={it.t} className="group flex items-center gap-3 rounded-lg bg-softer/80 p-3 transition-all hover:-translate-y-0.5 dark:bg-navy-900/90">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-400"><it.icon className="h-4 w-4" /></span>
          <span className="text-sm font-medium text-ink">{it.t}</span>
        </li>
      ))}
    </ul>
  );
}

const primaryBtn = "inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-600";
const softBtn = "inline-flex h-11 items-center gap-2 rounded-lg bg-softer/80 px-5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:text-brand-600 dark:bg-navy-900/90";

export function SoftwareBlock() {
  const dispatch = useAppDispatch();
  return (
    <section className="bg-surface py-12 sm:py-16">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Pill>Web platform</Pill>
          <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">GPS Tracking Software</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">One console for your whole fleet — cut idle time, wasted trips and running costs.</p>
          <PointGrid items={[
            { icon: MapPin, t: "Live map, 10-second updates" },
            { icon: Route, t: "Route history playback" },
            { icon: Fence, t: "Geo-fence & speed alerts" },
            { icon: BarChart3, t: "Daily mileage reports" },
          ]} />
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => dispatch(openDemoModal("Schedule a demo (software)"))} className={primaryBtn}><CalendarCheck className="h-4 w-4" />Schedule a demo</button>
            <Link href="/features" className={softBtn}>See how it works <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div aria-hidden className="absolute inset-[8%] -z-0 rounded-[2rem] bg-gradient-to-br from-brand-500/15 via-softer to-sky-500/10 blur-2xl dark:via-navy-900" />
          <Image src="/img/platform.png" alt="Safety GPS Tracker web platform" width={1200} height={1137} sizes="(min-width:1024px) 560px, 100vw" className="relative h-auto w-full" />
          <div className="absolute left-0 top-[12%] flex items-center gap-2 rounded-xl bg-surface/95 px-3 py-2 shadow-xl shadow-black/10 backdrop-blur dark:bg-navy-950/95 sm:-left-4">
            <span className="relative flex h-2 w-2"><span className="animate-ping-slow absolute inset-0 rounded-full bg-green-500" /><span className="relative h-2 w-2 rounded-full bg-green-500" /></span>
            <span className="text-xs font-semibold text-ink">Live · 10s updates</span>
          </div>
          <div className="absolute bottom-[14%] right-0 rounded-xl bg-surface/95 px-3 py-2 shadow-xl shadow-black/10 backdrop-blur dark:bg-navy-950/95 sm:-right-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Today</p>
            <p className="text-sm font-black text-ink">214 km <span className="text-xs font-semibold text-green-600">· 6 trips</span></p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================= 4. app */
export function AppBlock() {
  const dispatch = useAppDispatch();
  return (
    <section className="bg-soft py-12 sm:py-16">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        {/* app visual (rendered artwork: public/img/app/app-showcase.png) */}
        <div className="relative order-last mx-auto w-full max-w-[500px] lg:order-first">
          <Image src="/img/app/app-showcase.png" alt="Safety GPS Tracker mobile app showing a live map, engine lock and alerts" width={1580} height={1700} sizes="(min-width:1024px) 520px, 100vw" className="h-auto w-full" />
        </div>

        <div>
          <Pill>Android · iOS</Pill>
          <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">GPS Tracking Mobile App</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">Track, get alerts and control every vehicle right from your phone.</p>
          <PointGrid items={[
            { icon: Lock, t: "Engine lock from your phone" },
            { icon: Bell, t: "Instant push alerts" },
            { icon: MapPin, t: "Live location sharing" },
            { icon: User, t: "Driver details" },
          ]} />
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/mobile-app" className={primaryBtn}><Smartphone className="h-4 w-4" />Explore the app</Link>
            <button onClick={() => dispatch(openDemoModal("Schedule a demo (app)"))} className={softBtn}>Schedule a demo</button>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================================== shared product card + tabs */
const TRACKER_CATS = ["GPS Tracking Devices", "Voice Monitoring Devices", "Video & Voice Monitoring Devices"] as const;
const HARDWARE_CAT = "Vehicle GPS Hardware";
const TAB_EVENT = "sgt:catalogue-tab";

/** Jump to a product list and switch it to `tab` */
function openList(sectionId: string, tab: string) {
  window.dispatchEvent(new CustomEvent(TAB_EVENT, { detail: { sectionId, tab } }));
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
function useListTab(sectionId: string, initial: string) {
  const [tab, setTab] = useState(initial);
  useEffect(() => {
    const on = (e: Event) => { const d = (e as CustomEvent<{ sectionId: string; tab: string }>).detail; if (d.sectionId === sectionId) setTab(d.tab); };
    window.addEventListener(TAB_EVENT, on);
    return () => window.removeEventListener(TAB_EVENT, on);
  }, [sectionId]);
  return [tab, setTab] as const;
}

function Tabs({ tabs, tab, setTab }: { tabs: readonly string[]; tab: string; setTab: (t: string) => void }) {
  return (
    <div role="tablist" className="-mx-3 mt-5 flex gap-5 overflow-x-auto px-3 [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
      {tabs.map((c) => (
        <button key={c} role="tab" aria-selected={tab === c} onClick={() => setTab(c)}
          className={cn("shrink-0 border-b-2 pb-1.5 text-xs font-semibold uppercase tracking-wide transition-colors", tab === c ? "border-brand-600 text-brand-text" : "border-transparent text-body hover:text-ink")}>{c}</button>
      ))}
    </div>
  );
}


/* ========================================================== 5. categories */
const CATEGORIES: { label: string; section: string; tab: string }[] = [
  { label: "GPS Tracking Devices", section: "gps-tracker", tab: "GPS Tracking Devices" },
  { label: "Voice Monitoring Devices", section: "gps-tracker", tab: "Voice Monitoring Devices" },
  { label: "Video & Voice Monitoring", section: "gps-tracker", tab: "Video & Voice Monitoring Devices" },
  { label: "Vehicle GPS Hardware", section: "other-products", tab: "Hardware & Accessories" },
];
export function CategoryGrid() {
  const cover = (cat: string) => devices.find((d) => d.category === cat && d.image) ?? devices.find((d) => d.category === cat);
  return (
    <section className="bg-surface py-14 sm:py-20">
      <Container>
        <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">Shop by category</span>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Our Product&apos;s Category</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const d = cover(c.tab === "Hardware & Accessories" ? HARDWARE_CAT : c.tab);
            const count = devices.filter((x) => x.category === (c.tab === "Hardware & Accessories" ? HARDWARE_CAT : c.tab)).length;
            return (
              <button key={c.label} onClick={() => openList(c.section, c.tab)} className="group overflow-hidden rounded-lg bg-softer/80 text-left transition-all hover:-translate-y-1 dark:bg-navy-900/90">
                <span className="relative block aspect-[4/3] overflow-hidden">
                  {d && <Image src={productImage(d)} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-contain transition-transform duration-500 group-hover:scale-105" />}
                </span>
                <span className="flex items-center justify-between gap-2 p-3 sm:p-4">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink sm:text-[15px]">{c.label}</span>
                    <span className="block text-xs text-slate-500">{count} product{count === 1 ? "" : "s"}</span>
                  </span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-navy-950/70 dark:text-brand-400"><ArrowRight className="h-4 w-4" /></span>
                </span>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ======================================================== 6. GPS tracker */
export function DeviceCatalogue() {
  const [tab, setTab] = useListTab("gps-tracker", TRACKER_CATS[0]);
  const list = devices.filter((d) => d.category === tab);
  return (
    <section id="gps-tracker" className="scroll-mt-20 bg-soft py-14 sm:py-20">
      <Container>
        <div className="text-center"><span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">Trackers</span><h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">GPS Tracker</h2></div>
        <Tabs tabs={TRACKER_CATS} tab={tab} setTab={setTab} />
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {list.map((d) => <DeviceTile key={d.id} d={d} />)}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}

/* ===================================================== 6b. other products */
const OTHER_TABS = ["Hardware & Accessories", "Service Packages"] as const;
export function OtherProducts() {
  const [tab, setTab] = useListTab("other-products", OTHER_TABS[0]);
  return (
    <section id="other-products" className="scroll-mt-20 bg-surface py-14 sm:py-20">
      <Container>
        <div className="text-center"><span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">Hardware &amp; packages</span><h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Other Products</h2></div>
        <Tabs tabs={OTHER_TABS} tab={tab} setTab={setTab} />
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {tab === "Hardware & Accessories"
              ? devices.filter((d) => d.category === HARDWARE_CAT).map((d) => <DeviceTile key={d.id} d={d} />)
              : plans.map((p) => (
                <PlanTile key={p.id} p={p} />
              ))}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}

/* ============================================================== 7. why */
export function WhyChecklist() {
  const dispatch = useAppDispatch();
  const telecom = TELECOM_PARTNER_LOGOS.slice(0, 3).map((p) => p.name).join(", ");
  const minDevice = Math.min(...plans.map((p) => p.devicePrice));
  const minMonthly = Math.min(...plans.map((p) => p.monthlyCharge));
  const cards: { icon: LucideIcon; t: string; d: string }[] = [
    { icon: MapPin, t: "10-second live tracking", d: "Every vehicle refreshes on the map about every 10 seconds." },
    { icon: Lock, t: "Remote engine lock", d: "Stop an unauthorised trip by locking the engine from the app." },
    { icon: Globe, t: "Strong network coverage", d: `Devices connect over ${telecom}.` },
    { icon: Phone, t: "24/7 human helpline", d: `Real people answer on ${SITE.phone}, day and night.` },
  ];
  const stats: [string, string][] = [
    ["10s", "Location updates"],
    [String(plans.length), "Packages"],
    [formatBDT(minMonthly), "Per month from"],
    ["24×7", "Helpline"],
  ];
  return (
    <section className="bg-soft py-12 sm:py-16">
      <Container className="grid items-stretch gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">Why Safety GPS</span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Why Choose Safety GPS</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-body">
            Certified hardware, a simple app and a team that picks up the phone — with packages from {formatBDT(minDevice)} + {formatBDT(minMonthly)}/month.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {cards.map((c) => (
              <div key={c.t} className="group rounded-lg bg-softer/80 p-5 transition-all hover:-translate-y-1 dark:bg-navy-900/90">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-400"><c.icon className="h-5 w-5" /></span>
                <h3 className="mt-3 text-base font-bold text-ink">{c.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-body">{c.d}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="relative isolate flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] p-6 text-white sm:p-8">
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-40" />
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl" />
          <div className="relative mx-auto grid h-36 w-36 place-items-center">
            {[0, 1, 2].map((k) => <span key={k} aria-hidden className="ring-pulse absolute inset-0 rounded-full bg-brand-500/20" style={{ animationDelay: `${k}s` }} />)}
            <span className="relative grid h-24 w-24 place-items-center rounded-full bg-brand-500 shadow-xl shadow-brand-500/40"><ShieldCheck className="h-12 w-12" strokeWidth={1.6} /></span>
          </div>
          <p className="mt-4 text-center text-sm font-semibold text-brand-300">BTRC approved · 64 districts</p>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            {stats.map(([v, l]) => (
              <div key={l} className="rounded-lg bg-white/[0.06] p-3 text-center backdrop-blur-sm">
                <dd className="text-2xl font-black tracking-tight">{v}</dd>
                <dt className="mt-0.5 text-[11px] uppercase tracking-wider text-slate-300">{l}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            <Link href="/pricing" className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-4 text-sm font-semibold transition-colors hover:bg-brand-600">Compare packages <ArrowRight className="h-4 w-4" /></Link>
            <button onClick={() => dispatch(openDemoModal("Demo request (why choose)"))} className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-white/10 px-4 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/20">Book a demo</button>
          </div>
        </aside>
      </Container>
    </section>
  );
}

/* ========================================================== 8. partners */
function LogoTile({ p }: { p: { name: string; logo: string } }) {
  return (
    <li title={p.name} className="group grid h-20 place-items-center rounded-lg bg-surface px-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 dark:bg-navy-950/70">
      <Image src={clean(p.logo)} alt={p.name} width={140} height={50} className="h-auto max-h-9 w-auto max-w-full object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0" />
    </li>
  );
}

export function PartnerBorderGrid() {
  const all = [...DEVICE_PARTNER_LOGOS, ...TELECOM_PARTNER_LOGOS];
  const groups = [
    { icon: Smartphone, t: "Device manufacturers", d: "Certified tracking hardware we install and support.", items: DEVICE_PARTNER_LOGOS, cols: "grid-cols-2 sm:grid-cols-3" },
    { icon: Globe, t: "Network partners", d: "Mobile networks that carry your vehicle's data.", items: TELECOM_PARTNER_LOGOS, cols: "grid-cols-2" },
  ];
  return (
    <section className="bg-surface py-12 sm:py-16">
      <Container>
        <div className="text-center">
          <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">Ecosystem · {all.length} partners</span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Our Device &amp; Network Partners</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-body">Trusted hardware brands and nationwide mobile networks keep every vehicle connected.</p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          {groups.map((g) => (
            <div key={g.t} className="rounded-lg bg-softer/80 p-5 dark:bg-navy-900/90 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><g.icon className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-ink">{g.t}</h3>
                  <p className="text-xs text-body">{g.d}</p>
                </div>
                <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-ink dark:bg-navy-950/70">{g.items.length}</span>
              </div>
              <ul className={cn("mt-5 grid gap-3", g.cols)}>
                {g.items.map((p) => <LogoTile key={p.name} p={p} />)}
              </ul>
            </div>
          ))}
        </div>

        {/* scrolling strip */}
        <div className="marquee-mask mt-8 overflow-hidden" aria-hidden>
          <div className="marquee-track flex w-max gap-10 py-2">
            {[...all, ...all].map((p, i) => (
              <Image key={i} src={clean(p.logo)} alt="" width={120} height={40} className="h-7 w-auto object-contain opacity-50 grayscale" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* =============================================================== 9. faq */
export function FaqGrid() {
  const items = FAQS.slice(0, 8);
  const [open, setOpen] = useState<string | null>(null);
  const cols = [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)];
  return (
    <section className="bg-surface pb-14 sm:pb-20">
      <Container>
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <h2 className="text-center text-2xl font-bold tracking-tight text-ink sm:text-4xl">Frequently Asked Question</h2>
          <span className="h-px flex-1 bg-line" />
        </div>
        <p className="mt-2 text-center text-sm text-body">Get answers to your questions about GPS tracking, devices and packages.</p>
        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {cols.map((col, ci) => (
            <div key={ci} className="space-y-3">
              {col.map((f) => {
                const on = open === f.id;
                return (
                  <div key={f.id} className="border border-line bg-surface shadow-sm">
                    <button onClick={() => setOpen(on ? null : f.id)} aria-expanded={on} className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-semibold text-ink">
                      {f.q}<ChevronDown className={cn("h-5 w-5 shrink-0 text-slate-400 transition-transform", on && "rotate-180")} />
                    </button>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <p className="px-4 pb-4 text-sm leading-relaxed text-body">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* =========================================================== 10. enquiry */
export function EnquiryBlock() {
  const [tab, setTab] = useState<"products" | "fleet">("products");
  return (
    <section className="bg-surface pb-16 sm:pb-24">
      <Container>
        <div className="flex flex-wrap gap-3 sm:ml-[8%]">
          {([["products", "Inquiry for products"], ["fleet", "Inquiry for corporate fleet"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={cn("h-11 rounded-md px-5 text-xs font-semibold uppercase tracking-wide shadow-md transition-colors", tab === k ? "bg-brand-600 text-white" : "bg-navy-900 text-white hover:bg-navy-800")}>{l}</button>
          ))}
        </div>
        <div className="mt-2 grid overflow-hidden rounded-md shadow-xl lg:grid-cols-[1.6fr_1fr]">
          <div className="bg-surface p-4 sm:p-6 [&>form]:border-0 [&>form]:p-0 [&>form]:shadow-none">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-text">{tab === "products" ? "Ask about devices and packages" : "Tell us about your fleet"}</p>
            <ContactForm key={tab} />
          </div>
          <div className="relative overflow-hidden bg-[#3d3b52] p-6 text-white sm:p-8">
            <div aria-hidden className="absolute -right-10 top-1/3 h-32 w-32 rounded-full bg-white/5" />
            <div aria-hidden className="absolute -bottom-24 -left-10 h-64 w-[140%] -rotate-12 bg-white/5" />
            <h3 className="relative text-lg font-bold">Get in Touch</h3>
            <ul className="relative mt-6 space-y-6 text-sm">
              <li><MapPin className="h-7 w-7 text-brand-400" /><b className="mt-2 block">Head Office</b><span className="mt-1 block text-slate-300">{SITE.address}</span></li>
              <li><Phone className="h-7 w-7 text-brand-400" /><b className="mt-2 block">24/7 Helpline</b><a href={`tel:${SITE.phone}`} className="mt-1 block text-slate-300 hover:text-white">{SITE.phone}</a></li>
              <li><Mail className="h-7 w-7 text-brand-400" /><b className="mt-2 block">Email</b><a href={`mailto:${SITE.email}`} className="mt-1 block text-slate-300 hover:text-white">{SITE.email}</a></li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

