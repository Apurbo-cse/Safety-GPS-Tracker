"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCheck, Inbox, Mail, Phone, RotateCcw, Trash2 } from "lucide-react";
import type { AdminMessage } from "@/lib/api";
import { errorMessage, useAdminMessagesQuery, useDeleteMessageMutation, useSetMessageStatusMutation } from "@/store/apiSlice";
import { cn } from "@/utils/format";
import { CARD, EmptyState, ErrorState, PageHeader, Pagination, Skeleton, fmtDateTime, view } from "./ui";

const LIMIT = 15;
type Filter = "all" | "new" | "handled";
const DEPT: Record<string, string> = { sales: "Sales", support: "Support", billing: "Billing" };

export default function MessagesAdminView() {
  const [status, setStatus] = useState<Filter>("new");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null);
  const list = view(useAdminMessagesQuery({ status, page, limit: LIMIT }));
  const [setState] = useSetMessageStatusMutation();
  const [remove] = useDeleteMessageMutation();
  const counts = list.data?.counts ?? {};
  const act = (p: Promise<unknown>, ok?: string) => p.then(() => ok && toast.success(ok)).catch((e) => toast.error(errorMessage(e, "Could not update")));

  return (
    <>
      <PageHeader title="Messages" subtitle="Messages and call-back requests from the website's Contact page. New ones appear here the moment they are sent." />
      <div role="tablist" aria-label="Filter messages" className="mb-4 inline-flex rounded-full bg-softer/80 p-1 dark:bg-navy-900/90">
        {([["new", "New", counts.new], ["handled", "Handled", counts.handled], ["all", "All", (counts.new ?? 0) + (counts.handled ?? 0)]] as const).map(([k, l, n]) => (
          <button key={k} role="tab" aria-selected={status === k} onClick={() => { setStatus(k); setPage(1); }} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold transition-colors", status === k ? "bg-brand-500 text-white" : "text-body hover:text-ink")}>{l} <span className="opacity-70">{n ?? 0}</span></button>
        ))}
      </div>

      {list.error ? <ErrorState message={list.error} onRetry={list.reload} /> : !list.data ? <Skeleton rows={4} /> : list.data.items.length === 0 ? (
        <div className={CARD}><EmptyState icon={Inbox} title={status === "new" ? "No new messages" : "No messages here"} text="Messages sent from the Contact page show up here." /></div>
      ) : (
        <ul className={cn("space-y-2 transition-opacity", list.loading && "opacity-60")}>
          {list.data.items.map((m) => <Row key={m.id} m={m} open={open === m.id} onToggle={() => setOpen(open === m.id ? null : m.id)}
            onStatus={(s) => void act(setState({ id: m.id, status: s }).unwrap())}
            onDelete={() => { if (window.confirm(`Delete the message from ${m.name}?`)) void act(remove(m.id).unwrap(), "Deleted"); }} />)}
        </ul>
      )}
      {list.data && <Pagination page={list.data.page} limit={list.data.limit} total={list.data.total} onPage={setPage} />}
    </>
  );
}

function Row({ m, open, onToggle, onStatus, onDelete }: { m: AdminMessage; open: boolean; onToggle: () => void; onStatus: (s: "new" | "handled") => void; onDelete: () => void }) {
  const isNew = m.status === "new";
  return (
    <li className={`${CARD} overflow-hidden`}>
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 p-3.5 text-left sm:px-5">
        <span aria-hidden className={cn("h-2.5 w-2.5 shrink-0 rounded-full", isNew ? "bg-brand-500" : "bg-slate-300 dark:bg-slate-600")} />
        <span className="min-w-0 flex-1 basis-56">
          <span className={cn("block truncate text-sm text-ink", isNew ? "font-black" : "font-semibold")}>{m.name} <span className="font-normal text-slate-500">· {m.kind === "lead" ? "Call-back request" : DEPT[m.department] ?? m.department}</span></span>
          <span className="block truncate text-xs text-slate-500">{m.subject || m.message}</span>
        </span>
        <span className="text-xs text-slate-500">{fmtDateTime(m.createdAt)}</span>
      </button>
      {open && (
        <div className="space-y-3 px-5 pb-5">
          <p className="whitespace-pre-wrap rounded-lg bg-surface p-4 text-sm leading-relaxed text-ink dark:bg-navy-950/70">{m.message}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <a href={`tel:${m.phone}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface px-3 font-semibold text-ink hover:text-brand-600 dark:bg-navy-950/70"><Phone className="h-4 w-4" />{m.phone}</a>
            {m.email && <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "your message"}`)}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface px-3 font-semibold text-ink hover:text-brand-600 dark:bg-navy-950/70"><Mail className="h-4 w-4" />{m.email}</a>}
            {m.fleet && <span className="text-xs text-slate-500">Fleet: {m.fleet}</span>}
            <span className="ml-auto flex items-center gap-1">
              {isNew
                ? <button onClick={() => onStatus("handled")} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-500 px-3 font-semibold text-white hover:bg-brand-600"><CheckCheck className="h-4 w-4" />Mark handled</button>
                : <button onClick={() => onStatus("new")} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 font-semibold text-body hover:text-ink"><RotateCcw className="h-4 w-4" />Mark as new</button>}
              <button onClick={onDelete} aria-label={`Delete message from ${m.name}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-red-500/10 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </span>
          </div>
        </div>
      )}
    </li>
  );
}
