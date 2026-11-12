import "server-only";
import { cache } from "react";
import { SITE, type SiteInfo } from "./site";

const API = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

/** Company details from the admin panel (refreshed every minute). If the API can't be reached the built-in details are used, so the site still renders. */
export const getSite = cache(async (): Promise<SiteInfo> => {
  if (!API) return SITE;
  try {
    const res = await fetch(`${API}/site`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return SITE;
    const j = (await res.json()) as Partial<SiteInfo>;
    return { ...SITE, ...j, url: SITE.url, referenceUrl: SITE.referenceUrl };
  } catch { return SITE; }
});

export interface LegalPageData { id: string; title: string; content: string; updatedAt: string }

/** One text page (Privacy, Terms, Refund policy…), or null when it doesn't exist or isn't published. */
export const getPage = cache(async (id: string): Promise<LegalPageData | null> => {
  if (!API) return null;
  try {
    const res = await fetch(`${API}/pages/${encodeURIComponent(id)}`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) });
    return res.ok ? ((await res.json()) as LegalPageData) : null;
  } catch { return null; }
});

/** Fill the {{name}}, {{phone}}, {{email}} and {{address}} placeholders used in page text. */
export const fillPlaceholders = (html: string, s: SiteInfo) =>
  html.replace(/\{\{(name|phone|email|address)\}\}/g, (_, k: "name" | "phone" | "email" | "address") => s[k].replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!));
