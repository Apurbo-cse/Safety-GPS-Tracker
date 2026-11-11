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
  const shown = plan.features.slice(0, compact ? 3 : 5);
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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-lg bg-softer/80 dark:bg-navy-900/90 transition-all",
        selected ? "ring-2 ring-brand-500" : ""
      )}
    >
      {/* Full-width Product Image Header */}
      {plan.image && (
        <div className="relative aspect-[858/600] w-full shrink-0 overflow-hidden bg-surface/50 dark:bg-navy-950/60">
          {plan.highlight && (
            <span className="absolute left-2 top-2 sm:left-3 sm:top-3 z-10 rounded-full bg-brand-500 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[11px] font-semibold text-white">
              {plan.highlight}
            </span>
          )}
          <Image
            src={plan.image}
            alt={plan.siteTitle ?? plan.name}
            fill
            sizes="(min-width:1280px) 25vw, (min-width:640px) 50vw, 50vw"
            className="object-contain"
          />
        </div>
      )}

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-5">
        <h3
          className="line-clamp-2 min-h-[2.1rem] sm:min-h-[2.6rem] text-xs sm:text-[15px] font-semibold leading-snug text-ink"
          title={plan.name}
        >
          {plan.name}
        </h3>
        <p className="mt-0.5 sm:mt-1 h-3.5 sm:h-4 truncate text-[10px] sm:text-xs text-slate-500">
          {plan.siteTitle ? `Hardware: ${plan.siteTitle}` : "\u00a0"}
        </p>

        <div className="mt-2.5 sm:mt-4 flex flex-col gap-1 sm:grid sm:grid-cols-2 sm:gap-3 rounded-md bg-surface/80 dark:bg-navy-950/60 p-2 sm:p-3.5">
          <div className="flex items-baseline justify-between sm:block">
            <p className="text-[10px] sm:text-xs font-medium text-slate-500">Device</p>
            <p className="text-sm sm:text-lg font-semibold tracking-tight text-ink">{formatBDT(plan.devicePrice)}</p>
          </div>
          <div className="flex items-baseline justify-between sm:block">
            <p className="text-[10px] sm:text-xs font-medium text-slate-500">Monthly</p>
            <p className="text-xs sm:text-lg font-semibold tracking-tight text-brand-text">
              {formatBDT(plan.monthlyCharge)}
              <span className="text-[10px] sm:text-xs font-normal text-slate-400">/mo</span>
            </p>
          </div>
          <p className="hidden sm:block col-span-2 pt-1 text-xs text-body">
            First 12 months: <span className="font-semibold text-ink">{formatBDT(plan.devicePrice + plan.monthlyCharge * 12)}</span>
          </p>
        </div>

        <ul className="mt-2.5 sm:mt-4 space-y-1 sm:space-y-2 text-[11px] sm:text-xs font-normal text-body">
          {shown.map((f) => (
            <li key={f} className="flex h-3.5 sm:h-4 items-center gap-1.5 sm:gap-2">
              <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-emerald-600 stroke-[2.5]" />
              <span className="truncate" title={f}>{f}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => dispatch(openPlanModal(plan.id))}
          className="mt-2 sm:mt-3 inline-flex h-4 sm:h-5 items-center gap-1 self-start text-[10px] sm:text-xs font-medium text-brand-text hover:underline"
        >
          +{rest} more · view features
          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>

        <div className="mt-auto grid gap-1.5 sm:gap-2 pt-3 sm:pt-6">
          <Button onClick={buy} size="sm" className="w-full font-semibold text-xs sm:text-sm py-1.5 sm:py-2">
            Order Package
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(openDemoModal(`Sales enquiry: ${plan.name}`))}
            className="w-full font-medium text-xs sm:text-sm py-1.5 sm:py-2"
          >
            Contact Sales
          </Button>
          {showCompare && (
            <label className="mt-0.5 sm:mt-1 flex cursor-pointer items-center justify-center gap-1 text-[10px] sm:text-xs font-medium text-slate-500 hover:text-ink">
              <input
                type="checkbox"
                checked={comparing}
                onChange={() => {
                  if (!comparing && compareCount >= 4) {
                    toast.error("You can compare up to 4 packages");
                    return;
                  }
                  dispatch(toggleCompare(plan.id));
                }}
                className="h-3 w-3 sm:h-3.5 sm:w-3.5 accent-brand-600 rounded"
              />
              <GitCompare className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Compare
            </label>
          )}
        </div>
      </div>
    </motion.article>
  );
}
