"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, X } from "lucide-react";
import ProductImage from "@/components/common/ProductImage";
import { mediaUrl } from "@/lib/api";
import { errorMessage, useUploadImageMutation } from "@/store/apiSlice";
import { cn } from "@/utils/format";

export const MAX_IMAGES = 10;
const MAX_BYTES = 3 * 1024 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** How small each kind of picture is made before it is uploaded: a size budget and the longest edge allowed. */
export const IMAGE_PRESETS = {
  product: { label: "Product picture", maxBytes: 100 * 1024, maxSide: 1000 },
  banner: { label: "Banner", maxBytes: 200 * 1024, maxSide: 1920 },
  cover: { label: "News cover", maxBytes: 200 * 1024, maxSide: 1600 },
  content: { label: "Picture in text", maxBytes: 250 * 1024, maxSide: 1400 },
} as const;
export type ImagePreset = keyof typeof IMAGE_PRESETS;
export const kb = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

const toBlob = (c: HTMLCanvasElement, type: string, q: number) => new Promise<Blob | null>((res) => c.toBlob(res, type, q));

/**
 * Shrink a picture in the browser to fit its size budget: first lower the quality step by step, and if that is not enough,
 * make the picture a little smaller and try again. WebP keeps transparency (product cut-outs); JPEG is the fallback for old browsers.
 */
export async function prepareImage(file: File, preset: ImagePreset = "content"): Promise<Blob> {
  const { maxBytes, maxSide } = IMAGE_PRESETS[preset];
  if (!OK_TYPES.includes(file.type)) throw new Error(`“${file.name}” isn't a JPEG, PNG or WebP picture`);
  let bmp: ImageBitmap;
  try { bmp = await createImageBitmap(file); } catch { throw new Error(`“${file.name}” can't be read as a picture`); }
  try {
    // already small enough in both size and dimensions: upload it as it is
    if (file.size <= maxBytes && Math.max(bmp.width, bmp.height) <= maxSide) return file;
    let side = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    let type = "image/webp";
    let best: Blob | null = null;
    for (let round = 0; round < 8; round++) {
      const w = Math.max(1, Math.round(bmp.width * side)), h = Math.max(1, Math.round(bmp.height * side));
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser can't shrink pictures");
      if (type === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); } // JPEG has no transparency
      ctx.drawImage(bmp, 0, 0, w, h);
      for (const q of [0.88, 0.8, 0.72, 0.64, 0.56, 0.48, 0.4]) {
        const blob = await toBlob(canvas, type, q);
        if (!blob) throw new Error(`“${file.name}” can't be shrunk`);
        if (blob.type !== type) { type = "image/jpeg"; best = null; break; } // this browser can't write WebP — redo as JPEG
        if (!best || blob.size < best.size) best = blob;
        if (blob.size <= maxBytes) return blob;
      }
      if (type === "image/jpeg" && best === null) { round--; continue; }
      if (Math.max(w, h) <= 320) break; // too small to be worth shrinking more
      side *= 0.82;
    }
    if (best && best.size <= MAX_BYTES && best.size < file.size) return best;
    throw new Error(`“${file.name}” can't be made smaller than ${kb(maxBytes)} without ruining it — try a simpler picture`);
  } finally { bmp.close(); }
}

/**
 * The picture gallery of a product: upload several at once, reorder, pick the main one (first), remove.
 * `value` holds picture references ("media:<id>" for uploads; older products may still hold "/img/…" files kept in the backend).
 */
export default function ImageManager({ value, onChange, onUploaded, single, label = "Pictures", wide, preset = "product" }: { value: string[]; onChange: (v: string[]) => void; onUploaded?: (token: string) => void; single?: boolean; label?: string; wide?: boolean; preset?: ImagePreset }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  // uploads finish one after another; keep the latest list so none is lost
  const latest = useRef(value);
  useEffect(() => { latest.current = value; });

  const [upload] = useUploadImageMutation();
  const add = async (files: File[]) => {
    setError(null);
    const room = single ? 1 : MAX_IMAGES - latest.current.length;
    if (room <= 0) { setError(`A product can have up to ${MAX_IMAGES} pictures`); return; }
    const picked = files.slice(0, room);
    if (files.length > room) setError(`Only ${room} more picture${room === 1 ? "" : "s"} fit — the rest were skipped`);
    for (let i = 0; i < picked.length; i++) {
      setBusy(`Uploading ${i + 1} of ${picked.length}…`);
      try {
        const blob = await prepareImage(picked[i], preset);
        if (blob !== picked[i]) toast.message(`${picked[i].name}: ${kb(picked[i].size)} → ${kb(blob.size)}`);
        const up = await upload({ file: blob, name: picked[i].name }).unwrap();
        const next = single ? [up.token] : latest.current.includes(up.token) ? latest.current : [...latest.current, up.token];
        onChange(next); latest.current = next;
        onUploaded?.(up.token);
      } catch (e) { setError(errorMessage(e, "Upload failed")); }
    }
    setBusy(null);
    if (input.current) input.current.value = "";
  };

  const move = (i: number, d: -1 | 1) => { const a = [...value]; [a[i], a[i + d]] = [a[i + d], a[i]]; onChange(a); };
  const makeMain = (i: number) => onChange([value[i], ...value.filter((_, j) => j !== i)]);
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));

  return (
    <div className="sm:col-span-2">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-body-strong">{label}{!single && <span className="font-normal text-slate-500"> ({value.length}/{MAX_IMAGES})</span>}</span>
        {!single && value.length > 0 && <span className="text-xs text-slate-500">The first picture is the main one</span>}
      </div>

      {value.length > 0 && (
        <ul className={cn("mb-3 grid gap-3", wide ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-4")} aria-label={label}>
          {value.map((ref, i) => (
            <li key={ref} className={cn("group relative overflow-hidden rounded-lg bg-surface dark:bg-navy-950/70", i === 0 && "ring-2 ring-brand-500")}>
              <div className={cn("relative", wide ? "aspect-[16/6]" : "aspect-[4/3]")}><ProductImage src={mediaUrl(ref)} alt={`Picture ${i + 1}`} fill sizes="200px" className={wide ? "object-cover" : "object-contain p-1.5"} /></div>
              {!single && i === 0 && <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white"><Star className="h-3 w-3" />Main</span>}
              <button type="button" onClick={() => remove(i)} aria-label={`Remove picture ${i + 1}`} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white hover:bg-red-600"><X className="h-4 w-4" /></button>
              {!single && <div className="flex items-center justify-between gap-1 p-1.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move picture ${i + 1} earlier`} className="grid h-7 w-7 place-items-center rounded text-body hover:bg-softer disabled:opacity-30"><ArrowLeft className="h-4 w-4" /></button>
                {i > 0 && <button type="button" onClick={() => makeMain(i)} className="text-[11px] font-semibold text-brand-600 hover:underline dark:text-brand-400">Make main</button>}
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label={`Move picture ${i + 1} later`} className="grid h-7 w-7 place-items-center rounded text-body hover:bg-softer disabled:opacity-30"><ArrowRight className="h-4 w-4" /></button>
              </div>}
            </li>
          ))}
        </ul>
      )}

      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); void add([...e.dataTransfer.files]); }}
        className={cn("flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg px-4 py-6 text-center transition-colors", drag ? "bg-brand-500/15" : "bg-softer/80 hover:bg-brand-500/10 dark:bg-navy-900/90", busy && "pointer-events-none opacity-70")}>
        {busy ? <Loader2 className="h-6 w-6 animate-spin text-brand-500" /> : <ImagePlus className="h-6 w-6 text-brand-600 dark:text-brand-400" />}
        <span className="text-sm font-semibold text-ink">{busy ?? (single ? "Click to choose a picture, or drop it here" : "Click to choose pictures, or drop them here")}</span>
        <span className="text-xs text-slate-500">JPEG, PNG or WebP · {single ? "one picture" : "several at once"} · shrunk to about {kb(IMAGE_PRESETS[preset].maxBytes)} automatically</span>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple={!single} className="sr-only" aria-label="Choose pictures to upload" onChange={(e) => void add([...(e.target.files ?? [])])} />
      </label>

      {error && <p role="alert" className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
