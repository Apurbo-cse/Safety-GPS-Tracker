"use client";
import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { useAdminCustomersQuery } from "@/store/apiSlice";
import ExportButton from "./ExportButton";
import { cn, formatBDT } from "@/utils/format";
import { CARD, EmptyState, ErrorState, PageHeader, Pagination, Skeleton, fmtDate, view } from "./ui";

const LIMIT = 20;

export default function CustomersAdminView() {
  const [term, setTerm] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => { const t = setTimeout(() => { setQ(term.trim()); setPage(1); }, 350); return () => clearTimeout(t); }, [term]);
  const { data, error, loading, reload } = view(useAdminCustomersQuery({ q: q || undefined, page, limit: LIMIT }));

  return (
    <>
      <PageHeader title="Customers" subtitle="Everyone with an account." actions={
        <>
        <ExportButton kind="customers" />
        <div className="relative w-64 max-w-full" role="search">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Name, email or mobile" aria-label="Search customers" className="h-10 w-full rounded-lg bg-softer/80 pl-9 pr-3 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:bg-navy-900/90" />
        </div>
        </>} />

      {error ? <ErrorState message={error} onRetry={reload} /> : !data ? <Skeleton rows={5} /> : (
        <div className={`${CARD} overflow-hidden`}>
          {data.customers.length === 0 ? <EmptyState icon={Users} title="No customers found" text={q ? "Try a different search." : "Accounts created on the website appear here."} /> : (
            <div className={cn("overflow-x-auto", loading && "opacity-60")}>
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead><tr className="text-xs font-semibold uppercase tracking-wider text-slate-500"><th className="px-5 py-3">Customer</th><th className="px-3 py-3">Contact</th><th className="px-3 py-3">Division</th><th className="px-3 py-3 text-right">Orders</th><th className="px-3 py-3 text-right">Spent</th><th className="px-3 py-3">Joined</th></tr></thead>
                <tbody>
                  {data.customers.map((c) => (
                    <tr key={c.id}>
                      <td className="px-5 py-3"><span className="flex items-center gap-2 font-semibold text-ink">{c.name}{c.role === "admin" && <span className="rounded bg-brand-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-600 dark:text-brand-400">Admin</span>}</span></td>
                      <td className="px-3 py-3 text-body"><span className="block">{c.email}</span><span className="block text-xs text-slate-500">{c.phone ?? "—"}</span></td>
                      <td className="px-3 py-3 text-body">{c.division}</td>
                      <td className="px-3 py-3 text-right font-bold tabular-nums text-ink">{c.orders}</td>
                      <td className="px-3 py-3 text-right tabular-nums text-ink">{formatBDT(c.spent)}</td>
                      <td className="px-3 py-3 text-xs text-slate-500">{fmtDate(c.createdAt)}</td>
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
