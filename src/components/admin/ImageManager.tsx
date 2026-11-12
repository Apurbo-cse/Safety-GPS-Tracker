"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, X } from "lucide-react";
import ProductImage from "@/components/common/ProductImage";
import { inputCls } from "@/components/forms/Field";
import { api, ApiError, mediaUrl } from "@/lib/api";
import { cn } from "@/utils/format";

export const MAX_IMAGES = 10;
const MAX_SIDE = 1600;       // longest edge after shrinking
const MAX_BYTES = 3 * 1024 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Shrink a picture in the browser (≤ 1600 px, WebP) so uploads are fast and the shop loads quickly. */
async function prepare(file: File): Promise<Blob> {
  if (!OK_TYPES.includes(file.type)) throw new Error(`“${file.name}” isn't a JPEG, PNG or WebP picture`);
  let bmp: ImageBitmap;
  try { bmp = await createImageBitmap(file); } catch { throw new Error(`“${file.name}” can't be read as a picture`); }
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale)), h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d")?.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const shrunk = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", 0.85));
  // keep whichever is smaller; the original is only usable if it already fits
  const best = shrunk && (file.size > MAX_BYTES || shrunk.size < file.size) ? shrunk : file;
  if (best.size > MAX_BYTES) throw new Error(`“${file.name}” is still over 3 MB after shrinking`);
  return best;
}

/**
 * The picture gallery of a product: upload several at once, reorder, pick the main one (first), remove.
 * `value` holds picture references ("media:<id>" for uploads, "/img/…" for files in /public).
 */
export default function ImageManager({ value, onChange, onUploaded }: { value: string[]; onChange: (v: string[]) => void; onUploaded?: (token: string) => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState("");
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  // uploads finish one after another; keep the latest list so none is lost
  const latest = useRef(value);
  useEffect(() => { latest.current = value; });

  const add = async (files: File[]) => {
    setError(null);
    const room = MAX_IMAGES - latest.current.length;
    if (room <= 0) { setError(`A product can have up to ${MAX_IMAGES} pictures`); return; }
    const picked = files.slice(0, room);
    if (files.length > room) setError(`Only ${room} more picture${room === 1 ? "" : "s"} fit — the rest were skipped`);
    for (let i = 0; i < picked.length; i++) {
      setBusy(`Uploading ${i + 1} of ${picked.length}…`);
      try {
        const blob = await prepare(picked[i]);
        const up = await api.admin.uploadImage(blob, picked[i].name);
        if (!latest.current.includes(up.token)) { onChange([...latest.current, up.token]); latest.current = [...latest.current, up.token]; }
        onUploaded?.(up.token);
      } catch (e) { setError(e instanceof ApiError || e instanceof Error ? e.message : "Upload failed"); }
    }
    setBusy(null);
    if (input.current) input.current.value = "";
  };

  const move = (i: number, d: -1 | 1) => { const a = [...value]; [a[i], a[i + d]] = [a[i + d], a[i]]; onChange(a); };
  const makeMain = (i: number) => onChange([value[i], ...value.filter((_, j) => j !== i)]);
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const addPath = () => {
    const p = path.trim();
    if (!/^\/(?!.*\.\.)[A-Za-z0-9/_.-]{2,230}$/.test(p)) { setError("A path inside /public looks like /img/products/my-photo.png"); return; }
    if (value.includes(p)) { setError("That picture is already in the list"); return; }
    if (value.length >= MAX_IMAGES) { setError(`A product can have up to ${MAX_IMAGES} pictures`); return; }
    setError(null); setPath(""); onChange([...value, p]);
  };

  return (
    <div className="sm:col-span-2">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-body-strong">Pictures <span className="font-normal text-slate-500">({value.length}/{MAX_IMAGES})</span></span>
        {value.length > 0 && <span className="text-xs text-slate-500">The first picture is the main one</span>}
      </div>

      {value.length > 0 && (
        <ul className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Product pictures">
          {value.map((ref, i) => (
            <li key={ref} className={cn("group relative overflow-hidden rounded-lg bg-surface dark:bg-navy-950/70", i === 0 && "ring-2 ring-brand-500")}>
              <div className="relative aspect-[4/3]"><ProductImage src={mediaUrl(ref)} alt={`Picture ${i + 1}`} fill sizes="200px" className="object-contain p-1.5" /></div>
              {i === 0 && <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white"><Star className="h-3 w-3" />Main</span>}
              <button type="button" onClick={() => remove(i)} aria-label={`Remove picture ${i + 1}`} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white hover:bg-red-600"><X className="h-4 w-4" /></button>
              <div className="flex items-center justify-between gap-1 p-1.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move picture ${i + 1} earlier`} className="grid h-7 w-7 place-items-center rounded text-body hover:bg-softer disabled:opacity-30"><ArrowLeft className="h-4 w-4" /></button>
                {i > 0 && <button type="button" onClick={() => makeMain(i)} className="text-[11px] font-semibold text-brand-600 hover:underline dark:text-brand-400">Make main</button>}
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label={`Move picture ${i + 1} later`} className="grid h-7 w-7 place-items-center rounded text-body hover:bg-softer disabled:opacity-30"><ArrowRight className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); void add([...e.dataTransfer.files]); }}
        className={cn("flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg px-4 py-6 text-center transition-colors", drag ? "bg-brand-500/15" : "bg-softer/80 hover:bg-brand-500/10 dark:bg-navy-900/90", busy && "pointer-events-none opacity-70")}>
        {busy ? <Loader2 className="h-6 w-6 animate-spin text-brand-500" /> : <ImagePlus className="h-6 w-6 text-brand-600 dark:text-brand-400" />}
        <span className="text-sm font-semibold text-ink">{busy ?? "Click to choose pictures, or drop them here"}</span>
        <span className="text-xs text-slate-500">JPEG, PNG or WebP · several at once · shrunk automatically</span>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" aria-label="Choose pictures to upload" onChange={(e) => void add([...(e.target.files ?? [])])} />
      </label>

      <div className="mt-3 flex gap-2">
        <input className={inputCls} value={path} onChange={(e) => setPath(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPath(); } }} placeholder="Or add a file already in /public, e.g. /img/products/obd-pro.png" aria-label="Add a picture by path" />
        <button type="button" onClick={addPath} className="h-10 shrink-0 rounded-lg bg-surface px-4 text-sm font-semibold text-ink hover:text-brand-600 dark:bg-navy-950/70">Add</button>
      </div>
      {error && <p role="alert" className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
