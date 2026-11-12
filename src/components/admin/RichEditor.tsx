"use client";
import { useEffect, useRef, useState } from "react";
import "summernote/dist/summernote-lite.min.css";
import { API_URL, mediaUrl } from "@/lib/api";
import { errorMessage, useUploadImageMutation } from "@/store/apiSlice";
import { prepareImage } from "./ImageManager";

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
/** Stored text refers to uploaded pictures as "media:<id>"; the editor needs real URLs to show them. */
export const toEditorHtml = (html: string) => html.replace(new RegExp(`media:(${UUID})`, "g"), (_, id) => mediaUrl(`media:${id}`));
export const fromEditorHtml = (html: string) => html.replace(new RegExp(`${API_URL.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}/media/(${UUID})`, "g"), "media:$1");
/** Every uploaded-picture token inside some HTML. */
export const tokensIn = (html: string) => [...new Set(html.match(new RegExp(`media:${UUID}`, "g")) ?? [])];

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Summernote (Lite) rich-text editor: headings, bold/italic, colours, lists, alignment, tables, links, pictures, undo/redo, HTML view.
 * Starts from `value` and reports every change through `onChange` (HTML with "media:<id>" picture references).
 * Pictures are shrunk in the browser, uploaded to the server, and reported through `onUploaded` so unused ones can be cleaned up.
 * Give it a `key` to load a different value.
 */
export default function RichEditor({ value, onChange, onUploaded, height = 280, placeholder = "Write here…" }: { value: string; onChange: (html: string) => void; onUploaded?: (token: string) => void; height?: number; placeholder?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [upload] = useUploadImageMutation();
  const cb = useRef({ onChange, onUploaded, upload });
  useEffect(() => { cb.current = { onChange, onUploaded, upload }; });
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let $el: any = null;
    (async () => {
      const $: any = (await import("jquery")).default;
      (window as any).$ = (window as any).jQuery = $;
      await import("summernote/dist/summernote-lite.min.js");
      if (disposed || !ref.current) return;
      $el = $(ref.current);
      $el.summernote({
        height, placeholder, dialogsInBody: true, tabsize: 2,
        styleTags: ["p", "h2", "h3", "h4", "blockquote", "pre"],
        toolbar: [
          ["style", ["style"]],
          ["font", ["bold", "italic", "underline", "clear"]],
          ["color", ["color"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["table", ["table"]],
          ["insert", ["link", "picture", "hr"]],
          ["view", ["undo", "redo", "codeview", "fullscreen"]],
        ],
        callbacks: {
          onChange: (html: string) => cb.current.onChange(fromEditorHtml(html)),
          // pictures (button, drag and drop, paste) are uploaded instead of being embedded as huge inline data
          onImageUpload: async (files: File[]) => {
            setError(null);
            for (const f of Array.from(files)) {
              try {
                const up = await cb.current.upload({ file: await prepareImage(f), name: f.name }).unwrap();
                cb.current.onUploaded?.(up.token);
                $el.summernote("insertImage", mediaUrl(up.token), ($img: any) => $img.css("max-width", "100%"));
              } catch (e) { setError(errorMessage(e, "Upload failed")); }
            }
          },
        },
      });
      $el.summernote("code", toEditorHtml(value));
      setReady(true);
    })();
    return () => { disposed = true; try { $el?.summernote("destroy"); } catch { /* already gone */ } };
    // the editor is created once; use `key` to start it with another value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rich-editor">
      {!ready && <div className="skeleton h-40 w-full rounded-lg" aria-busy="true" aria-label="Loading the editor" />}
      <textarea ref={ref} defaultValue="" className={ready ? undefined : "sr-only"} aria-label="Formatted text" />
      {error && <p role="alert" className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
