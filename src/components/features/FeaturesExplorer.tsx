"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Search, SearchX, Star, X } from "lucide-react";
import Container from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { features, featureCategories } from "@/data/features";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { DynIcon } from "@/lib/icons";
import { announceNavigation } from "@/lib/navigate";
import { isPackageFeature, packagesFor, packagesWithAll } from "@/lib/featurePackages";
import { useAppDispatch } from "@/store/hooks";
import { setCompare } from "@/store/slices/pricingSlice";
import { openFeatureModal } from "@/store/slices/uiSlice";
import { cn, formatBDT } from "@/utils/format";
import type { FeatureCategory } from "@/types";

function Availability({ id }: { id: string }) {
  const { plans } = useCatalog();
  if (!isPackageFeature(id)) return <span className="rounded-full bg-softer px-2 py-0.5 text-xs font-semibold text-body">Platform feature</span>;
  const n = packagesFor(id, plans).length;
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", n === plans.length ? "bg-green-500/15 text-green-600" : "bg-amber-500/15 text-amber-600")}>
      {n === plans.length ? `All ${n} packages` : `${n} of ${plans.length} packages`}
    </span>
  );
}

export default function FeaturesExplorer() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { plans } = useCatalog();
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
  const match = useMemo(() => packagesWithAll(picked, plans), [picked, plans]);
  const cheapest = match.list[0];

  const seePackages = () => {
    dispatch(setCompare(match.list.slice(0, 4).map((p) => p.id).concat(match.list.length < 2 ? plans.filter((p) => !match.list.includes(p)).slice(0, 2 - match.list.length).map((p) => p.id) : [])));
    announceNavigation();
    router.push("/pricing#compare");
  };

  return (
    <Container className="py-8 sm:py-12" id="all-features">
      {/* Search & Category Filter Controls */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search 40+ features... (press '/' to focus)"
              className="w-full rounded-md border border-line bg-surface py-2.5 pl-10 pr-10 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="text-xs text-body">
            Showing <strong className="text-ink">{list.length}</strong> of {features.length} features
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Feature categories">
          <button
            type="button"
            role="tab"
            aria-selected={cat === "All"}
            onClick={() => setCat("All")}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
              cat === "All"
                ? "bg-brand-600 text-white "
                : "bg-softer/80 dark:bg-navy-900/90 text-body hover:text-ink"
            )}
          >
            All Features ({features.length})
          </button>
          {featureCategories.map((c) => {
            const count = features.filter((f) => f.category === c).length;
            const isSelected = cat === c;
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                  isSelected
                    ? "bg-brand-600 text-white "
                    : "bg-softer/80 dark:bg-navy-900/90 text-body hover:text-ink"
                )}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="grid place-items-center rounded-md border border-dashed border-line-strong py-16 text-center">
          <SearchX className="h-10 w-10 text-slate-400" />
          <p className="mt-3 text-base font-bold text-ink">No features match &quot;{q}&quot;</p>
          <p className="text-xs text-slate-500">Try searching for keywords like &quot;engine lock&quot;, &quot;fuel&quot;, &quot;playback&quot;, or &quot;speed&quot;.</p>
          <button
            className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
            onClick={() => {
              setQ("");
              setCat("All");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : null}

      {groups.map((g) => (
        <section key={g} className="mb-9" aria-labelledby={`cat-${g}`}>
          <div className="mb-4 flex items-center justify-between border-b border-line pb-2.5">
            <h2 id={`cat-${g}`} className="flex items-center gap-2 text-base font-bold text-ink"><span className="h-5 w-1 rounded-full bg-gradient-to-b from-brand-400 to-brand-700" />{g}</h2>
            <span className="text-xs text-body">{list.filter((f) => f.category === g).length} features</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {list.filter((f) => f.category === g).map((f, i) => {
              const on = picked.includes(f.id);
              return (
                <motion.article key={f.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.3, delay: (i % 6) * 0.04 }}
                  className={cn("group relative flex flex-col overflow-hidden rounded-md bg-softer/80 dark:bg-navy-900/90 p-3.5 transition-all duration-300 hover:-translate-y-1 sm:p-4", on && "ring-2 ring-brand-500/40")}>
                  <span aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/15 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-start gap-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-gradient-to-br from-navy-700 to-navy-950 text-white   ring-1 ring-white/10 transition-all duration-300 group-hover:from-brand-500 group-hover:to-brand-700 group-hover:scale-105"><DynIcon name={f.icon} className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1"><h3 className="text-base font-bold leading-snug text-ink">{f.title}</h3><div className="mt-1"><Availability id={f.id} /></div></div>
                    <button onClick={() => toggle(f.id)} aria-pressed={on} aria-label={on ? `Remove ${f.title} from shortlist` : `Add ${f.title} to shortlist`} className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all active:scale-90", on ? "border-brand-500 bg-brand-600 text-white" : "border-line-strong text-slate-400 hover:text-brand-text")}>
                      <Star className={cn("h-3.5 w-3.5", on && "fill-current")} />
                    </button>
                  </div>
                  <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-body">{f.description}</p>
                  <button onClick={() => dispatch(openFeatureModal(f.id))} className="relative mt-3 inline-flex items-center gap-1 self-start rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-text transition-colors hover:bg-brand-100">Details & packages <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></button>
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
            className="glass fixed bottom-[calc(4.6rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-center gap-3 rounded-md border border-line p-3 lg:bottom-5">
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
