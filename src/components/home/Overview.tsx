import {
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

export default function Overview() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            align="left"
            eyebrow="Mission-Critical Fleet Telematics"
            title="One intelligent platform to track, protect, and manage every vehicle"
            description="Safety GPS Tracker delivers aerospace-grade GNSS satellite telemetry, OBD-II CAN-bus diagnostics, and remote immobilizer relays across Bangladesh. From a single family car to enterprise 500+ commercial truck fleets."
          />
          <div className="mt-8">
            </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {points.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.05}>
              <div className="group h-full rounded-lg glass border border-white/60 dark:border-white/10 p-5   transition-all hover:-translate-y-1 hover:border-brand-300  ">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-ink transition-colors group-hover:text-brand-text">
                  {p.t}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-body">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
