"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, GitCompare, LayoutGrid, Search, SearchX, X } from "lucide-react";
import Container from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import PlanCard from "./PlanCard";
import { plans } from "@/data/pricing";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMaxMonthly, setSort, toggleCompare } from "@/store/slices/pricingSlice";
import { cn, formatBDT } from "@/utils/format";
import type { PricingPlan } from "@/types";

type Kind = "all" | "voice" | "video";
type View = "cards" | "cost";

const hasVoice = (p: PricingPlan) => p.features.some((f) => f === "Car Inside Voice Monitoring" || f === "Voice Monitoring");
const hasVideo = (p: PricingPlan) => p.features.includes("Live Video & Voice Monitoring");

const KINDS: { id: Kind; label: string; test: (p: PricingPlan) => boolean }[] = [
  { id: "all", label: "All packages", test: () => true },
  { id: "voice", label: "Voice monitoring", test: hasVoice },
  { id: "video", label: "Video & voice", test: hasVideo },
];

const PERIODS = [6, 12, 24] as const;
const chip = (on: boolean) => cn("shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors", on ? "border-brand-600 bg-brand-600 text-white" : "border-line-strong bg-surface text-body-strong hover:border-brand-400");

/* ----------------------------------------------------------- cost chart */
function CostChart({ list }: { list: PricingPlan[] }) {
  const [months, setMonths] = useState<(typeof PERIODS)[number]>(12);
  const [hover, setHover] = useState<string | null>(null);
  const rows = useMemo(() => list.map((p) => ({ p, service: p.monthlyCharge * months, total: p.devicePrice + p.monthlyCharge * months })).sort((a, b) => a.total - b.total), [list, months]);
  const max = Math.max(...rows.map((r) => r.total), 1);
  return (
    <div className="glass rounded-lg border border-white/60 p-4 dark:border-white/10 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-ink">Cost for one vehicle over {months} months</h2>
          <p className="text-xs text-body">Device price (one-time) + monthly charge × {months}. Cheapest first.</p>
        </div>
        <div className="flex rounded-lg border border-line-strong bg-surface p-0.5 text-xs font-semibold" role="group" aria-label="Period">
          {PERIODS.map((m) => <button key={m} onClick={() => setMonths(m)} aria-pressed={months === m} className={cn("rounded-lg px-3 py-1.5", months === m ? "bg-brand-600 text-white" : "text-body")}>{m} mo</button>)}
        </div>
      </div>
      <ul className="space-y-2.5">
        {rows.map(({ p, service, total }, i) => (
          <li key={p.id} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)} className={cn("rounded-lg p-2 transition-colors", hover === p.id && "bg-softer")}>
            <div className="mb-1.5 flex items-center gap-3">
              <span className="relative h-8 w-11 shrink-0 overflow-hidden rounded bg-white">{p.image && <Image src={p.image} alt="" fill sizes="44px" className="object-contain" />}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{p.name}{i === 0 && <span className="ml-2 rounded-full bg-green-500/15 px-2 py-0.5 text-[11px] md:text-xs font-semibold text-green-600">Lowest</span>}</span>
              <span className="text-sm font-bold tabular-nums text-ink">{formatBDT(total)}</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full bg-softer" aria-hidden>
              <motion.span key={`d-${months}`} initial={{ width: 0 }} animate={{ width: `${(p.devicePrice / max) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.04 }} className="h-full bg-navy-700" />
              <motion.span key={`s-${months}`} initial={{ width: 0 }} animate={{ width: `${(service / max) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.04 }} className="h-full bg-brand-600" />
            </div>
            <p className="mt-1 text-[11px] md:text-xs text-body">Device {formatBDT(p.devicePrice)} + service {formatBDT(service)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-4 text-xs text-body"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-navy-700" />Device (one-time)</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-brand-600" />Monthly service</span></div>
    </div>
  );
}

/* -------------------------------------------------------------- explorer */
export default function PricingExplorer() {
  const dispatch = useAppDispatch();
  const { sort, maxMonthly, compareIds } = useAppSelector((s) => s.pricing);
  const [kind, setKind] = useState<Kind>("all");
  const [view, setView] = useState<View>("cards");
  const [q, setQ] = useState("");

  const visible = useMemo(() => {
    const test = KINDS.find((k) => k.id === kind)!.test;
    const t = q.trim().toLowerCase();
    let list = plans.filter((p) => test(p) && (maxMonthly === null || p.monthlyCharge <= maxMonthly) && (!t || `${p.name} ${p.siteTitle ?? ""}`.toLowerCase().includes(t)));
    if (sort === "device") list = [...list].sort((a, b) => a.devicePrice - b.devicePrice);
    if (sort === "monthly") list = [...list].sort((a, b) => a.monthlyCharge - b.monthlyCharge);
    return list;
  }, [kind, q, sort, maxMonthly]);

  const filtersActive = kind !== "all" || maxMonthly !== null || q !== "";
  const reset = () => { setKind("all"); setQ(""); dispatch(setMaxMonthly(null)); dispatch(setSort("default")); };

  return (
    <>
      <Container className="scroll-mt-32 py-8" id="plans">
        {/* sticky smart toolbar */}
        <div className="glass z-30 mb-6 md:sticky md:top-[6.5rem] space-y-3 rounded-lg border border-white/60 p-3 dark:border-white/10 lg:top-[7.25rem]">
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative min-w-0 flex-1 basis-48"><span className="sr-only">Search packages</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search package or device…" className="w-full rounded-lg border border-line-strong bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </label>
            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
            <label className="flex items-center gap-2 text-sm text-body"><span className="hidden sm:inline">Sort</span>
              <select value={sort} onChange={(e) => dispatch(setSort(e.target.value as typeof sort))} className="rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink">
                <option value="default">Default</option><option value="device">Device price ↑</option><option value="monthly">Monthly charge ↑</option>
              </select>
            </label>
            <div className="flex rounded-lg border border-line-strong bg-surface p-0.5" role="group" aria-label="View">
              {([["cards", LayoutGrid, "Cards"], ["cost", BarChart3, "Cost"]] as const).map(([id, Icon, label]) => (
                <button key={id} onClick={() => setView(id)} aria-pressed={view === id} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold", view === id ? "bg-brand-600 text-white" : "text-body")}><Icon className="h-4 w-4" />{label}</button>
              ))}
            </div>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
            {KINDS.map((k) => <button key={k.id} onClick={() => setKind(k.id)} aria-pressed={kind === k.id} className={chip(kind === k.id)}>{k.label}</button>)}
            <span className="mx-1 h-5 w-px shrink-0 bg-line-strong" aria-hidden />
            {([[null, "Any monthly"], [300, "≤ ৳300/mo"], [400, "≤ ৳400/mo"]] as const).map(([v, l]) => <button key={l} onClick={() => dispatch(setMaxMonthly(v))} aria-pressed={maxMonthly === v} className={chip(maxMonthly === v)}>{l}</button>)}
            {filtersActive && <button onClick={reset} className="ml-1 flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-text hover:underline"><X className="h-3.5 w-3.5" />Reset</button>}
          </div>
          <p className="text-xs text-body" aria-live="polite">Showing {visible.length} of {plans.length} packages</p>
        </div>

        {visible.length === 0 ? (
          <div className="grid place-items-center rounded-lg border border-dashed border-line-strong py-16 text-center">
            <SearchX className="h-8 w-8 text-slate-400" /><p className="mt-2 text-sm font-medium text-body-strong">No packages match these filters</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={reset}>Reset filters</Button>
          </div>
        ) : view === "cards" ? (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }} className="flex">
                  <PlanCard plan={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <CostChart list={visible} />
        )}
      </Container>

      {/* floating compare bar */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            className="glass fixed bottom-[calc(4.6rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center gap-2 rounded-lg border border-white/60 p-2.5 dark:border-white/10 lg:bottom-5">
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
