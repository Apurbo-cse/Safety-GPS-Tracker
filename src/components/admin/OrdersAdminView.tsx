"use client";
import { AdminTableSkeleton } from "@/components/common/Skeletons";
import { useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/common/ProductImage";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Eye, Package, Search, X } from "lucide-react";
import { useCan } from "@/lib/useCan";
import ExportButton from "./ExportButton";
import { mediaUrl, type AdminOrder, type OrderStatus } from "@/lib/api";
import { errorMessage, useAdminOrdersQuery, useSetOrderStatusMutation } from "@/store/apiSlice";
import { cn, formatBDT } from "@/utils/format";
import { CARD, EmptyState, ErrorState, PageHeader, Pagination, STATUS, STATUS_ORDER, fmtDateTime, view } from "./ui";

const LIMIT = 15;
const selectCls = "h-9 rounded-lg bg-surface px-2.5 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:bg-navy-950";

export default function OrdersAdminView() {
  const params = useSearchParams();
  const status = (params.get("status") as OrderStatus | null) ?? undefined;
  const q = params.get("q") ?? "";
  // changing a filter remounts the table, which resets the page number and the search box
  return <OrdersTable key={`${status ?? "all"}|${q}`} status={status} q={q} />;
}

function OrdersTable({ status, q }: { status?: OrderStatus; q: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [page, setPage] = useState(1);
  const [term, setTerm] = useState(q);
  const [busy, setBusy] = useState<string | null>(null);

  const { data, error, loading, reload } = view(useAdminOrdersQuery({ status, q: q || undefined, page, limit: LIMIT }));
  const [setOrderStatus] = useSetOrderStatusMutation();
  const canManage = useCan("orders.manage");

  const setParam = (key: string, value: string | null) => {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value); else p.delete(key);
    router.replace(`${pathname}${p.size ? `?${p}` : ""}`);
  };

  const changeStatus = async (o: AdminOrder, next: OrderStatus) => {
    if (next === o.status) return;
    if ((next === "cancelled" || next === "returned" || next === "refunded") && !window.confirm(`Mark order ${o.id} as ${next}? The customer will see it, and stock and any coupon use are given back.`)) return;
    setBusy(o.id);
    try {
      await setOrderStatus({ id: o.id, status: next }).unwrap();
      toast.success(`${o.id} → ${STATUS[next].label}`);
    } catch (e) { toast.error(errorMessage(e, "Could not update the order")); }
    finally { setBusy(null); }
  };

  const counts = data?.counts ?? {};
  const all = Object.values(counts).reduce((n, v) => n + (v ?? 0), 0);

  return (
    <>
      <PageHeader title="Orders" subtitle="Confirm, schedule and track customer orders." actions={<ExportButton kind="orders" range />} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-1 rounded-full bg-softer/80 p-1 dark:bg-navy-900/90">
          {([[undefined, "All", all], ...STATUS_ORDER.map((k) => [k, STATUS[k].label, counts[k] ?? 0] as const)] as const).map(([k, label, n]) => (
            <button key={label} role="tab" aria-selected={status === k} onClick={() => setParam("status", k ?? null)}
              className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors", status === k ? "bg-brand-500 text-white" : "text-body hover:text-ink")}>{label} <span className="opacity-70">{n}</span></button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setParam("q", term.trim() || null); }} className="relative w-full sm:w-72" role="search">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Order no., name or mobile" aria-label="Search orders" className="h-10 w-full rounded-lg bg-softer/80 pl-9 pr-9 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:bg-navy-900/90" />
          {q && <button type="button" onClick={() => setParam("q", null)} aria-label="Clear search" className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded text-slate-400 hover:text-ink"><X className="h-3.5 w-3.5" /></button>}
        </form>
      </div>

      {error ? <ErrorState message={error} onRetry={reload} /> : !data ? <AdminTableSkeleton /> : (
        <div className={`${CARD} overflow-hidden`}>
          {data.orders.length === 0 ? <EmptyState icon={Package} title="No orders match" text={q || status ? "Try another filter or search." : "Orders placed on the website show up here."} /> : (
            <div className={cn("overflow-x-auto", loading && "opacity-60")}>
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead><tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Order</th><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Items</th><th className="px-3 py-3 text-right">Total</th><th className="px-3 py-3">Placed</th><th className="px-3 py-3">Status</th><th className="px-3 py-3"><span className="sr-only">Details</span></th>
                </tr></thead>
                <tbody>
                  {data.orders.map((o) => (
                    <tr key={o.id} className="border-t border-line-soft/0">
                      <td className="px-5 py-3 font-mono text-sm font-bold text-ink"><Link href={`/admin/orders/${o.id}`} className="hover:text-brand-600 hover:underline">{o.id}</Link></td>
                      <td className="px-3 py-3"><span className="block font-semibold text-ink">{o.customer.name}</span><span className="block text-xs text-slate-500">{o.contact.phone}</span></td>
                      <td className="max-w-[16rem] px-3 py-3 text-body">
                        <div className="flex items-center gap-2.5">
                          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-surface dark:bg-navy-950/70">{o.items[0]?.image ? <ProductImage src={mediaUrl(o.items[0].image)} alt={o.items[0].name} fill sizes="40px" className="object-contain p-0.5" /> : <Package className="m-auto mt-2.5 h-4 w-4 text-slate-400" />}</span>
                          <span className="min-w-0"><span className="block truncate">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</span>{o.items.length > 1 && <span className="block text-xs text-slate-500">+{o.items.length - 1} more</span>}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right"><span className="block font-bold tabular-nums text-ink">{formatBDT(o.deviceTotal - o.discount)}</span><span className="block text-xs text-slate-500">+{formatBDT(o.monthlyTotal)}/mo</span></td>
                      <td className="px-3 py-3 text-xs text-slate-500">{fmtDateTime(o.createdAt)}</td>
                      <td className="px-3 py-3">
                        <label className="sr-only" htmlFor={`st-${o.id}`}>Status of {o.id}</label>
                        <select id={`st-${o.id}`} className={selectCls} value={o.status} disabled={busy === o.id || !canManage} onChange={(e) => void changeStatus(o, e.target.value as OrderStatus)}>
                          {STATUS_ORDER.map((k) => <option key={k} value={k}>{STATUS[k].label}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-3 text-right"><Link href={`/admin/orders/${o.id}`} aria-label={`View ${o.id}`} className="inline-grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-surface hover:text-brand-600 dark:hover:bg-navy-950"><Eye className="h-4 w-4" /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {data && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />}
    </>
  );
}
