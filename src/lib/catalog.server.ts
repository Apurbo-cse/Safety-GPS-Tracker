import "server-only";
import { cache } from "react";
import { plans as staticPlans } from "@/data/pricing";
import { devices as staticDevices } from "@/data/devices";
import { FAQS } from "@/data/faqs";
import { heroSlides as staticHero } from "@/data/hero";
import { isCatalog, type Catalog } from "./catalogData";
import type { Paged } from "./api";
import type { Device } from "@/types";

const API = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const REVALIDATE_SECONDS = 60;

/** Built-in data, used when the API isn't configured or can't be reached. */
export const fallbackCatalog = (): Catalog => ({
  plans: staticPlans,
  // same picture paths the database uses (public/img/products/<id>.png)
  devices: staticDevices.map((d) => ({ ...d, image: `/img/products/${d.id}.png` })),
  faqs: FAQS,
  heroSlides: staticHero,
});

/**
 * Products, plans and FAQs for the website: from the API (cached, refreshed every minute),
 * or the built-in data if the API is unavailable at build/dev time. In production a failed refresh keeps the last good page.
 */
export const getCatalog = cache(async (): Promise<Catalog> => {
  if (!API) return fallbackCatalog();
  try {
    const res = await fetch(`${API}/catalog`, { next: { revalidate: REVALIDATE_SECONDS }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`catalog responded ${res.status}`);
    const json: unknown = await res.json();
    if (!isCatalog(json)) throw new Error("catalog payload has an unexpected shape");
    return json;
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    // While the site is running in production, a failed refresh must NOT replace good pages with the built-in data:
    // throwing makes Next keep serving the last successfully generated page until the API is back.
    // At build time and in development we fall back so the site still builds and runs.
    const serving = process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build";
    if (serving) throw new Error(`[catalog] API unavailable: ${reason}`);
    console.error("[catalog] using built-in data:", reason);
    return fallbackCatalog();
  }
});

/** Page size the shop starts with. */
export const SHOP_PAGE_SIZE = 12;

/**
 * First page of the shop for a category / sub-category (or everything), fetched from the API for the server-rendered HTML.
 * Same failure rules as getCatalog: built-in data at build/dev time, last good page while serving.
 */
export const getShopPage = cache(async (category?: string, sub?: string): Promise<Paged<Device>> => {
  const fallback = (): Paged<Device> => {
    const all = fallbackCatalog().devices.filter((d) => (!category || d.category === category) && (!sub || d.subcategory === sub));
    return { items: all.slice(0, SHOP_PAGE_SIZE), total: all.length, page: 1, limit: SHOP_PAGE_SIZE, pages: Math.max(1, Math.ceil(all.length / SHOP_PAGE_SIZE)) };
  };
  if (!API) return fallback();
  try {
    const p = new URLSearchParams({ limit: String(SHOP_PAGE_SIZE) });
    if (category) p.set("category", category);
    if (sub) p.set("sub", sub);
    const res = await fetch(`${API}/products?${p}`, { next: { revalidate: REVALIDATE_SECONDS }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`products responded ${res.status}`);
    const json = (await res.json()) as Paged<Device>;
    if (!Array.isArray(json.items) || typeof json.total !== "number") throw new Error("products payload has an unexpected shape");
    return json;
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    const serving = process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build";
    if (serving) throw new Error(`[shop] API unavailable: ${reason}`);
    console.error("[shop] using built-in data:", reason);
    return fallback();
  }
});

/**
 * One product for its own page. Looks in the (cached) catalogue first; a product created a moment ago isn't in that cache yet,
 * so a miss asks the API directly — new products get a working page immediately instead of a 404 for a minute or two.
 */
export const getProduct = cache(async (id: string): Promise<Device | null> => {
  const known = (await getCatalog()).devices.find((d) => d.id === id);
  if (!API) return known ?? null;
  try {
    // the single-product endpoint also carries the long description, which the catalogue list leaves out
    const res = await fetch(`${API}/products/${encodeURIComponent(id)}`, known ? { next: { revalidate: REVALIDATE_SECONDS }, signal: AbortSignal.timeout(5000) } : { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (res.status === 404) return null;
    if (!res.ok) return known ?? null;
    return (await res.json()) as Device;
  } catch { return known ?? null; }
});
