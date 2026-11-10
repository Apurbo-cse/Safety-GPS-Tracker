"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Search, SearchX } from "lucide-react";
import Container from "@/components/common/Container";
import { features, featureCategories } from "@/data/features";
import { DynIcon } from "@/lib/icons";
import { useAppDispatch } from "@/store/hooks";
import { openFeatureModal } from "@/store/slices/uiSlice";
import { cn } from "@/utils/format";
import type { FeatureCategory } from "@/types";

export default function FeaturesExplorer() {
  const dispatch = useAppDispatch();
  const [cat, setCat] = useState<"All" | FeatureCategory>("All");
  const [q, setQ] = useState("");
  const list = useMemo(
    () => features.filter((f) => (cat === "All" || f.category === cat) && (f.title + f.description).toLowerCase().includes(q.toLowerCase())),
    [cat, q],
  );
  const groups = featureCategories.filter((c) => list.some((f) => f.category === c));

  return (
    <Container className="py-12">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Feature categories">
          {(["All", ...featureCategories] as const).map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
              className={cn("rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors", cat === c ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-surface text-body-strong hover:border-brand-400")}>
              {c}
            </button>
          ))}
        </div>
        <label className="relative block w-full lg:w-72">
          <span className="sr-only">Search features</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search features…" className="w-full rounded-lg border border-line-strong bg-surface py-2.5 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </label>
      </div>

      {list.length === 0 && (
        <div className="grid place-items-center rounded-xl border border-dashed border-line-strong py-16 text-center">
          <SearchX className="h-8 w-8 text-slate-400" /><p className="mt-2 text-sm font-medium text-body-strong">No features match “{q}”</p>
          <button className="mt-2 text-sm font-semibold text-brand-text" onClick={() => { setQ(""); setCat("All"); }}>Clear filters</button>
        </div>
      )}

      {groups.map((g) => (
        <section key={g} className="mb-12" aria-labelledby={`cat-${g}`}>
          <h2 id={`cat-${g}`} className="mb-4 text-xl font-bold text-ink">{g}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.filter((f) => f.category === g).map((f) => {
              return (
                <article key={f.id} className="spotlight group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-shadow hover:shadow-md">
                  <div className="relative flex h-20 items-center justify-between bg-gradient-to-br from-navy-900 to-navy-700 px-5">
                    {f.image ? <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-white/30"><Image src={f.image} alt="" width={56} height={56} className="h-full w-full object-contain" /></span> : <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-white ring-1 ring-white/20"><DynIcon name={f.icon} className="h-5 w-5" /></span>}
                    <DynIcon name={f.icon} className="absolute -right-3 top-1/2 h-24 w-24 -translate-y-1/2 text-white/5" />
                    <span className="flex items-end gap-1" aria-hidden>{[10, 18, 13, 24, 16].map((h, i) => <span key={i} className="w-1.5 rounded-sm bg-brand-400/70" style={{ height: h }} />)}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[14px] font-bold text-ink">{f.title}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-body">{f.description}</p>
                    <button onClick={() => dispatch(openFeatureModal(f.id))} className="mt-3 inline-flex items-center gap-1 self-start text-sm font-semibold text-brand-text hover:underline">Learn more <ArrowRight className="h-3.5 w-3.5" /></button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </Container>
  );
}
