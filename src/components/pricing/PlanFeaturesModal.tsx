"use client";
import RichText from "@/components/common/RichText";
import Image from "next/image";
import { Check } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { groupFeatures } from "@/lib/featureGroups";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { selectPlan } from "@/store/slices/pricingSlice";
import { openDemoModal, openPlanModal, setCartOpen } from "@/store/slices/uiSlice";
import { formatBDT } from "@/utils/format";

/** Lists every published feature of one package, grouped. Opened from "Show all features". */
export default function PlanFeaturesModal() {
  const dispatch = useAppDispatch();
  const id = useAppSelector((s) => s.ui.planModalId);
  const { plans } = useCatalog();
  const plan = plans.find((p) => p.id === id);
  const close = () => dispatch(openPlanModal(null));

  const grouped = plan ? groupFeatures(plan.features) : [];

  const buy = () => {
    if (!plan) return;
    dispatch(selectPlan(plan.id));
    dispatch(addToCart({ id: `plan-${plan.id}`, kind: "plan", name: plan.name, price: plan.devicePrice, monthly: plan.monthlyCharge }));
    close();
    dispatch(setCartOpen(true));
    toast.success(`${plan.name} added to cart`);
  };

  return (
    <Modal open={!!plan} onClose={close} title={plan ? `${plan.name} — all features` : ""} wide>
      {plan && (
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative aspect-[858/600] w-full shrink-0 overflow-hidden rounded-md bg-surface/50 dark:bg-navy-950/60 sm:w-44">
              {plan.image && (
                <Image
                  quality={90}
                  src={plan.image}
                  alt={plan.siteTitle ?? plan.name}
                  fill
                  sizes="(min-width:640px) 176px, 100vw"
                  className="object-contain"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              {plan.siteTitle && <p className="text-xs text-body">Device: {plan.siteTitle}</p>}
              <div className="mt-1 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-md bg-soft p-2.5"><p className="text-xs text-body">Device price</p><p className="font-bold text-ink">{formatBDT(plan.devicePrice)}</p></div>
                <div className="rounded-md bg-soft p-2.5"><p className="text-xs text-body">Monthly</p><p className="font-bold text-brand-text">{formatBDT(plan.monthlyCharge)}</p></div>
                <div className="rounded-md bg-soft p-2.5"><p className="text-xs text-body">First 12 months</p><p className="font-bold text-ink">{formatBDT(plan.devicePrice + plan.monthlyCharge * 12)}</p></div>
              </div>
            </div>
          </div>

          {plan.description && <RichText html={plan.description} className="mt-5 text-sm" />}
          <p className="mt-5 text-sm font-semibold text-ink">{plan.features.length} features included</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {grouped.map((g) => (
              <section key={g.title} className="rounded-md border border-line p-3.5">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-text"><g.icon className="h-4 w-4" />{g.title}</h3>
                <ul className="space-y-1.5 text-sm text-body-strong">
                  {g.items.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{f}</li>)}
                </ul>
              </section>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">Feature list as published on the company price list.</p>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
            <Button variant="outline" onClick={() => { close(); dispatch(openDemoModal(`Sales enquiry: ${plan.name}`)); }}>Contact Sales</Button>
            <Button onClick={buy}>Buy Now</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
