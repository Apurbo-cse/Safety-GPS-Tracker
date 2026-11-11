"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Lock, LockOpen, MapPin, Smartphone } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import { features, homeFeatureIds } from "@/data/features";
import { DynIcon } from "@/lib/icons";
import { useAppDispatch } from "@/store/hooks";
import { openFeatureModal } from "@/store/slices/uiSlice";
import type { FeatureCategory, FeatureItem } from "@/types";
import { cn } from "@/utils/format";

const TABS: { key: "All" | FeatureCategory; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Vehicle Tracking", label: "Tracking" },
  { key: "Vehicle Security", label: "Security" },
  { key: "Driver Monitoring", label: "Driver" },
  { key: "Reports & Analytics", label: "Reports" },
  { key: "Maintenance & Reminders", label: "Reminders" },
  { key: "Platform", label: "Platform" },
];

const HERO_STATS = [
  ["10 sec", "Refresh"],
  ["3", "Map views"],
  ["Web·iOS·Android", "Access"],
];

const ROUTE = "M20 150 C 70 140, 90 90, 150 92 S 240 130, 280 80 S 340 30, 380 28";

/** Animated mini map for the hero card. */
function MapVisual() {
  return (
    <div aria-hidden className="relative h-full min-h-40 overflow-hidden rounded-md sm:min-h-48 border border-white/10 bg-navy-900">
      <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="fg-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#fff" strokeOpacity=".05" /></pattern>
        </defs>
        <rect width="400" height="180" fill="url(#fg-grid)" />
        {[[30, 20, 70, 40], [130, 15, 60, 50], [220, 110, 80, 50], [320, 70, 60, 60], [40, 100, 60, 40]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#fff" fillOpacity=".04" />
        ))}
        <g stroke="#2c3340" strokeWidth="9" fill="none" strokeLinecap="round">
          <path d="M0 70 H400" /><path d="M115 0 V180" /><path d="M300 0 V180" />
        </g>
        <path d={ROUTE} stroke="#f05a22" strokeOpacity=".3" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d={ROUTE} stroke="#f98a55" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="8 10" className="route-flow" />
        <circle cx="20" cy="150" r="6" fill="#22c55e" stroke="#fff" strokeWidth="2" />
        <g>
          <circle r="14" fill="#f05a22" fillOpacity=".25" />
          <circle r="6" fill="#f05a22" stroke="#fff" strokeWidth="2.5" />
          <animateMotion dur="7s" repeatCount="indefinite" path={ROUTE} />
        </g>
      </svg>
      <MapPin className="absolute right-[3%] top-[4%] h-7 w-7 fill-brand-600 text-white drop-shadow" />
      <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-green-400" />
        </span>
        Live · 10s refresh
      </span>
      <span className="absolute bottom-2.5 left-2.5 rounded-md border border-white/10 bg-navy-950/85 px-2.5 py-1.5 text-xs text-white backdrop-blur">
        <b>Delivery Van 01</b> <span className="text-slate-400">· 42 km/h</span>
      </span>
    </div>
  );
}

/** Lock status that toggles, for the engine-lock card. */
function LockVisual() {
  const [locked, setLocked] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setLocked((l) => !l), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <div aria-hidden className="flex items-center gap-3 rounded-md border border-line bg-surface/70 p-3">
      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition-colors duration-500", locked ? "bg-emerald-600" : "bg-amber-500")}>
        {locked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink">{locked ? "Engine locked" : "Engine unlocked"}</p>
        <p className="flex items-center gap-1 text-xs text-slate-500"><Smartphone className="h-3 w-3" />Command sent from app</p>
      </div>
      <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors duration-500", locked ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-500", locked ? "left-[22px]" : "left-0.5")} />
      </span>
    </div>
  );
}

function FeatureIcon({ f, large }: { f: FeatureItem; large?: boolean }) {
  const size = large ? "h-12 w-12" : "h-11 w-11";
  if (f.image) {
    return (
      <span className={cn("grid shrink-0 place-items-center overflow-hidden rounded-md bg-white p-1.5 ring-1 ring-line", size)}>
        <Image src={f.image} alt="" width={56} height={56} className="h-full w-full object-contain" />
      </span>
    );
  }
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-md bg-gradient-to-br from-navy-800 to-navy-950 text-white shadow-lg shadow-navy-950/20 transition-colors group-hover:from-brand-500 group-hover:to-brand-700", size)}>
      <DynIcon name={f.icon} className="h-5 w-5" />
    </span>
  );
}

export default function FeaturesGrid() {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("All");
  const bento = tab === "All";
  const items = bento
    ? homeFeatureIds.map((id) => features.find((f) => f.id === id)!).filter(Boolean)
    : features.filter((f) => f.category === tab).slice(0, 8);
  const count = (k: (typeof TABS)[number]["key"]) => (k === "All" ? homeFeatureIds.length : features.filter((f) => f.category === k).length);

  const card = (f: FeatureItem, i: number) => {
    const hero = bento && i === 0;
    const wide = bento && i === 1;
    return (
      <motion.div
        key={f.id}
        layout
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, delay: (i % 4) * 0.04, ease: [0.16, 1, 0.3, 1] }}
        className={cn(hero && "sm:col-span-2 lg:row-span-2", wide && "sm:col-span-2")}
      >
        <button
          type="button"
          onClick={() => dispatch(openFeatureModal(f.id))}
          className={cn(
            "spotlight card-pro group flex h-full w-full flex-col rounded-md border p-4 text-left sm:p-5",
            hero ? "border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-[#3a1a0c] text-white" : "border-line glass",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <FeatureIcon f={f} large={hero} />
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                hero ? "bg-white/10 text-brand-200" : "bg-brand-500/10 text-brand-text",
              )}
            >
              {f.category}
            </span>
          </div>

          <h3 className={cn("mt-4 font-bold", hero ? "text-lg text-white sm:text-xl" : "text-base text-ink")}>{f.title}</h3>
          <p className={cn("mt-1.5 text-sm leading-relaxed", hero ? "max-w-md text-slate-300" : "text-body", !hero && !wide && "flex-1")}>
            {f.description}
          </p>

          {hero && (
            <>
              <div className="mt-5 flex-1"><MapVisual /></div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {HERO_STATS.map(([v, l]) => (
                  <div key={l} className="rounded-md border border-white/10 bg-white/5 px-1.5 py-2">
                    <dd className="truncate text-xs font-bold text-white sm:text-sm">{v}</dd>
                    <dt className="text-[11px] text-slate-400">{l}</dt>
                  </div>
                ))}
              </dl>
            </>
          )}
          {wide && <div className="mt-4 flex-1"><LockVisual /></div>}

          <span className={cn("mt-4 inline-flex items-center gap-1 text-sm font-semibold", hero ? "text-brand-300" : "text-brand-text")}>
            Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </motion.div>
    );
  };

  return (
    <section className="bg-sec-white relative overflow-hidden py-16 sm:py-20">
      <div aria-hidden className="dot-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,#000,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
      <Container className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="[&>div]:mb-0">
            <SectionHeading
              align="left"
              eyebrow="Main features"
              title="Everything you need to run vehicles with confidence"
              description="Tracking, security, driver monitoring, reports and reminders in one platform."
            />
          </div>
          <Link
            href="/features"
            className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-500 hover:text-brand-text sm:self-auto"
          >
            See all features <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <LayoutGroup>
          <div role="tablist" aria-label="Feature categories" className="-mx-4 mt-8 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                    active ? "text-white" : "text-body hover:bg-softer hover:text-ink",
                  )}
                >
                  {active && <motion.span layoutId="feature-tab" className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 shadow-md shadow-brand-600/30" transition={{ type: "spring", bounce: 0.2, duration: 0.45 }} />}
                  <span className="relative flex items-center gap-1.5">
                    {t.label}
                    <span className={cn("rounded-full px-1.5 text-[11px] tabular-nums", active ? "bg-white/20" : "bg-softer text-slate-500")}>{count(t.key)}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <Reveal>
            <motion.div layout className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map(card)}
              </AnimatePresence>
            </motion.div>
          </Reveal>
        </LayoutGroup>
      </Container>
    </section>
  );
}
