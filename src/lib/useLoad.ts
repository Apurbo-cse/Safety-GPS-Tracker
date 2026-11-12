"use client";
import { useEffect, useRef, useState } from "react";
import { ApiError } from "./api";

/**
 * Loads data from the API and re-runs when `deps` change (or `reload()` is called).
 * `loading` is derived from which request the stored result belongs to, so out-of-order responses are ignored
 * and the previous data stays on screen while the next request is in flight.
 */
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[]) {
  const fnRef = useRef(fn);
  useEffect(() => { fnRef.current = fn; });
  const [tick, setTick] = useState(0);
  const [res, setRes] = useState<{ key: string; data: T | null; error: string | null } | null>(null);
  const key = `${JSON.stringify(deps)}#${tick}`;

  useEffect(() => {
    let live = true;
    fnRef.current()
      .then((data) => { if (live) setRes({ key, data, error: null }); })
      .catch((e) => { if (live) setRes((r) => ({ key, data: r?.data ?? null, error: e instanceof ApiError ? e.message : "Something went wrong" })); });
    return () => { live = false; };
  }, [key]);

  return { data: res?.data ?? null, error: res?.key === key ? res.error : null, loading: res?.key !== key, reload: () => setTick((t) => t + 1) };
}
