"use client";
/**
 * Inner-page layouts in the same white-label GPS style as the home page:
 * service page (Features), About and Contact. All content is Safety GPS Tracker's own.
 */
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Banknote, Briefcase, ChevronRight, Clock, Headset, Home, Mail, MapPin, MessageSquare, Navigation, Phone, PhoneCall, ShieldCheck, Smartphone, Sparkles, Wrench } from "lucide-react";
import Container from "@/components/common/Container";
import PageHero from "@/components/common/PageHero";
import Accordion from "@/components/common/Accordion";
import LocationMap from "@/components/common/LocationMap";
import { useCatalog } from "@/components/providers/CatalogProvider";
import ContactForm from "@/components/forms/ContactForm";
import { values } from "@/data/about";
import { features } from "@/data/features";
import { solutions } from "@/data/solutions";
import { DEVICE_PARTNER_LOGOS, SITE, TELECOM_PARTNER_LOGOS } from "@/lib/site";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";

const clean = (l: string) => l.replace("/img/partners/", "/img/partners/clean/");
const ROUTE = "M0 30 C 160 30, 220 8, 380 10 S 620 44, 820 26 S 1080 4, 1240 18 S 1400 34, 1440 30";

/* =============================================================== FEATURES */
const SERVICE_CARDS = [
  { t: "Real-time tracking", d: "Live location, speed and ignition status for every vehicle, refreshed about every 10 seconds on one map." },
  { t: "Smart alerts", d: "Geo-fence entry and exit, speed violations, ignition, tamper and panic alerts reach your phone the moment they happen." },
  { t: "Clear reports", d: "Daily mileage, trip history, parking time and working hours — plain reports that help you cut running costs." },
];

export function ServiceTop() {
  const { plans } = useCatalog();
  const dispatch = useAppDispatch();
  return (
    <>
      {/* hero matching homepage style */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] text-white">
        <Image
          src="/img/hero-truck.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-center opacity-70"
        />
        <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-r from-[#0c1e31]/95 via-[#0c1e31]/75 to-[#0c1e31]/30" />
        <div aria-hidden className="absolute -left-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div aria-hidden className="absolute -right-20 bottom-1/4 -z-10 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div aria-hidden className="grid-bg absolute inset-0 -z-10 opacity-30 pointer-events-none" />

        <Container className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 text-center">
          <nav aria-label="Breadcrumb" className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-300">
            <Link href="/" className="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-white">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-medium text-slate-100">Features</span>
          </nav>

          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-slow absolute inset-0 rounded-full bg-brand-400 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-brand-400" />
              </span>
              BTRC Certified Telematics Software
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white">
            GPS Fleet Management{" "}
            <span className="bg-gradient-to-r from-brand-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Software & Security
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
            One platform that covers your fleet operations — 10s live tracking, remote engine lock, ultrasonic fuel monitoring, smart alerts, and BRTA paper renewal reminders across Web, Android and iOS.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => dispatch(openDemoModal("Schedule a demo"))}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-brand-500 px-6 text-sm font-bold text-white transition-all hover:bg-brand-600 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              Schedule a Demo
            </button>
            <Link
              href="/pricing"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              Compare Packages <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-md border border-white/20 bg-surface backdrop-blur-sm">
            <div className="flex items-center gap-1.5 border-b border-line bg-soft px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs font-medium text-body">Safety GPS Tracker Web Dashboard</span>
            </div>
            <Image
              src="/img/platform.png"
              alt="Safety GPS Tracker platform"
              width={1200}
              height={1137}
              sizes="(min-width:1024px) 896px, 100vw"
              className="mx-auto h-auto w-full max-w-3xl"
            />
          </div>
        </Container>

        {/* GPS route along the bottom edge */}
        <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-6 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d={ROUTE} fill="none" stroke="#f05a22" strokeOpacity=".3" strokeWidth="5" vectorEffect="non-scaling-stroke" />
          <path d={ROUTE} fill="none" stroke="#f98a55" strokeWidth="1.5" strokeDasharray="6 10" className="route-flow" vectorEffect="non-scaling-stroke" />
        </svg>
      </section>

      {/* three cards with borderless modern bg */}
      <section className="bg-surface py-12">
        <Container className="grid gap-5 md:grid-cols-3">
          {SERVICE_CARDS.map((c) => (
            <div key={c.t} className="rounded-md bg-softer/80 dark:bg-navy-900/90 p-6 text-center transition-all hover:-translate-y-1">
              <h2 className="text-xl font-black uppercase tracking-tight text-brand-600 sm:text-2xl">{c.t}</h2>
              <p className="mt-3 text-sm leading-relaxed text-body">{c.d}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* solutions block */}
      <section className="bg-surface pb-12 sm:pb-16">
        <Container className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black uppercase leading-none tracking-tight text-ink sm:text-5xl">Tracking for<br />every fleet</h2>
            <p className="mt-4 text-lg font-semibold text-ink">One size does not fit all</p>
            <p className="mt-2 max-w-md text-sm text-body">Private cars, trucks, buses, bikes, CNGs and construction machines all need different things. Pick the package that fits your vehicles.</p>
            <Link href="/pricing" className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-brand-500 px-5 text-sm font-semibold text-white hover:bg-brand-600 transition-all">Compare packages <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-md bg-softer/80 dark:bg-navy-900/90 p-5 text-center transition-all hover:-translate-y-1">
              <div className="relative mx-auto h-32 overflow-hidden rounded"><Image src="/img/industries/logistics-bd.jpg" alt="" fill sizes="300px" className="object-cover" /></div>
              <span className="mt-4 inline-block rounded bg-brand-500 px-3 py-1 text-xs font-semibold text-white">{solutions.length} industries</span>
              <h3 className="mt-2 text-base font-bold text-ink">Solutions for industries</h3>
              <p className="mt-1 text-xs leading-relaxed text-body">From logistics to public transport, every sector gets the features it needs.</p>
            </div>
            <div className="rounded-md bg-softer/80 dark:bg-navy-900/90 p-5 text-center transition-all hover:-translate-y-1">
              <div className="relative mx-auto h-32"><Image src="/img/platform.png" alt="" fill sizes="300px" className="object-contain" /></div>
              <span className="mt-4 inline-block rounded bg-brand-500 px-3 py-1 text-xs font-semibold text-white">Android · iOS · Web</span>
              <h3 className="mt-2 text-base font-bold text-ink">Apps for every screen</h3>
              <p className="mt-1 text-xs leading-relaxed text-body">Track, get alerts and lock the engine from your phone or the web.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* benefits */}
      <section className="bg-soft py-12 sm:py-16">
        <Container>
          <span className="inline-block rounded-full bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white">Benefits of GPS fleet tracking</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-4xl">Everything in one place, for every vehicle.</h2>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            {[["10 sec", "Location updates"], [String(features.length), "Platform features"], [String(plans.length), "Packages"], ["24×7", "Helpline"]].map(([v, l]) => (
              <div key={l} className="rounded-md bg-softer/80 dark:bg-navy-900/90 p-5">
                <dd className="text-4xl font-black text-brand-600 sm:text-5xl">{v}</dd>
                <dt className="mt-1.5 text-xs font-medium uppercase tracking-wider text-body">{l}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* dark CTA band */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] text-white">
        <Image src="/img/hero-car.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-60" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0c1e31]/95 via-[#0c1e31]/75 to-[#0c1e31]/30" />
        <div aria-hidden className="absolute -left-10 top-1/2 -z-10 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <Container className="flex flex-col items-start justify-between gap-5 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight sm:text-4xl">Time to upgrade your fleet tracking</h2>
            <p className="mt-2 text-sm text-slate-200">Talk to our telematics experts and see live demo with your vehicle.</p>
          </div>
          <button
            onClick={() => dispatch(openDemoModal("Schedule a demo"))}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-brand-500 px-6 text-sm font-bold text-white transition-all hover:bg-brand-600 active:scale-95"
          >
            Book a Demo <ArrowRight className="h-4 w-4" />
          </button>
        </Container>
      </section>
    </>
  );
}

/* ================================================================== ABOUT */
export function AboutAuto() {
  const { plans } = useCatalog();
  const stats: [string, string, string][] = [
    [String(features.length), "+", "Platform features"],
    [String(solutions.length), "+", "Industries served"],
    [String(DEVICE_PARTNER_LOGOS.length + TELECOM_PARTNER_LOGOS.length), "+", "Device & telecom partners"],
    ["24", "×7", "Helpline"],
  ];
  return (
    <>
      <PageHero
        art="van"
        eyebrow="About Us"
        badgeText="Bangladesh's #1 GPS Tracking Platform"
        title="Empowering Smarter & Safer"
        titleHighlight="Vehicle Journeys Nationwide"
        description="Safety GPS Tracker delivers intelligent telematics, certified GPS tracking hardware, and proactive vehicle security to thousands of private owners and enterprise fleets."
      />

      <section className="bg-surface py-12 sm:py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3.5] overflow-hidden rounded-md">
            <Image src="/img/industries/private-cars-hd.jpg" alt="A tracked vehicle on the road" fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <ShieldCheck className="h-3.5 w-3.5" /> BTRC Approved License
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">Who We Are</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-body">
              <p>Safety GPS Tracker provides real-time GPS vehicle tracking for private vehicles and enterprise fleets across all 64 districts in Bangladesh.</p>
              <p>Our tracking devices, mobile apps and web platform show where each vehicle is, how it is being driven and when something needs attention — with 10-second updates, remote engine lock, and instant anti-theft notifications.</p>
              <p>We offer {plans.length} tailored packages with clear device pricing and transparent monthly charges, so every customer knows exactly what they pay for with zero hidden costs.</p>
              <p>Our corporate office is located at {SITE.address}, and our dedicated emergency hotline is open 24×7 on {SITE.phone}.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-soft py-12 sm:py-16">
        <Container>
          <div className="text-center">
            <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">Core Values</span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Why Choose Us</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-body">Vehicle tracking that keeps assets visible and secure, with 24/7 support whenever you need it.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {values.slice(0, 3).map((v) => (
              <div key={v.title} className="rounded-md bg-softer/80 dark:bg-navy-900/90 p-6 text-center transition-all hover:-translate-y-1">
                <v.icon className="mx-auto h-12 w-12 text-brand-500" strokeWidth={1.5} />
                <h3 className="mt-3 text-lg font-bold text-ink">{v.title}</h3>
                <p className="mt-1 text-sm text-body leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-12 sm:py-16">
        <Container>
          <dl className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            {stats.map(([n, suffix, l]) => (
              <div key={l} className="rounded-md bg-softer/80 dark:bg-navy-900/90 p-6">
                <dd className="text-4xl font-black tracking-tight text-ink sm:text-5xl">{n}<span className="text-brand-500">{suffix}</span></dd>
                <dt className="mt-1.5 text-xs font-medium uppercase tracking-wider text-body">{l}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-soft py-12 sm:py-16">
        <Container>
          <div className="text-center">
            <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">Ecosystem</span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Our Hardware & Telecom Partners</h2>
          </div>
          <ul className="mt-8 grid grid-cols-2 items-center gap-6 sm:grid-cols-5">
            {[...DEVICE_PARTNER_LOGOS, ...TELECOM_PARTNER_LOGOS].map((p) => (
              <li key={p.name} className="grid h-16 place-items-center rounded-md bg-softer/80 dark:bg-navy-900/90 p-3">
                <Image src={clean(p.logo)} alt={p.name} width={140} height={50} className="h-auto max-h-10 w-auto max-w-full object-contain" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}

/* ================================================================ CONTACT */
const CARD = "rounded-lg bg-softer/80 dark:bg-navy-900/90";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`;

const TEAMS = [
  { icon: Briefcase, t: "Corporate Sales", d: "Fleet proposals, volume pricing, multi-vehicle installs and custom packages.", cta: "Talk to sales", subject: "Corporate sales enquiry" },
  { icon: Headset, t: "Technical Support", d: "App log-in, device offline, alerts, engine lock and anything on the platform.", cta: "Get support", subject: "Technical support request" },
  { icon: Banknote, t: "Billing & Accounts", d: "Monthly invoices, bKash / Nagad / Rocket payments and renewals.", cta: "Billing help", subject: "Billing enquiry" },
];

const STEPS = [
  { icon: MessageSquare, t: "You reach out", d: "Call the 24×7 hotline or send the enquiry form below." },
  { icon: PhoneCall, t: "We call you back", d: "A specialist confirms your vehicles and recommends the right package." },
  { icon: Wrench, t: "Doorstep installation", d: "Our technician installs and tests the device at your location." },
  { icon: Smartphone, t: "Track from day one", d: "Log in to the app and see your vehicle live within minutes." },
];

const PROMISES = [
  { icon: Clock, t: "Reply within one business day", d: "Hotline calls are answered 24×7." },
  { icon: ShieldCheck, t: "BTRC approved", d: "Certified devices and licensed tracking service." },
  { icon: Wrench, t: "Doorstep setup in 64 districts", d: "Our technician comes to your vehicle." },
];

/** Contact-page enquiry: tab switch + form card + dark help panel. */
function ContactEnquiry() {
  const [tab, setTab] = useState<"products" | "fleet">("products");
  return (
    <section className="bg-surface py-12 sm:py-16">
      <Container>
        <div className="text-center">
          <Pill>Enquiry</Pill>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Send Us A Message</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-body">Tell us about your vehicles or fleet and our team will get back to you with the right package.</p>
          <div role="tablist" aria-label="Enquiry type" className="mt-6 inline-flex rounded-full bg-softer/80 p-1 dark:bg-navy-900/90">
            {([["products", "Products & packages"], ["fleet", "Corporate fleet"]] as const).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:px-5 sm:text-sm ${tab === k ? "bg-brand-500 text-white" : "text-body hover:text-ink"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              {tab === "products" ? "Ask about devices and packages" : "Tell us about your fleet"}
            </p>
            <ContactForm key={tab} showHeader={false} />
          </div>

          <aside className="relative isolate flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] p-6 text-white sm:p-8 lg:mt-7">
            <Image src="/img/hero-car.jpg" alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="-z-20 object-cover opacity-25" />
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl" />
            <h3 className="text-xl font-black tracking-tight">Prefer to talk?</h3>
            <p className="mt-1 text-sm text-slate-300">Our team picks up day and night.</p>
            <a href={`tel:${SITE.phone}`} className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 text-base font-bold transition-all hover:bg-brand-600 active:scale-95">
              <PhoneCall className="h-5 w-5" />{SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white/10 px-5 text-sm font-semibold backdrop-blur-md transition-all hover:bg-white/20">
              <Mail className="h-4 w-4" /><span className="truncate">{SITE.email}</span>
            </a>
            <ul className="mt-8 space-y-4">
              {PROMISES.map((p) => (
                <li key={p.t} className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-brand-300"><p.icon className="h-4 w-4" /></span>
                  <span><b className="block text-sm">{p.t}</b><span className="text-xs text-slate-300">{p.d}</span></span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">{children}</span>;
}

export function ContactAuto() {
  const { faqs: FAQS } = useCatalog();
  const dispatch = useAppDispatch();
  const contactCards = [
    { icon: Phone, title: "24/7 Hotline", subtitle: "Emergency & Support", value: SITE.phone, href: `tel:${SITE.phone}`, action: "Call now" },
    { icon: MapPin, title: "Corporate Office", subtitle: "Head Office Dhaka", value: SITE.address, href: MAPS_URL, action: "Get directions", external: true },
    { icon: Mail, title: "Email Queries", subtitle: "Sales & Invoicing", value: SITE.email, href: `mailto:${SITE.email}`, action: "Send email" },
  ];
  const quickFaqs = FAQS.filter((f) => f.category === "Billing & Support").slice(0, 4);

  return (
    <>
      <PageHero
        art="van"
        eyebrow="Contact & Support"
        badgeText="24/7 Emergency Assistance"
        title="We're Here To Keep Your"
        titleHighlight="Vehicles Connected & Safe"
        description="Whether you need a new GPS device installed, custom fleet telematics consultation, or billing support — our team is ready to help 24 hours a day, 7 days a week."
      />

      {/* quick contact */}
      <section className="bg-surface py-12 sm:py-16">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {contactCards.map((c) => (
              <div key={c.title} className={`${CARD} flex flex-col p-6 transition-all hover:-translate-y-1`}>
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><c.icon className="h-6 w-6" /></span>
                <span className="mt-4 block text-xs font-semibold uppercase tracking-wider text-slate-400">{c.subtitle}</span>
                <h3 className="text-lg font-bold text-ink">{c.title}</h3>
                <p className="mt-1 text-sm font-medium text-body-strong">{c.value}</p>
                <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
                  {c.action} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* teams */}
      <section className="bg-soft py-12 sm:py-16">
        <Container>
          <div className="text-center">
            <Pill>Departments</Pill>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Reach The Right Team</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-body">Pick what you need help with and we&apos;ll route you to the right specialist — no waiting in a general queue.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {TEAMS.map((t) => (
              <div key={t.t} className={`${CARD} flex flex-col p-6 text-center transition-all hover:-translate-y-1`}>
                <t.icon className="mx-auto h-12 w-12 text-brand-500" strokeWidth={1.5} />
                <h3 className="mt-3 text-lg font-bold text-ink">{t.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-body">{t.d}</p>
                <div className="mt-auto flex justify-center gap-2 pt-5">
                  <button onClick={() => dispatch(openDemoModal(t.subject))} className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white transition-all hover:bg-brand-600 active:scale-95">{t.cta}</button>
                  <a href={`tel:${SITE.phone}`} aria-label={`Call ${t.t}`} className="grid h-10 w-10 place-items-center rounded-lg bg-surface text-brand-600 transition-colors hover:bg-brand-500/10 dark:bg-navy-950/70 dark:text-brand-400"><Phone className="h-4 w-4" /></a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ContactEnquiry />

      {/* what happens next */}
      <section className="bg-soft py-12 sm:py-16">
        <Container>
          <div className="text-center">
            <Pill>What happens next</Pill>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">From Call To Live Tracking</h2>
          </div>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className={`${CARD} relative p-6 transition-all hover:-translate-y-1`}>
                <span className="absolute right-4 top-3 text-3xl font-black text-ink/5 dark:text-white/5">0{i + 1}</span>
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><s.icon className="h-6 w-6" /></span>
                <h3 className="mt-4 text-base font-bold text-ink">{s.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-body">{s.d}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* office + map */}
      <section className="bg-surface py-12 sm:py-16">
        <Container className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.5fr]">
          <div className={`${CARD} flex flex-col p-6 sm:p-8`}>
            <span className="self-start"><Pill>Visit us</Pill></span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink">Our Dhaka Office</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" /><span><b className="block text-ink">Address</b><span className="text-body">{SITE.address}</span></span></li>
              <li className="flex gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" /><span><b className="block text-ink">Helpline</b><span className="text-body">Open 24 hours, 7 days a week</span></span></li>
              <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" /><span><b className="block text-ink">Phone</b><a href={`tel:${SITE.phone}`} className="text-body hover:text-brand-text">{SITE.phone}</a></span></li>
              <li className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" /><span><b className="block text-ink">Email</b><a href={`mailto:${SITE.email}`} className="break-all text-body hover:text-brand-text">{SITE.email}</a></span></li>
            </ul>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-brand-500 px-5 text-sm font-semibold text-white transition-all hover:bg-brand-600 lg:mt-8">
              <Navigation className="h-4 w-4" /> Get directions
            </a>
          </div>
          <div className="min-h-[320px] overflow-hidden rounded-lg">
            <LocationMap lat={23.7513} lng={90.3727} label="Meem Tower, Shukrabad, Dhaka (approximate location)" />
          </div>
        </Container>
      </section>

      {/* quick FAQ */}
      <section className="bg-soft py-12 sm:py-16">
        <Container className="max-w-3xl">
          <div className="mb-8 text-center">
            <Pill>Support FAQ</Pill>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Before You Call</h2>
          </div>
          <Accordion items={quickFaqs} />
          <p className="mt-6 text-center text-sm text-body">
            More answers in our <Link href="/faq" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">Help Centre</Link>.
          </p>
        </Container>
      </section>
    </>
  );
}
