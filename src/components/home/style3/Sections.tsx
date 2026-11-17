"use client";
/**
 * Home page sections following a white-label GPS landing-page layout:
 * dark hero → product wheel → software block → app block → categories →
 * tabbed device catalogue → why-us checklist → partner grid → FAQ → enquiry.
 * All text, data and images are Safety GPS Tracker's own.
 */
import Image from "next/image";
import ProductImage from "@/components/common/ProductImage";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import {
  ArrowRight, Award, BarChart3, Bell, Bike, CalendarCheck, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Fence, Fuel, Globe,
  Lock, Mail, MapPin, Navigation, Phone, Route, ShieldCheck, Smartphone, Truck, Car, User, Wrench, type LucideIcon,
} from "lucide-react";
import Container from "@/components/common/Container";
import ContactForm from "@/components/forms/ContactForm";
import { DeviceTile } from "@/components/devices/ProductTile";
import PlanTile from "@/components/pricing/PlanTile";
import { useCatalog } from "@/components/providers/CatalogProvider";
import type { HeroSlide as HeroSlideT } from "@/data/hero";
import { categoryUrl } from "@/data/catalogue";
import DeviceVisual from "@/components/devices/DeviceVisual";
import { DEVICE_PARTNER_LOGOS, TELECOM_PARTNER_LOGOS } from "@/lib/site";
import { useSite } from "@/components/providers/SiteProvider";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";
import { cn, formatBDT } from "@/utils/format";
import { solutions } from "@/data/solutions";
import { DynIcon } from "@/lib/icons";

const clean = (l: string) => l.replace("/img/partners/", "/img/partners/clean/");



/* ================================================================ 1. hero */
export function HeroDark() {
  const { heroSlides: slides } = useCatalog();
  if (!slides.length) return null;
  return <HeroCarousel key={slides.map((x) => x.id).join("|")} slides={slides} />;
}

function HeroCarousel({ slides }: { slides: HeroSlideT[] }) {
  const dispatch = useAppDispatch();
  const swiperRef = useRef<SwiperType | null>(null);
  const [active, setActive] = useState(0);

  return (
    <section className="relative w-full h-[64vh] sm:h-[60vh] min-h-[440px] max-h-[580px] bg-[#0c1f38] overflow-hidden" aria-roledescription="carousel" aria-label="Hero highlights">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={slides.length > 1}
        speed={700}
        autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        onSwiper={(sw) => { swiperRef.current = sw; }}
        onSlideChange={(sw) => setActive(sw.realIndex)}
        className="h-full w-full"
      >
        {slides.map((s, idx) => (
          <SwiperSlide key={s.id} className="relative h-full w-full overflow-hidden">
            {/* Background image & gradient overlays */}
            <div className="absolute inset-0 z-0">
              <div className="hero-kb absolute inset-0">
                <ProductImage
                  src={s.bgImage}
                  alt={s.titleMain}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
              <div aria-hidden className="hero-glow pointer-events-none absolute right-[8%] top-[42%] h-56 w-56 rounded-full bg-brand-500/30 blur-3xl" />
              <div aria-hidden className="hero-sweep" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0c1f38]/95 via-[#0c1f38]/70 to-[#0c1f38]/20" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0c1f38]/85 via-transparent to-transparent" />
            </div>

            {/* Foreground content */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-white/20 bg-white/10 backdrop-blur-md text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                  {s.badge}
                </span>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                  {s.titleMain}{" "}
                  <span className="text-brand-400">{s.titleHighlight}</span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl line-clamp-4">
                  {s.text}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {s.ctaHref.startsWith("https://") ? (
                    <a
                      href={s.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors active:scale-95"
                    >
                      <span>{s.ctaLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <Link
                      href={s.ctaHref}
                      className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors active:scale-95"
                    >
                      <span>{s.ctaLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => dispatch(openDemoModal("Hero live demo"))}
                    className="inline-flex items-center gap-2 border border-white/30 bg-white/10 hover:bg-white hover:text-navy-950 backdrop-blur-md text-white px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer active:scale-95"
                  >
                    <CalendarCheck className="h-3.5 w-3.5" />
                    <span>Book a Demo</span>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom slide controls */}
      <div className="absolute bottom-5 left-0 right-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between pointer-events-none">
        {/* Indicators on the left */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => swiperRef.current?.slideToLoop(i)}
              className={cn(
                "h-1.5 rounded-full transition-all cursor-pointer",
                active === i
                  ? "w-7 bg-brand-500"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>

        {/* Previous / Next chevrons on the right */}
        {slides.length > 1 && (
          <div className="hidden sm:flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-8 h-8 rounded-full border border-white/30 bg-white/10 text-white hover:bg-brand-500 hover:border-brand-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => swiperRef.current?.slideNext()}
              className="w-8 h-8 rounded-full border border-white/30 bg-white/10 text-white hover:bg-brand-500 hover:border-brand-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================================================================ NovasBD Header */
export function SectionHeader({
  badge,
  title,
  description,
  link,
  center,
}: {
  badge: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
  center?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-3 mb-8 sm:mb-10", center ? "items-center text-center max-w-2xl mx-auto" : "md:flex-row md:items-end md:justify-between")}>
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
          <span className="w-5 h-[2px] bg-brand-500" />
          {badge}
        </span>
        <h2 className="text-xl sm:text-3xl font-extrabold text-[#0c1f38] dark:text-white tracking-tight leading-snug">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 dark:text-brand-400 shrink-0"
        >
          <span>{link.label}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

/* ================================================================ Capability snapshot (about + live numbers) */
export function CapabilitySnapshot() {
  const { plans, devices } = useCatalog();
  const tiles = [
    { v: "10s", l: "Live location refresh" },
    { v: "64", l: "Districts we install in" },
    { v: "24/7", l: "Helpline" },
  ];
  const metrics = [
    { v: plans.length, l: "Tracking packages" },
    { v: `${devices.length}+`, l: "Devices & accessories" },
    { v: "3", l: "Android, iOS & Web apps" },
    { v: "1-tap", l: "Remote engine lock" },
  ];
  return (
    <section className="bg-white py-12 dark:bg-[#00122b] sm:py-16">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-4 lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              <span className="h-[2px] w-5 bg-brand-500" /> About Safety GPS Tracker
            </span>
            <h2 className="text-xl font-extrabold leading-snug tracking-tight text-[#0c1f38] dark:text-white sm:text-3xl">Real-time vehicle tracking &amp; fleet security</h2>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
              We supply GPS tracking devices, a live web and mobile platform, and a 24/7 helpline for cars, motorcycles and fleets across Bangladesh — installed at your doorstep.
            </p>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
              See where a vehicle is every 10 seconds, get speed and geofence alerts, review route history and stop the engine remotely if it is stolen.
            </p>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {tiles.map((t) => (
                <div key={t.l} className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-[#00224f]">
                  <p className="text-lg font-extrabold text-[#0c1f38] dark:text-white">{t.v}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.l}</p>
                </div>
              ))}
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 pt-2 text-xs font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 dark:text-brand-400">Read about us <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-md border border-white/10 bg-gradient-to-br from-[#0c1f38] to-[#071322] p-5 text-white sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-400">At a glance</span>
                <span className="text-[10px] text-slate-300">Safety GPS Tracker</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((m) => (
                  <div key={m.l} className="rounded-md border border-white/15 bg-white/10 p-4 transition-colors hover:border-brand-500/80">
                    <div className="text-2xl font-extrabold sm:text-3xl">{m.v}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-200">{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ NovasBD Section 2: Four Fundamental Commitments */
export function FundamentalCommitments() {
  const COMMITMENTS = [
    {
      icon: ShieldCheck,
      code: "ENGINE LOCK",
      title: "Remote Engine Lock",
      desc: "Stop a stolen vehicle from the app or by calling the helpline, and see where it is while you wait.",
    },
    {
      icon: Navigation,
      code: "LIVE TRACKING",
      title: "10-Second Live Sync",
      desc: "Live vehicle movement every 10 seconds, with speed alerts and route history playback.",
    },
    {
      icon: Wrench,
      code: "INSTALLATION",
      title: "64 Districts Doorstep Fit",
      desc: "Our technicians fit the device at your doorstep, garage or fleet depot.",
    },
    {
      icon: Phone,
      code: "SUPPORT",
      title: "24/7 Helpline",
      desc: "Call any time for emergencies, engine lock and billing help.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#f9f8fb] dark:bg-[#00162f]">
      <Container>
        <SectionHeader
          badge="Commitments"
          title="Four fundamental commitments"
          description="What you can rely on when you track a vehicle with Safety GPS Tracker."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMMITMENTS.map((c) => (
            <div
              key={c.code}
              className="group rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#00224f] p-5 hover:border-brand-500 transition-all flex flex-col"
            >
              <span className="inline-flex p-2.5 rounded-md bg-[#0c1f38] text-white group-hover:bg-brand-500 transition-colors w-fit">
                <c.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-[10px] font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {c.code}
              </p>
              <h3 className="mt-1 text-sm font-bold text-[#0c1f38] dark:text-white">
                {c.title}
              </h3>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ NovasBD Section 3: Where We Deliver (Sectors) */
export function SectorsDeliver({ showLink = true }: { showLink?: boolean }) {
  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#00122b]">
      <Container>
        <SectionHeader
          badge="Sectors"
          title="Where we deliver"
          description="Tracking for the vehicles and fleets people in Bangladesh actually run."
          link={showLink ? { label: "All solutions", href: "/solutions" } : undefined}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {solutions.map((s) => (
            <Link
              key={s.id}
              href={`/solutions#${s.id}`}
              className="group relative bg-white dark:bg-[#00224f] border border-slate-200 dark:border-slate-800/80 rounded-md overflow-hidden hover:border-brand-500 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <ProductImage
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f38]/90 via-[#0c1f38]/30 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-white/20 text-white backdrop-blur-md">
                    <DynIcon name={s.icon} className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {s.title}
                  </span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.features.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="rounded bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <span className="mt-4 pt-2 border-t border-slate-100 dark:border-white/5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 group-hover:text-brand-700">
                  Explore solution <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ NovasBD Section 4: Hardware Catalogue */
export function HardwareCatalogueSection() {
  const { devices } = useCatalog();
  // featured = the first four with a published price (those can be bought straight away)
  const featured = [...devices.filter((d) => d.price), ...devices.filter((d) => !d.price)].slice(0, 4);
  if (!featured.length) return null;

  return (
    <section className="bg-surface py-12 sm:py-16">
      <Container>
        <SectionHeader
          badge="Hardware catalogue"
          title="Featured tracking devices"
          description="GPS trackers, voice and video monitoring devices and engine-lock relays."
          link={{ label: "View all products", href: "/products" }}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {featured.map((d) => <DeviceTile key={d.id} d={d} />)}
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ NovasBD Section 5: Telematics Blueprint */
export function BlueprintSection() {
  const BLUEPRINTS = [
    {
      num: "01",
      title: "Package Selection",
      desc: "Choose the tracker and monthly service plan tailored for private car, motorcycle, or commercial fleet requirements.",
    },
    {
      num: "02",
      title: "Doorstep Fitting",
      desc: "Our technicians concealed-fit and test the immobilizer relay at your doorstep across 64 districts.",
    },
    {
      num: "03",
      title: "App & Web Onboarding",
      desc: "Instant account activation with live access on Android, iOS, and Web platforms for continuous real-time monitoring.",
    },
    {
      num: "04",
      title: "24/7 Human Security",
      desc: "Continuous automated BRTA alerts, geofence trigger notifications, and emergency hotline engine cut-off support.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#0c1f38] text-white relative overflow-hidden">
      <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
      <Container className="relative z-10">
        <div className="flex flex-col gap-3 mb-8 sm:mb-10 items-center text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-brand-400 mb-2">
              <span className="w-5 h-[2px] bg-brand-500" />
              Telematics blueprint
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              From order to 24/7 sustained protection
            </h2>
            <p className="mt-2 text-xs sm:text-[13px] text-slate-300 leading-relaxed">
              From choosing a package to a tracker that is installed, switched on and watched.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BLUEPRINTS.map((b) => (
            <div key={b.num} className="rounded-md border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <span className="text-2xl font-extrabold text-brand-400">{b.num}</span>
              <h3 className="mt-2 text-sm font-bold text-white">{b.title}</h3>
              <p className="mt-1.5 text-[11px] text-slate-200 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ NovasBD Section 6: Quality & Certifications */
export function CertificationsSection() {
  const CERTS = [
    { title: "BTRC Approved Hardware", subtitle: "Approvals", desc: "Tracking hardware that carries BTRC approval for use on Bangladesh mobile networks.", icon: ShieldCheck },
    { title: "BRTA Document Alerts", subtitle: "Compliance", desc: "Reminders before registration, fitness and tax-token documents expire.", icon: CheckCircle2 },
    { title: "Android, iOS & Web", subtitle: "Apps", desc: "Track and lock from your phone or the web console with the same account.", icon: Award },
    { title: "64 Districts Network", subtitle: "Coverage", desc: "Doorstep installation and a 24/7 helpline for vehicles anywhere in Bangladesh.", icon: MapPin },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#00122b]">
      <Container>
        <SectionHeader
          badge="Approvals & coverage"
          title="Approved hardware, nationwide support"
          description="What backs every tracker we install."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CERTS.map((c) => (
            <div
              key={c.title}
              className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#00224f] p-5 flex flex-col"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#0c1f38] dark:text-white leading-tight">
                    {c.title}
                  </h3>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {c.subtitle}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ Solutions served (chips) */
export function SolutionChips() {
  return (
    <section className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-[#00122b]">
      <Container className="flex flex-wrap items-center gap-2.5">
        <span className="mr-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Vehicles we track</span>
        {solutions.map((x) => (
          <Link key={x.id} href={`/solutions#${x.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:bg-[#00224f] dark:text-slate-200 dark:hover:text-brand-300">
            <DynIcon name={x.icon} className="h-3.5 w-3.5 text-brand-500" />{x.title}
          </Link>
        ))}
      </Container>
    </section>
  );
}

/* ================================================================ NovasBD Section 7: Direct Procurement Closing CTA */
export function TenderCtaSection() {
  const site = useSite();

  return (
    <section className="py-12 sm:py-16 bg-[#f9f8fb] dark:bg-[#00162f]">
      <Container>
        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#00224f] p-6 sm:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
              <span className="w-5 h-[2px] bg-brand-500" />
              Direct procurement & installation
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0c1f38] dark:text-white tracking-tight">
              Need a formal fleet proposal or doorstep device installation?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Call our sales &amp; engineering desk directly or submit your vehicle requirements. Our certified technicians cover all 64 districts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:${site.phone}`}
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Helpline ({site.phone})</span>
            </a>
          </div>
        </div>
      </Container>
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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50/70 to-white dark:from-navy-950 dark:via-navy-900/40 dark:to-navy-950 py-16 sm:py-24 border-b border-line/40">
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 -z-0 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute left-0 bottom-0 -z-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <Container className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">All in one platform</span>
          <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight text-ink sm:text-5xl">We&apos;re Here To Keep Your Vehicles Safe</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-body">One platform for cars, bikes, trucks and whole fleets — live tracking, alerts and remote engine control.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => dispatch(openDemoModal("Book a schedule"))} className="inline-flex h-9 sm:h-11 items-center gap-2 rounded-md bg-brand-500 px-4 sm:px-6 text-xs sm:text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-600">
              <CalendarCheck className="h-4 w-4" />Book a schedule
            </button>
            <Link href="/products" className="inline-flex h-9 sm:h-11 items-center gap-2 rounded-md bg-softer/80 px-3.5 sm:px-5 text-xs sm:text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:text-brand-600 dark:bg-navy-900/90">
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
                  <span className={cn("orbit-rev grid h-full w-full place-items-center rounded-full border transition-all duration-300",
                    on ? "scale-110 border-brand-500 bg-brand-500 text-white ring-4 ring-brand-500/20" : "border-line bg-surface text-brand-600 hover:scale-105 dark:border-white/10 dark:bg-navy-950 dark:text-brand-400")}>
                    <w.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* centre hub */}
          <div className="absolute inset-[30%] grid place-items-center rounded-full border border-line/60 bg-surface text-center dark:border-white/10 dark:bg-navy-950">
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
const Pill = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <span className={cn(
    "inline-block rounded-full px-3 py-1 text-xs font-semibold",
    dark ? "bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30" : "bg-brand-500/10 text-brand-600 dark:text-brand-400"
  )}>
    {children}
  </span>
);

const primaryBtn = "inline-flex h-9 sm:h-11 items-center gap-2 rounded-md bg-brand-500 px-4 sm:px-6 text-xs sm:text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-600";
const softBtn = "inline-flex h-9 sm:h-11 items-center gap-2 rounded-md bg-softer/80 px-3.5 sm:px-5 text-xs sm:text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:text-brand-600 dark:bg-navy-900/90";

export function SoftwareBlock() {
  const dispatch = useAppDispatch();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1e31] via-[#102740] to-[#0c1e31] py-16 sm:py-24 text-white border-y border-white/10">
      {/* High-tech telemetry glow & pattern */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/15 via-transparent to-transparent opacity-60" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-1/3 -z-0 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-20 bottom-10 -z-0 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />

      <Container className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Pill dark>Web platform</Pill>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">GPS Tracking Software</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-300">One console for your whole fleet — cut idle time, wasted trips and running costs.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { icon: MapPin, t: "Live map, 10-second updates" },
              { icon: Route, t: "Route history playback" },
              { icon: Fence, t: "Geo-fence & speed alerts" },
              { icon: BarChart3, t: "Daily mileage reports" },
            ].map((it) => (
              <li key={it.t} className="group flex items-center gap-3 rounded-md bg-white/[0.07] p-3 text-white ring-1 ring-white/10 transition-all hover:bg-white/[0.12] hover:-translate-y-0.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-500/20 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-white"><it.icon className="h-4 w-4" /></span>
                <span className="text-sm font-medium text-white">{it.t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => dispatch(openDemoModal("Schedule a demo (software)"))} className={primaryBtn}><CalendarCheck className="h-4 w-4" />Schedule a demo</button>
            <Link href="/features" className="inline-flex h-9 sm:h-11 items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3.5 sm:px-5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20">See how it works <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div aria-hidden className="absolute inset-[8%] -z-0 rounded-2xl bg-gradient-to-br from-brand-500/25 via-sky-500/15 to-transparent blur-2xl" />
          <Image src="/img/platform.png" alt="Safety GPS Tracker web platform" width={1200} height={1137} sizes="(min-width:1024px) 560px, 100vw" className="relative h-auto w-full" />
          <div className="absolute left-0 top-[12%] flex items-center gap-2 rounded-md bg-[#0c2033]/90 px-3 py-2 ring-1 ring-white/15 backdrop-blur sm:-left-4">
            <span className="relative flex h-2 w-2"><span className="animate-ping-slow absolute inset-0 rounded-full bg-green-500" /><span className="relative h-2 w-2 rounded-full bg-green-500" /></span>
            <span className="text-xs font-semibold text-white">Live · 10s updates</span>
          </div>
          <div className="absolute bottom-[14%] right-0 rounded-md bg-[#0c2033]/90 px-3 py-2 ring-1 ring-white/15 backdrop-blur sm:-right-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Today</p>
            <p className="text-sm font-black text-white">214 km <span className="text-xs font-semibold text-emerald-400">· 6 trips</span></p>
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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100/90 via-slate-50/50 to-white dark:from-navy-950 dark:via-navy-900/40 dark:to-navy-950 py-16 sm:py-24 border-b border-line/40">
      <div aria-hidden className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 -z-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-10 top-10 -z-0 h-80 w-80 rounded-full bg-brand-500/5 blur-3xl" />
      <Container className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
        {/* app visual (rendered artwork: public/img/app/app-showcase.png) */}
        <div className="relative order-last mx-auto w-full max-w-[500px] lg:order-first">
          <Image src="/img/app/app-showcase.png" alt="Safety GPS Tracker mobile app showing a live map, engine lock and alerts" width={1580} height={1700} sizes="(min-width:1024px) 520px, 100vw" className="h-auto w-full" />
        </div>

        <div>
          <Pill>Android · iOS</Pill>
          <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">GPS Tracking Mobile App</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">Track, get alerts and control every vehicle right from your phone.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Lock, t: "Engine lock from your phone" },
              { icon: Bell, t: "Instant push alerts" },
              { icon: MapPin, t: "Live location sharing" },
              { icon: User, t: "Driver details" },
            ].map((it) => (
              <li key={it.t} className="group flex items-center gap-3 rounded-md bg-white dark:bg-navy-900/90 p-3 ring-1 ring-line/50 transition-all hover:-translate-y-0.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-400"><it.icon className="h-4 w-4" /></span>
                <span className="text-sm font-medium text-ink">{it.t}</span>
              </li>
            ))}
          </ul>
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
const TAB_EVENT = "sgt:catalogue-tab";

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
export function CategoryGrid() {
  const { devices, catalogue } = useCatalog();
  const cover = (cat: string) => devices.find((d) => d.category === cat && d.image) ?? devices.find((d) => d.category === cat);
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-50 dark:from-navy-950 dark:via-navy-900/60 dark:to-navy-950 py-16 sm:py-24 border-b border-line/40">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-0 h-64 w-[600px] rounded-full bg-brand-500/5 blur-3xl" />
      <Container className="relative z-10">
        <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">Shop by category</span>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Our Product&apos;s Category</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {catalogue.map((c) => {
            const d = cover(c.name);
            const count = c.count;
            return (
              <Link key={c.slug} href={categoryUrl(c.name)} className="group overflow-hidden rounded-md bg-white text-left ring-1 ring-line/50 transition-all hover:-translate-y-1 dark:bg-navy-900/90">
                <span className="relative block aspect-[4/3] overflow-hidden bg-slate-50 dark:bg-navy-950/50">
                  {d?.image ? <ProductImage src={d.image} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-contain p-2" /> : d ? <DeviceVisual kind={d.visual} className="h-full w-full" /> : null}
                </span>
                <span className="flex items-center justify-between gap-2 p-3 sm:p-4">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink sm:text-[15px]">{c.name}</span>
                    <span className="block text-xs text-slate-500">{count} product{count === 1 ? "" : "s"}</span>
                  </span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-softer text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-navy-950/70 dark:text-brand-400"><ArrowRight className="h-4 w-4" /></span>
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ======================================================== 6. products by category */
const PER_TAB = 8;

/** One tab per real category (so a category created in the admin panel gets its own tab automatically). */
export function DeviceCatalogue() {
  const { devices, catalogue } = useCatalog();
  const names = catalogue.map((c) => c.name);
  const [picked, setPicked] = useListTab("gps-tracker", names[0] ?? "");
  const tab = names.includes(picked) ? picked : names[0] ?? "";
  if (!names.length) return null;
  const node = catalogue.find((c) => c.name === tab)!;
  const list = devices.filter((d) => d.category === tab);
  return (
    <section id="gps-tracker" className="relative overflow-hidden scroll-mt-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-navy-950 dark:via-navy-900/30 dark:to-navy-950 py-16 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/3 -z-0 h-96 w-96 rounded-full bg-sky-500/5 blur-3xl" />
      <Container className="relative z-10">
        <div className="text-center"><span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">Shop products</span><h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">GPS Trackers &amp; Hardware</h2></div>
        <Tabs tabs={names} tab={tab} setTab={setPicked} />
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {list.slice(0, PER_TAB).map((d) => <DeviceTile key={d.id} d={d} />)}
          </motion.div>
        </AnimatePresence>
        {list.length > PER_TAB && (
          <div className="mt-8 text-center">
            <Link href={categoryUrl(node.name)} className="inline-flex h-9 sm:h-11 items-center gap-2 rounded-md bg-brand-500 px-4 sm:px-6 text-xs sm:text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-600">View all {list.length} {node.name} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        )}
      </Container>
    </section>
  );
}

/* ========================================================= 6b. service packages */
export function OtherProducts() {
  const { plans } = useCatalog();
  if (!plans.length) return null;
  return (
    <section id="other-products" className="relative overflow-hidden scroll-mt-20 bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/70 dark:from-navy-950 dark:via-navy-900/70 dark:to-navy-950 py-16 sm:py-24 border-y border-line/40">
      <div aria-hidden className="pointer-events-none absolute left-0 bottom-10 -z-0 h-80 w-80 rounded-full bg-brand-500/5 blur-3xl" />
      <Container className="relative z-10">
        <div className="text-center"><span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">Packages</span><h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Service Packages</h2><p className="mx-auto mt-3 max-w-xl text-sm text-body">Pay once for the device, then a simple monthly charge for tracking, apps and support.</p></div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {plans.map((p) => <PlanTile key={p.id} p={p} />)}
        </div>
      </Container>
    </section>
  );
}

/* ============================================================== 7. why */
export function WhyChecklist() {
  const site = useSite();
  const { plans } = useCatalog();
  const dispatch = useAppDispatch();
  const telecom = TELECOM_PARTNER_LOGOS.slice(0, 3).map((p) => p.name).join(", ");
  const minDevice = plans.length ? Math.min(...plans.map((p) => p.devicePrice)) : 0;
  const minMonthly = plans.length ? Math.min(...plans.map((p) => p.monthlyCharge)) : 0;
  const cards: { icon: LucideIcon; t: string; d: string }[] = [
    { icon: MapPin, t: "10-second live tracking", d: "Every vehicle refreshes on the map about every 10 seconds." },
    { icon: Lock, t: "Remote engine lock", d: "Stop an unauthorised trip by locking the engine from the app." },
    { icon: Globe, t: "Strong network coverage", d: `Devices connect over ${telecom}.` },
    { icon: Phone, t: "24/7 human helpline", d: `Real people answer on ${site.phone}, day and night.` },
  ];
  const stats: [string, string][] = [
    ["10s", "Location updates"],
    [String(plans.length), "Packages"],
    [formatBDT(minMonthly), "Per month from"],
    ["24×7", "Helpline"],
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-navy-950 dark:via-navy-900/40 dark:to-navy-950 py-16 sm:py-24">
      <Container className="grid items-stretch gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">Why Safety GPS</span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Why Choose Safety GPS</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-body">
            Certified hardware, a simple app and a team that picks up the phone — with packages from {formatBDT(minDevice)} + {formatBDT(minMonthly)}/month.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {cards.map((c) => (
              <div key={c.t} className="group rounded-md bg-slate-100/80 p-5 ring-1 ring-line/30 transition-all hover:-translate-y-1 dark:bg-navy-900/90">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-400"><c.icon className="h-5 w-5" /></span>
                <h3 className="mt-3 text-base font-bold text-ink">{c.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-body">{c.d}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="relative isolate flex flex-col overflow-hidden rounded-md bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] p-6 text-white sm:p-8">
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-40" />
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl" />
          <div className="relative mx-auto grid h-36 w-36 place-items-center">
            {[0, 1, 2].map((k) => <span key={k} aria-hidden className="ring-pulse absolute inset-0 rounded-full bg-brand-500/20" style={{ animationDelay: `${k}s` }} />)}
            <span className="relative grid h-24 w-24 place-items-center rounded-full bg-brand-500"><ShieldCheck className="h-12 w-12" strokeWidth={1.6} /></span>
          </div>
          <p className="mt-4 text-center text-sm font-semibold text-brand-300">BTRC approved · 64 districts</p>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            {stats.map(([v, l]) => (
              <div key={l} className="rounded-md bg-white/[0.06] p-3 text-center backdrop-blur-sm">
                <dd className="text-2xl font-black tracking-tight">{v}</dd>
                <dt className="mt-0.5 text-[11px] uppercase tracking-wider text-slate-300">{l}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            <Link href="/pricing" className="inline-flex h-8 sm:h-10 flex-1 items-center justify-center gap-1.5 rounded-md bg-brand-500 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-colors hover:bg-brand-600">Compare packages <ArrowRight className="h-4 w-4" /></Link>
            <button onClick={() => dispatch(openDemoModal("Demo request (why choose)"))} className="inline-flex h-8 sm:h-10 flex-1 items-center justify-center rounded-md bg-white/10 px-3 sm:px-4 text-xs sm:text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/20">Book a demo</button>
          </div>
        </aside>
      </Container>
    </section>
  );
}

/* ========================================================== 8. partners */
type Partner = { name: string; logo: string; kind: "network" | "hardware" };
const PARTNERS: Partner[] = [
  ...TELECOM_PARTNER_LOGOS.map((p) => ({ ...p, kind: "network" as const })),
  ...DEVICE_PARTNER_LOGOS.map((p) => ({ ...p, kind: "hardware" as const })),
];
const PARTNER_TABS = [
  { id: "all", label: "All partners" },
  { id: "network", label: "Mobile networks" },
  { id: "hardware", label: "GPS hardware" },
] as const;

/** One logo cell of the partner wall: hairline borders shared with its neighbours, colour on hover. */
function LogoCell({ p }: { p: Partner }) {
  return (
    <motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      className="group relative flex h-28 flex-col items-center justify-center gap-2 bg-white px-4 transition-colors hover:bg-brand-500/[0.04] dark:bg-[#00224f] dark:hover:bg-brand-500/10 sm:h-32">
      <Image src={clean(p.logo)} alt={p.name} width={140} height={50} className="h-auto max-h-9 w-auto max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-110" />
      <span className="text-[11px] font-semibold text-slate-500 transition-colors group-hover:text-ink dark:text-slate-400 dark:group-hover:text-white">{p.name}</span>
      <span className={cn("absolute right-2 top-2 rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider", p.kind === "network" ? "bg-sky-500/10 text-sky-600 dark:text-sky-300" : "bg-brand-500/10 text-brand-600 dark:text-brand-300")}>{p.kind === "network" ? "Network" : "GPS"}</span>
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100" />
    </motion.li>
  );
}

/** Partners: a summary card on the left, and a filterable logo wall on the right. */
export function PartnerBorderGrid() {
  const [tab, setTab] = useState<(typeof PARTNER_TABS)[number]["id"]>("all");
  const shown = PARTNERS.filter((p) => tab === "all" || p.kind === tab);
  const networks = TELECOM_PARTNER_LOGOS.length;
  const hardware = DEVICE_PARTNER_LOGOS.length;
  return (
    <section className="relative overflow-hidden border-t border-slate-200 bg-[#f9f8fb] py-14 dark:border-slate-800 dark:bg-[#00162f] sm:py-20">
      <Container className="relative z-10">
        <SectionHeader
          badge="Partners"
          title="National telecom & global GPS partners"
          description="Mobile networks that carry your vehicle's data, and the tracker brands we install and support."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="relative isolate overflow-hidden rounded-md bg-gradient-to-br from-[#0c1f38] to-[#071322] p-6 text-white lg:col-span-4 lg:p-7">
            <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-25" />
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-brand-500/25 blur-3xl" />
            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-400">Connected network</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[{ n: networks, l: "Mobile networks", i: Globe }, { n: hardware, l: "Tracker brands", i: Smartphone }].map((x) => (
                <div key={x.l} className="rounded-md border border-white/15 bg-white/10 p-4">
                  <x.i className="h-4 w-4 text-brand-400" />
                  <p className="mt-2 text-3xl font-extrabold tabular-nums">{x.n}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">{x.l}</p>
                </div>
              ))}
            </div>
            <ul className="mt-5 space-y-2.5 text-xs leading-relaxed text-slate-200">
              {["Local SIM data on Grameenphone, Banglalink, Robi and more", "Hardware from brands we install and support ourselves", "One number to call for the device, the SIM and the app"].map((t) => (
                <li key={t} className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />{t}</li>
              ))}
            </ul>
            <Link href="/features" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-400 hover:text-brand-300">How it works <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>

          <div className="lg:col-span-8">
            <div role="tablist" aria-label="Partner type" className="mb-4 inline-flex rounded-md bg-white p-1 ring-1 ring-slate-200 dark:bg-[#00224f] dark:ring-slate-800">
              {PARTNER_TABS.map((t) => (
                <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                  className={cn("rounded px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors", tab === t.id ? "bg-[#0c1f38] text-white dark:bg-brand-500" : "text-slate-500 hover:text-ink dark:text-slate-400 dark:hover:text-white")}>{t.label}</button>
              ))}
            </div>
            <motion.ul layout className="grid grid-cols-2 gap-px overflow-hidden rounded-md bg-slate-200 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-800 sm:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence mode="popLayout" initial={false}>{shown.map((p) => <LogoCell key={p.name} p={p} />)}</AnimatePresence>
            </motion.ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* =============================================================== 9. faq */
export function FaqGrid() {
  const { faqs: FAQS } = useCatalog();
  const items = FAQS.slice(0, 8);
  const [open, setOpen] = useState<string | null>(null);
  const cols = [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)];
  return (
    <section className="py-16 sm:py-24 bg-[#f9f8fb] dark:bg-[#00162f] border-t border-slate-200 dark:border-slate-800">
      <Container>
        <SectionHeader
          badge="HELP CENTRE"
          title="Frequently asked procurement & operational questions"
          description="Direct answers regarding tender requirements, installation logistics, data privacy, warranty coverage, and BRTA compliance."
          link={{ label: "SUPPORT DESK", href: "/faq" }}
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {cols.map((col, ci) => (
            <div key={ci} className="space-y-3">
              {col.map((f) => {
                const on = open === f.id;
                return (
                  <div key={f.id} className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#00224f] overflow-hidden transition-all">
                    <button onClick={() => setOpen(on ? null : f.id)} aria-expanded={on} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold text-slate-800 dark:text-slate-100">
                      {f.q}<ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", on && "rotate-180")} />
                    </button>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <p className="px-5 pb-5 text-xs sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 pt-3">{f.a}</p>
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
  const site = useSite();
  const [tab, setTab] = useState<"products" | "fleet">("products");
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100/80 via-slate-50 to-white dark:from-navy-950 dark:via-navy-900/60 dark:to-navy-950 pb-16 sm:pb-24 pt-8">
      <Container>
        <div className="flex flex-wrap gap-2.5 sm:ml-[8%]">
          {([["products", "Inquiry for products"], ["fleet", "Inquiry for corporate fleet"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={cn("h-8 sm:h-10 rounded-md px-3 sm:px-4 text-xs font-semibold uppercase tracking-wide transition-colors", tab === k ? "bg-brand-500 text-white font-bold" : "bg-softer text-body hover:text-ink dark:bg-navy-900 dark:text-slate-300")}>{l}</button>
          ))}
        </div>
        <div className="mt-3 grid overflow-hidden rounded-md ring-1 ring-line/40 lg:grid-cols-[1.6fr_1fr]">
          <div className="bg-white p-4 sm:p-6 dark:bg-navy-900/90 [&>form]:border-0 [&>form]:p-0 [&>form]:shadow-none">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-text">{tab === "products" ? "Ask about devices and packages" : "Tell us about your fleet"}</p>
            <ContactForm key={tab} />
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] p-6 text-white sm:p-8">
            <div aria-hidden className="absolute -right-10 top-1/3 h-32 w-32 rounded-full bg-white/5" />
            <div aria-hidden className="absolute -bottom-24 -left-10 h-64 w-[140%] -rotate-12 bg-white/5" />
            <h3 className="relative text-lg font-bold">Get in Touch</h3>
            <ul className="relative mt-6 space-y-6 text-sm">
              <li><MapPin className="h-7 w-7 text-brand-400" /><b className="mt-2 block">Head Office</b><span className="mt-1 block text-slate-300">{site.address}</span></li>
              <li><Phone className="h-7 w-7 text-brand-400" /><b className="mt-2 block">24/7 Helpline</b><a href={`tel:${site.phone}`} className="mt-1 block text-slate-300 hover:text-white">{site.phone}</a></li>
              <li><Mail className="h-7 w-7 text-brand-400" /><b className="mt-2 block">Email</b><a href={`mailto:${site.email}`} className="mt-1 block text-slate-300 hover:text-white">{site.email}</a></li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}


/* ======================================================== 8. innovation */
type Inno = { icon: LucideIcon; t: string; d: string; cat: string; points: string[] };
const INNO_TABS = ["All", "Tracking", "Security", "Management"] as const;
const INNOVATIONS: Inno[] = [
  { cat: "Tracking", icon: MapPin, t: "Live in 10 seconds", d: "Positions refresh about every 10 seconds on the map.", points: ["Needs GPS and mobile coverage", "Android, iOS and web"] },
  { cat: "Tracking", icon: Route, t: "Route & travel history", d: "Replay past trips and see where a vehicle stopped.", points: ["Replay any past trip", "Stops and parking time"] },
  { cat: "Tracking", icon: Fence, t: "Geo-fencing", d: "Draw a boundary and get an alert when it is crossed.", points: ["Alert on enter, leave or both", "Great for sites and depots"] },
  { cat: "Security", icon: Lock, t: "Remote engine lock", d: "Lock the engine from the app on supported packages.", points: ["Use only when it is safe", "Helpline can advise"] },
  { cat: "Security", icon: Bell, t: "Alerts you choose", d: "Ignition, geo-fence, device removal and panic alerts.", points: ["Pick only what you need", "Device-removal alert"] },
  { cat: "Security", icon: ShieldCheck, t: "Panic button", d: "An urgent alert that reaches you and your team at once.", points: ["Emergency situations", "24×7 helpline backup"] },
  { cat: "Management", icon: CalendarCheck, t: "Smart reminders", d: "BRTA paper, insurance and engine-oil reminders.", points: ["Enter dates once", "Reminder before expiry"] },
  { cat: "Management", icon: BarChart3, t: "Reports that save money", d: "Daily mileage, stops and working hours in one place.", points: ["Owners and managers see the same data", "Spot unexplained mileage"] },
  { cat: "Management", icon: Smartphone, t: "One platform, three screens", d: "Android, iOS and web show the same vehicles.", points: ["Many vehicles, one map", "Switch phone and desktop"] },
];

export function InnovationGrid() {
  const [tab, setTab] = useState<(typeof INNO_TABS)[number]>("All");
  const list = INNOVATIONS.filter((i) => tab === "All" || i.cat === tab);
  return (
    <section className="relative isolate overflow-hidden bg-white py-12 dark:bg-navy-950 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
      <Container>
        <div className="text-center">
          <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">Innovation</span>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-4xl">Built To Keep Getting Smarter</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-body">Practical features designed around how vehicles are really used.</p>
          <div className="mt-6 inline-flex flex-wrap justify-center gap-1.5 rounded-full bg-softer/80 p-1 dark:bg-navy-900/90">
            {INNO_TABS.map((k) => (
              <button key={k} onClick={() => setTab(k)} className={cn("h-8 rounded-full px-3.5 text-xs font-semibold transition-colors", tab === k ? "bg-brand-500 text-white" : "text-body hover:text-ink")}>{k}</button>
            ))}
          </div>
        </div>
        <motion.div layout className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((c) => (
              <motion.div key={c.t} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}
                className="group relative overflow-hidden rounded-md border border-line/60 bg-slate-100/80 p-4 transition-all hover:-translate-y-1 dark:border-white/10 dark:bg-navy-900/90 sm:p-5">
                <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-400"><c.icon className="h-5 w-5" /></span>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-body dark:bg-navy-950/60">{c.cat}</span>
                </div>
                <h3 className="mt-3 text-base font-bold text-ink">{c.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-body">{c.d}</p>
                <ul className="mt-3 space-y-1 border-t border-line/30 pt-3 text-xs text-body">
                  {c.points.map((x) => <li key={x} className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-brand-500" />{x}</li>)}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
}
