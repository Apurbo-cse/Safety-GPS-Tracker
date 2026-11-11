import Image from "next/image";
import {
  MapPin,
  Smartphone,
  Timer,
  Headset,
  Lock,
  Fuel,
  FileCheck2,
} from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";

const points = [
  {
    icon: Timer,
    t: "10-Second GNSS Stream",
    d: "Ultra-low latency positioning refresh keeps the map completely synchronized with road movements.",
  },
  {
    icon: Lock,
    t: "Remote Engine Immobilizer",
    d: "Instantly cut fuel and ignition from your phone with emergency speed-gated safety latch.",
  },
  {
    icon: Fuel,
    t: "Ultrasonic Fuel Rod Analytics",
    d: "Detect highway fuel theft, tank drainage, and excessive engine idling with ±1% precision.",
  },
  {
    icon: FileCheck2,
    t: "Automated BRTA Compliance",
    d: "Receive proactive countdown reminders before vehicle tax token, fitness, and insurance expire.",
  },
  {
    icon: Smartphone,
    t: "iOS, Android & Web Cockpit",
    d: "High-priority push siren alerts sound even when your smartphone is set to silent mode.",
  },
  {
    icon: Headset,
    t: "24×7 Emergency Support Desk",
    d: "Live Dhaka-based operations center with immediate stolen vehicle recovery assistance.",
  },
];

const facts = [
  { v: "10 sec", l: "Live location refresh" },
  { v: "3", l: "Apps: iOS, Android, Web" },
  { v: "24×7", l: "Dhaka support desk" },
];

export default function Overview() {
  return (
    <section className="bg-sec-warm relative overflow-hidden py-16 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <Container className="relative">
        {/* Heading row */}
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 [&>div]:mb-0">
            <SectionHeading
              align="left"
              eyebrow="Mission-Critical Fleet Telematics"
              title="One intelligent platform to track, protect, and manage every vehicle"
              description="Safety GPS Tracker delivers aerospace-grade GNSS satellite telemetry, OBD-II CAN-bus diagnostics, and remote immobilizer relays across Bangladesh. From a single family car to enterprise 500+ commercial truck fleets."
            />
          </div>
          <dl className="grid grid-cols-3 gap-2 lg:col-span-5">
            {facts.map((f) => (
              <div key={f.l} className="glass rounded-md border border-line p-3 text-center">
                <dt className="sr-only">{f.l}</dt>
                <dd className="text-gradient text-xl font-black tabular-nums sm:text-2xl">{f.v}</dd>
                <dd className="mt-0.5 text-xs leading-snug text-body">{f.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Bento grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3">
          <Reveal direction="scale" className="sm:col-span-2 lg:col-span-1 lg:row-span-3">
            <div className="relative h-full min-h-80 overflow-hidden rounded-md border border-line shadow-xl shadow-navy-950/10">
              <Image
                src="/img/hero-car.jpg"
                alt="Car on the road with live GPS tracking"
                fill
                sizes="(min-width:1024px) 33vw, 100vw"
                quality={85}
                className="object-cover object-[50%_70%]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-navy-950/20" />

              <span aria-hidden className="absolute left-[42%] top-[34%] -translate-x-1/2">
                <span className="ring-pulse absolute left-1/2 top-full h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/50" />
                <MapPin className="relative h-9 w-9 fill-brand-600 text-white drop-shadow-lg" />
              </span>
 
            </div>
          </Reveal>

          {points.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.05}>
              <div className="spotlight card-pro group flex h-full gap-4 rounded-md glass border border-line p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25">
                  <p.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-ink transition-colors group-hover:text-brand-text">{p.t}</h3>
                    <span className="text-xs font-bold tabular-nums text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-body">{p.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
