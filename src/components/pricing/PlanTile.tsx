"use client";
import { toast } from "sonner";
import ProductTile from "@/components/devices/ProductTile";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { setCartOpen } from "@/store/slices/uiSlice";
import { formatBDT } from "@/utils/format";
import type { PricingPlan } from "@/types";

/** Service package as an e-commerce card (adds the plan to the cart). */
export default function PlanTile({ p }: { p: PricingPlan }) {
  const dispatch = useAppDispatch();
  const id = `plan-${p.id}`;
  const added = useAppSelector((s) => s.cart.items.some((i) => i.id === id));
  return (
    <ProductTile
      href="/pricing"
      image={p.image}
      name={p.name}
      category="Service Package"
      sub={p.siteTitle ?? "GPS Package"}
      features={p.features}
      price={p.devicePrice}
      priceDisplay={formatBDT(p.devicePrice)}
      monthly={p.monthlyCharge}
      monthlyDisplay={`+ ${formatBDT(p.monthlyCharge)}/mo`}
      hot={!!p.highlight}
      tag="PLAN"
      added={added}
      onAdd={() => {
        dispatch(addToCart({ id, kind: "plan", name: p.name, price: p.devicePrice, monthly: p.monthlyCharge }));
        dispatch(setCartOpen(true));
        toast.success(`${p.name} added to cart`);
      }}
    />
  );
}
