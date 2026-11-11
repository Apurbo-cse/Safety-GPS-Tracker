"use client";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GitCompare, X } from "lucide-react";
import Container from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import PlanCard from "./PlanCard";
import { plans } from "@/data/pricing";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleCompare } from "@/store/slices/pricingSlice";
import type { PricingPlan } from "@/types";

type Kind = "all" | "voice" | "video";

const hasVoice = (p: PricingPlan) => p.features.some((f) => f === "Car Inside Voice Monitoring" || f === "Voice Monitoring");
const hasVideo = (p: PricingPlan) => p.features.includes("Live Video & Voice Monitoring");

const KINDS: { id: Kind; label: string; test: (p: PricingPlan) => boolean }[] = [
  { id: "all", label: "All packages", test: () => true },
  { id: "voice", label: "Voice monitoring", test: hasVoice },
  { id: "video", label: "Video & voice", test: hasVideo },
];

export default function PricingExplorer() {
  const dispatch = useAppDispatch();
  const { sort, maxMonthly, compareIds } = useAppSelector((s) => s.pricing);
  const kind: Kind = "all";
  const q = "";

  const visible = useMemo(() => {
    const test = KINDS.find((k) => k.id === kind)!.test;
    const t = q.trim().toLowerCase();
    let list = plans.filter((p) => test(p) && (maxMonthly === null || p.monthlyCharge <= maxMonthly) && (!t || `${p.name} ${p.siteTitle ?? ""}`.toLowerCase().includes(t)));
    if (sort === "device") list = [...list].sort((a, b) => a.devicePrice - b.devicePrice);
    if (sort === "monthly") list = [...list].sort((a, b) => a.monthlyCharge - b.monthlyCharge);
    return list;
  }, [kind, q, sort, maxMonthly]);

  return (
    <>
      <Container className="scroll-mt-32 py-8" id="plans">
        

          <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }} className="flex">
                  <PlanCard plan={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
      
      </Container>

      {/* floating compare bar */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            className="glass fixed bottom-[calc(4.6rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center gap-2 rounded-md border border-line p-2.5 lg:bottom-5">
            <GitCompare className="ml-1 h-5 w-5 shrink-0 text-brand-text" />
            <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto [scrollbar-width:none]">
              {compareIds.map((id) => { const p = plans.find((x) => x.id === id)!; return (
                <span key={id} className="flex shrink-0 items-center gap-1 rounded-full bg-brand-50 py-1 pl-2.5 pr-1 text-xs font-semibold text-brand-text">{p.name}<button onClick={() => dispatch(toggleCompare(id))} aria-label={`Remove ${p.name}`} className="grid h-5 w-5 place-items-center rounded-full hover:bg-brand-100"><X className="h-3 w-3" /></button></span>
              ); })}
            </div>
            <Button size="sm" disabled={compareIds.length < 2} onClick={() => document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" })}>{compareIds.length < 2 ? "Pick 2+" : "Compare"}</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
