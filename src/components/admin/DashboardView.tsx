"use client";
import Link from "next/link";
import { ArrowRight, Banknote, Package, Repeat, Users } from "lucide-react";
import { api, type AdminStats } from "@/lib/api";
import { formatBDT } from "@/utils/format";
import { CARD, EmptyState, ErrorState, PageHeader, Skeleton, StatCard, StatusBadge, STATUS, STATUS_ORDER, fmtDateTime, useLoad } from "./ui";

/** 14-day bar chart (orders per day) — plain SVG, no chart library. */
function DailyChart({ daily }: { daily: AdminStats["daily"] }) {
  const W = 640, H = 200, L = 28, B = 26, T = 10;
  const max = Math.max(3, ...daily.map((d) => d.orders));
  const step = (W - L) / daily.length;
  const total = daily.reduce((n, d) => n + d.orders, 0);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Orders per day over the last 14 days, ${total} in total`}>
      {[0, 0.5, 1].map((t) => { const y = T + (1 - t) * (H - T - B); return (
        <g key={t}><line x1={L} x2={W} y1={y} y2={y} stroke="currentColor" className="text-line-strong" strokeOpacity=".5" strokeDasharray={t ? "3 4" : undefined} /><text x={L - 6} y={y + 4} textAnchor="end" fontSize="10" fill="currentColor" className="text-slate-500">{Math.round(max * t)}</text></g>
      ); })}
      {daily.map((d, i) => {
        const h = (d.orders / max) * (H - T - B);
        const x = L + i * step + step * 0.18;
        return (
          <g key={d.date}>
            <title>{`${d.date}: ${d.orders} order${d.orders === 1 ? "" : "s"}${d.revenue ? `, ${formatBDT(d.revenue)}` : ""}`}</title>
            <rect x={x} y={H - B - Math.max(h, d.orders ? 2 : 0)} width={step * 0.64} height={Math.max(h, d.orders ? 2 : 0)} rx="4" fill="#f05a22" opacity={d.orders ? 1 : 0.15} />
            {(i % 2 === 0 || i === daily.length - 1) && <text x={x + step * 0.32} y={H - 8} textAnchor="middle" fontSize="10" fill="currentColor" className="text-slate-500">{d.date.slice(8)}/{d.date.slice(5, 7)}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export default function DashboardView() {
  const stats = useLoad(() => api.admin.stats(), []);
  const recent = useLoad(() => api.admin.orders({ limit: 6 }), []);
  const s = stats.data;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="What's happening with orders and customers." actions={
        <Link href="/admin/orders?status=received" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600">
          {s?.orders.byStatus.received ? `${s.orders.byStatus.received} new order${s.orders.byStatus.received === 1 ? "" : "s"} to confirm` : "Review orders"}<ArrowRight className="h-4 w-4" />
        </Link>} />

      {stats.error ? <ErrorState message={stats.error} onRetry={stats.reload} /> : !s ? <Skeleton rows={2} /> : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Banknote} label="Device sales" value={formatBDT(s.revenue)} hint="Orders not cancelled" />
            <StatCard icon={Package} label="Orders" value={String(s.orders.total)} hint={`${s.orders.byStatus.active ?? 0} active`} tone="sky" />
            <StatCard icon={Repeat} label="Monthly recurring" value={formatBDT(s.monthlyActive)} hint={`+ ${formatBDT(s.monthlyPipeline)}/mo in the pipeline`} tone="green" />
            <StatCard icon={Users} label="Customers" value={String(s.customers)} hint={`${s.newCustomers7d} new this week`} tone="amber" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <section className={`${CARD} p-5 sm:p-6`}>
              <h2 className="text-lg font-black tracking-tight text-ink">Orders, last 14 days</h2>
              <p className="mb-3 text-xs text-slate-500">Bangladesh time</p>
              <DailyChart daily={s.daily} />
            </section>
            <section className={`${CARD} p-5 sm:p-6`}>
              <h2 className="text-lg font-black tracking-tight text-ink">Order pipeline</h2>
              <ul className="mt-4 space-y-3">
                {STATUS_ORDER.map((k) => {
                  const n = s.orders.byStatus[k] ?? 0;
                  return (
                    <li key={k}>
                      <Link href={`/admin/orders?status=${k}`} className="group block">
                        <div className="flex items-center justify-between text-sm"><span className="font-medium text-ink group-hover:text-brand-600">{STATUS[k].label}</span><span className="font-bold tabular-nums text-ink">{n}</span></div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line-strong/40 dark:bg-navy-700"><div className={`h-full rounded-full ${STATUS[k].dot}`} style={{ width: `${s.orders.total ? (n / s.orders.total) * 100 : 0}%` }} /></div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </>
      )}

      <section className={`${CARD} mt-6 p-5 sm:p-6`}>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black tracking-tight text-ink">Latest orders</h2><Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">All orders <ArrowRight className="h-4 w-4" /></Link></div>
        {recent.error ? <ErrorState message={recent.error} onRetry={recent.reload} /> : !recent.data ? <Skeleton rows={3} /> : recent.data.orders.length === 0 ? (
          <EmptyState icon={Package} title="No orders yet" text="Orders placed on the website show up here." />
        ) : (
          <ul className="space-y-2">
            {recent.data.orders.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders?q=${o.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-surface p-3 transition-all hover:-translate-y-0.5 dark:bg-navy-950/70">
                  <span className="w-24 font-mono text-sm font-bold text-ink">{o.id}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-body">{o.customer.name} · {o.items.reduce((n, i) => n + i.qty, 0)} item(s)</span>
                  <span className="text-sm font-bold tabular-nums text-ink">{formatBDT(o.deviceTotal)}</span>
                  <span className="hidden text-xs text-slate-500 sm:block">{fmtDateTime(o.createdAt)}</span>
                  <StatusBadge status={o.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
