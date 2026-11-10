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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = animate(0, to, { duration: 1.1, ease: "easeOut", onUpdate: (v) => { el.textContent = `${Math.round(v)}${suffix}`; } });
    return () => c.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>{`${to}${suffix}`}</span>;
}

const stats = [
  { v: <CountUp to={8} />, l: "package options" },
  { v: <CountUp to={10} suffix=" sec" />, l: "location updates" },
  { v: <CountUp to={8} />, l: "industries covered" },
  { v: <>24×7</>, l: "helpline" },
];

export default function Stats() {
  return (
    <section className="py-10">
      <Container>
        <dl className="glass grid grid-cols-2 divide-line rounded-lg border border-line py-2 text-center lg:grid-cols-4 lg:divide-x">
          {stats.map((s) => (
            <div key={s.l} className="px-4 py-5">
              <dd className="text-2xl font-bold text-ink tabular-nums sm:text-3xl">{s.v}</dd>
              <dt className="mt-1 text-sm text-body">{s.l}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
