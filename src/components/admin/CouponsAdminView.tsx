"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Percent, Plus, Trash2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import { inputCls } from "@/components/forms/Field";
import type { AdminCoupon } from "@/lib/api";
import { errorMessage, useAdminCouponsQuery, useDeleteCouponMutation, useSaveCouponMutation } from "@/store/apiSlice";
import { cn, formatBDT } from "@/utils/format";
import { CARD, EmptyState, ErrorState, PageHeader, Skeleton, Switch, fmtDate, view } from "./ui";

const toLocal = (iso: string | null) => { if (!iso) return ""; const d = new Date(iso); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
const describe = (c: AdminCoupon) => `${c.kind === "percent" ? `${c.value}% off` : `${formatBDT(c.value)} off`}${c.minTotal ? ` · min ${formatBDT(c.minTotal)}` : ""}`;
const state = (c: AdminCoupon) => !c.active ? "Off" : c.expiresAt && new Date(c.expiresAt) <= new Date() ? "Expired" : c.maxUses !== null && c.used >= c.maxUses ? "Used up" : "Live";

export default function CouponsAdminView() {
  const list = view(useAdminCouponsQuery());
  const [save] = useSaveCouponMutation();
  const [remove] = useDeleteCouponMutation();
  const [editing, setEditing] = useState<{ coupon: AdminCoupon | null } | null>(null);
  const toggle = (c: AdminCoupon) => void save({ code: c.code, body: { kind: c.kind, value: c.value, minTotal: c.minTotal, maxUses: c.maxUses, expiresAt: c.expiresAt, active: !c.active, note: c.note } }).unwrap().catch((e) => toast.error(errorMessage(e, "Could not update")));
  return (
    <>
      <PageHeader title="Coupons" subtitle="Discount codes customers type at checkout. They take money off the device price; monthly charges are never discounted."
        actions={<button onClick={() => setEditing({ coupon: null })} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"><Plus className="h-4 w-4" />New coupon</button>} />
      {list.error ? <ErrorState message={list.error} onRetry={list.reload} /> : !list.data ? <Skeleton rows={3} /> : list.data.length === 0 ? (
        <div className={CARD}><EmptyState icon={Percent} title="No coupons yet" text="Create a code like WELCOME10 for 10% off." /></div>
      ) : (
        <ul className="space-y-2">
          {list.data.map((c) => {
            const st = state(c);
            return (
              <li key={c.code} className={cn(`${CARD} flex flex-wrap items-center gap-x-4 gap-y-2 p-3.5 sm:px-5`, st !== "Live" && "opacity-70")}>
                <div className="min-w-0 flex-1 basis-56">
                  <p className="flex items-center gap-2 text-sm font-bold text-ink"><span className="font-mono">{c.code}</span><span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", st === "Live" ? "bg-green-500/15 text-green-700 dark:text-green-300" : "bg-slate-500/15 text-slate-600 dark:text-slate-300")}>{st}</span></p>
                  <p className="truncate text-xs text-slate-500">{describe(c)} · used {c.used}{c.maxUses !== null ? ` of ${c.maxUses}` : ""}{c.expiresAt ? ` · expires ${fmtDate(c.expiresAt)}` : ""}{c.note ? ` · ${c.note}` : ""}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Switch on={c.active} onChange={() => toggle(c)} label={`${c.code} active`} />
                  <button onClick={() => setEditing({ coupon: c })} aria-label={`Edit ${c.code}`} className="ml-2 grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-surface hover:text-brand-600 dark:hover:bg-navy-950"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => { if (window.confirm(`Delete coupon ${c.code}? Orders that used it keep their discount.`)) void remove(c.code).unwrap().then(() => toast.success("Deleted")).catch((e) => toast.error(errorMessage(e, "Could not delete"))); }} aria-label={`Delete ${c.code}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-red-500/10 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.coupon ? `Edit ${editing.coupon.code}` : "New coupon"}>
        {editing && <CouponForm key={editing.coupon?.code ?? "new"} initial={editing.coupon} onDone={() => setEditing(null)} />}
      </Modal>
    </>
  );
}

function CouponForm({ initial, onDone }: { initial: AdminCoupon | null; onDone: () => void }) {
  const isNew = !initial;
  const [v, setV] = useState({ code: initial?.code ?? "", kind: initial?.kind ?? "percent" as "percent" | "fixed", value: String(initial?.value ?? ""), minTotal: String(initial?.minTotal ?? ""), maxUses: initial?.maxUses == null ? "" : String(initial.maxUses), expires: toLocal(initial?.expiresAt ?? null), note: initial?.note ?? "", active: initial?.active ?? true });
  const [error, setError] = useState<string | null>(null);
  const [save, { isLoading }] = useSaveCouponMutation();
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const value = Number(v.value), min = v.minTotal ? Number(v.minTotal) : 0, max = v.maxUses ? Number(v.maxUses) : null;
    if (!Number.isInteger(value) || value < 1) return setError("Enter the discount as a whole number");
    if (v.kind === "percent" && value > 100) return setError("A percentage can't be more than 100");
    if (!Number.isInteger(min) || min < 0 || (max !== null && (!Number.isInteger(max) || max < 1))) return setError("Minimum spend and uses must be whole numbers");
    try {
      await save({ code: v.code.trim().toUpperCase(), body: { kind: v.kind, value, minTotal: min, maxUses: max, expiresAt: v.expires ? new Date(v.expires).toISOString() : null, active: v.active, note: v.note.trim() } }).unwrap();
      toast.success(isNew ? "Coupon created" : "Coupon saved"); onDone();
    } catch (err) { setError(errorMessage(err, "Could not save")); }
  };
  return (
    <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
      {isNew && <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-medium text-body-strong">Code</span><input className={`${inputCls} font-mono uppercase`} value={v.code} onChange={set("code")} required minLength={3} maxLength={30} placeholder="WELCOME10" /><span className="mt-1 block text-xs text-slate-500">Letters, numbers and dashes. Customers can type it in any case.</span></label>}
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Type</span><select className={inputCls} value={v.kind} onChange={set("kind")}><option value="percent">Percentage off</option><option value="fixed">Fixed amount off (৳)</option></select></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">{v.kind === "percent" ? "Percent" : "Amount (৳)"}</span><input className={inputCls} inputMode="numeric" value={v.value} onChange={set("value")} required /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Minimum device total (৳) <span className="font-normal text-slate-500">optional</span></span><input className={inputCls} inputMode="numeric" value={v.minTotal} onChange={set("minTotal")} /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Total uses <span className="font-normal text-slate-500">optional — empty is unlimited</span></span><input className={inputCls} inputMode="numeric" value={v.maxUses} onChange={set("maxUses")} /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Expires <span className="font-normal text-slate-500">optional</span></span><input type="datetime-local" className={inputCls} value={v.expires} onChange={set("expires")} /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Note <span className="font-normal text-slate-500">for you only</span></span><input className={inputCls} value={v.note} onChange={set("note")} maxLength={120} /></label>
      <label className="flex items-center gap-3 sm:col-span-2"><Switch on={v.active} onChange={() => setV((s) => ({ ...s, active: !s.active }))} label="Active" /><span className="text-sm font-medium text-ink">Active</span></label>
      {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600 sm:col-span-2">{error}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={onDone} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:text-ink">Cancel</button>
        <button type="submit" disabled={isLoading} className="h-10 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? "Saving…" : "Save coupon"}</button>
      </div>
    </form>
  );
}
