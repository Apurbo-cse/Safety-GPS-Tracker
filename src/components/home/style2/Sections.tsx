"use client";
/**
 * Home page sections in a clean "light cards + two-tone headings" style.
 * Layout inspired by common GPS-tracker landing pages; all text, data and
 * images are Safety GPS Tracker's own (src/data, public/img).
 */
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, CalendarCheck, ChevronDown, Headset, Lock, Mail, MapPin, Phone, ShieldCheck, Smartphone, Wrench,
} from "lucide-react";
import Container from "@/components/common/Container";
import AppStoreBadges from "@/components/common/AppStoreBadges";
import ContactForm from "@/components/forms/ContactForm";
import { DynIcon } from "@/lib/icons";
import { features } from "@/data/features";
import { plans } from "@/data/pricing";
import { solutions } from "@/data/solutions";
import { FAQS } from "@/data/faqs";
import { DEVICE_PARTNER_LOGOS, SITE, TELECOM_PARTNER_LOGOS } from "@/lib/site";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";
import { cn, formatBDT } from "@/utils/format";

const clean = (l: string) => l.replace("/img/partners/", "/img/partners/clean/");

/* ------------------------------------------------------------------ helpers */
function Title({ a, b, c, className, center = true }: { a: string; b: string; c?: string; className?: string; center?: boolean }) {
  return (
    <h2 className={cn("text-2xl font-bold tracking-tight text-ink sm:text-3xl", center && "text-center", className)}>
      {a} <span className="text-brand-600">{b}</span>{c ? ` ${c}` : ""}
    </h2>
  );
}

/* ------------------------------------------------------------------ 1. hero */
export function HeroLight() {
  const dispatch = useAppDispatch();
  return (
    <section className="relative overflow-hidden bg-soft">
      <div aria-hidden className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />
      <div aria-hidden className="absolute -right-20 -top-10 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      <Container className="relative grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-md border border-dashed border-brand-400 bg-surface px-3 py-1.5 text-xs font-semibold text-ink">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-white"><Headset className="h-3.5 w-3.5" /></span>
            24/7 helpline · {SITE.phone}
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            Real-time GPS Tracking &amp; <span className="text-brand-600">Fleet Management</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-body">
            Track your vehicles live, lock the engine from your phone and get alerts — with tracking devices and apps made for Bangladesh&apos;s roads.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${SITE.phone}`} className="inline-flex h-10 items-center gap-2 rounded-md border border-brand-600 bg-surface px-4 text-sm font-semibold text-brand-text transition-colors hover:bg-brand-50">
              <Phone className="h-4 w-4" />Contact Sales
            </a>
            <button onClick={() => dispatch(openDemoModal("Book a demo"))} className="gloss-btn inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold text-white">
              <CalendarCheck className="h-4 w-4" />Book a Demo
            </button>
          </div>
        </div>
        <div className="relative">
          <div aria-hidden className="absolute inset-[12%] rounded-full border-[18px] border-brand-500/80" />
          <Image src="/img/platform.png" alt="Safety GPS Tracker web platform and mobile app" width={1200} height={1137} priority sizes="(min-width:1024px) 560px, 100vw" className="relative mx-auto h-auto w-full max-w-[560px]" />
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------- 2. why us */
const WHY = [
  { icon: Headset, t: "24/7 customer helpline" },
  { icon: Lock, t: "Remote engine lock for your safety" },
  { icon: Wrench, t: "Installation and after-sales support" },
  { icon: Smartphone, t: "Android, iOS and web apps" },
];
export function WhyUsLight() {
  return (
    <section className="relative overflow-hidden bg-surface py-14 sm:py-20">
      <p aria-hidden className="pointer-events-none absolute inset-x-0 top-6 select-none text-center text-[clamp(3rem,14vw,10rem)] font-black leading-none tracking-tight text-softer">SAFETY GPS</p>
      <Container className="relative">
        <Title a="Bangladesh's Trusted" b="GPS Tracking" />
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <div aria-hidden className="absolute inset-[10%] rounded-full border-[14px] border-brand-500/70" />
            <Image src="/img/packages/premium-voice.png" alt="Safety GPS tracking device" width={600} height={600} className="relative h-auto w-full object-contain" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {WHY.map((w) => (
              <div key={w.t} className="rounded-md border border-line bg-surface p-4 transition-shadow hover:shadow-md sm:p-5">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-500/10 text-brand-600"><w.icon className="h-6 w-6" /></span>
                <p className="mt-3 text-sm font-semibold text-ink">{w.t}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------- 3. features */
export function FeatureCardsLight() {
  const items = features.slice(0, 9);
  return (
    <section className="bg-soft py-14 sm:py-20">
      <Container>
        <Title a="Features to Keep Your" b="Vehicle Safe" />
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-body">Monitor your vehicle, get alerts in real time and stay in control — from your phone or the web.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div key={f.id} className="rounded-md bg-surface p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-500/10 text-brand-600"><DynIcon name={f.icon} className="h-6 w-6" /></span>
              <h3 className="mt-4 text-base font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{f.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center"><Link href="/features" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline">See all features <ArrowRight className="h-4 w-4" /></Link></p>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------- 4. products */
export function ProductStrip() {
  return (
    <section className="bg-surface py-14 sm:py-16">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-text">Our packages</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <Title a="Explore Our" b="GPS Packages" center={false} />
          <Link href="/pricing" className="hidden shrink-0 items-center gap-1 rounded-full border border-brand-500 px-3 py-1.5 text-xs font-semibold text-brand-text hover:bg-brand-50 sm:inline-flex">View all packages <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="-mx-3 mt-6 flex gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {plans.map((p) => (
            <Link key={p.id} href="/pricing" className="group relative w-44 shrink-0 rounded-md border border-line bg-surface p-3 transition-shadow hover:shadow-md sm:w-auto">
              {p.highlight && <span className="absolute left-2 top-2 z-10 max-w-[80%] truncate rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{p.highlight}</span>}
              <span className="relative block h-28 overflow-hidden rounded bg-transparent">
                {p.image && <Image src={p.image} alt="" fill sizes="(min-width:1024px) 25vw, 176px" className="object-contain p-2 transition-transform duration-300 group-hover:scale-105" />}
              </span>
              <p className="mt-3 truncate text-sm font-semibold text-ink">{p.name}</p>
              <p className="text-xs text-body">{formatBDT(p.devicePrice)} + {formatBDT(p.monthlyCharge)}/mo</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-text">Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------ 5. brand banner */
export function NetworkBanner() {
  return (
    <section className="relative overflow-hidden bg-brand-600 py-12 text-white sm:py-14">
      <div aria-hidden className="grid-bg absolute inset-0 opacity-30" />
      <Container className="relative text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Connected on Bangladesh&apos;s Leading Networks</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85">Our tracking devices send location and alerts over the country&apos;s major mobile networks, so your vehicle stays connected across the highways.</p>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TELECOM_PARTNER_LOGOS.map((p) => (
            <li key={p.name} className="grid h-20 place-items-center rounded-md bg-white px-4 shadow-lg shadow-black/10">
              <Image src={clean(p.logo)} alt={p.name} width={160} height={60} className="h-auto max-h-10 w-auto max-w-full object-contain" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* --------------------------------------------------------- 6. app section */
export function AppSectionLight() {
  const points = [
    { icon: MapPin, t: "Live GPS tracking", d: "See every vehicle on the map, updated every 10 seconds." },
    { icon: ShieldCheck, t: "Security in your pocket", d: "Engine lock, geo-fence and tamper alerts on your phone." },
  ];
  return (
    <section className="bg-surface py-14 sm:py-20">
      <Container>
        <Title a="All-in-one" b="GPS Tracking" c="App" />
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <ul className="space-y-5">
              {points.map((p) => (
                <li key={p.t} className="flex items-center gap-4">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-line bg-surface text-brand-600 shadow-sm"><p.icon className="h-7 w-7" /></span>
                  <span>
                    <span className="block text-base font-semibold text-ink">{p.t}</span>
                    <span className="block text-sm text-body">{p.d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8"><AppStoreBadges showQr={false} /></div>
          </div>
          <Image src="/img/platform.png" alt="Safety GPS Tracker app on phone and web" width={1200} height={1137} sizes="(min-width:1024px) 560px, 100vw" className="mx-auto h-auto w-full max-w-[520px]" />
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------- 7. stats */
export function StatsLight() {
  const stats: [string, string][] = [
    [String(plans.length), "Packages to choose from"],
    ["10 sec", "Live location updates"],
    [String(features.length), "Platform features"],
    ["24×7", "Customer helpline"],
  ];
  return (
    <section className="bg-soft py-12 sm:py-16">
      <Container className="grid items-center gap-8 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="text-2xl font-bold leading-snug tracking-tight text-ink sm:text-3xl">Safety GPS — vehicle tracking built for <span className="text-brand-600">Bangladesh</span></h2>
        <dl className="grid grid-cols-2 gap-6">
          {stats.map(([v, l]) => (
            <div key={l} className="text-center">
              <dd className="text-4xl font-bold tracking-tight text-brand-600 sm:text-5xl">{v}</dd>
              <dt className="mt-1 text-sm text-body">{l}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* --------------------------------------------------------- 8. industries */
export function IndustryIcons() {
  return (
    <section className="bg-surface py-14 sm:py-20">
      <Container>
        <Title a="Industries" b="We Cover" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {solutions.map((s) => (
            <Link key={s.id} href={`/solutions#${s.id}`} className="group flex flex-col items-center rounded-md border border-line bg-surface p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-softer text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white"><DynIcon name={s.icon} className="h-7 w-7" /></span>
              <span className="mt-3 text-sm font-semibold text-ink">{s.title}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------- 9. partners */
export function PartnerGrids() {
  return (
    <section className="bg-soft py-14 sm:py-16">
      <Container>
        <Title a="GPS Device" b="Partners" />
        <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {DEVICE_PARTNER_LOGOS.map((p) => (
            <li key={p.name} title={p.name} className="grid h-16 place-items-center rounded-md bg-surface px-3 shadow-sm">
              <Image src={clean(p.logo)} alt={p.name} width={140} height={50} className="h-auto max-h-8 w-auto max-w-full object-contain" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* --------------------------------------------------------------- 10. FAQ */
export function FaqTwoCol() {
  const items = FAQS.slice(0, 8);
  const [open, setOpen] = useState<string | null>(null);
  const cols = [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)];
  return (
    <section className="bg-surface py-14 sm:py-20">
      <Container>
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <h2 className="text-center text-2xl font-bold tracking-tight text-ink sm:text-3xl">Frequently Asked Questions</h2>
          <span className="h-px flex-1 bg-line" />
        </div>
        <p className="mt-2 text-center text-sm text-body">Answers about GPS tracking, devices, packages and support.</p>
        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {cols.map((col, ci) => (
            <div key={ci} className="space-y-3">
              {col.map((f) => {
                const on = open === f.id;
                return (
                  <div key={f.id} className="rounded-md border border-line bg-surface shadow-sm">
                    <button onClick={() => setOpen(on ? null : f.id)} aria-expanded={on} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-ink">
                      {f.q}
                      <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", on && "rotate-180 text-brand-text")} />
                    </button>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-body">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center"><Link href="/faq" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline">All FAQs <ArrowRight className="h-4 w-4" /></Link></p>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------- 11. contact */
export function ContactBlock() {
  return (
    <section className="bg-soft py-14 sm:py-20">
      <Container>
        <div className="grid overflow-hidden rounded-md shadow-lg lg:grid-cols-[1.4fr_1fr]">
          <div className="bg-surface p-4 sm:p-6 [&>form]:border-0 [&>form]:p-0 [&>form]:shadow-none"><ContactForm /></div>
          <div className="relative overflow-hidden bg-navy-900 p-6 text-white sm:p-8">
            <div aria-hidden className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-white/5" />
            <h3 className="text-lg font-bold">Get in touch</h3>
            <ul className="relative mt-6 space-y-6 text-sm">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" /><span><b className="block">Office</b><span className="text-slate-300">{SITE.address}</span></span></li>
              <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" /><span><b className="block">24/7 helpline</b><a href={`tel:${SITE.phone}`} className="text-slate-300 hover:text-white">{SITE.phone}</a></span></li>
              <li className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" /><span><b className="block">Email</b><a href={`mailto:${SITE.email}`} className="text-slate-300 hover:text-white">{SITE.email}</a></span></li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
