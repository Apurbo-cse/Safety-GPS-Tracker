"use client";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink, FileText, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import { inputCls } from "@/components/forms/Field";
import type { AdminPageFull } from "@/lib/api";
import { errorMessage, useAdminPageQuery, useAdminPagesQuery, useDeletePageMutation, useSavePageMutation } from "@/store/apiSlice";
import { slug } from "@/utils/format";
import RichEditor, { tokensIn } from "./RichEditor";
import { useUploadCleanup } from "./useUploadCleanup";
import { CARD, EmptyState, ErrorState, PageHeader, Skeleton, fmtDate, view } from "./ui";

const urlOf = (id: string) => (id === "privacy" || id === "terms" ? `/${id}` : `/page/${id}`);

export default function PagesAdminView() {
  const list = view(useAdminPagesQuery());
  const [remove] = useDeletePageMutation();
  const [editing, setEditing] = useState<{ id: string | null } | null>(null);
  return (
    <>
      <PageHeader title="Pages" subtitle="Privacy, Terms and any other text page (like a Refund policy). Use headings to split a page into numbered sections."
        actions={<button onClick={() => setEditing({ id: null })} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"><Plus className="h-4 w-4" />New page</button>} />
      {list.error ? <ErrorState message={list.error} onRetry={list.reload} /> : !list.data ? <Skeleton rows={3} /> : list.data.length === 0 ? (
        <div className={CARD}><EmptyState icon={FileText} title="No pages yet" /></div>
      ) : (
        <ul className="space-y-2">
          {list.data.map((p) => (
            <li key={p.id} className={`${CARD} flex flex-wrap items-center gap-x-4 gap-y-2 p-3.5 sm:px-5`}>
              <div className="min-w-0 flex-1 basis-56">
                <p className="flex items-center gap-2 truncate text-sm font-bold text-ink">{p.title}{p.system && <span className="inline-flex items-center gap-1 rounded bg-slate-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300"><Lock className="h-3 w-3" />Built-in</span>}{!p.published && <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">Hidden</span>}</p>
                <p className="truncate text-xs text-slate-500"><span className="font-mono">{urlOf(p.id)}</span> · updated {fmtDate(p.updatedAt)}</p>
              </div>
              <div className="flex items-center gap-1">
                <a href={urlOf(p.id)} target="_blank" rel="noopener noreferrer" aria-label={`View ${p.title}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-surface hover:text-brand-600 dark:hover:bg-navy-950"><ExternalLink className="h-4 w-4" /></a>
                <button onClick={() => setEditing({ id: p.id })} aria-label={`Edit ${p.title}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-surface hover:text-brand-600 dark:hover:bg-navy-950"><Pencil className="h-4 w-4" /></button>
                <button disabled={p.system} title={p.system ? "Built-in pages can be edited but not deleted" : undefined}
                  onClick={() => { if (window.confirm(`Delete “${p.title}” permanently?`)) void remove(p.id).unwrap().then(() => toast.success("Deleted")).catch((e) => toast.error(errorMessage(e, "Could not delete"))); }}
                  aria-label={`Delete ${p.title}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-red-500/10 hover:text-red-600 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Modal open={!!editing} onClose={() => setEditing(null)} wide title={editing?.id ? "Edit page" : "New page"}>
        {editing && <PageEditor key={editing.id ?? "new"} id={editing.id} onDone={() => setEditing(null)} />}
      </Modal>
    </>
  );
}

function PageEditor({ id, onDone }: { id: string | null; onDone: () => void }) {
  const q = useAdminPageQuery(id ?? "", { skip: !id });
  if (id && q.isLoading) return <div className="p-5"><Skeleton rows={3} /></div>;
  if (id && !q.data) return <div className="p-5"><ErrorState message={q.error ? errorMessage(q.error) : "Page not found"} onRetry={() => void q.refetch()} /></div>;
  return <PageForm initial={q.data ?? null} onDone={onDone} />;
}

function PageForm({ initial, onDone }: { initial: AdminPageFull | null; onDone: () => void }) {
  const isNew = !initial;
  const [v, setV] = useState({ id: initial?.id ?? "", title: initial?.title ?? "", published: initial?.published ?? true });
  const [content, setContent] = useState(initial?.content ?? "");
  const [error, setError] = useState<string | null>(null);
  const [save, { isLoading }] = useSavePageMutation();
  const cleanup = useUploadCleanup(tokensIn(initial?.content ?? ""), () => tokensIn(content));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const pid = isNew ? (v.id || slug(v.title)).slice(0, 60) : initial.id;
    if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(pid)) { setError("The link name must be 2–60 characters: lower-case letters, numbers and dashes"); return; }
    try { await save({ id: pid, body: { title: v.title.trim(), content, published: v.published } }).unwrap(); cleanup.markSaved(); toast.success(isNew ? "Page created" : "Page saved"); onDone(); }
    catch (err) { setError(errorMessage(err, "Could not save")); }
  };
  return (
    <form onSubmit={submit} className="grid gap-4 p-5">
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Title</span><input className={inputCls} value={v.title} onChange={(e) => setV((s) => ({ ...s, title: e.target.value }))} required minLength={2} maxLength={120} /></label>
      <div>
        <span className="mb-1.5 block text-sm font-medium text-body-strong">Text</span>
        <RichEditor value={initial?.content ?? ""} onChange={setContent} onUploaded={cleanup.track} height={380} placeholder="Write the page…" />
        <p className="mt-1.5 text-xs text-slate-500">Every <b>Heading</b> (choose it from the style menu) starts a numbered section with its own link. You can type <code>{"{{name}}"}</code>, <code>{"{{phone}}"}</code>, <code>{"{{email}}"}</code> and <code>{"{{address}}"}</code> — they are filled in from Site details.</p>
      </div>
      <label className="flex items-center gap-3"><input type="checkbox" className="h-4 w-4 accent-brand-600" checked={v.published} onChange={(e) => setV((s) => ({ ...s, published: e.target.checked }))} disabled={initial?.system} /><span className="text-sm font-medium text-ink">Visible on the website</span></label>
      {isNew && <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Link name <span className="font-normal text-slate-500">(optional — made from the title; the page will be at /page/<i>name</i>)</span></span><input className={inputCls} value={v.id} onChange={(e) => setV((s) => ({ ...s, id: e.target.value }))} placeholder={slug(v.title) || "refund-policy"} /></label>}
      {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:text-ink">Cancel</button>
        <button type="submit" disabled={isLoading} className="h-10 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? "Saving…" : "Save page"}</button>
      </div>
    </form>
  );
}
