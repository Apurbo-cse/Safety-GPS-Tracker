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

  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Pricing plans" title="Simple device price plus monthly charge" description="Pay once for the device, then a monthly subscription for the tracking service. Pick a package and see your cost." />

        <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
          {/* package picker */}
          <div role="radiogroup" aria-label="Choose a package" className="swipe-row-x flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {plans.map((p) => {
              const on = p.id === planId;
              return (
                <button key={p.id} role="radio" aria-checked={on} onClick={(e) => { setPlanId(p.id); e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); }}
                  className={cn("glass flex w-56 shrink-0 items-center gap-3 rounded-lg border p-2.5 text-left transition-all lg:w-auto", on ? "border-brand-500 ring-2 ring-brand-500/25" : "border-white/60 hover:border-brand-400 dark:border-white/10")}>
                  <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-white">{p.image && <Image quality={90} src={p.image} alt="" fill sizes="64px" className="object-contain" />}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{p.name}</span>
                    <span className="block text-xs text-body">{formatBDT(p.devicePrice)} · {formatBDT(p.monthlyCharge)}/mo</span>
                  </span>
                  <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border", on ? "border-brand-600 bg-brand-600 text-white" : "border-line-strong")}>{on && <Check className="h-3 w-3" />}</span>
                </button>
              );
            })}
          </div>

          {/* estimate */}
          <div className="glass grid gap-6 rounded-lg border border-white/60 p-5 dark:border-white/10 md:grid-cols-2 md:p-6">
            <div>
              <div className="relative h-44 overflow-hidden rounded-lg border border-line bg-white sm:h-52">
                {plan.image && <Image quality={90} src={plan.image} alt={plan.siteTitle ?? plan.name} fill sizes="(min-width:768px) 340px, 100vw" className="object-contain p-2" />}
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">{plan.name}</h3>
              {plan.siteTitle && <p className="text-xs text-body">Device: {plan.siteTitle}</p>}
              <ul className="mt-3 grid grid-cols-1 gap-1.5 text-sm text-body-strong sm:grid-cols-2">
                {plan.features.slice(0, 6).map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{f}</li>)}
              </ul>
              <button onClick={() => dispatch(openPlanModal(plan.id))} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline">Show all {plan.features.length} features <ArrowRight className="h-3.5 w-3.5" /></button>
            </div>

            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wider text-body">Your estimate</p>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm font-medium text-body-strong">Vehicles</span>
                <div className="ml-auto inline-flex items-center rounded-lg border border-line-strong bg-surface">
                  <button onClick={() => setQtyState((n) => clamp(n - 1))} aria-label="Fewer vehicles" className="grid h-9 w-9 place-items-center hover:bg-softer"><Minus className="h-4 w-4" /></button>
                  <span className="w-10 text-center text-sm font-bold tabular-nums text-ink" aria-live="polite">{qty}</span>
                  <button onClick={() => setQtyState((n) => clamp(n + 1))} aria-label="More vehicles" className="grid h-9 w-9 place-items-center hover:bg-softer"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
              <input type="range" min={1} max={50} value={qty} onChange={(e) => setQtyState(Number(e.target.value))} aria-label="Number of vehicles" className="mt-2 w-full cursor-pointer accent-brand-600" />

              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm font-medium text-body-strong">Service period</span>
                <div className="ml-auto flex rounded-lg border border-line-strong bg-surface p-0.5 text-xs font-semibold" role="group" aria-label="Service period">
                  {PERIODS.map((m) => <button key={m} onClick={() => setMonths(m)} aria-pressed={months === m} className={cn("rounded-lg px-3 py-1.5", months === m ? "bg-brand-600 text-white" : "text-body")}>{m} mo</button>)}
                </div>
              </div>

              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-body">Device price × {qty}</dt><dd className="font-semibold text-ink"><AnimatedBDT value={device} /></dd></div>
                <div className="flex justify-between"><dt className="text-body">Monthly charge × {qty}</dt><dd className="font-semibold text-ink"><AnimatedBDT value={monthly} />/mo</dd></div>
                <div className="flex justify-between"><dt className="text-body">Service for {months} months</dt><dd className="font-semibold text-ink"><AnimatedBDT value={service} /></dd></div>
              </dl>

              <div className="mt-4 rounded-lg bg-brand-50 p-4">
                <p className="text-xs font-medium text-body">Total over {months} months</p>
                <p className="text-3xl font-bold tracking-tight text-ink tabular-nums"><AnimatedBDT value={total} /></p>
                <p className="mt-0.5 text-xs text-body">≈ {formatBDT(perVehicleMonth)} per vehicle per month</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button onClick={buy}><ShoppingCart className="h-4 w-4" />Buy Now</Button>
                <Button variant="outline" onClick={() => dispatch(openDemoModal(`Sales enquiry: ${qty} × ${plan.name}`))}>Contact Sales</Button>
              </div>
              <p className="mt-3 text-[11px] md:text-xs leading-relaxed text-slate-500">Estimate = device price + monthly charge × months, using the published prices. No discounts are applied; sales confirms the final quote.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center"><Link href="/pricing" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline">Compare all 8 packages <ArrowRight className="h-4 w-4" /></Link></div>
      </Container>
    </section>
  );
}
