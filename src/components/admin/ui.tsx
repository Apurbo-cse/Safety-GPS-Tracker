"use client";
import { AlertCircle, RefreshCw, type LucideIcon } from "lucide-react";
import type { OrderStatus } from "@/lib/api";
import { cn } from "@/utils/format";

export const CARD = "rounded-lg bg-softer/80 dark:bg-navy-900/90";
export const ROW = "rounded-lg bg-surface dark:bg-navy-950/70";

export const STATUS: Record<OrderStatus, { label: string; cls: string; dot: string }> = {
  received: { label: "Received", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  confirmed: { label: "Confirmed", cls: "bg-sky-500/15 text-sky-700 dark:text-sky-300", dot: "bg-sky-500" },
  scheduled: { label: "Scheduled", cls: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300", dot: "bg-indigo-500" },
  active: { label: "Active", cls: "bg-green-500/15 text-green-700 dark:text-green-300", dot: "bg-green-500" },
  cancelled: { label: "Cancelled", cls: "bg-red-500/15 text-red-700 dark:text-red-300", dot: "bg-red-500" },
};
export const STATUS_ORDER: OrderStatus[] = ["received", "confirmed", "scheduled", "active", "cancelled"];

export function StatusBadge({ status }: { status: OrderStatus }) {
  const m = STATUS[status];
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", m.cls)}><span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />{m.label}</span>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">{title}</h1>{subtitle && <p className="mt-1 text-sm text-body">{subtitle}</p>}</div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, hint, tone = "brand" }: { icon: LucideIcon; label: string; value: string; hint?: string; tone?: "brand" | "green" | "sky" | "amber" }) {
  const tones = { brand: "bg-brand-500/10 text-brand-600 dark:text-brand-400", green: "bg-green-500/10 text-green-600", sky: "bg-sky-500/10 text-sky-600", amber: "bg-amber-500/10 text-amber-600" };
  return (
    <div className={`${CARD} p-5`}>
      <span className={cn("grid h-10 w-10 place-items-center rounded-lg", tones[tone])}><Icon className="h-5 w-5" /></span>
      <p className="mt-3 truncate text-2xl font-black tracking-tight text-ink">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wider text-body">{label}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Switch({ on, onChange, label, disabled }: { on: boolean; onChange: () => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} disabled={disabled} onClick={onChange}
      className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50", on ? "bg-brand-500" : "bg-line-strong dark:bg-navy-700")}>
      <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow transition-transform", on ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}

export function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text?: string }) {
  return (
    <div className="grid place-items-center px-4 py-14 text-center">
      <Icon className="h-10 w-10 text-slate-400" />
      <p className="mt-3 text-base font-bold text-ink">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-body">{text}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className={`${CARD} grid place-items-center p-10 text-center`}>
      <AlertCircle className="h-10 w-10 text-amber-500" />
      <p className="mt-3 text-base font-bold text-ink">Couldn&apos;t load this</p>
      <p className="mt-1 max-w-sm text-sm text-body">{message}</p>
      <button onClick={onRetry} className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-semibold text-white hover:bg-brand-600"><RefreshCw className="h-4 w-4" />Retry</button>
    </div>
  );
}

export function Skeleton({ rows = 4 }: { rows?: number }) {
  return <div className="space-y-3" aria-busy="true" aria-label="Loading">{Array.from({ length: rows }, (_, i) => <div key={i} className="skeleton h-16 w-full rounded-lg" />)}</div>;
}

export function Pagination({ page, limit, total, onPage }: { page: number; limit: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (total <= limit) return <p className="mt-4 text-xs text-slate-500">{total} result{total === 1 ? "" : "s"}</p>;
  const btn = "inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40";
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-slate-500">Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</p>
      <div className="flex items-center gap-2">
        <button className={`${btn} bg-surface text-ink hover:text-brand-600 dark:bg-navy-950/70`} disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
        <span className="text-sm text-body">Page {page} of {pages}</span>
        <button className={`${btn} bg-surface text-ink hover:text-brand-600 dark:bg-navy-950/70`} disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

import { errorMessage } from "@/store/apiSlice";
/** Adapts an RTK Query result to what the admin screens use: data, a message, a "refreshing" flag and a retry. */
export function view<Q extends { data?: unknown; error?: unknown; isFetching: boolean; refetch: () => unknown }>(q: Q) {
  return { data: (q.data ?? null) as Exclude<Q["data"], undefined> | null, error: q.error ? errorMessage(q.error, "Could not load") : null, loading: q.isFetching, reload: () => { void q.refetch(); } };
}

export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
export const fmtDateTime = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
