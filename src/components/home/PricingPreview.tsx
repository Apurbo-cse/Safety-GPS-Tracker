"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/common/Button";
import { plans } from "@/data/pricing";
import { useAppDispatch } from "@/store/hooks";
import { addToCart, setQty } from "@/store/slices/cartSlice";
import { selectPlan } from "@/store/slices/pricingSlice";
import { openDemoModal, openPlanModal, setCartOpen } from "@/store/slices/uiSlice";
import { cn, formatBDT } from "@/utils/format";

function AnimatedBDT({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const c = animate(prev.current, value, { duration: 0.5, ease: "easeOut", onUpdate: (v) => { el.textContent = formatBDT(Math.round(v)); } });
    prev.current = value;
    return () => c.stop();
  }, [value]);
  return <span ref={ref}>{formatBDT(value)}</span>;
}

const PERIODS = [6, 12, 24] as const;

export default function PricingPreview() {
  const dispatch = useAppDispatch();
  const [planId, setPlanId] = useState("gps-2");
  const [qty, setQtyState] = useState(1);
  const [months, setMonths] = useState<(typeof PERIODS)[number]>(12);
  const plan = plans.find((p) => p.id === planId)!;

  const device = plan.devicePrice * qty;
  const monthly = plan.monthlyCharge * qty;
  const service = monthly * months;
  const total = device + service;
  const perVehicleMonth = Math.round(total / qty / months);

  const clamp = (n: number) => Math.min(50, Math.max(1, n));
  const buy = () => {
    const id = `plan-${plan.id}`;
    dispatch(selectPlan(plan.id));
    dispatch(addToCart({ id, kind: "plan", name: plan.name, price: plan.devicePrice, monthly: plan.monthlyCharge }));
    dispatch(setQty({ id, qty }));
    dispatch(setCartOpen(true));
    toast.success(`${qty} × ${plan.name} added to cart`);
  };

  const devShare = total ? Math.round((device / total) * 100) : 0;

  return (
    <section className="bg-sec-gray py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Pricing plans" title="Simple device price plus monthly charge" description="Pay once for the device, then a monthly subscription for the tracking service. Pick a package and see your cost." />

        {/* ---------- 1. package cards ---------- */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink"><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs text-white">1</span>Choose a package</p>
          <Link href="/pricing" className="hidden items-center gap-1 text-sm font-semibold text-brand-text hover:underline sm:inline-flex">Compare all {plans.length} <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div role="radiogroup" aria-label="Choose a package" className="-mx-3 flex snap-x gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {plans.map((p) => {
            const on = p.id === planId;
            return (
              <button key={p.id} role="radio" aria-checked={on} onClick={() => setPlanId(p.id)}
                className={cn("group relative flex w-44 shrink-0 snap-start flex-col rounded-md border bg-surface p-3 text-left transition-all duration-300 sm:w-auto",
                  on ? "border-brand-500 shadow-lg shadow-brand-600/15 ring-2 ring-brand-500/25" : "border-line hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md")}>
                {p.highlight && <span className="absolute left-2 top-2 z-10 max-w-[calc(100%-2.75rem)] truncate rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">{p.highlight}</span>}
                <span className={cn("absolute right-2 top-2 z-10 grid h-5 w-5 place-items-center rounded-full border transition-colors", on ? "border-brand-600 bg-brand-600 text-white" : "border-line-strong bg-surface")}>{on && <Check className="h-3 w-3" />}</span>
                <span className="relative block h-24 overflow-hidden rounded-md bg-white">
                  {p.image && <Image quality={90} src={p.image} alt="" fill sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 176px" className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105" />}
                </span>
                <span className="mt-2.5 block truncate text-sm font-bold text-ink">{p.name}</span>
                <span className="mt-1 flex items-baseline gap-1">
                  <span className="text-base font-black text-ink">{formatBDT(p.devicePrice)}</span>
                  <span className="text-xs text-body">+ {formatBDT(p.monthlyCharge)}/mo</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* ---------- 2. configure + 3. quote ---------- */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="glass rounded-md border border-line p-5 md:p-6">
            <p className="text-sm font-semibold text-ink"><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs text-white">2</span>Configure</p>

            <div className="mt-4 flex gap-4">
              <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md border border-line bg-white sm:h-24 sm:w-32">
                {plan.image && <Image quality={90} src={plan.image} alt={plan.siteTitle ?? plan.name} fill sizes="128px" className="object-contain p-1.5" />}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
                {plan.siteTitle && <p className="text-xs text-body">Device: {plan.siteTitle}</p>}
                <button onClick={() => dispatch(openPlanModal(plan.id))} className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline">All {plan.features.length} features <ArrowRight className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {plan.features.slice(0, 8).map((f) => (
                <li key={f} className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-body-strong"><Check className="h-3 w-3 text-green-600" />{f}</li>
              ))}
            </ul>

            <div className="mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-body-strong">Vehicles</span>
                  <div className="inline-flex items-center rounded-md border border-line-strong bg-surface">
                    <button onClick={() => setQtyState((n) => clamp(n - 1))} aria-label="Fewer vehicles" className="grid h-9 w-9 place-items-center hover:bg-softer"><Minus className="h-4 w-4" /></button>
                    <span className="w-10 text-center text-sm font-bold tabular-nums text-ink" aria-live="polite">{qty}</span>
                    <button onClick={() => setQtyState((n) => clamp(n + 1))} aria-label="More vehicles" className="grid h-9 w-9 place-items-center hover:bg-softer"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
                <input type="range" min={1} max={50} value={qty} onChange={(e) => setQtyState(Number(e.target.value))} aria-label="Number of vehicles" className="mt-3 w-full cursor-pointer accent-brand-600" />
                <div className="flex justify-between text-[11px] text-slate-400"><span>1</span><span>50</span></div>
              </div>
              <div>
                <span className="text-sm font-medium text-body-strong">Service period</span>
                <div className="mt-2 grid grid-cols-3 gap-1 rounded-md border border-line-strong bg-surface p-1 text-sm font-semibold" role="group" aria-label="Service period">
                  {PERIODS.map((m) => <button key={m} onClick={() => setMonths(m)} aria-pressed={months === m} className={cn("rounded-md py-2 transition-colors", months === m ? "bg-brand-600 text-white shadow" : "text-body hover:bg-softer")}>{m} mo</button>)}
                </div>
              </div>
            </div>
          </div>

          {/* quote card */}
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-navy-950 via-navy-900 to-[#3a1a0c] p-5 text-white md:p-6">
            <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
            <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-600/30 blur-3xl" />
            <div className="relative flex h-full flex-col">
              <p className="text-sm font-semibold"><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-white text-xs text-brand-700">3</span>Your estimate</p>

              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between"><dt className="text-slate-400">Device × {qty}</dt><dd className="font-semibold tabular-nums"><AnimatedBDT value={device} /></dd></div>
                <div className="flex justify-between"><dt className="text-slate-400">Monthly × {qty}</dt><dd className="font-semibold tabular-nums"><AnimatedBDT value={monthly} />/mo</dd></div>
                <div className="flex justify-between"><dt className="text-slate-400">Service · {months} months</dt><dd className="font-semibold tabular-nums"><AnimatedBDT value={service} /></dd></div>
              </dl>

              {/* cost split */}
              <div className="mt-4">
                <div className="flex h-2 overflow-hidden rounded-full bg-white/10">
                  <span className="bg-brand-500 transition-[width] duration-500" style={{ width: `${devShare}%` }} />
                  <span className="bg-sky-400 transition-[width] duration-500" style={{ width: `${100 - devShare}%` }} />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-brand-500" />Device {devShare}%</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-sky-400" />Service {100 - devShare}%</span>
                </div>
              </div>

              <div className="mt-5 border-t border-dashed border-white/20 pt-4">
                <p className="text-xs text-slate-400">Total over {months} months</p>
                <p className="text-4xl font-black tracking-tight tabular-nums"><AnimatedBDT value={total} /></p>
                <p className="mt-1 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-xs text-brand-100">≈ {formatBDT(perVehicleMonth)} per vehicle / month</p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 lg:mt-auto lg:pt-5">
                <Button onClick={buy}><ShoppingCart className="h-4 w-4" />Buy Now</Button>
                <Button variant="outline" className="!border-white/30 !bg-transparent !text-white hover:!bg-white/10" onClick={() => dispatch(openDemoModal(`Sales enquiry: ${qty} × ${plan.name}`))}>Contact Sales</Button>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">Estimate = device price + monthly charge × months, using published prices. No discounts applied; sales confirms the final quote.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center sm:hidden"><Link href="/pricing" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline">Compare all {plans.length} packages <ArrowRight className="h-4 w-4" /></Link></div>
      </Container>
    </section>
  );
}
