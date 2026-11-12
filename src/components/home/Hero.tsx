"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import Container from "@/components/common/Container";
import HeroTrackCard, { type TrackInfo } from "./HeroTrackCard";
import { LinkButton } from "@/components/common/Button";
import { plans } from "@/data/pricing";
import { TELECOM_PARTNER_LOGOS } from "@/lib/site";
import { useSite } from "@/components/providers/SiteProvider";
import { formatBDT } from "@/utils/format";

interface Slide {
  id: string;
  icon: LucideIcon;
  image: string;
  /** Optional live-tracking map card (only on some slides) */
  track?: TrackInfo;
  badge: string;
  title: string;
  highlight: string;
  text: string;
}

const slides: Slide[] = [
  {
    id: "live",
    icon: MapPin,
    image: "/img/hero-car.jpg",
    track: { vehicle: "Sedan — Executive", plate: "DHAKA-GA 23-4016", place: "Gulshan Avenue, Dhaka", speed: "42 km/h", ignition: "ON", status: "Moving", route: "M20 160 C 70 150, 70 120, 70 100 S 120 40, 180 40 S 230 60, 290 30" },
    badge: "Live GPS tracking",
    title: "Know where your vehicle is,",
    highlight: "every second",
    text: "Live location, speed and ignition on one map.",
  },
  {
    id: "security",
    icon: ShieldCheck,
    image: "/img/hero-bike.jpg",
    badge: "Vehicle security",
    title: "Lock the engine",
    highlight: "from your phone",
    text: "Remote engine lock and instant alerts, right on your phone.",
  },
  {
    id: "fleet",
    icon: Truck,
    image: "/img/hero-truck.jpg",
    badge: "Fleet management",
    title: "One dashboard for",
    highlight: "your whole fleet",
    text: "Mileage, routes and reminders for every vehicle.",
  },
];

const cheapest = [...plans].sort((a, b) => a.devicePrice - b.devicePrice || a.monthlyCharge - b.monthlyCharge)[0];
const lowestMonthly = Math.min(...plans.map((p) => p.monthlyCharge));

export default function Hero() {
  const site = useSite();
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
            <SwiperSlide key={s.id} className="!h-auto">
              <div className="relative h-full overflow-hidden">
                <Image src={s.image} alt="" fill priority={i === 0} quality={85} sizes="100vw" className="object-cover object-center" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/60 to-transparent" />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/80 to-transparent" />

                <Container className="relative grid h-full min-h-[340px] items-center py-10 pb-14 sm:min-h-[400px] lg:min-h-[460px] lg:grid-cols-2">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-1 pr-3 text-xs font-medium text-brand-200 backdrop-blur">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-white"><s.icon className="h-3 w-3" /></span>
                      {s.badge}
                    </span>
                    <Title className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                      {s.title} <span className="text-brand-400">{s.highlight}</span>
                    </Title>
                    <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-300">{s.text}</p>
                    <p className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm backdrop-blur">
                      <span className="text-slate-400">Starting from</span>
                      <b className="text-white">{formatBDT(cheapest.devicePrice)}</b>
                      <span className="text-slate-400">+ {formatBDT(lowestMonthly)}/mo</span>
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <LinkButton href="/pricing" size="lg">View packages <ArrowRight className="h-4 w-4" /></LinkButton>
                      <LinkButton href="/features" variant="outline" size="lg" className="!border-white/30 !bg-transparent !text-white hover:!bg-white/10">Explore features</LinkButton>
                    </div>
                  </div>

                  {s.track && (
                    <div className="hidden justify-end lg:flex">
                      <HeroTrackCard t={s.track} />
                    </div>
                  )}
                </Container>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="relative border-t border-white/10 bg-navy-950">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-3 py-3 text-xs text-slate-400 sm:justify-between sm:px-6 lg:px-8">
          <span className="flex items-center gap-2">
            Networks:
            <span className="flex items-center gap-0.5">
              {TELECOM_PARTNER_LOGOS.map((p) => (
                <Image key={p.name} src={p.logo} alt={p.name} title={p.name} width={428} height={186} className="h-6 w-auto" />
              ))}
            </span>
          </span>
          <span>Apps: <b className="font-semibold text-slate-200">Android · iOS · Web</b></span>
          <span>Helpline: <a href={`tel:${site.phone}`} className="font-semibold text-slate-200 hover:text-white">{site.phone}</a> (24×7)</span>
        </div>
      </div>
      <button className="hero-prev absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-brand-600 md:grid" aria-label="Previous slide"><ChevronLeft className="h-5 w-5" /></button>
      <button className="hero-next absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-brand-600 md:grid" aria-label="Next slide"><ChevronRight className="h-5 w-5" /></button>
    </section>
  );
}
