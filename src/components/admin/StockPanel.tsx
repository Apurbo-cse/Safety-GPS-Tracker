"use client";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDownRight, ArrowUpRight, ClipboardList, Minus, PackageMinus, PackagePlus, Plus } from "lucide-react";
import Modal from "@/components/common/Modal";
import { inputCls } from "@/components/forms/Field";
import { useCan } from "@/lib/useCan";
import type { StockReason } from "@/lib/api";
import { errorMessage, useChangeStockMutation, useStockHistoryQuery } from "@/store/apiSlice";
import { cn } from "@/utils/format";
import { CARD, fmtDateTime } from "./ui";

type Mode = "add" | "remove" | "set";
const MODES: Record<Mode, { title: string; label: string; cta: string; hint: string; icon: typeof Plus }> = {
  add: { title: "Add stock", label: "Units received", cta: "Add to stock", hint: "New units arrived — they are added to what is there now.", icon: PackagePlus },
  remove: { title: "Remove stock", label: "Units to remove", cta: "Remove from stock", hint: "Lost, broken or taken out — they are taken off what is there now.", icon: PackageMinus },
  set: { title: "Set count", label: "Counted number", cta: "Set stock", hint: "After counting the shelf: the stock becomes exactly this number.", icon: ClipboardList },
};

const REASON: Record<StockReason, string> = {
  initial: "Starting stock", purchase: "Stock added", adjustment: "Stock removed", recount: "Recount", order: "Order", cancel: "Order cancelled", return: "Returned to shelf",
  return_damaged: "Returned damaged", refund: "Order refunded", reopen: "Order reopened",
};

/** Add / remove / set the stock of one product. Used on the product page and in the product list. */
export function StockModal({ id, name, current, mode, onClose }: { id: string; name: string; current: number | null; mode: Mode | null; onClose: () => void }) {
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [change, { isLoading }] = useChangeStockMutation();
  const m = mode ? MODES[mode] : null;
  const n = Number(qty);
  const valid = qty.trim() !== "" && Number.isInteger(n) && n >= (mode === "set" ? 0 : 1);
  const after = !mode || !valid ? null : mode === "set" ? n : (current ?? 0) + (mode === "add" ? n : -n);

  const submit = async () => {
    if (!mode || !valid) return;
    try {
      const r = await change({ id, mode, qty: n, note: note.trim() || undefined }).unwrap();
      toast.success(`Stock is now ${r.stock}`);
      setQty(""); setNote(""); onClose();
    } catch (e) { toast.error(errorMessage(e, "Could not change the stock")); }
  };

  return (
    <Modal open={!!mode} onClose={onClose} title={m ? `${m.title} — ${name}` : ""}>
      {m && (
        <form onSubmit={(e) => { e.preventDefault(); void submit(); }} className="space-y-4">
          <p className="text-sm text-body">{m.hint}</p>
          <div className="flex items-center justify-between rounded-lg bg-softer/80 p-3 text-sm dark:bg-navy-900/90">
            <span className="text-body">In stock now</span><span className="font-bold tabular-nums text-ink">{current ?? "Not counted"}</span>
          </div>
          <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">{m.label}</span>
            <input className={inputCls} inputMode="numeric" autoFocus value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))} placeholder="0" required />
          </label>
          <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Note (optional)</span>
            <input className={inputCls} value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder={mode === "add" ? "e.g. Supplier X, invoice 123" : mode === "remove" ? "e.g. Broken in the warehouse" : "e.g. Shelf count on Friday"} />
          </label>
          {after !== null && <p className={cn("text-sm font-semibold", after < 0 ? "text-red-600" : "text-ink")}>After this: {after < 0 ? "not enough stock to remove that many" : `${after} in stock`}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:text-ink">Cancel</button>
            <button type="submit" disabled={!valid || isLoading || (after !== null && after < 0)} className="h-10 rounded-lg bg-brand-500 px-5 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? "Saving…" : m.cta}</button>
          </div>
        </form>
      )}
    </Modal>
  );
}

/** Current stock with its buttons, and the history of every change underneath. */
export default function StockPanel({ id, name, stock }: { id: string; name: string; stock: number | null }) {
  const canEdit = useCan("products.manage");
  const [mode, setMode] = useState<Mode | null>(null);
  const history = useStockHistoryQuery(id, { skip: !canEdit });
  const rows = history.data ?? [];

  return (
    <section className={`${CARD} p-5`}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Stock</h2>
        <span className={cn("text-2xl font-extrabold tabular-nums", stock === null ? "text-slate-400" : stock <= 0 ? "text-red-600" : stock <= 5 ? "text-amber-600" : "text-ink")}>{stock === null ? "Not counted" : stock}</span>
      </div>
      {canEdit && (
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(MODES) as Mode[]).map((k) => {
            const Icon = MODES[k].icon;
            return <button key={k} type="button" disabled={k === "add" && stock === null || k === "remove" && stock === null} onClick={() => setMode(k)} className="flex h-16 flex-col items-center justify-center gap-1 rounded-lg bg-surface text-xs font-semibold text-ink hover:text-brand-600 disabled:opacity-40 dark:bg-navy-950/70"><Icon className="h-4 w-4" />{MODES[k].title.replace(" stock", "")}</button>;
          })}
        </div>
      )}
      {stock === null && canEdit && <p className="mt-2 text-xs text-slate-500">This product doesn&apos;t count stock yet. Use “Set count” to start.</p>}

      {canEdit && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">History</p>
          {history.isLoading ? <p className="text-sm text-body">Loading…</p> : rows.length === 0 ? <p className="text-sm text-body">No changes recorded yet.</p> : (
            <ul className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
              {rows.map((r) => (
                <li key={r.id} className="flex items-start gap-2.5 rounded-lg bg-surface p-2.5 text-sm dark:bg-navy-950/70">
                  <span className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full", r.delta > 0 ? "bg-green-500/15 text-green-600" : r.delta < 0 ? "bg-red-500/15 text-red-600" : "bg-amber-500/15 text-amber-600")}>
                    {r.delta > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : r.delta < 0 ? <ArrowDownRight className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2"><span className="font-semibold text-ink">{REASON[r.reason]}{r.reason === "return_damaged" ? ` · ${r.damaged}` : ""}</span><span className="font-bold tabular-nums text-ink">{r.delta > 0 ? `+${r.delta}` : r.delta === 0 ? "0" : r.delta}</span></span>
                    <span className="block truncate text-xs text-slate-500">{fmtDateTime(r.createdAt)}{r.by ? ` · ${r.by}` : ""}{r.orderId ? ` · ${r.orderId}` : ""} · now {r.stockAfter}</span>
                    {r.note && <span className="block text-xs text-body">{r.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <StockModal id={id} name={name} current={stock} mode={mode} onClose={() => setMode(null)} />
    </section>
  );
}
