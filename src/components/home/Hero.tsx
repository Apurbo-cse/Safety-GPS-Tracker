"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/common/Container";
import { LinkButton } from "@/components/common/Button";
import { FleetScene, LiveTrackingScene, SecurityScene } from "./HeroScenes";

interface Slide {
  bg: string;
  photo: string;
  badge: string;
  title: string;
  text: string;
  stats?: [string, string][];
}

const slides: Slide[] = [
  {
    bg: "/hero/slide-1.svg",
    photo: "/img/industries/logistics.jpg",
    badge: "Next-Gen Telemetry & Fleet Cockpit · Bangladesh",
    title: "Enterprise GPS Vehicle Tracking & Remote Immobilizer Platform",
    text: "Track every asset in real time with 10-second GNSS satellite telemetry, emergency remote fuel cut-off, OBD-II CAN-bus diagnostics, and automated geofence radar.",
    stats: [["10 sec", "satellite refresh"], ["OBD-II", "CAN-bus telemetry"], ["4G LTE", "triple SIM failover"]],
  },
  {
    bg: "/hero/slide-2.svg",
    photo: "/img/industries/motorcycles.jpg",
    badge: "Active Asset Protection",
    title: "Protect every vehicle with remote engine lock and instant alerts",
    text: "Lock or unlock the engine remotely in under 400ms, set perimeter geo-fences, and receive instant push & SMS alerts for ignition tampering, device removal, and accidents.",
  },
  {
    bg: "/hero/slide-3.svg",
    photo: "/img/industries/ships-cargo.jpg",
    badge: "Automated Fleet Telematics",
    title: "Predictive reports, trip playback, and BRTA paper compliance",
    text: "Scrub trip history playback, monitor fuel efficiency and daily mileage, review driver safety scores, and automate BRTA tax token and insurance renewal reminders.",
  },
];

export default function Hero() {
  return (
    <section className="hero-swiper relative bg-navy-950 text-white" aria-roledescription="carousel" aria-label="Featured">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={700}
        autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
      >
        {slides.map((s, i) => {
          const Title = i === 0 ? "h1" : "h2";
          return (
            <SwiperSlide key={s.bg}>
              <div className="relative overflow-hidden">
                <Image src={s.photo} alt="" fill priority={i === 0} sizes="100vw" className="scale-105 object-cover opacity-40 blur-[2px]" />
                <Image src={s.bg} alt="" fill unoptimized sizes="100vw" className="object-cover opacity-70 mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-navy-950/10" aria-hidden />
                <Container className="relative grid min-h-[560px] items-center gap-12 py-14 pb-20 sm:py-20 sm:pb-24 lg:grid-cols-2">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-200">
                      <BadgeCheck className="h-3.5 w-3.5" /> {s.badge}
                    </span>
                    <Title className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{s.title}</Title>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{s.text}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <LinkButton href="/features" variant="light" size="lg">Explore Features</LinkButton>
                      <LinkButton href="/pricing" variant="outline" size="lg" className="!border-white/30 !bg-transparent !text-white hover:!bg-white/10">View Pricing</LinkButton>
                      <LinkButton href="/register" size="lg">Get Started <ArrowRight className="h-4 w-4" /></LinkButton>
                    </div>
                    {s.stats && (
                      <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
                        {s.stats.map(([v, l]) => (<div key={l}><dt className="text-sm font-bold text-white sm:text-base">{v}</dt><dd className="mt-0.5 text-xs text-slate-400">{l}</dd></div>))}
                      </dl>
                    )}
                  </div>
                  <div className="pb-6 lg:pb-0">{[<LiveTrackingScene key="l" />, <SecurityScene key="s" />, <FleetScene key="f" />][i]}</div>
                </Container>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button className="hero-prev absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-brand-600 md:grid" aria-label="Previous slide"><ChevronLeft className="h-5 w-5" /></button>
      <button className="hero-next absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-brand-600 md:grid" aria-label="Next slide"><ChevronRight className="h-5 w-5" /></button>
    </section>
  );
}
