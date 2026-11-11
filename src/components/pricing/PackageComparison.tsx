"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowLeftRight, Check, ChevronDown, Minus, ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";
import Container from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { comparisonFeatures, plans } from "@/data/pricing";
import { groupFeatures } from "@/lib/featureGroups";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { clearCompare, setCompare } from "@/store/slices/pricingSlice";
import { openPlanModal, setCartOpen } from "@/store/slices/uiSlice";
import { cn, formatBDT } from "@/utils/format";
import type { PricingPlan } from "@/types";

const DEFAULTS = ["premium-voice", "gps-2", "voice-gps", "video-voice"];
const MAX = 4;
const GROUPS = groupFeatures(comparisonFeatures);
const firstYear = (p: PricingPlan) => p.devicePrice + p.monthlyCharge * 12;

const Best = () => <span className="ml-1.5 rounded-full bg-green-500/15 px-1.5 py-0.5 text-xs font-semibold text-green-600">Lowest</span>;
const Mark = ({ on }: { on: boolean }) => on ? <Check className="mx-auto h-4 w-4 text-green-600" aria-label="Included" /> : <Minus className="mx-auto h-4 w-4 text-slate-300" aria-label="Not listed" />;

export default function PackageComparison() {
  const dispatch = useAppDispatch();
  const compareIds = useAppSelector((s) => s.pricing.compareIds);
  const ids = compareIds.length >= 2 ? compareIds : DEFAULTS;
  const cols = plans.filter((p) => ids.includes(p.id));

  const [diffOnly, setDiffOnly] = useState(false);
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const [hoverCol, setHoverCol] = useState<string | null>(null);
  const [aId, setAId] = useState(ids[0]);
  const [bId, setBId] = useState(ids[1]);
  const a = plans.find((p) => p.id === aId)!;
  const b = plans.find((p) => p.id === bId)!;

  const toggle = (id: string) => {
    const on = ids.includes(id);
    if (on && ids.length <= 2) { toast.error("Keep at least 2 packages to compare"); return; }
    if (!on && ids.length >= MAX) { toast.error(`You can compare up to ${MAX} packages`); return; }
    dispatch(setCompare(on ? ids.filter((x) => x !== id) : [...ids, id]));
  };
  const buy = (p: PricingPlan) => {
    dispatch(addToCart({ id: `plan-${p.id}`, kind: "plan", name: p.name, price: p.devicePrice, monthly: p.monthlyCharge }));
    dispatch(setCartOpen(true));
    toast.success(`${p.name} added to cart`);
  };

  const lowest = useMemo(() => ({
    device: Math.min(...cols.map((c) => c.devicePrice)),
    monthly: Math.min(...cols.map((c) => c.monthlyCharge)),
    year: Math.min(...cols.map(firstYear)),
    allSame: (k: "devicePrice" | "monthlyCharge") => cols.every((c) => c[k] === cols[0][k]),
  }), [cols]);

  const groups = useMemo(() => GROUPS.map((g) => {
    const items = g.items.map((f) => ({ f, vals: cols.map((c) => c.features.includes(f)) }));
    const shown = diffOnly ? items.filter((r) => r.vals.some((v) => v !== r.vals[0])) : items;
    return { ...g, items, shown };
  }).filter((g) => g.shown.length), [cols, diffOnly]);
  const totals = cols.map((c) => comparisonFeatures.filter((f) => c.features.includes(f)).length);

  return (
    <section className="scroll-mt-32 bg-surface py-12" id="compare">
      <Container>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-ink">Package comparison</h2>
            <p className="mt-1 text-sm text-body">Compare up to {MAX} packages side by side. Prices and features follow the published price list.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-line-strong bg-surface px-3 py-2 text-sm font-medium text-body-strong">
              <input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} className="h-4 w-4 accent-brand-600" />Differences only
            </label>
            {compareIds.length > 0 && <Button variant="outline" size="sm" onClick={() => dispatch(clearCompare())}><X className="h-4 w-4" />Reset</Button>}
          </div>
        </div>

        {/* ------------------------------------------------ desktop / tablet */}
        <div className="hidden md:block">
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Packages to compare">
            {plans.map((p) => { const on = ids.includes(p.id); return (
              <button key={p.id} onClick={() => toggle(p.id)} aria-pressed={on}
                className={cn("flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs font-semibold transition-colors", on ? "border-brand-600 bg-brand-50 text-brand-text" : "border-line-strong bg-surface text-body hover:border-brand-400")}>
                <span className="relative h-6 w-8 overflow-hidden rounded-full bg-white">{p.image && <Image quality={90} src={p.image} alt="" fill sizes="32px" className="object-contain" />}</span>
                {p.name}{on && <Check className="h-3.5 w-3.5" />}
              </button>
            ); })}
          </div>

          <div className="max-h-[80vh] overflow-auto rounded-md border border-line">
            <table className="w-full border-separate border-spacing-0 text-sm" style={{ minWidth: 220 + cols.length * 170 }} onMouseLeave={() => setHoverCol(null)}>
              <thead>
                <tr>
                  <th className="sticky left-0 top-0 z-30 w-52 border-b border-line bg-soft px-4 py-3 text-left font-semibold text-body-strong">Package</th>
                  {cols.map((p) => (
                    <th key={p.id} onMouseEnter={() => setHoverCol(p.id)} className={cn("sticky top-0 z-20 border-b border-line px-3 py-3 text-center align-top transition-colors", hoverCol === p.id ? "bg-brand-50" : "bg-soft")}>
                      <div className="relative">
                        {cols.length > 2 && <button onClick={() => toggle(p.id)} aria-label={`Remove ${p.name}`} className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full text-slate-400 hover:bg-softer hover:text-ink"><X className="h-3.5 w-3.5" /></button>}
                        <span className="relative mx-auto block h-14 w-20 overflow-hidden rounded-md bg-white">{p.image && <Image quality={90} src={p.image} alt={p.siteTitle ?? p.name} fill sizes="80px" className="object-contain" />}</span>
                        <span className="mt-1.5 block text-sm font-bold leading-tight text-ink">{p.name}</span>
                        {p.siteTitle && <span className="block text-xs font-normal text-body">{p.siteTitle}</span>}
                        <button onClick={() => buy(p)} className="gloss-btn mt-2 inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold text-white"><ShoppingCart className="h-3.5 w-3.5" />Buy Now</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([["Device price", "devicePrice", (p: PricingPlan) => p.devicePrice, lowest.device], ["Monthly charge", "monthlyCharge", (p: PricingPlan) => p.monthlyCharge, lowest.monthly]] as const).map(([label, key, get, min]) => (
                  <tr key={label}>
                    <th className="sticky left-0 z-10 border-b border-line bg-surface px-4 py-2.5 text-left font-medium text-body">{label}</th>
                    {cols.map((p) => <td key={p.id} className={cn("border-b border-line px-3 py-2.5 text-center font-bold tabular-nums text-ink transition-colors", hoverCol === p.id && "bg-brand-50")}>{formatBDT(get(p))}{label === "Monthly charge" && <span className="text-xs font-normal text-body">/mo</span>}{get(p) === min && !lowest.allSame(key) && <Best />}</td>)}
                  </tr>
                ))}
                <tr>
                  <th className="sticky left-0 z-10 border-b border-line bg-surface px-4 py-2.5 text-left font-medium text-body">First 12 months</th>
                  {cols.map((p) => <td key={p.id} className={cn("border-b border-line px-3 py-2.5 text-center font-semibold tabular-nums text-ink transition-colors", hoverCol === p.id && "bg-brand-50")}>{formatBDT(firstYear(p))}{firstYear(p) === lowest.year && cols.some((c) => firstYear(c) !== lowest.year) && <Best />}</td>)}
                </tr>

                {groups.map((g) => (
                  <GroupRows key={g.title} g={g} cols={cols} closed={!!closed[g.title]} onToggle={() => setClosed((c) => ({ ...c, [g.title]: !c[g.title] }))} hoverCol={hoverCol} setHoverCol={setHoverCol} />
                ))}
                {groups.length === 0 && <tr><td colSpan={cols.length + 1} className="px-4 py-8 text-center text-body">These packages list the same features — only the price differs.</td></tr>}

                <tr>
                  <th className="sticky left-0 z-10 border-t border-line bg-soft px-4 py-3 text-left font-semibold text-ink">Features included</th>
                  {cols.map((p, i) => <td key={p.id} className="border-t border-line bg-soft px-3 py-3 text-center font-bold tabular-nums text-ink">{totals[i]}<span className="font-normal text-body"> / {comparisonFeatures.length}</span></td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ------------------------------------------------------- phones */}
        <div className="md:hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            {[[aId, setAId, "Package A"], [bId, setBId, "Package B"]].map(([val, set, label], i) => (
              <label key={String(label)} className={cn("block", i === 1 && "col-start-3 row-start-1")}>
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-body">{String(label)}</span>
                <select value={val as string} onChange={(e) => (set as (v: string) => void)(e.target.value)} className="w-full rounded-md border border-line-strong bg-surface px-2.5 py-2.5 text-sm font-medium text-ink">
                  {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </label>
            ))}
            <button onClick={() => { setAId(bId); setBId(aId); }} aria-label="Swap packages" className="col-start-2 row-start-1 mb-0.5 grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-surface text-body active:scale-90"><ArrowLeftRight className="h-4 w-4" /></button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[a, b].map((p) => {
              const other = p.id === a.id ? b : a;
              return (
                <div key={p.id + (p === a ? "a" : "b")} className="glass rounded-md border border-line p-3">
                  <span className="relative block h-20 overflow-hidden rounded-md bg-white">{p.image && <Image quality={90} src={p.image} alt={p.siteTitle ?? p.name} fill sizes="45vw" className="object-contain p-1" />}</span>
                  <p className="mt-2 text-sm font-bold leading-tight text-ink">{p.name}</p>
                  <dl className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between gap-1"><dt className="text-body">Device</dt><dd className="font-semibold tabular-nums text-ink">{formatBDT(p.devicePrice)}{p.devicePrice < other.devicePrice && <Best />}</dd></div>
                    <div className="flex justify-between gap-1"><dt className="text-body">Monthly</dt><dd className="font-semibold tabular-nums text-ink">{formatBDT(p.monthlyCharge)}{p.monthlyCharge < other.monthlyCharge && <Best />}</dd></div>
                    <div className="flex justify-between gap-1"><dt className="text-body">12 months</dt><dd className="font-semibold tabular-nums text-ink">{formatBDT(firstYear(p))}{firstYear(p) < firstYear(other) && <Best />}</dd></div>
                  </dl>
                  <Button size="sm" className="mt-3 w-full" onClick={() => buy(p)}>Buy Now</Button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 space-y-2">
            {GROUPS.map((g) => {
              const rows = g.items.map((f) => ({ f, x: a.features.includes(f), y: b.features.includes(f) })).filter((r) => !diffOnly || r.x !== r.y);
              if (!rows.length) return null;
              const open = !closed[`m-${g.title}`];
              return (
                <section key={g.title} className="overflow-hidden rounded-md border border-line">
                  <button onClick={() => setClosed((c) => ({ ...c, [`m-${g.title}`]: !c[`m-${g.title}`] }))} aria-expanded={open} className="flex w-full items-center gap-2 bg-soft px-3 py-3 text-left">
                    <g.icon className="h-4 w-4 text-brand-text" /><span className="flex-1 text-sm font-semibold text-ink">{g.title}</span>
                    <span className="text-xs tabular-nums text-body">{rows.filter((r) => r.x).length} · {rows.filter((r) => r.y).length}</span>
                    <ChevronDown className={cn("h-4 w-4 text-body transition-transform", open && "rotate-180")} />
                  </button>
                  {open && (
                    <ul className="divide-y divide-line-soft">
                      {rows.map((r) => (
                        <li key={r.f} className={cn("grid grid-cols-[1fr_44px_44px] items-center gap-1 px-3 py-2.5 text-sm", r.x !== r.y && "bg-brand-50/60")}>
                          <span className="text-body-strong">{r.f}</span><Mark on={r.x} /><Mark on={r.y} />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
            {diffOnly && GROUPS.every((g) => g.items.every((f) => a.features.includes(f) === b.features.includes(f))) && <p className="rounded-md border border-dashed border-line-strong p-5 text-center text-sm text-body">These two packages list the same features — only the price differs.</p>}
          </div>
          <button onClick={() => dispatch(openPlanModal(a.id))} className="mt-3 text-sm font-semibold text-brand-text hover:underline">See every feature of {a.name}</button>
        </div>

        <p className="mt-4 text-xs text-slate-500">A dash means the feature is not listed on that package. “First 12 months” = device price + 12 × monthly charge. “Lowest” marks the cheapest of the packages shown.</p>
      </Container>
    </section>
  );
}

function GroupRows({ g, cols, closed, onToggle, hoverCol, setHoverCol }: {
  g: { title: string; icon: React.ComponentType<{ className?: string }>; items: { f: string; vals: boolean[] }[]; shown: { f: string; vals: boolean[] }[] };
  cols: PricingPlan[]; closed: boolean; onToggle: () => void; hoverCol: string | null; setHoverCol: (id: string | null) => void;
}) {
  return (
    <>
      <tr>
        <th className="sticky left-0 z-10 border-b border-line bg-soft p-0 text-left">
          <button onClick={onToggle} aria-expanded={!closed} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-brand-text">
            <g.icon className="h-4 w-4" />{g.title}<ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", !closed && "rotate-180")} />
          </button>
        </th>
        {cols.map((c, i) => <td key={c.id} className="border-b border-line bg-soft px-3 py-2.5 text-center text-xs font-semibold tabular-nums text-body">{g.items.filter((r) => r.vals[i]).length}/{g.items.length}</td>)}
      </tr>
      {!closed && g.shown.map((r, ri) => (
        <tr key={r.f}>
          <th scope="row" className={cn("sticky left-0 z-10 border-b border-line-soft px-4 py-2.5 text-left font-medium text-body-strong", ri % 2 ? "bg-soft" : "bg-surface")}>{r.f}</th>
          {r.vals.map((v, c) => (
            <td key={cols[c].id} onMouseEnter={() => setHoverCol(cols[c].id)} className={cn("border-b border-line-soft px-3 py-2.5 text-center transition-colors", hoverCol === cols[c].id ? "bg-brand-50" : ri % 2 ? "bg-soft" : "bg-surface")}><Mark on={v} /></td>
          ))}
        </tr>
      ))}
    </>
  );
}
