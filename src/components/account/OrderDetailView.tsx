"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, Calendar, Car, MapPin, Package, Phone, Receipt, RotateCcw, Smartphone, X } from "lucide-react";
import ProductImage from "@/components/common/ProductImage";
import { mediaUrl } from "@/lib/api";
import { useSite } from "@/components/providers/SiteProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, setQty } from "@/store/slices/cartSlice";
import { errorMessage, useCancelOrderMutation, useMyOrderQuery, usePayBkashMutation } from "@/store/apiSlice";
import { cn, formatBDT } from "@/utils/format";
import AccountShell, { CARD } from "./AccountShell";
import { STATUS_LABEL, STATUS_STYLE, Tracker } from "./OrdersView";

const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** One order, in full: progress, items, payment, installation and billing. */
export default function OrderDetailView({ id }: { id: string }) {
  const site = useSite();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const q = useMyOrderQuery(id, { skip: !user, refetchOnMountOrArgChange: true });
  const [cancel, { isLoading: cancelling }] = useCancelOrderMutation();
  const [payBkash, { isLoading: paying }] = usePayBkashMutation();
  const o = q.data;

  return (
    <AccountShell title={`Order ${id}`} subtitle="Everything about this order in one place." what="this order">
      <Link href="/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"><ArrowLeft className="h-4 w-4" />All orders</Link>
      {q.isLoading ? (
        <div className="skeleton h-64 w-full rounded-lg" aria-busy="true" />
      ) : q.isError || !o ? (
        <div className={`${CARD} p-10 text-center`}>
          <AlertCircle className="mx-auto h-10 w-10 text-amber-500" />
          <h2 className="mt-3 text-lg font-black text-ink">Order not found</h2>
          <p className="mt-1 text-sm text-body">{q.error ? errorMessage(q.error) : "We couldn't find this order."}</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <section className={`${CARD} p-5`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-xs text-slate-500">Placed {date(o.createdAt)}</p><h2 className="text-xl font-black tracking-tight text-ink">{o.id}</h2></div>
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_STYLE[o.status])}>{STATUS_LABEL[o.status]}</span>
              </div>
              {!["cancelled", "returned", "refunded"].includes(o.status) && <div className="mt-4"><Tracker status={o.status} /></div>}
            </section>

            <section className={`${CARD} p-5`}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Items</h3>
              <ul className="space-y-2">
                {o.items.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 rounded-lg bg-surface p-3 text-sm dark:bg-navy-950/70">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-softer/80 dark:bg-navy-900">{i.image ? <ProductImage src={mediaUrl(i.image)} alt={i.name} fill sizes="56px" className="object-contain p-1" /> : <Package className="m-auto mt-4 h-6 w-6 text-slate-400" />}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-ink">{i.name}</span><span className="text-xs text-slate-500">{i.kind === "plan" ? "Package" : "Device"} · {i.qty} × {formatBDT(i.price)}{i.monthly ? ` + ${formatBDT(i.monthly)}/mo` : ""}</span></span>
                    <span className="font-bold tabular-nums text-ink">{formatBDT(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={`${CARD} p-5`}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Installation &amp; billing</h3>
              <dl className="space-y-2.5 text-sm">
                <div className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /><dd className="text-ink">{o.contact.address}, {o.contact.district ?? o.contact.division}{o.contact.thana ? ` · ${o.contact.thana}` : ""}{o.contact.postcode ? ` ${o.contact.postcode}` : ""}{o.contact.area && o.contact.area !== "Outside Dhaka" ? ` (${o.contact.area})` : ""}</dd></div>
                <div className="flex gap-2.5"><Car className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /><dd className="text-ink">{o.contact.vehicleType} · {o.contact.vehicleReg}</dd></div>
                <div className="flex gap-2.5"><Calendar className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /><dd className="text-ink">Preferred installation: {date(o.contact.preferredDate)}</dd></div>
                <div className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /><dd className="text-ink">{o.contact.name} · {o.contact.phone} · {o.contact.email}</dd></div>
                <div className="flex gap-2.5"><Receipt className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /><dd className="text-ink">Billed to {o.billing.name}{o.billing.company ? `, ${o.billing.company}` : ""}, {o.billing.address}, {o.billing.district ?? o.billing.division}{o.billing.taxId ? ` · BIN/TIN ${o.billing.taxId}` : ""}</dd></div>
                {o.contact.note && <p className="rounded-lg bg-surface p-3 text-xs text-body dark:bg-navy-950/70">“{o.contact.note}”</p>}
              </dl>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <section className={`${CARD} p-5`}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Payment</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-body">Devices</dt><dd className="font-semibold tabular-nums text-ink">{formatBDT(o.deviceTotal)}</dd></div>
                {o.discount > 0 && <div className="flex justify-between"><dt className="text-body">Coupon {o.couponCode}</dt><dd className="font-semibold tabular-nums text-green-600">−{formatBDT(o.discount)}</dd></div>}
                <div className="flex justify-between"><dt className="text-body">Monthly service</dt><dd className="font-semibold tabular-nums text-ink">{formatBDT(o.monthlyTotal)}/mo</dd></div>
                <div className="flex items-baseline justify-between border-t border-line/30 pt-3"><dt className="font-semibold text-ink">Due now</dt><dd className="text-xl font-black tabular-nums text-ink">{formatBDT(o.deviceTotal - o.discount)}</dd></div>
                <div className="flex justify-between"><dt className="text-body">Method</dt><dd className="font-semibold text-ink">{o.payment}</dd></div>
                <div className="flex justify-between"><dt className="text-body">Status</dt><dd className={cn("font-semibold", o.paymentStatus === "paid" ? "text-green-600" : o.paymentStatus === "failed" ? "text-red-600" : o.paymentStatus === "refunded" ? "text-purple-600" : "text-amber-600")}>{o.paymentStatus === "paid" ? "Paid" : o.paymentStatus === "failed" ? "Failed" : o.paymentStatus === "refunded" ? "Refunded" : "Unpaid"}</dd></div>
                {o.paymentTrxId && <div className="flex justify-between"><dt className="text-body">bKash Trx ID</dt><dd className="font-mono text-xs text-ink">{o.paymentTrxId}</dd></div>}
              </dl>
              {o.payment === "bKash" && o.paymentStatus !== "paid" && !["cancelled", "returned", "refunded"].includes(o.status) && (
                <button disabled={paying} onClick={() => { payBkash(o.id).unwrap().then((r) => window.location.assign(r.bkashURL)).catch((e) => toast.error(errorMessage(e, "Could not open bKash"))); }} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-pink-600 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-60"><Smartphone className="h-4 w-4" />{paying ? "Opening…" : "Pay with bKash"}</button>
              )}
            </section>

            <div className="flex flex-col gap-2">
              <Link href={`/orders/${o.id}/invoice`} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-softer/80 text-sm font-semibold text-ink hover:text-brand-600 dark:bg-navy-900/90"><Receipt className="h-4 w-4" />Invoice</Link>
              <button onClick={() => { o.items.forEach((i) => { dispatch(addToCart({ id: i.id, kind: i.kind, name: i.name, price: i.price, monthly: i.monthly })); dispatch(setQty({ id: i.id, qty: i.qty })); }); toast.success("Items added to your cart"); router.push("/checkout"); }} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-500 text-sm font-semibold text-white hover:bg-brand-600"><RotateCcw className="h-4 w-4" />Order again</button>
              <a href={`tel:${site.phone}`} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-softer/80 text-sm font-semibold text-ink hover:text-brand-600 dark:bg-navy-900/90"><Phone className="h-4 w-4" />Call support</a>
              {o.status === "pending" && (
                <button disabled={cancelling} onClick={() => { cancel(o.id).unwrap().then(() => toast.success(`Order ${o.id} cancelled`)).catch((e) => toast.error(errorMessage(e, "Could not cancel the order"))); }} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-500/10"><X className="h-4 w-4" />Cancel order</button>
              )}
            </div>
          </aside>
        </div>
      )}
    </AccountShell>
  );
}
