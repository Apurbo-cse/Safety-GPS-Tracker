"use client";
import { useState } from "react";
import { toast } from "sonner";
import Modal from "@/components/common/Modal";
import { inputCls } from "@/components/forms/Field";
import type { AdminOrder } from "@/lib/api";
import { errorMessage, useReturnItemsMutation } from "@/store/apiSlice";
import { formatBDT } from "@/utils/format";

/** Staff record items that came back: how many of each, and whether they can be sold again or are damaged. */
export default function ReturnItemsModal({ order, open, onClose }: { order: AdminOrder; open: boolean; onClose: () => void }) {
  const lines = order.items.filter((i) => i.kind === "device" && i.lineId && i.qty - (i.returned ?? 0) > 0);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [damaged, setDamaged] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState("");
  const [send, { isLoading }] = useReturnItemsMutation();

  const picked = lines.filter((l) => (qty[l.lineId!] ?? 0) > 0);
  const submit = async () => {
    if (!picked.length) return;
    try {
      await send({ id: order.id, lines: picked.map((l) => ({ lineId: l.lineId!, qty: qty[l.lineId!], damaged: !!damaged[l.lineId!] })), note: note.trim() || undefined }).unwrap();
      toast.success("Return recorded");
      setQty({}); setDamaged({}); setNote(""); onClose();
    } catch (e) { toast.error(errorMessage(e, "Could not record the return")); }
  };

  return (
    <Modal open={open} onClose={onClose} wide title={`Return items — ${order.id}`}>
      {lines.length === 0 ? <p className="text-sm text-body">Nothing left to return on this order.</p> : (
        <form onSubmit={(e) => { e.preventDefault(); void submit(); }} className="space-y-4">
          <p className="text-sm text-body">Choose how many units came back. Units in good condition go back on the shelf; <strong>damaged</strong> ones are only recorded and do not add to stock.</p>
          <ul className="space-y-2">
            {lines.map((l) => {
              const left = l.qty - (l.returned ?? 0);
              const id = l.lineId!;
              return (
                <li key={id} className="rounded-lg bg-softer/80 p-3 dark:bg-navy-900/90">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="min-w-0"><span className="block truncate text-sm font-semibold text-ink">{l.name}</span><span className="text-xs text-slate-500">{formatBDT(l.price)} · bought {l.qty}{l.returned ? ` · ${l.returned} already returned` : ""}</span></span>
                    <span className="flex items-center gap-2">
                      <button type="button" onClick={() => setQty((s) => ({ ...s, [id]: left }))} className="text-xs font-semibold text-brand-600 hover:underline">All ({left})</button>
                      <input aria-label={`Units returned of ${l.name}`} className={`${inputCls} !w-20 text-center`} inputMode="numeric" value={qty[id] ?? ""} placeholder="0"
                        onChange={(e) => { const n = Math.min(left, Number(e.target.value.replace(/\D/g, "")) || 0); setQty((s) => ({ ...s, [id]: n })); }} />
                    </span>
                  </div>
                  {(qty[id] ?? 0) > 0 && (
                    <label className="mt-2 flex items-center gap-2 text-sm text-body"><input type="checkbox" checked={!!damaged[id]} onChange={(e) => setDamaged((s) => ({ ...s, [id]: e.target.checked }))} className="h-4 w-4 accent-brand-500" />These units are damaged — don&apos;t put them back in stock</label>
                  )}
                </li>
              );
            })}
          </ul>
          <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Note (optional)</span><input className={inputCls} value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Customer changed their mind" /></label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:text-ink">Cancel</button>
            <button type="submit" disabled={!picked.length || isLoading} className="h-10 rounded-lg bg-brand-500 px-5 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? "Saving…" : "Record return"}</button>
          </div>
        </form>
      )}
    </Modal>
  );
}
