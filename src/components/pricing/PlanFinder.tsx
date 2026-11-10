"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Bike, Car, Check, HardHat, HelpCircle, RotateCcw, ShoppingCart, Truck, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/common/Button";
import { plans } from "@/data/pricing";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { selectPlan, setCompare } from "@/store/slices/pricingSlice";
import { openPlanModal, setCartOpen } from "@/store/slices/uiSlice";
import { cn, formatBDT } from "@/utils/format";
import type { PricingPlan } from "@/types";

const hasVoice = (p: PricingPlan) => p.features.some((f) => f === "Car Inside Voice Monitoring" || f === "Voice Monitoring");
const hasVideo = (p: PricingPlan) => p.features.includes("Live Video & Voice Monitoring");
const year = (p: PricingPlan) => p.devicePrice + p.monthlyCharge * 12;

/** Vehicle → packages whose price-list product image is for that kind of vehicle. */
const VEHICLES: { id: string; label: string; hint: string; icon: LucideIcon; match: string[] }[] = [
  { id: "car", label: "Car", hint: "Private or office car", icon: Car, match: ["premium-voice", "standard-gps", "gps-1", "voice-gps-2"] },
  { id: "bike", label: "Motorcycle", hint: "Bike or rider", icon: Bike, match: ["gps-2"] },
  { id: "truck", label: "Truck", hint: "Commercial vehicle", icon: Truck, match: ["voice-gps"] },
  { id: "equip", label: "Equipment", hint: "Excavator, machinery", icon: HardHat, match: ["gps-3"] },
  { id: "other", label: "Not sure", hint: "Show me everything", icon: HelpCircle, match: [] },
];
const MONITORING = [
  { id: "voice", label: "Voice monitoring", hint: "Listen to the cabin", test: (p: PricingPlan) => hasVoice(p) },
  { id: "video", label: "Live video + voice", hint: "See and hear live", test: hasVideo },
  { id: "any", label: "No preference", hint: "Any option", test: () => true },
];
const PRIORITY = [
  { id: "device", label: "Lowest device price", short: "device price", get: (p: PricingPlan) => p.devicePrice },
  { id: "monthly", label: "Lowest monthly charge", short: "monthly charge", get: (p: PricingPlan) => p.monthlyCharge },
  { id: "year", label: "Lowest first-year cost", short: "first-year cost", get: year },
];

const Option = ({ on, label, hint, icon: Icon, onClick }: { on?: boolean; label: string; hint: string; icon?: LucideIcon; onClick: () => void }) => (
  <button onClick={onClick} className={cn("flex items-center gap-3 rounded-lg border p-3.5 text-left transition-all hover:border-brand-400 active:scale-[.98]", on ? "border-brand-500 bg-brand-50" : "border-line-strong bg-surface")}>
    {Icon && <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-softer text-brand-text"><Icon className="h-5 w-5" /></span>}
    <span><span className="block text-sm font-semibold text-ink">{label}</span><span className="block text-xs text-body">{hint}</span></span>
  </button>
);

export default function PlanFinder() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [vehicle, setVehicle] = useState<string | null>(null);
  const [monitor, setMonitor] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!vehicle || !monitor || !priority) return null;
    const v = VEHICLES.find((x) => x.id === vehicle)!;
    const m = MONITORING.find((x) => x.id === monitor)!;
    const pr = PRIORITY.find((x) => x.id === priority)!;
    const pool = plans.filter(m.test);
    const ranked = pool.map((p) => ({ p, v: v.match.includes(p.id) })).sort((a, b) => Number(b.v) - Number(a.v) || pr.get(a.p) - pr.get(b.p) || year(a.p) - year(b.p));
    const best = ranked[0];
    if (!best) return null;
    const lowest = Math.min(...pool.map(pr.get));
    const reasons = [
      best.v ? `Its product on the price list is for a ${v.label.toLowerCase()} (${best.p.siteTitle})` : v.id === "other" ? "Fits any vehicle type" : `No ${m.label.toLowerCase()} package is listed for a ${v.label.toLowerCase()} — this is the closest match`,
      m.id === "any" ? "Includes the full tracking and security feature set" : `Includes ${m.label.toLowerCase()}`,
      pr.get(best.p) === lowest ? `Lowest ${pr.short} among your options (${formatBDT(pr.get(best.p))})` : `${pr.short.charAt(0).toUpperCase() + pr.short.slice(1)}: ${formatBDT(pr.get(best.p))}`,
    ];
    return { best: best.p, alts: ranked.slice(1, 3).map((r) => r.p), reasons };
  }, [vehicle, monitor, priority]);

  const reset = () => { setStep(0); setVehicle(null); setMonitor(null); setPriority(null); };
  const buy = (p: PricingPlan) => {
    dispatch(selectPlan(p.id));
    dispatch(addToCart({ id: `plan-${p.id}`, kind: "plan", name: p.name, price: p.devicePrice, monthly: p.monthlyCharge }));
    dispatch(setCartOpen(true));
    toast.success(`${p.name} added to cart`);
  };
  const pick = (setter: (v: string) => void, v: string) => { setter(v); setStep((s) => s + 1); };

  const done = step >= 3 && result;
  return (
    <section id="finder" className="scroll-mt-32 py-14">
      <Container>
        <SectionHeading eyebrow="Find my plan" title="Not sure which package?" description="Answer three quick questions and we'll point you to the best-fitting published package." />
        <div className="glass mx-auto max-w-3xl rounded-lg border border-white/60 p-5 dark:border-white/10 sm:p-7">
          {!done && (
            <div className="mb-5 flex items-center gap-3">
              {step > 0 && <button onClick={() => setStep((s) => s - 1)} aria-label="Back" className="grid h-8 w-8 place-items-center rounded-full border border-line-strong text-body hover:text-ink"><ArrowLeft className="h-4 w-4" /></button>}
              <div className="flex flex-1 gap-1.5" aria-label={`Step ${step + 1} of 3`}>{[0, 1, 2].map((i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-brand-600" : "bg-line-strong")} />)}</div>
              <span className="text-xs font-semibold text-body">{step + 1}/3</span>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div key={done ? "result" : step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
              {step === 0 && (<>
                <h3 className="mb-3 text-lg font-bold text-ink">What do you want to track?</h3>
                <div className="grid gap-2.5 sm:grid-cols-2">{VEHICLES.map((o) => <Option key={o.id} {...o} on={vehicle === o.id} onClick={() => pick(setVehicle, o.id)} />)}</div>
              </>)}
              {step === 1 && (<>
                <h3 className="mb-3 text-lg font-bold text-ink">Which in-vehicle monitoring do you want?</h3>
                <div className="grid gap-2.5 sm:grid-cols-2">{MONITORING.map((o) => <Option key={o.id} {...o} on={monitor === o.id} onClick={() => pick(setMonitor, o.id)} />)}</div>
              </>)}
              {step === 2 && (<>
                <h3 className="mb-3 text-lg font-bold text-ink">What matters most to you?</h3>
                <div className="grid gap-2.5 sm:grid-cols-3">{PRIORITY.map((o) => <Option key={o.id} label={o.label} hint="" on={priority === o.id} onClick={() => pick(setPriority, o.id)} />)}</div>
              </>)}
              {done && result && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-text">Best match</p>
                  <div className="mt-2 grid gap-5 sm:grid-cols-[200px_1fr]">
                    <div className="relative h-36 overflow-hidden rounded-lg border border-line bg-white sm:h-full sm:min-h-40">{result.best.image && <Image quality={90} src={result.best.image} alt={result.best.siteTitle ?? result.best.name} fill sizes="200px" className="object-contain p-2" />}</div>
                    <div>
                      <h3 className="text-xl font-bold text-ink">{result.best.name}</h3>
                      <p className="text-sm text-body">{formatBDT(result.best.devicePrice)} device + {formatBDT(result.best.monthlyCharge)}/month · first 12 months {formatBDT(year(result.best))}</p>
                      <ul className="mt-3 space-y-1.5 text-sm text-body-strong">{result.reasons.map((r) => <li key={r} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{r}</li>)}</ul>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={() => buy(result.best)}><ShoppingCart className="h-4 w-4" />Order package</Button>
                        <Button variant="outline" onClick={() => dispatch(openPlanModal(result.best.id))}>All {result.best.features.length} features</Button>
                      </div>
                    </div>
                  </div>
                  {result.alts.length > 0 && (
                    <div className="mt-5 border-t border-line pt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-body">Also consider</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {result.alts.map((a) => (
                          <button key={a.id} onClick={() => { dispatch(setCompare([result.best.id, a.id])); document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" }); }} className="flex items-center gap-3 rounded-lg border border-line-strong bg-surface p-2.5 text-left transition-colors hover:border-brand-400">
                            <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-white">{a.image && <Image quality={90} src={a.image} alt="" fill sizes="56px" className="object-contain" />}</span>
                            <span className="min-w-0"><span className="block truncate text-sm font-semibold text-ink">{a.name}</span><span className="block text-xs text-body">{formatBDT(a.devicePrice)} + {formatBDT(a.monthlyCharge)}/mo · compare →</span></span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={reset} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text hover:underline"><RotateCcw className="h-3.5 w-3.5" />Start over</button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="mt-5 text-[11px] text-slate-500">Recommendations use only the published prices, feature lists and the product shown for each package on the price list. Sales confirms the right device for your vehicle.</p>
        </div>
      </Container>
    </section>
  );
}
