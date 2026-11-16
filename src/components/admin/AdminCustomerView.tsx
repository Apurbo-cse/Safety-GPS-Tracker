"use client";
import Link from "next/link";
import ProductImage from "@/components/common/ProductImage";
import { mediaUrl } from "@/lib/api";
import { ArrowLeft, Banknote, Building2, Mail, MapPin, Package, Phone, Receipt, ShoppingCart, Truck } from "lucide-react";
import { useAdminCustomerQuery } from "@/store/apiSlice";
import { cn, formatBDT } from "@/utils/format";
import { CARD, EmptyState, ErrorState, PageHeader, Skeleton, StatCard, StatusBadge, fmtDate, fmtDateTime, view } from "./ui";

/** One account for staff: contact and billing details, totals, and every order they placed. */
export default function AdminCustomerView({ id }: { id: string }) {
  const { data, error, reload } = view(useAdminCustomerQuery(id));
  const c = data?.customer;

  return (
    <>
      <PageHeader title={c?.name ?? "Customer"} subtitle={c ? `Joined ${fmtDate(c.createdAt)}${c.role === "admin" ? " · Staff account" : ""}${c.disabled ? " · Disabled" : ""}` : undefined} />
      <Link href="/admin/customers" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"><ArrowLeft className="h-4 w-4" />All customers</Link>

      {error ? <ErrorState message={error} onRetry={reload} /> : !data || !c ? <Skeleton rows={4} /> : (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={ShoppingCart} label="Orders" value={String(data.stats.orders)} hint={`${data.stats.open} in progress`} tone="sky" />
            <StatCard icon={Banknote} label="Total spent" value={formatBDT(data.stats.spent)} hint="Excludes cancelled, returned, refunded" />
            <StatCard icon={Truck} label="Monthly (delivered)" value={`${formatBDT(data.stats.monthly)}/mo`} hint="Active subscriptions" />
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className={`${CARD} overflow-hidden`}>
              <h2 className="px-5 pb-2 pt-4 text-sm font-bold uppercase tracking-wider text-slate-500">Orders</h2>
              {data.orders.length === 0 ? <EmptyState icon={Package} title="No orders yet" text="Orders this customer places show up here." /> : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead><tr className="text-xs font-semibold uppercase tracking-wider text-slate-500"><th className="px-5 py-2.5">Order</th><th className="px-3 py-2.5">Placed</th><th className="px-3 py-2.5 text-right">Total</th><th className="px-3 py-2.5">Payment</th><th className="px-3 py-2.5">Status</th></tr></thead>
                    <tbody>
                      {data.orders.map((o) => (
                        <tr key={o.id}>
                          <td className="px-5 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-surface dark:bg-navy-950/70">{o.image ? <ProductImage src={mediaUrl(o.image)} alt="" fill sizes="40px" className="object-contain p-0.5" /> : <Package className="m-auto mt-2.5 h-4 w-4 text-slate-400" />}</span>
                              <span><Link href={`/admin/orders/${o.id}`} className="font-mono text-sm font-bold text-ink hover:text-brand-600 hover:underline">{o.id}</Link><span className="block text-xs text-slate-500">{o.items} item{o.items === 1 ? "" : "s"}</span></span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-xs text-slate-500">{fmtDateTime(o.createdAt)}</td>
                          <td className="px-3 py-2.5 text-right"><span className="block font-bold tabular-nums text-ink">{formatBDT(o.total)}</span><span className="block text-xs text-slate-500">+{formatBDT(o.monthly)}/mo</span></td>
                          <td className="px-3 py-2.5 text-xs"><span className="block text-body">{o.payment}</span><span className={cn("font-semibold", o.paymentStatus === "paid" ? "text-green-600" : o.paymentStatus === "failed" ? "text-red-600" : o.paymentStatus === "refunded" ? "text-purple-600" : "text-amber-600")}>{o.paymentStatus}</span></td>
                          <td className="px-3 py-2.5"><StatusBadge status={o.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <section className={`${CARD} p-5`}>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Contact</h2>
                <ul className="space-y-2.5 text-sm text-body">
                  <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /><a href={`mailto:${c.email}`} className="break-all hover:text-brand-600">{c.email}</a></li>
                  <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />{c.phone ? <a href={`tel:${c.phone}`} className="hover:text-brand-600">{c.phone}</a> : "—"}</li>
                  <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />{c.address ? `${c.address}, ${c.division}` : c.division || "—"}</li>
                  {c.vehicleType && <li className="text-xs">Vehicle: <b className="text-ink">{c.vehicleType}</b></li>}
                </ul>
              </section>
              <section className={`${CARD} p-5`}>
                <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-slate-500"><Receipt className="h-4 w-4" />Billing</h2>
                <ul className="space-y-2 text-sm text-body">
                  <li className="flex gap-2.5"><Building2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />{c.company || "No company"}</li>
                  {c.taxId && <li>BIN / TIN: <b className="text-ink">{c.taxId}</b></li>}
                  <li>{c.billingAddress ? `${c.billingAddress}, ${c.billingDivision}${c.billingPostcode ? ` ${c.billingPostcode}` : ""}` : "Same as the contact address"}</li>
                </ul>
              </section>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
