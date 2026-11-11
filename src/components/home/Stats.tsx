"use client";
import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { Clock, Headset, Layers, Truck } from "lucide-react";
import Container from "@/components/common/Container";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = animate(0, to, { duration: 1.1, ease: "easeOut", onUpdate: (v) => { el.textContent = `${Math.round(v)}${suffix}`; } });
    return () => c.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>{`${to}${suffix}`}</span>;
}

const stats = [
  { icon: Layers, v: <CountUp to={8} />, l: "package options" },
  { icon: Clock, v: <CountUp to={10} suffix=" sec" />, l: "location updates" },
  { icon: Truck, v: <CountUp to={8} />, l: "industries covered" },
  { icon: Headset, v: <>24×7</>, l: "helpline" },
];

export default function Stats() {
  return (
    <section className="bg-sec-gray py-10">
      <Container>
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {stats.map((s) => (
            <div key={s.l} className="spotlight card-pro glass flex flex-col items-center rounded-md border border-line px-4 py-6 text-center">
              <span className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-brand-500/10 text-brand-600 ring-1 ring-brand-500/20"><s.icon className="h-5 w-5" /></span>
              <dd className="text-gradient text-2xl font-black tabular-nums sm:text-3xl">{s.v}</dd>
              <dt className="mt-1 text-sm text-body">{s.l}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
