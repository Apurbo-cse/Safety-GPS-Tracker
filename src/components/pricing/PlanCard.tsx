"use client";
import { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, GitCompare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { selectPlan, toggleCompare } from "@/store/slices/pricingSlice";
import { openDemoModal, setCartOpen } from "@/store/slices/uiSlice";
import { formatBDT, cn } from "@/utils/format";
import type { PricingPlan } from "@/types";

export default function PlanCard({ plan, showCompare = true, compact = false }: { plan: PricingPlan; showCompare?: boolean; compact?: boolean }) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.pricing.selectedPlanId === plan.id);
  const comparing = useAppSelector((s) => s.pricing.compareIds.includes(plan.id));
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? plan.features : plan.features.slice(0, compact ? 6 : 8);

  const buy = () => {
    dispatch(selectPlan(plan.id));
    dispatch(addToCart({ id: `plan-${plan.id}`, kind: "plan", name: plan.name, price: plan.devicePrice, monthly: plan.monthlyCharge }));
    dispatch(setCartOpen(true));
    toast.success(`${plan.name} added to cart`);
  };

  return (
    <article className={cn("spotlight flex flex-col rounded-2xl border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md", selected ? "border-brand-500 ring-2 ring-brand-500/20" : "border-line")}>
      {plan.image && (
        <div className="relative -mx-1 mb-4 h-36 overflow-hidden rounded-xl border border-line bg-white">
          <Image src={plan.image} alt={plan.siteTitle ?? plan.name} fill sizes="(min-width:1280px) 22vw, (min-width:640px) 45vw, 100vw" className="object-contain p-1.5" />
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-ink">{plan.name}</h3>
        {plan.highlight && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-text">{plan.highlight}</span>}
      </div>
      {plan.siteTitle && <p className="mt-1 text-xs text-slate-500">Device: {plan.siteTitle}</p>}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-soft p-3">
        <div><p className="text-xs text-slate-500">Device price</p><p className="text-xl font-bold text-ink">{formatBDT(plan.devicePrice)}</p></div>
        <div><p className="text-xs text-slate-500">Monthly charge</p><p className="text-xl font-bold text-brand-text">{formatBDT(plan.monthlyCharge)}<span className="text-xs font-medium text-slate-500">/mo</span></p></div>
      </div>
      <ul className="mt-4 space-y-1.5 text-sm text-body-strong">
        {shown.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{f}</li>)}
      </ul>
      {plan.features.length > shown.length || expanded ? (
        <button onClick={() => setExpanded(!expanded)} className="mt-2 inline-flex items-center gap-1 self-start text-sm font-semibold text-brand-text hover:underline">
          {expanded ? "Show less" : `Show all ${plan.features.length} features`}
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </button>
      ) : null}
      <div className="mt-auto grid gap-2 pt-5">
        <Button onClick={buy}>Buy Now</Button>
        <Button variant="outline" onClick={() => dispatch(openDemoModal(`Sales enquiry: ${plan.name}`))}>Contact Sales</Button>
        {showCompare && (
          <label className="mt-1 flex cursor-pointer items-center gap-2 text-xs font-medium text-body">
            <input type="checkbox" checked={comparing} onChange={() => dispatch(toggleCompare(plan.id))} className="h-4 w-4 accent-brand-600" />
            <GitCompare className="h-3.5 w-3.5" /> Add to comparison
          </label>
        )}
      </div>
    </article>
  );
}
