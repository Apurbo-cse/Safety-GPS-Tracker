import { Smartphone, Timer, Headset, PackageCheck } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import FleetStrip from "@/components/art/FleetStrip";
import Reveal from "@/components/common/Reveal";

const points = [
  { icon: Timer, t: "10-second updates", d: "Frequent location refresh keeps the map close to the road." },
  { icon: Smartphone, t: "Android, iOS and web", d: "Track from your phone or any browser." },
  { icon: Headset, t: "24×7 helpline", d: "Listed on every published package." },
  { icon: PackageCheck, t: "Eight package options", d: "From ৳4,000 device price with monthly plans from ৳300." },
];

export default function Overview() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading align="left" eyebrow="GPS tracking overview" title="One platform to see, protect and manage every vehicle" description="Safety GPS Tracker provides real-time GPS vehicle tracking software that lets you monitor the accurate location of your fleet and vehicles — for personal use or for business." />
          <FleetStrip />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {points.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.05}>
              <div className="h-full rounded-xl border border-line bg-surface p-5 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-text"><p.icon className="h-5 w-5" /></span>
                <h3 className="mt-3 text-sm font-bold text-ink">{p.t}</h3>
                <p className="mt-1 text-sm text-body">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
