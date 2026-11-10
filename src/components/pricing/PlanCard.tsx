"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check, GitCompare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { selectPlan, toggleCompare } from "@/store/slices/pricingSlice";
import { openDemoModal, openPlanModal, setCartOpen } from "@/store/slices/uiSlice";
import { formatBDT, cn } from "@/utils/format";
import type { PricingPlan } from "@/types";

export default function PlanCard({
  plan,
  showCompare = true,
  compact = false,
}: {
  plan: PricingPlan;
  showCompare?: boolean;
  compact?: boolean;
}) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.pricing.selectedPlanId === plan.id);
  const comparing = useAppSelector((s) => s.pricing.compareIds.includes(plan.id));
  const compareCount = useAppSelector((s) => s.pricing.compareIds.length);
  const shown = plan.features.slice(0, compact ? 4 : 6);
  const rest = plan.features.length - shown.length;

  const buy = () => {
    dispatch(selectPlan(plan.id));
    dispatch(
      addToCart({
        id: `plan-${plan.id}`,
        kind: "plan",
        name: plan.name,
        price: plan.devicePrice,
        monthly: plan.monthlyCharge,
      })
    );
    dispatch(setCartOpen(true));
    toast.success(`${plan.name} added to cart`);
  };

  return (
    <motion.article
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={cn(
        "flex h-full w-full flex-col rounded-lg border bg-surface p-5   transition-all  ",
        selected
          ? "border-brand-500 ring-2 ring-brand-500/20"
          : "border-line hover:border-brand-300"
      )}
    >
      {plan.image && (
        <div className="relative -mx-1 mb-4 h-40 shrink-0 overflow-hidden rounded-lg border border-line bg-white  ">
          {plan.highlight && <span className="absolute bottom-2 left-2 z-10 rounded-full border border-brand-500/30 bg-surface/90 px-2.5 py-0.5 text-xs font-bold text-brand-text   backdrop-blur">{plan.highlight}</span>}
          <Image
            src={plan.image}
            alt={plan.siteTitle ?? plan.name}
            fill
            sizes="(min-width:1280px) 22vw, (min-width:640px) 45vw, 100vw"
            className="object-contain p-2"
          />
        </div>
      )}

      <h3 className="line-clamp-2 min-h-[2.6rem] text-base font-bold leading-snug text-ink" title={plan.name}>{plan.name}</h3>
      <p className="mt-1 h-4 truncate text-xs text-slate-500">{plan.siteTitle ? `Hardware: ${plan.siteTitle}` : "\u00a0"}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-soft/60 p-3.5 border border-line-soft">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Device Price</p>
          <p className="text-xl font-black text-ink">{formatBDT(plan.devicePrice)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Monthly</p>
          <p className="text-xl font-black text-brand-text">
            {formatBDT(plan.monthlyCharge)}
            <span className="text-xs font-normal text-slate-400">/mo</span>
          </p>
        </div>
        <p className="col-span-2 border-t border-line-soft pt-2 text-xs text-body">First 12 months: <b className="text-ink">{formatBDT(plan.devicePrice + plan.monthlyCharge * 12)}</b></p>
      </div>

      <ul className="mt-4 space-y-2 text-xs font-semibold text-body-strong">
        {shown.map((f) => (
          <li key={f} className="flex h-4 items-center gap-2">
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span className="truncate" title={f}>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => dispatch(openPlanModal(plan.id))}
        className="mt-3 inline-flex h-5 items-center gap-1 self-start text-xs font-bold text-brand-text hover:underline"
      >
        +{rest} more · view all {plan.features.length} features
        <ArrowRight className="h-3.5 w-3.5" />
      </button>

      <div className="mt-auto grid gap-2 pt-6">
        <Button onClick={buy} className="w-full font-bold  ">
          Order Package
        </Button>
        <Button
          variant="outline"
          onClick={() => dispatch(openDemoModal(`Sales enquiry: ${plan.name}`))}
          className="w-full font-semibold"
        >
          Contact Sales
        </Button>
        {showCompare && (
          <label className="mt-1 flex cursor-pointer items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-ink">
            <input
              type="checkbox"
              checked={comparing}
              onChange={() => { if (!comparing && compareCount >= 4) { toast.error("You can compare up to 4 packages"); return; } dispatch(toggleCompare(plan.id)); }}
              className="h-3.5 w-3.5 accent-brand-600 rounded"
            />
            <GitCompare className="h-3.5 w-3.5" /> Compare Features
          </label>
        )}
      </div>
    </motion.article>
  );
}
