import { CreditCard, Download, Radio, Smartphone } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

const steps = [
  { icon: CreditCard, t: "Choose a package", d: "Pick a device and monthly plan that fits your vehicle." },
  { icon: Download, t: "Get your device fitted", d: "The tracker is installed in your vehicle." },
  { icon: Radio, t: "Device reports location", d: "Position and events are sent to the platform." },
  { icon: Smartphone, t: "Track and control", d: "Monitor, get alerts and lock the engine from app or web." },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="How it works" title="From order to live tracking in four steps" />
        <ol className="swipe-row grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="spotlight relative rounded-xl border border-line bg-surface p-5">
              <span className="absolute right-4 top-3 text-3xl font-black text-slate-100">{i + 1}</span>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 text-brand-text"><s.icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-[14px] font-bold text-ink">{s.t}</h3>
              <p className="mt-1 text-sm text-body">{s.d}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
