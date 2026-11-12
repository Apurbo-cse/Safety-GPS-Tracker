"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { AlertCircle, ArrowRight, Calendar, Car, Check, ChevronDown, MapPin, Package, Phone, Receipt, RefreshCw, RotateCcw, X } from "lucide-react";
import { useSite } from "@/components/providers/SiteProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, setQty } from "@/store/slices/cartSlice";
import type { Order, OrderStatus } from "@/store/slices/ordersSlice";
import { errorMessage, useCancelOrderMutation, useMyOrdersQuery } from "@/store/apiSlice";
import { cn, formatBDT } from "@/utils/format";
import AccountShell, { CARD } from "./AccountShell";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "received", label: "Received" },
  { key: "confirmed", label: "Confirmed" },
  { key: "scheduled", label: "Installation" },
  { key: "active", label: "Tracking live" },
];
const STATUS_STYLE: Record<OrderStatus, string> = {
  received: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  confirmed: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  scheduled: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  active: "bg-green-500/15 text-green-700 dark:text-green-300",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-300",
};
const STATUS_LABEL: Record<OrderStatus, string> = { received: "Received", confirmed: "Confirmed", scheduled: "Installation scheduled", active: "Active", cancelled: "Cancelled" };
type Filter = "all" | "open" | "cancelled";
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function Tracker({ status }: { status: OrderStatus }) {
  const cur = STEPS.findIndex((s) => s.key === status);
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Order progress">
      {STEPS.map((s, i) => {
        const done = cur >= 0 && i <= cur;
        return (
          <li key={s.key} className="min-w-0">
            <span className={cn("block h-1.5 rounded-full", done ? "bg-brand-500" : "bg-line-strong/60 dark:bg-navy-700")} />
            <span className={cn("mt-1.5 flex items-center gap-1 truncate text-[11px] font-semibold sm:text-xs", done ? "text-ink" : "text-slate-400")}>
              {done && <Check className="h-3 w-3 shrink-0 text-brand-600" />}{s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function OrderCard({ o }: { o: Order }) {
  const site = useSite();
  const dispatch = useAppDispatch();
  const [cancel, { isLoading: cancelling }] = useCancelOrderMutation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const count = o.items.reduce((n, i) => n + i.qty, 0);

  const reorder = () => {
    o.items.forEach((i) => {
      dispatch(addToCart({ id: i.id, kind: i.kind, name: i.name, price: i.price, monthly: i.monthly }));
      dispatch(setQty({ id: i.id, qty: i.qty }));
    });
    toast.success("Items added to your cart");
    router.push("/checkout");
  };

  return (
    <article className={`${CARD} overflow-hidden`}>
      <div className="flex flex-wrap items-start justify-between gap-3 p-5">
        <div>
          <p className="text-xs text-slate-500">Order · {fmtDate(o.createdAt)}</p>
          <h3 className="text-lg font-black tracking-tight text-ink">{o.id}</h3>
        </div>
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_STYLE[o.status])}>{STATUS_LABEL[o.status]}</span>
      </div>

      {o.status !== "cancelled" && <div className="px-5"><Tracker status={o.status} /></div>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-5 pb-5">
        <p className="text-sm text-body"><b className="text-ink">{count}</b> item{count === 1 ? "" : "s"} · <b className="text-ink">{formatBDT(o.deviceTotal - o.discount)}</b>{o.discount > 0 && <span className="text-green-600"> (−{formatBDT(o.discount)} {o.couponCode})</span>} + {formatBDT(o.monthlyTotal)}/mo · {o.payment}</p>
        <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
          {open ? "Hide details" : "Details"}<ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="grid gap-4 bg-black/[0.02] p-5 dark:bg-white/[0.02] md:grid-cols-2">
              <ul className="space-y-2">
                {o.items.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3 rounded-lg bg-surface p-3 text-sm dark:bg-navy-950/70">
                    <span className="min-w-0"><span className="block truncate font-semibold text-ink">{i.name}</span><span className="text-xs text-slate-500">{i.qty} × {formatBDT(i.price)}{i.monthly ? ` + ${formatBDT(i.monthly)}/mo` : ""}</span></span>
                    <span className="font-bold tabular-nums text-ink">{formatBDT(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="space-y-2.5 text-sm">
                <div className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /><span><dt className="sr-only">Address</dt><dd className="text-ink">{o.contact.address}, {o.contact.division}</dd></span></div>
                <div className="flex gap-2.5"><Car className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /><dd className="text-ink">{o.contact.vehicleType} · {o.contact.vehicleReg}</dd></div>
                <div className="flex gap-2.5"><Calendar className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /><dd className="text-ink">Preferred installation: {fmtDate(o.contact.preferredDate)}</dd></div>
                <div className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /><dd className="text-ink">{o.contact.name} · {o.contact.phone}</dd></div>
                <div className="flex gap-2.5"><Receipt className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /><span><dt className="sr-only">Billing</dt><dd className="text-ink">Billed to {o.billing.name}{o.billing.company ? `, ${o.billing.company}` : ""}, {o.billing.address}, {o.billing.division}{o.billing.taxId ? ` · BIN/TIN ${o.billing.taxId}` : ""}</dd></span></div>
                {o.contact.note && <p className="rounded-lg bg-surface p-3 text-xs text-body dark:bg-navy-950/70">“{o.contact.note}”</p>}
              </dl>
            </div>
            <div className="flex flex-wrap gap-2 p-5 pt-0">
              <button onClick={reorder} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-500 px-4 text-xs font-semibold text-white hover:bg-brand-600"><RotateCcw className="h-3.5 w-3.5" />Order again</button>
              <Link href={`/orders/${o.id}/invoice`} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface px-4 text-xs font-semibold text-ink hover:text-brand-600 dark:bg-navy-950/70"><Receipt className="h-3.5 w-3.5" />Invoice</Link>
              <a href={`tel:${site.phone}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface px-4 text-xs font-semibold text-ink hover:text-brand-600 dark:bg-navy-950/70"><Phone className="h-3.5 w-3.5" />Call support</a>
              {o.status === "received" && (
                <button disabled={cancelling} onClick={() => { cancel(o.id).unwrap().then(() => toast.success(`Order ${o.id} cancelled`)).catch((e) => toast.error(errorMessage(e, "Could not cancel the order"))); }} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-semibold text-red-600 hover:bg-red-500/10"><X className="h-3.5 w-3.5" />Cancel order</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default function OrdersView() {
  const user = useAppSelector((s) => s.auth.user);
  // statuses change when our team confirms or schedules an order, so refresh whenever the page opens
  const q = useMyOrdersQuery(undefined, { skip: !user, refetchOnMountOrArgChange: true });
  const orders = q.data ?? [];
  const status = q.isError ? "error" : q.isFetching ? "loading" : "idle";
  const reloadOrders = () => void q.refetch();
  const [filter, setFilter] = useState<Filter>("all");
  const shown = orders.filter((o) => filter === "all" || (filter === "cancelled" ? o.status === "cancelled" : o.status !== "cancelled"));
  const counts = { all: orders.length, open: orders.filter((o) => o.status !== "cancelled").length, cancelled: orders.filter((o) => o.status === "cancelled").length };

  return (
    <AccountShell title="My orders" subtitle="Track installation progress and reorder in one tap." what="your orders">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Filter orders" className="inline-flex rounded-full bg-softer/80 p-1 dark:bg-navy-900/90">
          {(["all", "open", "cancelled"] as const).map((f) => (
            <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)}
              className={cn("rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors", filter === f ? "bg-brand-500 text-white" : "text-body hover:text-ink")}>
              {f} <span className="opacity-70">{counts[f]}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => reloadOrders()} disabled={status === "loading"} aria-label="Refresh orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-body hover:text-ink disabled:opacity-50"><RefreshCw className={cn("h-4 w-4", status === "loading" && "animate-spin")} />Refresh</button>
          <Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">Shop more <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>

      {status === "error" && !orders.length ? (
        <div className={`${CARD} p-10 text-center`}>
          <AlertCircle className="mx-auto h-10 w-10 text-amber-500" />
          <h2 className="mt-3 text-lg font-black text-ink">Couldn&apos;t load your orders</h2>
          <p className="mt-1 text-sm text-body">Check your connection and try again.</p>
          <button onClick={() => reloadOrders()} className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-semibold text-white hover:bg-brand-600"><RefreshCw className="h-4 w-4" />Retry</button>
        </div>
      ) : status === "loading" && !orders.length ? (
        <div className="space-y-4" aria-busy="true">{[0, 1].map((i) => <div key={i} className="skeleton h-40 w-full rounded-lg" />)}</div>
      ) : shown.length === 0 ? (
        <div className={`${CARD} p-10 text-center`}>
          <Package className="mx-auto h-12 w-12 text-slate-400" />
          <h2 className="mt-3 text-xl font-black text-ink">{orders.length ? "No orders here" : "No orders yet"}</h2>
          <p className="mt-1 text-sm text-body">{orders.length ? "Try another filter." : "When you check out, your orders and their progress show up here."}</p>
          {!orders.length && <Link href="/pricing" className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-bold text-white hover:bg-brand-600">Choose a package <ArrowRight className="h-4 w-4" /></Link>}
        </div>
      ) : (
        <div className="space-y-4">{shown.map((o) => <OrderCard key={o.id} o={o} />)}</div>
      )}
    </AccountShell>
  );
}
