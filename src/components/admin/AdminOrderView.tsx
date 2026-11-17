"use client";
import { AdminDetailSkeleton } from "@/components/common/Skeletons";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, ArrowLeft, Calendar, Car, MapPin, Package, Phone, Receipt } from "lucide-react";
import ProductImage from "@/components/common/ProductImage";
import Modal from "@/components/common/Modal";
import { Select, inputCls } from "@/components/forms/Field";
import { DISTRICTS, THANAS } from "@/lib/districts";
import { useCan } from "@/lib/useCan";
import { mediaUrl, type AdminOrder, type Area, type OrderStatus } from "@/lib/api";
import { errorMessage, useAdminOrderQuery, useSetOrderStatusMutation, useRefundBkashMutation, useUpdateOrderMutation } from "@/store/apiSlice";
import { cn, formatBDT } from "@/utils/format";
import ReturnItemsModal from "./ReturnItemsModal";
import { CARD, ErrorState, PageHeader, StatusBadge, STATUS, STATUS_ORDER, fmtDate, fmtDateTime, view } from "./ui";

const AREA_OPTIONS = [["DNCC", "Inside Dhaka · DNCC (Dhaka North)"], ["DSCC", "Inside Dhaka · DSCC (Dhaka South)"], ["Outside Dhaka", "Outside Dhaka"]] as const;

/** Staff fix the installation details of an order (date, place, phone, vehicle, note). */
function EditOrderForm({ o, onDone }: { o: AdminOrder; onDone: () => void }) {
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();
  const [v, setV] = useState({
    phone: o.contact.phone, address: o.contact.address, area: (o.contact.area ?? "Outside Dhaka") as Area, district: o.contact.district ?? o.contact.division,
    thana: o.contact.thana ?? "", postcode: o.contact.postcode ?? "", vehicleType: o.contact.vehicleType, vehicleReg: o.contact.vehicleReg,
    preferredDate: o.contact.preferredDate, note: o.contact.note ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const inside = v.area !== "Outside Dhaka";
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((s) => ({ ...s, [k]: val }));
  const thanas: readonly string[] = inside ? THANAS[v.area as "DNCC" | "DSCC"] : [];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    try {
      await updateOrder({ id: o.id, body: { ...v, district: inside ? "Dhaka" : v.district, thana: inside ? v.thana : "" } }).unwrap();
      toast.success(`${o.id} updated`); onDone();
    } catch (err) { setError(errorMessage(err, "Could not save the changes")); }
  };
  const lbl = "mb-1 block text-xs font-semibold text-slate-500";
  return (
    <form onSubmit={(e) => void submit(e)} className="grid gap-4 p-5 sm:grid-cols-2">
      <label className="sm:col-span-2"><span className={lbl}>Address</span><input className={inputCls} value={v.address} onChange={(e) => set("address", e.target.value)} required minLength={6} maxLength={240} /></label>
      <label><span className={lbl}>Area</span><Select value={v.area} onChange={(e) => set("area", e.target.value as Area)}>{AREA_OPTIONS.map(([k, t]) => <option key={k} value={k}>{t}</option>)}</Select></label>
      <label><span className={lbl}>District</span><Select value={inside ? "Dhaka" : v.district} disabled={inside} onChange={(e) => set("district", e.target.value)}>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}</Select></label>
      {inside && <label><span className={lbl}>Thana ({v.area})</span><Select value={v.thana} onChange={(e) => set("thana", e.target.value)} required><option value="">Select thana</option>{thanas.map((t) => <option key={t}>{t}</option>)}</Select></label>}
      <label><span className={lbl}>Postal code (optional)</span><input className={inputCls} inputMode="numeric" value={v.postcode} onChange={(e) => set("postcode", e.target.value)} maxLength={10} /></label>
      <label><span className={lbl}>Mobile</span><input className={inputCls} type="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} required /></label>
      <label><span className={lbl}>Installation date</span><input className={inputCls} type="date" value={v.preferredDate} onChange={(e) => set("preferredDate", e.target.value)} required /></label>
      <label><span className={lbl}>Vehicle type</span><input className={inputCls} value={v.vehicleType} onChange={(e) => set("vehicleType", e.target.value)} required /></label>
      <label><span className={lbl}>Registration number</span><input className={inputCls} value={v.vehicleReg} onChange={(e) => set("vehicleReg", e.target.value)} required /></label>
      <label className="sm:col-span-2"><span className={lbl}>Note</span><textarea className={`${inputCls} min-h-20 py-2`} value={v.note} onChange={(e) => set("note", e.target.value)} maxLength={300} /></label>
      {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600 sm:col-span-2">{error}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={onDone} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:bg-surface">Cancel</button>
        <button type="submit" disabled={isLoading} className="h-10 rounded-lg bg-brand-500 px-5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? "Saving…" : "Save changes"}</button>
      </div>
    </form>
  );
}

/** One order in full, for staff: items, payment, customer, installation, billing and the status buttons. */
export default function AdminOrderView({ id }: { id: string }) {
  const { data: o, error, reload } = view(useAdminOrderQuery(id));
  const [setOrderStatus] = useSetOrderStatusMutation();
  const [refundBkash] = useRefundBkashMutation();
  const canManage = useCan("orders.manage");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [returning, setReturning] = useState(false);

  const changeStatus = async (next: OrderStatus) => {
    if (!o || next === o.status) return;
    // a delivered order goes back through the return form, where staff say how many units and whether they are damaged
    if (next === "returned" && o.status === "delivered") { setReturning(true); return; }
    if ((next === "cancelled" || next === "returned" || next === "refunded") && !window.confirm(`Mark order ${o.id} as ${next}? The customer will see it, and stock and any coupon use are given back.`)) return;
    setBusy(true);
    try { await setOrderStatus({ id: o.id, status: next }).unwrap(); toast.success(`${o.id} → ${STATUS[next].label}`); }
    catch (e) { toast.error(errorMessage(e, "Could not update the order")); }
    finally { setBusy(false); }
  };

  const refund = async () => {
    if (!o || !window.confirm(`Refund ${formatBDT(o.deviceTotal - o.discount)} to the customer's bKash for ${o.id}? This sends real money back through bKash and cannot be undone.`)) return;
    setBusy(true);
    try { await refundBkash(o.id).unwrap(); toast.success(`${o.id} refunded through bKash`); }
    catch (e) { toast.error(errorMessage(e, "bKash could not refund this order")); }
    finally { setBusy(false); }
  };

  return (
    <>
      <PageHeader title={`Order ${id}`} subtitle="Everything about this order." actions={o && canManage && <button onClick={() => setEditing(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"><Pencil className="h-4 w-4" />Edit details</button>} />
      <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"><ArrowLeft className="h-4 w-4" />All orders</Link>
      {error ? <ErrorState message={error} onRetry={reload} /> : !o ? <AdminDetailSkeleton stats={false} /> : (
        <div className={`${CARD} p-1`}>
    <div className="grid gap-5 p-5 md:grid-cols-2">
      <div>
        <div className="mb-3 flex items-center justify-between"><StatusBadge status={o.status} /><span className="text-xs text-slate-500">{fmtDateTime(o.createdAt)}</span></div>
        <ul className="space-y-2">
          {o.items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 rounded-lg bg-softer/80 p-3 text-sm dark:bg-navy-900/90">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface dark:bg-navy-950">{i.image ? <ProductImage src={mediaUrl(i.image)} alt={i.name} fill sizes="48px" className="object-contain p-1" /> : <Package className="m-auto mt-3 h-5 w-5 text-slate-400" />}</span>
              <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-ink">{i.name}</span><span className="text-xs text-slate-500">{i.qty} × {formatBDT(i.price)}{i.monthly ? ` + ${formatBDT(i.monthly)}/mo` : ""}{i.returned ? ` · ${i.returned} returned` : ""}</span></span>
              <span className="text-right"><span className="block font-bold tabular-nums text-ink">{formatBDT(i.price * i.qty)}</span>{i.cost != null && <span className="block text-[11px] tabular-nums text-slate-500">cost {formatBDT(i.cost * i.qty)}</span>}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between"><dt className="text-body">Devices</dt><dd className="font-bold tabular-nums">{formatBDT(o.deviceTotal)}</dd></div>
          {o.discount > 0 && <div className="flex justify-between"><dt className="text-body">Coupon <span className="font-mono text-xs">{o.couponCode}</span></dt><dd className="font-bold tabular-nums text-green-600">−{formatBDT(o.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-body">Monthly</dt><dd className="font-bold tabular-nums">{formatBDT(o.monthlyTotal)}/mo</dd></div>
          <div className="flex justify-between"><dt className="text-body">Payment</dt><dd className="font-semibold">{o.payment}</dd></div>
                <div className="flex justify-between"><dt className="text-body">Payment status</dt><dd className={cn("font-semibold", o.paymentStatus === "paid" ? "text-green-600" : o.paymentStatus === "failed" ? "text-red-600" : o.paymentStatus === "refunded" ? "text-purple-600" : "text-amber-600")}>{o.paymentStatus ?? "unpaid"}</dd></div>
                {o.paymentTrxId && <div className="flex justify-between"><dt className="text-body">bKash Trx ID</dt><dd className="font-mono text-xs">{o.paymentTrxId}</dd></div>}
                {o.paymentRefundTrxId && <div className="flex justify-between"><dt className="text-body">Refund Trx ID</dt><dd className="font-mono text-xs">{o.paymentRefundTrxId}</dd></div>}
          {o.profit !== undefined && <div className="flex justify-between border-t border-line pt-1"><dt className="text-body">Profit on devices</dt><dd className={cn("font-bold tabular-nums", o.profit < 0 ? "text-red-600" : "text-green-600")}>{formatBDT(o.profit)}</dd></div>}
        </dl>
      </div>
      <div>
        <p className="text-sm font-bold text-ink">{o.contact.name}</p>
        <ul className="mt-2 space-y-2.5 text-sm text-body">
          <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /><a href={`tel:${o.contact.phone}`} className="hover:text-brand-600">{o.contact.phone}</a> · {o.contact.email}</li>
          <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />{o.contact.address}, {o.contact.district ?? o.contact.division}{o.contact.thana ? ` · ${o.contact.thana}` : ""}{o.contact.area ? (o.contact.area === "Outside Dhaka" ? " · Outside Dhaka" : ` (${o.contact.area})`) : ""}</li>
          <li className="flex gap-2.5"><Car className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />{o.contact.vehicleType} · {o.contact.vehicleReg}</li>
          <li className="flex gap-2.5"><Calendar className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />Preferred installation {fmtDate(o.contact.preferredDate)}</li>
          {o.contact.note && <li className="rounded-lg bg-softer/80 p-3 text-xs dark:bg-navy-900/90">“{o.contact.note}”</li>}
        </ul>
        <div className="mt-4 rounded-lg bg-softer/80 p-3 text-xs dark:bg-navy-900/90">
          <p className="mb-1 flex items-center gap-1.5 font-semibold uppercase tracking-wider text-slate-500"><Receipt className="h-3.5 w-3.5" />Bill to</p>
          <p className="font-semibold text-ink">{o.billing.name}{o.billing.company ? ` · ${o.billing.company}` : ""}</p>
          <p className="text-body">{o.billing.address}, {o.billing.district ?? o.billing.division}{o.billing.postcode ? ` ${o.billing.postcode}` : ""}</p>
          <p className="text-body">{o.billing.phone} · {o.billing.email}</p>
          {o.billing.taxId && <p className="text-body">BIN / TIN: <b className="text-ink">{o.billing.taxId}</b></p>}
        </div>
        {canManage && o.payment === "bKash" && o.paymentStatus === "paid" && (
                <button disabled={busy} onClick={() => void refund()} className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-purple-600 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60">Refund through bKash ({formatBDT(o.deviceTotal - o.discount)})</button>
              )}
              {canManage && <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Move to</p>}
        <div className="flex flex-wrap gap-2">
          {canManage && o.status === "delivered" && o.items.some((i) => i.kind === "device" && i.qty - (i.returned ?? 0) > 0) && (
            <button disabled={busy} onClick={() => setReturning(true)} className="rounded-full bg-amber-500/15 px-3.5 py-1.5 text-xs font-semibold text-amber-700 hover:opacity-80 disabled:opacity-50 dark:text-amber-300">Return items…</button>
          )}
          {canManage && STATUS_ORDER.filter((k) => k !== o.status).map((k) => (
            <button key={k} disabled={busy} onClick={() => void changeStatus(k)} className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors hover:opacity-80 disabled:opacity-50", STATUS[k].cls)}>{STATUS[k].label}</button>
          ))}
        </div>
      </div>
    </div>
        </div>
      )}

      {o && <ReturnItemsModal key={`${o.id}-${o.items.map((i) => i.returned ?? 0).join(".")}`} order={o} open={returning} onClose={() => setReturning(false)} />}
      <Modal open={editing} onClose={() => setEditing(false)} wide title={`Edit order ${id}`}>
        {editing && o && <EditOrderForm key={o.id} o={o} onDone={() => setEditing(false)} />}
      </Modal>
    </>
  );
}
