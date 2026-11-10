"use client";
import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import Container from "@/components/common/Container";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = `${to}${suffix}`; return; }
    const c = animate(0, to, { duration: 1.4, ease: "easeOut", onUpdate: (v) => { el.textContent = `${Math.round(v)}${suffix}`; } });
    return () => c.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>{`${to}${suffix}`}</span>;
}

const stats = [
  { v: <CountUp to={8} />, l: "package options" },
  { v: <CountUp to={10} suffix=" sec" />, l: "location update interval" },
  { v: <CountUp to={8} />, l: "industries covered" },
  { v: <>24×7</>, l: "helpline facility" },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-navy-900 to-navy-700 py-14 text-white">
      <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
      <Container className="relative">
        <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 backdrop-blur">
              <dd className="bg-gradient-to-b from-white to-brand-200 bg-clip-text text-3xl font-extrabold text-transparent tabular-nums sm:text-4xl">{s.v}</dd>
              <dt className="mt-1 text-sm text-brand-200">{s.l}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
