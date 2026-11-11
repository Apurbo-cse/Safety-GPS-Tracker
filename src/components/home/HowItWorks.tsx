"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Download, Radio, Smartphone } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import VehicleArt from "@/components/art/VehicleArt";
import { cn } from "@/utils/format";

const steps = [
  { icon: CreditCard, t: "Choose a package", d: "Pick a device and Monthly that fits your vehicle.", tag: "Online or by phone" },
  { icon: Download, t: "Get your device fitted", d: "The tracker is installed in your vehicle.", tag: "At your location" },
  { icon: Radio, t: "Device reports location", d: "Position and events are sent to the platform.", tag: "Every 10 seconds" },
  { icon: Smartphone, t: "Track and control", d: "Monitor, get alerts and lock the engine from app or web.", tag: "Anytime, 24×7" },
];

const N = steps.length;
/** Centre of each column, as a % of the track width */
const pos = (i: number) => ((i + 0.5) / N) * 100;

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % N), 2800);
    return () => clearInterval(t);
  }, [paused]);

  const fill = ((active) / (N - 1)) * 100;

  return (
    <section className="bg-sec-gray relative overflow-hidden py-16 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
      <Container className="relative">
        <SectionHeading eyebrow="How it works" title="From order to live tracking in four steps" description="Follow the route — from picking a package to controlling your vehicle from your phone." />

        <Reveal>
          <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {/* ---------- Desktop / tablet: horizontal road ---------- */}
            <div className="hidden md:block">
              <div className="relative h-28" aria-hidden>
                {/* road */}
                <div className="absolute inset-x-0 top-[72px] h-4 rounded-full bg-navy-900 shadow-inner ring-1 ring-white/5">
                  <svg className="absolute inset-x-3 top-1/2 h-1 w-[calc(100%-1.5rem)] -translate-y-1/2" preserveAspectRatio="none">
                    <line x1="0" y1="2" x2="100%" y2="2" stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeDasharray="12 12" className="road-dash" />
                  </svg>
                </div>
                {/* travelled route */}
                <div
                  className="absolute top-[78px] h-1 rounded-full bg-gradient-to-r from-brand-600 to-brand-400 shadow-[0_0_12px_rgb(240_90_34/0.7)] transition-[width] duration-700 ease-out"
                  style={{ left: `${pos(0)}%`, width: `${(fill / 100) * (pos(N - 1) - pos(0))}%` }}
                />
                {/* waypoints */}
                {steps.map((s, i) => (
                  <span
                    key={s.t}
                    className={cn(
                      "absolute top-[80px] grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-sm font-bold transition-all duration-500",
                      i < active && "border-brand-500 bg-brand-600 text-white",
                      i === active && "scale-110 border-white bg-brand-600 text-white shadow-[0_0_0_6px_rgb(240_90_34/0.25)]",
                      i > active && "border-line-strong bg-surface text-slate-500",
                    )}
                    style={{ left: `${pos(i)}%` }}
                  >
                    {i < active ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </span>
                ))}
                {/* vehicle */}
                <div className="absolute top-2 w-20 -translate-x-1/2 transition-[left] duration-700 ease-out" style={{ left: `${pos(active)}%` }}>
                  <span className="mx-auto mb-0.5 block w-fit rounded-full bg-navy-950 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-green-400 align-middle" />Step {active + 1}
                  </span>
                  <VehicleArt kind="van" className="drive-bob h-auto w-full drop-shadow-[0_6px_8px_rgba(0,0,0,.35)]" />
                </div>
              </div>

              <ol className="mt-4 grid grid-cols-4 gap-4">
                {steps.map((s, i) => (
                  <li key={s.t}>
                    <StepCard s={s} i={i} active={i === active} done={i < active} onSelect={() => setActive(i)} />
                  </li>
                ))}
              </ol>
            </div>

            {/* ---------- Phone: vertical route ---------- */}
            <ol className="relative space-y-3 md:hidden">
              <span aria-hidden className="absolute bottom-6 left-[17px] top-6 w-1 rounded-full bg-line" />
              <span
                aria-hidden
                className="absolute left-[17px] top-6 w-1 rounded-full bg-gradient-to-b from-brand-600 to-brand-400 transition-[height] duration-700 ease-out"
                style={{ height: `calc(${fill / 100} * (100% - 3rem))` }}
              />
              {steps.map((s, i) => (
                <li key={s.t} className="relative flex gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "relative z-10 mt-4 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-bold transition-all duration-500",
                      i <= active ? "border-brand-500 bg-brand-600 text-white" : "border-line-strong bg-surface text-slate-500",
                      i === active && "shadow-[0_0_0_5px_rgb(240_90_34/0.25)]",
                    )}
                  >
                    {i < active ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <StepCard s={s} i={i} active={i === active} done={i < active} onSelect={() => setActive(i)} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function StepCard({ s, i, active, done, onSelect }: { s: (typeof steps)[number]; i: number; active: boolean; done: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "step" : undefined}
      className={cn(
        "spotlight group relative flex h-full w-full flex-col overflow-hidden rounded-md border p-4 text-left transition-all duration-500 sm:p-5",
        active
          ? "border-brand-500 bg-gradient-to-br from-brand-50 to-surface shadow-lg shadow-brand-600/15 md:-translate-y-1"
          : "glass border-line hover:border-brand-300",
      )}
    >
      {active && <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-600 to-brand-400" />}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "grid h-11 w-11 place-items-center rounded-md transition-colors duration-500",
            active ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30" : done ? "bg-brand-500/15 text-brand-600" : "bg-softer text-body",
          )}
        >
          <s.icon className="h-5 w-5" />
        </span>
        <span className="text-xs font-bold tabular-nums text-slate-400">STEP {String(i + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-3 text-base font-bold text-ink">{s.t}</h3>
      <p className="mt-1 flex-1 text-sm text-body">{s.d}</p>
      <span className={cn("mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold", active ? "bg-brand-600 text-white" : "bg-softer text-slate-500")}>
        <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-white" : done ? "bg-green-500" : "bg-slate-400")} />
        {s.tag}
      </span>
    </button>
  );
}
