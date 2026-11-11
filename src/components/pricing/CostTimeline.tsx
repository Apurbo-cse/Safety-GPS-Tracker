"use client";
import { useRef, useState } from "react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { plans } from "@/data/pricing";
import { cn, formatBDT } from "@/utils/format";

const COLORS = ["#f05a22", "#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#ec4899", "#14b8a6", "#64748b"];
const W = 640, H = 320, L = 58, R = 16, T = 16, B = 34, MONTHS = 24;
const cost = (i: number, m: number) => plans[i].devicePrice + plans[i].monthlyCharge * m;
const niceMax = (v: number) => { const step = v > 20000 ? 5000 : 2500; return Math.ceil(v / step) * step; };

export default function CostTimeline() {
  const [sel, setSel] = useState<number[]>([0, 3, 5, 6]);
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);

  const yMax = niceMax(Math.max(...sel.map((i) => cost(i, MONTHS)), 1000));
  const x = (m: number) => L + (m / MONTHS) * (W - L - R);
  const y = (v: number) => T + (1 - v / yMax) * (H - T - B);
  const m = hover ?? MONTHS;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = ref.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    setHover(Math.max(0, Math.min(MONTHS, Math.round(((px - L) / (W - L - R)) * MONTHS))));
  };
  const toggle = (i: number) => setSel((s) => (s.includes(i) ? (s.length > 1 ? s.filter((x) => x !== i) : s) : [...s, i]));
  const readout = [...sel].sort((a, b) => cost(a, m) - cost(b, m));

  return (
    <section id="timeline" className="scroll-mt-32 bg-surface py-14">
      <Container>
        <SectionHeading eyebrow="Cost over time" title="See what each package costs as months go by" description="Each line starts at the device price and rises by the monthly charge. Hover or touch the chart to read any month." />
        <div className="glass rounded-md border border-line p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Packages on the chart">
            {plans.map((p, i) => { const on = sel.includes(i); return (
              <button key={p.id} onClick={() => toggle(i)} aria-pressed={on} className={cn("flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors", on ? "border-line-strong bg-surface text-ink" : "border-line text-slate-400")}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: on ? COLORS[i] : "#cbd5e1" }} />{p.name}
              </button>
            ); })}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
            <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full touch-none select-none" onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={() => setHover(null)} role="img" aria-label="Cumulative cost per package over 24 months">
              {[0, 1, 2, 3, 4].map((k) => { const v = (yMax / 4) * k; return (
                <g key={k}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeDasharray={k ? "3 4" : undefined} /><text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--body)">{v >= 1000 ? `${Math.round(v / 1000 * 10) / 10}k` : v}</text></g>
              ); })}
              {[0, 6, 12, 18, 24].map((mo) => <text key={mo} x={x(mo)} y={H - 10} textAnchor="middle" fontSize="11" fill="var(--body)">{mo === 0 ? "Start" : `${mo} mo`}</text>)}
              {sel.map((i) => <line key={i} x1={x(0)} y1={y(cost(i, 0))} x2={x(MONTHS)} y2={y(cost(i, MONTHS))} stroke={COLORS[i]} strokeWidth="2.75" strokeLinecap="round" />)}
              {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} stroke="var(--ink)" strokeOpacity=".35" strokeDasharray="4 4" />}
              {sel.map((i) => <circle key={i} cx={x(m)} cy={y(cost(i, m))} r={hover !== null ? 5 : 3.5} fill={COLORS[i]} stroke="#fff" strokeWidth="2" />)}
            </svg>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-body">{hover === null ? "After 24 months" : hover === 0 ? "At purchase" : `After ${hover} month${hover === 1 ? "" : "s"}`}</p>
              <ul className="mt-2 space-y-1.5">
                {readout.map((i, rank) => (
                  <li key={i} className="flex items-center gap-2 rounded-md bg-soft px-3 py-2 text-sm">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="min-w-0 flex-1 truncate font-medium text-ink">{plans[i].name}</span>
                    <span className="font-bold tabular-nums text-ink">{formatBDT(cost(i, m))}</span>
                    {rank === 0 && readout.length > 1 && <span className="rounded-full bg-green-500/15 px-1.5 py-0.5 text-xs font-semibold text-green-600">Lowest</span>}
                  </li>
                ))}
              </ul>
              {readout.length > 1 && <p className="mt-2 text-xs text-body">Gap between cheapest and priciest: <b className="text-ink">{formatBDT(cost(readout[readout.length - 1], m) - cost(readout[0], m))}</b></p>}
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">One vehicle. Cost = device price + monthly charge × months, from the published price list; no discounts applied.</p>
        </div>
      </Container>
    </section>
  );
}
