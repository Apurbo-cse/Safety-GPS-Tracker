"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Search, SearchX, Star, X } from "lucide-react";
import Container from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { features, featureCategories } from "@/data/features";
import { plans } from "@/data/pricing";
import { DynIcon } from "@/lib/icons";
import { announceNavigation } from "@/lib/navigate";
import { isPackageFeature, packagesFor, packagesWithAll } from "@/lib/featurePackages";
import { useAppDispatch } from "@/store/hooks";
import { setCompare } from "@/store/slices/pricingSlice";
import { openFeatureModal } from "@/store/slices/uiSlice";
import { cn, formatBDT } from "@/utils/format";
import type { FeatureCategory } from "@/types";

function Availability({ id }: { id: string }) {
  if (!isPackageFeature(id)) return <span className="rounded-full bg-softer px-2 py-0.5 text-[11px] font-semibold text-body">Platform feature</span>;
  const n = packagesFor(id).length;
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", n === plans.length ? "bg-green-500/15 text-green-600" : "bg-amber-500/15 text-amber-600")}>
      {n === plans.length ? `All ${n} packages` : `${n} of ${plans.length} packages`}
    </span>
  );
}

export default function FeaturesExplorer() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [cat, setCat] = useState<"All" | FeatureCategory>("All");
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" focuses the search box
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key === "/" && t && !["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const list = useMemo(() => features.filter((f) => (cat === "All" || f.category === cat) && `${f.title} ${f.description}`.toLowerCase().includes(q.trim().toLowerCase())), [cat, q]);
  const groups = featureCategories.filter((c) => list.some((f) => f.category === c));
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const match = useMemo(() => packagesWithAll(picked), [picked]);
  const cheapest = match.list[0];

  const seePackages = () => {
    dispatch(setCompare(match.list.slice(0, 4).map((p) => p.id).concat(match.list.length < 2 ? plans.filter((p) => !match.list.includes(p)).slice(0, 2 - match.list.length).map((p) => p.id) : [])));
    announceNavigation();
    router.push("/pricing#compare");
  };

  return (
    <Container className="py-12 sm:py-14" id="all-features">
      {/* sticky filter bar */}
      <div className="glass z-30 mb-8 space-y-3 rounded-lg border border-white/60 p-3 dark:border-white/10 md:sticky md:top-14 lg:top-[4.25rem]">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-0 flex-1 basis-56">
            <span className="sr-only">Search features</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search features…  (press / )" className="w-full rounded-lg border border-line-strong bg-surface py-2 pl-9 pr-8 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            {q && <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:text-ink"><X className="h-3.5 w-3.5" /></button>}
          </label>
          <p className="text-xs text-body" aria-live="polite">{list.length} of {features.length} features · tap <Star className="inline h-3 w-3 -translate-y-px" /> to shortlist</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]" role="tablist" aria-label="Feature categories">
          {(["All", ...featureCategories] as const).map((c) => {
            const count = c === "All" ? features.length : features.filter((f) => f.category === c).length;
            const on = cat === c;
            return (
              <button key={c} role="tab" aria-selected={on} onClick={() => setCat(c)} className={cn("flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors", on ? "border-brand-600 bg-brand-600 text-white" : "border-line-strong bg-surface text-body-strong hover:border-brand-400")}>
                {c}<span className={cn("rounded-full px-1.5 text-[11px] font-semibold", on ? "bg-white/25" : "bg-softer text-body")}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {list.length === 0 && (
        <div className="grid place-items-center rounded-lg border border-dashed border-line-strong py-16 text-center">
          <SearchX className="h-9 w-9 text-slate-400" /><p className="mt-3 text-base font-bold text-ink">No features match “{q}”</p>
          <p className="text-xs text-body">Try “engine”, “fuel”, “speed” or “BRTA”.</p>
          <Button size="sm" className="mt-4" onClick={() => { setQ(""); setCat("All"); }}>Reset filters</Button>
        </div>
      )}

      {groups.map((g) => (
        <section key={g} className="mb-12" aria-labelledby={`cat-${g}`}>
          <div className="mb-4 flex items-center justify-between border-b border-line pb-2.5">
            <h2 id={`cat-${g}`} className="flex items-center gap-2 text-lg font-bold text-ink"><span className="h-2 w-2 rounded-full bg-brand-600" />{g}</h2>
            <span className="text-xs text-body">{list.filter((f) => f.category === g).length} features</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.filter((f) => f.category === g).map((f, i) => {
              const on = picked.includes(f.id);
              return (
                <motion.article key={f.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.3, delay: (i % 6) * 0.04 }}
                  className={cn("group glass flex flex-col rounded-lg border p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg", on ? "border-brand-500 ring-2 ring-brand-500/25" : "border-white/60 hover:border-brand-400 dark:border-white/10")}>
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-navy-900 text-white transition-colors group-hover:bg-brand-600"><DynIcon name={f.icon} className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1"><h3 className="text-[15px] font-bold leading-snug text-ink">{f.title}</h3><div className="mt-1"><Availability id={f.id} /></div></div>
                    <button onClick={() => toggle(f.id)} aria-pressed={on} aria-label={on ? `Remove ${f.title} from shortlist` : `Add ${f.title} to shortlist`} className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors", on ? "border-brand-500 bg-brand-600 text-white" : "border-line-strong text-slate-400 hover:text-brand-text")}>
                      <Star className={cn("h-4 w-4", on && "fill-current")} />
                    </button>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-body">{f.description}</p>
                  <button onClick={() => dispatch(openFeatureModal(f.id))} className="mt-3 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-text hover:underline">Details & packages <ArrowRight className="h-3.5 w-3.5" /></button>
                </motion.article>
              );
            })}
          </div>
        </section>
      ))}

      {/* floating shortlist bar */}
      <AnimatePresence>
        {picked.length > 0 && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            className="glass fixed bottom-[calc(4.6rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-center gap-3 rounded-lg border border-white/60 p-3 dark:border-white/10 lg:bottom-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{picked.length}</span>
            <div className="min-w-0 flex-1 text-sm">
              {match.list.length > 0 ? (
                <><p className="truncate font-semibold text-ink">{match.list.length} of {plans.length} packages include all your picks</p>
                  <p className="truncate text-xs text-body">Cheapest: <b className="text-ink">{cheapest.name}</b> · {formatBDT(cheapest.devicePrice)} + {formatBDT(cheapest.monthlyCharge)}/mo{match.unmapped > 0 && ` · ${match.unmapped} platform feature${match.unmapped > 1 ? "s" : ""} not broken down by package`}</p></>
              ) : (
                <><p className="font-semibold text-ink">No single package lists all of these</p><p className="text-xs text-body">Remove a feature or ask sales for a custom package.</p></>
              )}
            </div>
            {match.list.length > 0 && <Button size="sm" onClick={seePackages}><Check className="h-4 w-4" />See packages</Button>}
            <button onClick={() => setPicked([])} aria-label="Clear shortlist" className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-softer hover:text-ink"><X className="h-4 w-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
