"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Newspaper, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import Modal from "@/components/common/Modal";
import ProductImage from "@/components/common/ProductImage";
import { inputCls, textareaCls } from "@/components/forms/Field";
import { mediaUrl, type AdminPost } from "@/lib/api";
import { errorMessage, useAdminPostQuery, useAdminPostsQuery, useDeletePostMutation, useSavePostMutation, useUploadImageMutation } from "@/store/apiSlice";
import { cn, slug } from "@/utils/format";
import RichEditor, { tokensIn } from "./RichEditor";
import { prepareImage } from "./ImageManager";
import { useUploadCleanup } from "./useUploadCleanup";
import { CARD, EmptyState, ErrorState, PageHeader, Pagination, Skeleton, fmtDate, view } from "./ui";

const LIMIT = 12;

type State = "published" | "scheduled" | "draft";
const stateOf = (p: Pick<AdminPost, "published" | "publishedAt">): State =>
  !p.published ? "draft" : p.publishedAt && new Date(p.publishedAt) > new Date() ? "scheduled" : "published";
const BADGE: Record<State, string> = {
  published: "bg-green-500/15 text-green-700 dark:text-green-300",
  scheduled: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  draft: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
};

/** `<input type="datetime-local">` works in local time; the API stores UTC. */
const toLocalInput = (iso: string | null) => { if (!iso) return ""; const d = new Date(iso); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };

export default function PostsAdminView() {
  const [term, setTerm] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<{ id: string | null } | null>(null);
  useEffect(() => { const t = setTimeout(() => { setQ(term.trim()); setPage(1); }, 350); return () => clearTimeout(t); }, [term]);

  const list = view(useAdminPostsQuery({ q: q || undefined, status, page, limit: LIMIT }));
  const [remove] = useDeletePostMutation();
  const del = async (p: AdminPost) => {
    if (!window.confirm(`Delete “${p.title}” permanently?`)) return;
    try { await remove(p.id).unwrap(); toast.success("Deleted"); } catch (e) { toast.error(errorMessage(e, "Could not delete")); }
  };

  return (
    <>
      <PageHeader title="News" subtitle="Posts for the website's News page — write like a social post, with pictures, links and lists."
        actions={<button onClick={() => setEditing({ id: null })} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"><Plus className="h-4 w-4" />New post</button>} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-64" role="search">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search posts" aria-label="Search posts" className="h-10 w-full rounded-lg bg-softer/80 pl-9 pr-3 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:bg-navy-900/90" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }} aria-label="Filter by status" className="h-10 rounded-lg bg-softer/80 px-3 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:bg-navy-900/90">
          <option value="all">All posts</option><option value="published">Published</option><option value="draft">Drafts</option>
        </select>
      </div>

      {list.error ? <ErrorState message={list.error} onRetry={list.reload} /> : !list.data ? <Skeleton rows={4} /> : list.data.items.length === 0 ? (
        <div className={CARD}><EmptyState icon={Newspaper} title="No posts yet" text="Use “New post” to write the first one." /></div>
      ) : (
        <ul className={cn("space-y-2 transition-opacity", list.loading && "opacity-60")}>
          {list.data.items.map((p) => {
            const st = stateOf(p);
            return (
              <li key={p.id} className={`${CARD} flex flex-wrap items-center gap-x-4 gap-y-2 p-3.5 sm:px-5`}>
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-surface dark:bg-navy-950/70">
                  {p.cover ? <ProductImage src={mediaUrl(p.cover)} alt="" fill sizes="64px" className="object-cover" /> : <span className="grid h-full place-items-center text-[10px] text-slate-400">No cover</span>}
                </div>
                <div className="min-w-0 flex-1 basis-60">
                  <p className="truncate text-sm font-bold text-ink">{p.title}</p>
                  <p className="truncate text-xs text-slate-500">{p.excerpt || "—"}</p>
                </div>
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", BADGE[st])}>{st}{st !== "draft" && p.publishedAt ? ` · ${fmtDate(p.publishedAt)}` : ""}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditing({ id: p.id })} aria-label={`Edit ${p.title}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-surface hover:text-brand-600 dark:hover:bg-navy-950"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => void del(p)} aria-label={`Delete ${p.title}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-red-500/10 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {list.data && <Pagination page={list.data.page} limit={list.data.limit} total={list.data.total} onPage={setPage} />}

      <Modal open={!!editing} onClose={() => setEditing(null)} wide title={editing?.id ? "Edit post" : "New post"}>
        {editing && <PostEditor key={editing.id ?? "new"} id={editing.id} onDone={() => setEditing(null)} />}
      </Modal>
    </>
  );
}

function PostEditor({ id, onDone }: { id: string | null; onDone: () => void }) {
  const existing = useAdminPostQuery(id ?? "", { skip: !id });
  if (id && existing.isLoading) return <div className="p-5"><Skeleton rows={3} /></div>;
  if (id && !existing.data) return <div className="p-5"><ErrorState message={existing.error ? errorMessage(existing.error) : "Post not found"} onRetry={() => void existing.refetch()} /></div>;
  return <PostForm initial={existing.data ?? null} onDone={onDone} />;
}

function PostForm({ initial, onDone }: { initial: AdminPost | null; onDone: () => void }) {
  const isNew = !initial;
  const [v, setV] = useState({ id: initial?.id ?? "", title: initial?.title ?? "", excerpt: initial?.excerpt ?? "", published: initial?.published ?? true, when: toLocalInput(initial?.publishedAt ?? null) });
  const [cover, setCover] = useState<string | null>(initial?.cover ?? null);
  const [content, setContent] = useState(initial?.content ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const [save, { isLoading: saving }] = useSavePostMutation();
  const [upload] = useUploadImageMutation();
  const cleanup = useUploadCleanup([...(initial?.cover ? [initial.cover] : []), ...tokensIn(initial?.content ?? "")], () => [...(cover ? [cover] : []), ...tokensIn(content)]);

  const pickCover = async (f: File | undefined) => {
    if (!f) return;
    setError(null); setBusy("Uploading…");
    try { const up = await upload({ file: await prepareImage(f), name: f.name }).unwrap(); cleanup.track(up.token); setCover(up.token); }
    catch (e) { setError(errorMessage(e, "Upload failed")); }
    setBusy(null); if (file.current) file.current.value = "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const pid = isNew ? (v.id || slug(v.title)).slice(0, 80) : initial.id;
    if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(pid)) { setError("The id must be 2–80 characters: lower-case letters, numbers and dashes"); return; }
    try {
      await save({ id: pid, body: { title: v.title.trim(), excerpt: v.excerpt.trim(), cover, content, published: v.published, ...(v.when ? { publishedAt: new Date(v.when).toISOString() } : {}) } }).unwrap();
      cleanup.markSaved(); toast.success(isNew ? "Post created" : "Post saved"); onDone();
    } catch (err) { setError(errorMessage(err, "Could not save")); }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 p-5">
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Title</span>
        <input className={inputCls} value={v.title} onChange={(e) => setV((s) => ({ ...s, title: e.target.value }))} required minLength={3} maxLength={150} /></label>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-body-strong">Cover picture <span className="font-normal text-slate-500">(optional)</span></span>
        {cover ? (
          <div className="relative aspect-[16/7] max-w-lg overflow-hidden rounded-lg bg-surface dark:bg-navy-950/70">
            <ProductImage src={mediaUrl(cover)} alt="Cover" fill sizes="512px" className="object-cover" />
            <button type="button" onClick={() => setCover(null)} aria-label="Remove cover" className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <button type="button" onClick={() => file.current?.click()} disabled={!!busy} className="inline-flex h-11 items-center gap-2 rounded-lg bg-surface px-4 text-sm font-semibold text-ink hover:text-brand-600 disabled:opacity-60 dark:bg-navy-950/70"><ImagePlus className="h-4 w-4" />{busy ?? "Add a cover picture"}</button>
        )}
        <input ref={file} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => void pickCover(e.target.files?.[0])} aria-label="Cover picture file" />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-body-strong">Post</span>
        <RichEditor value={initial?.content ?? ""} onChange={setContent} onUploaded={cleanup.track} height={340} placeholder="What do you want to share?" />
      </div>

      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Short summary <span className="font-normal text-slate-500">(shown in the list; taken from the post if empty)</span></span>
        <textarea className={`${textareaCls} min-h-20`} value={v.excerpt} onChange={(e) => setV((s) => ({ ...s, excerpt: e.target.value }))} maxLength={300} /></label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3"><input type="checkbox" className="h-4 w-4 accent-brand-600" checked={v.published} onChange={(e) => setV((s) => ({ ...s, published: e.target.checked }))} /><span className="text-sm font-medium text-ink">Published (untick to keep as a draft)</span></label>
        <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Publish at <span className="font-normal text-slate-500">(optional — a later time schedules it)</span></span>
          <input type="datetime-local" className={inputCls} value={v.when} onChange={(e) => setV((s) => ({ ...s, when: e.target.value }))} disabled={!v.published} /></label>
      </div>
      {isNew && <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Link name <span className="font-normal text-slate-500">(optional — made from the title)</span></span>
        <input className={inputCls} value={v.id} onChange={(e) => setV((s) => ({ ...s, id: e.target.value }))} placeholder={slug(v.title) || "my-first-post"} /></label>}

      {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:text-ink">Cancel</button>
        <button type="submit" disabled={saving || !!busy} className="h-10 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{saving ? "Saving…" : v.published ? "Save & publish" : "Save draft"}</button>
      </div>
    </form>
  );
}
