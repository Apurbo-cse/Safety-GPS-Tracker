"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { ArrowRight, Bell, Check, ChevronLeft, ChevronRight, FileBarChart, Fuel, Lock, MapPin, Route, Siren, type LucideIcon } from "lucide-react";
import Container from "@/components/common/Container";
import { LinkButton } from "@/components/common/Button";
import { features } from "@/data/features";
import { plans } from "@/data/pricing";
import { SITE, TELECOM_PARTNERS } from "@/lib/site";
import { formatBDT } from "@/utils/format";

interface Slide {
  image: string;
  badge: string;
  title: string;
  highlight: string;
  text: string;
  points: string[];
  cards: { icon: LucideIcon; title: string; sub: string; tone: string }[];
}

const slides: Slide[] = [
  {
    image: "/img/hero-car.jpg",
    badge: "Live GPS tracking",
    title: "Know where your vehicle is,",
    highlight: "every second",
    text: "Live location, speed and ignition status on one map — from your phone or the web.",
    points: ["10-second location updates", "Route history playback", "Google Street View"],
    cards: [
      { icon: MapPin, title: "Delivery Van 01", sub: "Moving · 42 km/h", tone: "bg-brand-600" },
      { icon: Bell, title: "Ignition ON", sub: "Mirpur · just now", tone: "bg-green-600" },
      { icon: Route, title: "Trip finished", sub: "Gulshan → Uttara", tone: "bg-sky-600" },
    ],
  },
  {
    image: "/img/hero-bike.jpg",
    badge: "Vehicle security",
    title: "Lock the engine",
    highlight: "from your phone",
    text: "Remote engine lock, geo-fence alerts and a panic button — help when you need it.",
    points: ["Remote engine lock & unlock", "Geo-fence entry/exit alerts", "Device removal alerts"],
    cards: [
      { icon: Lock, title: "Engine locked", sub: "Command sent from app", tone: "bg-green-600" },
      { icon: Bell, title: "Left geo-fence", sub: "Depot zone · alert", tone: "bg-red-600" },
      { icon: Siren, title: "Panic button", sub: "Alert sent to owner", tone: "bg-amber-600" },
    ],
  },
  {
    image: "/img/hero-truck.jpg",
    badge: "Fleet management",
    title: "One dashboard for",
    highlight: "your whole fleet",
    text: "Daily mileage, route history and BRTA paper reminders for every vehicle.",
    points: ["Daily mileage & parking reports", "Driver details management", "BRTA & insurance reminders"],
    cards: [
      { icon: FileBarChart, title: "Daily report ready", sub: "Mileage · trips · stops", tone: "bg-brand-600" },
      { icon: Bell, title: "Insurance renewal", sub: "Reminder before expiry", tone: "bg-amber-600" },
      { icon: Fuel, title: "Fuel monitoring", sub: "Usage across the fleet", tone: "bg-green-600" },
    ],
  },
];

const cheapest = [...plans].sort((a, b) => a.devicePrice - b.devicePrice || a.monthlyCharge - b.monthlyCharge)[0];
const lowestMonthly = Math.min(...plans.map((p) => p.monthlyCharge));

const STATS: [string, string][] = [
  ["10 sec", "Live updates"],
  [String(features.length), "Features"],
  [String(plans.length), "Packages"],
  ["24×7", "Helpline"],
];

export default function Hero() {
  return (
    <section className="hero-swiper relative bg-navy-950 text-white" aria-roledescription="carousel" aria-label="Featured">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={800}
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
      >
        {slides.map((s, i) => {
          const Title = i === 0 ? "h1" : "h2";
          return (
            <SwiperSlide key={s.image} className="!h-auto">
              <div className="relative h-full overflow-hidden">
                <Image src={s.image} alt="" fill priority={i === 0} quality={90} sizes="100vw" className="object-cover object-center" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-transparent" />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/80 to-transparent" />

                <Container className="relative grid h-full items-center gap-8 py-8 pb-12 sm:py-12 sm:pb-14 lg:min-h-[500px] lg:grid-cols-2">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-200 backdrop-blur">
                      <span className="relative flex h-1.5 w-1.5"><span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" /><span className="relative h-1.5 w-1.5 rounded-full bg-green-400" /></span>
                      {s.badge}
                    </span>
                    <Title className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                      {s.title} <span className="text-brand-400">{s.highlight}</span>
                    </Title>
                    <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">{s.text}</p>
                    <ul className="mt-4 grid max-w-lg gap-1.5 text-sm text-slate-200 sm:grid-cols-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-center gap-2"><span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-600"><Check className="h-2.5 w-2.5" /></span>{p}</li>
                      ))}
                    </ul>
                    <p className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm backdrop-blur">
                      <span className="text-slate-400">Starting from</span>
                      <b className="text-white">{formatBDT(cheapest.devicePrice)}</b>
                      <span className="text-slate-400">+ {formatBDT(lowestMonthly)}/mo</span>
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <LinkButton href="/pricing" size="lg">View packages <ArrowRight className="h-4 w-4" /></LinkButton>
                      <LinkButton href="/features" variant="outline" size="lg" className="!border-white/30 !bg-transparent !text-white hover:!bg-white/10">Explore features</LinkButton>
                    </div>
                    <dl className="mt-6 grid max-w-lg grid-cols-4 gap-3 border-t border-white/10 pt-5">
                      {STATS.map(([v, l]) => (
                        <div key={l}>
                          <dt className="text-base font-bold text-white sm:text-lg">{v}</dt>
                          <dd className="mt-0.5 text-xs text-slate-400">{l}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="hidden flex-col items-end gap-3 lg:flex">
                    {s.cards.map((c) => (
                      <div key={c.title} className="flex w-64 items-center gap-2.5 rounded-lg border border-white/10 bg-navy-950/80 p-2.5 backdrop-blur">
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${c.tone}`}><c.icon className="h-4 w-4" /></span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{c.title}</p>
                          <p className="truncate text-xs text-slate-400">{c.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="relative border-t border-white/10 bg-navy-950">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-3 text-xs text-slate-400 sm:justify-between sm:px-6 lg:px-8">
          <span>Networks: <b className="font-semibold text-slate-200">{TELECOM_PARTNERS.join(" · ")}</b></span>
          <span>Apps: <b className="font-semibold text-slate-200">Android · iOS · Web</b></span>
          <span>Helpline: <a href={`tel:${SITE.phone}`} className="font-semibold text-slate-200 hover:text-white">{SITE.phone}</a> (24×7)</span>
        </div>
      </div>
      <button className="hero-prev absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-brand-600 md:grid" aria-label="Previous slide"><ChevronLeft className="h-5 w-5" /></button>
      <button className="hero-next absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-brand-600 md:grid" aria-label="Next slide"><ChevronRight className="h-5 w-5" /></button>
    </section>
  );
}
