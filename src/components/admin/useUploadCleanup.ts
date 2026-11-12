"use client";
import { useEffect, useRef } from "react";
import { useDiscardImageMutation } from "@/store/apiSlice";

/**
 * Pictures uploaded while a form was open but not kept in the saved result (removed, or the form was cancelled) are discarded on the server.
 * `getKeep` returns every picture token the saved item will use.
 */
export function useUploadCleanup(startKeep: string[], getKeep: () => string[]) {
  const [discard] = useDiscardImageMutation();
  const uploaded = useRef(new Set<string>());
  const s = useRef({ saved: false, startKeep, getKeep, discard });
  useEffect(() => { s.current.getKeep = getKeep; });
  useEffect(() => () => {
    const keep = s.current.saved ? s.current.getKeep() : s.current.startKeep;
    for (const t of uploaded.current) if (!keep.includes(t)) void s.current.discard(t).unwrap().catch(() => { /* best effort */ });
  }, []);
  return { track: (t: string) => { uploaded.current.add(t); }, markSaved: () => { s.current.saved = true; } };
}
