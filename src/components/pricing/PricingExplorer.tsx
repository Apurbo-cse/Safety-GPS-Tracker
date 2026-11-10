"use client";
import { useMemo } from "react";
import { Check, Minus, X } from "lucide-react";
import Container from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import PlanCard from "./PlanCard";
import { comparisonFeatures, plans } from "@/data/pricing";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCompare, setMaxMonthly, setSort } from "@/store/slices/pricingSlice";
import { cn, formatBDT } from "@/utils/format";

export default function PricingExplorer() {
  const dispatch = useAppDispatch();
  const { sort, maxMonthly, compareIds } = useAppSelector((s) => s.pricing);

  const visible = useMemo(() => {
    let list = plans.filter((p) => maxMonthly === null || p.monthlyCharge <= maxMonthly);
    if (sort === "device") list = [...list].sort((a, b) => a.devicePrice - b.devicePrice);
    if (sort === "monthly") list = [...list].sort((a, b) => a.monthlyCharge - b.monthlyCharge);
    return list;
  }, [sort, maxMonthly]);

  const tablePlans = compareIds.length >= 2 ? plans.filter((p) => compareIds.includes(p.id)) : plans;

  return (
    <>
      <Container className="py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Maximum monthly charge">
            {([[null, "All plans"], [300, "Up to ৳300/mo"], [400, "Up to ৳400/mo"]] as const).map(([v, l]) => (
              <button key={l} onClick={() => dispatch(setMaxMonthly(v))} aria-pressed={maxMonthly === v}
                className={cn("rounded-full border px-3.5 py-1.5 text-sm font-medium", maxMonthly === v ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-surface text-body-strong hover:border-brand-400")}>{l}</button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-body">Sort by
            <select value={sort} onChange={(e) => dispatch(setSort(e.target.value as typeof sort))} className="rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm">
              <option value="default">Default</option><option value="device">Device price (low to high)</option><option value="monthly">Monthly charge (low to high)</option>
            </select>
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{visible.map((p) => <PlanCard key={p.id} plan={p} />)}</div>
        {visible.length === 0 && <p className="py-10 text-center text-sm text-body">No plans match this filter.</p>}
      </Container>

      <section className="bg-surface py-14" id="compare">
        <Container>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-ink">Package comparison</h2>
              <p className="mt-1 text-sm text-body">{compareIds.length >= 2 ? `Comparing ${compareIds.length} selected packages.` : "All eight packages. Tick “Add to comparison” on two or more cards to narrow this table."}</p>
            </div>
            {compareIds.length > 0 && <Button variant="outline" size="sm" onClick={() => dispatch(clearCompare())}><X className="h-4 w-4" />Clear selection ({compareIds.length})</Button>}
          </div>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-soft">
                  <th className="sticky left-0 z-10 w-56 bg-soft px-4 py-3 text-left font-semibold text-body-strong">Package</th>
                  {tablePlans.map((p) => (
                    <th key={p.id} className="min-w-32 px-3 py-3 text-center font-semibold text-ink">
                      {p.name}
                    </th>
                  ))}
                </tr>
                <tr><th className="sticky left-0 bg-surface px-4 py-2.5 text-left font-medium text-body">Device price</th>{tablePlans.map((p) => <td key={p.id} className="px-3 py-2.5 text-center font-bold text-ink">{formatBDT(p.devicePrice)}</td>)}</tr>
                <tr className="border-b border-line"><th className="sticky left-0 bg-surface px-4 py-2.5 text-left font-medium text-body">Monthly charge</th>{tablePlans.map((p) => <td key={p.id} className="px-3 py-2.5 text-center font-bold text-brand-text">{formatBDT(p.monthlyCharge)}</td>)}</tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((f, i) => (
                  <tr key={f} className={i % 2 ? "bg-soft/60" : ""}>
                    <th scope="row" className="sticky left-0 bg-inherit px-4 py-2.5 text-left font-medium text-body-strong">{f}</th>
                    {tablePlans.map((p) => (
                      <td key={p.id} className="px-3 py-2.5 text-center">
                        {p.features.includes(f) ? <Check className="mx-auto h-4 w-4 text-green-600" aria-label="Included" /> : <Minus className="mx-auto h-4 w-4 text-slate-300" aria-label="Not listed" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">A dash means the feature is not listed on that package. Feature lists follow the published price list.</p>
        </Container>
      </section>
    </>
  );
}
