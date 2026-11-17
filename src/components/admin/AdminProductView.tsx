"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Banknote, ExternalLink, Package, Pencil, ShoppingCart, TrendingUp, Warehouse } from "lucide-react";
import ProductImage from "@/components/common/ProductImage";
import { mediaUrl } from "@/lib/api";
import Modal from "@/components/common/Modal";
import { useCan } from "@/lib/useCan";
import { useAdminCatalogQuery, useAdminProductQuery } from "@/store/apiSlice";
import StockPanel from "./StockPanel";
import { DeviceForm } from "./CatalogAdminView";
import { cn, formatBDT } from "@/utils/format";
import { CARD, ErrorState, PageHeader, Skeleton, StatCard, StatusBadge, fmtDateTime, view } from "./ui";

/** One product in full, for staff: pictures, price and stock, specs, and how well it sells. */
export default function AdminProductView({ id }: { id: string }) {
  const { data, error, reload } = view(useAdminProductQuery(id));
  const d = data?.device;
  const [editing, setEditing] = useState(false);
  const canEdit = useCan("products.manage");
  const catalog = useAdminCatalogQuery({ slim: true }, { skip: !editing }).data;
  const gallery = d ? (d.images?.length ? d.images : d.image ? [d.image] : []) : [];
  const margin = d && d.price != null && d.cost != null ? d.price - d.cost : null;

  return (
    <>
      <PageHeader title={d?.name ?? `Product ${id}`} subtitle={d ? `${d.category}${d.subcategory ? ` · ${d.subcategory}` : ""} · ${d.id}` : undefined}
        actions={d && <>{canEdit && <button onClick={() => setEditing(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"><Pencil className="h-4 w-4" />Edit product</button>}<Link href={`/products/${d.id}`} target="_blank" className="inline-flex h-10 items-center gap-2 rounded-lg bg-softer/80 px-4 text-sm font-semibold text-ink hover:text-brand-600 dark:bg-navy-900/90"><ExternalLink className="h-4 w-4" />View on website</Link></>} />
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"><ArrowLeft className="h-4 w-4" />All products</Link>

      {error ? <ErrorState message={error} onRetry={reload} /> : !data || !d ? <Skeleton rows={4} /> : (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={ShoppingCart} label="Orders" value={String(data.sales.orders)} hint={`${data.sales.units} unit${data.sales.units === 1 ? "" : "s"} sold`} tone="sky" />
            <StatCard icon={Banknote} label="Revenue" value={formatBDT(data.sales.revenue)} hint="Excludes cancelled, returned, refunded" />
            {data.sales.profit !== undefined && <StatCard icon={TrendingUp} label="Profit" value={formatBDT(data.sales.profit)} hint="Before discounts" />}
            <StatCard icon={Warehouse} label="In stock" value={d.stock === null ? "Not tracked" : String(d.stock)} hint={d.active ? "Visible on website" : "Hidden from website"} />
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <section className={`${CARD} p-5`}>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Pictures</h2>
                {gallery.length === 0 ? <p className="text-sm text-body">No photo yet. Add one from the product list.</p> : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {gallery.map((g, n) => (
                      <div key={g + n} className="relative aspect-square overflow-hidden rounded-lg bg-surface dark:bg-navy-950/70">
                        <ProductImage src={mediaUrl(g)} alt={`${d.name} ${n + 1}`} fill sizes="160px" className="object-contain p-2" />
                        {n === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-semibold text-white">Main</span>}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className={`${CARD} p-5`}>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">About</h2>
                {d.summary && <p className="mb-2 text-sm font-semibold text-ink">{d.summary}</p>}
                <p className="whitespace-pre-line text-sm leading-relaxed text-body">{d.description || "No description."}</p>
                {d.features.length > 0 && <ul className="mt-3 grid gap-1.5 text-sm text-body sm:grid-cols-2">{d.features.map((f) => <li key={f} className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />{f}</li>)}</ul>}
              </section>

              {d.specs.length > 0 && (
                <section className={`${CARD} p-5`}>
                  <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Specifications</h2>
                  <dl className="divide-y divide-line/30 text-sm">
                    {d.specs.map((s) => <div key={s.label} className="flex justify-between gap-4 py-2"><dt className="text-body">{s.label}</dt><dd className="text-right font-semibold text-ink">{s.value}</dd></div>)}
                  </dl>
                </section>
              )}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <section className={`${CARD} p-5`}>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Price &amp; stock</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-body">Price</dt><dd className="font-bold tabular-nums text-ink">{d.price != null ? formatBDT(d.price) : "Ask for quote"}</dd></div>
                  {d.monthly ? <div className="flex justify-between"><dt className="text-body">Monthly</dt><dd className="font-bold tabular-nums text-ink">{formatBDT(d.monthly)}/mo</dd></div> : null}
                  {d.cost != null && <div className="flex justify-between"><dt className="text-body">Our cost</dt><dd className="font-semibold tabular-nums text-ink">{formatBDT(d.cost)}</dd></div>}
                  {margin !== null && <div className="flex justify-between"><dt className="text-body">Margin per unit</dt><dd className={cn("font-bold tabular-nums", margin < 0 ? "text-red-600" : "text-green-600")}>{formatBDT(margin)}</dd></div>}
                  <div className="flex justify-between"><dt className="text-body">Visibility</dt><dd className={cn("font-semibold", d.active ? "text-green-600" : "text-amber-600")}>{d.active ? "Visible" : "Hidden"}</dd></div>
                  {d.planId && <div className="flex justify-between"><dt className="text-body">Linked package</dt><dd className="font-mono text-xs text-ink">{d.planId}</dd></div>}
                  {d.priceNote && <p className="rounded-lg bg-surface p-2.5 text-xs text-body dark:bg-navy-950/70">{d.priceNote}</p>}
                </dl>
              </section>

              <StockPanel id={d.id} name={d.name} stock={d.stock} />

              <section className={`${CARD} p-5`}>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Recent orders</h2>
                {data.recent.length === 0 ? <p className="flex items-center gap-2 text-sm text-body"><Package className="h-4 w-4 text-slate-400" />Not ordered yet.</p> : (
                  <ul className="space-y-2">
                    {data.recent.map((r) => (
                      <li key={r.id + r.createdAt} className="flex items-center justify-between gap-2 rounded-lg bg-surface p-2.5 text-sm dark:bg-navy-950/70">
                        <span className="min-w-0"><Link href={`/admin/orders/${r.id}`} className="block font-mono text-xs font-bold text-ink hover:text-brand-600 hover:underline">{r.id}</Link><span className="block truncate text-xs text-slate-500">{r.customer} · {r.qty}× · {fmtDateTime(r.createdAt)}</span></span>
                        <StatusBadge status={r.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </aside>
          </div>
        </div>
      )}

      <Modal open={editing} onClose={() => setEditing(false)} wide="xl" title={d ? `Edit ${d.name}` : "Edit product"}>
        {editing && d && catalog && <DeviceForm key={d.id} initial={d} categories={[]} catTree={catalog.categories} plans={catalog.plans} onSaved={() => setEditing(false)} onCancel={() => setEditing(false)} />}
      </Modal>
    </>
  );
}
