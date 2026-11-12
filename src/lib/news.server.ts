import "server-only";
import { cache } from "react";
import type { Paged, PostFull, PostSummary } from "./api";

const API = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const REVALIDATE_SECONDS = 60;
export const NEWS_PAGE_SIZE = 9;

const empty = (page = 1): Paged<PostSummary> => ({ items: [], total: 0, page, limit: NEWS_PAGE_SIZE, pages: 1 });

/** One page of published posts (newest first). News is optional content: when the API is down the page shows "no posts" instead of failing. */
export const getPosts = cache(async (page = 1): Promise<Paged<PostSummary>> => {
  if (!API) return empty(page);
  try {
    const res = await fetch(`${API}/posts?${new URLSearchParams({ page: String(page), limit: String(NEWS_PAGE_SIZE) })}`, { next: { revalidate: REVALIDATE_SECONDS }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return empty(page);
    const json = (await res.json()) as Paged<PostSummary>;
    return Array.isArray(json.items) ? json : empty(page);
  } catch { return empty(page); }
});

/** A single published post, or null (unknown, draft, or scheduled for later). */
export const getPost = cache(async (id: string): Promise<PostFull | null> => {
  if (!API) return null;
  try {
    const res = await fetch(`${API}/posts/${encodeURIComponent(id)}`, { next: { revalidate: REVALIDATE_SECONDS }, signal: AbortSignal.timeout(8000) });
    return res.ok ? ((await res.json()) as PostFull) : null;
  } catch { return null; }
});
