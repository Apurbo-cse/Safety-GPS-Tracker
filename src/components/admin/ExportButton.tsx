"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { errorMessage, useExportCsvMutation } from "@/store/apiSlice";

/** Downloads a spreadsheet (CSV) of orders, customers or products. Orders can be limited to a date range. */
export default function ExportButton({ kind, range = false }: { kind: "orders" | "customers" | "products"; range?: boolean }) {
  const [exportCsv, { isLoading }] = useExportCsvMutation();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const run = async () => {
    try {
      const text = await exportCsv({ kind, from: from || undefined, to: to || undefined }).unwrap();
      const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url; a.download = `${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("Spreadsheet downloaded");
    } catch (e) { toast.error(errorMessage(e, "Could not export")); }
  };

  const date = "h-10 rounded-lg bg-softer/80 px-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:bg-navy-900/90";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {range && (
        <>
          <input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} aria-label="Export from date" className={date} />
          <span className="text-xs text-slate-500">to</span>
          <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} aria-label="Export to date" className={date} />
        </>
      )}
      <button type="button" onClick={() => void run()} disabled={isLoading} className="inline-flex h-10 items-center gap-2 rounded-lg bg-softer/80 px-4 text-sm font-semibold text-ink hover:text-brand-600 disabled:opacity-60 dark:bg-navy-900/90">
        <Download className="h-4 w-4" />{isLoading ? "Preparing…" : "Export CSV"}
      </button>
    </div>
  );
}
