/** Catalogue shapes and the pure helpers derived from them. No data in here — see catalog.server.ts. */
import type { Device, PricingPlan } from "@/types";
import type { Faq } from "@/data/faqs";
import type { HeroSlide } from "@/data/hero";

/** A category (no parentId) or sub-category (parentId = its category's id). */
export interface Category { id: string; name: string; parentId?: string; sort: number }

export interface Catalog { plans: PricingPlan[]; devices: Device[]; faqs: Faq[]; categories?: Category[]; heroSlides?: HeroSlide[] }

export interface CatalogueNode { name: string; slug: string; count: number; subs: { name: string; slug: string; count: number }[] }

export const slugify = (t: string) => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * Category → sub-category tree. With real categories (from the database) the tree follows their order and names;
 * empty categories/sub-categories are left out of the website. Without them (built-in fallback) it is derived from the products.
 */
export function buildCatalogue(devices: Device[], categories?: Category[]): CatalogueNode[] {
  if (categories?.length) {
    const bySort = (a: Category, b: Category) => a.sort - b.sort || a.name.localeCompare(b.name);
    return categories.filter((c) => !c.parentId).sort(bySort).map((c) => {
      const subs = categories.filter((s) => s.parentId === c.id).sort(bySort)
        .map((s) => ({ name: s.name, slug: slugify(s.name), count: devices.filter((d) => d.category === c.name && d.subcategory === s.name).length }))
        .filter((s) => s.count > 0);
      return { name: c.name, slug: slugify(c.name), count: devices.filter((d) => d.category === c.name).length, subs };
    }).filter((n) => n.count > 0);
  }
  const cats = [...new Set(devices.map((d) => d.category))];
  return cats.map((name) => {
    const items = devices.filter((d) => d.category === name);
    const subs = [...new Set(items.map((d) => d.subcategory))].map((sub) => ({ name: sub, slug: slugify(sub), count: items.filter((d) => d.subcategory === sub).length }));
    return { name, slug: slugify(name), count: items.length, subs };
  });
}

/** Every feature any package lists, in order of first appearance (for the comparison table). */
export function comparisonFeaturesOf(plans: PricingPlan[]): string[] {
  const seen = new Set<string>();
  for (const p of plans) for (const f of p.features) seen.add(f);
  return [...seen];
}

/** FAQ categories in first-seen order. */
export const faqCategoriesOf = (faqs: Faq[]) => [...new Set(faqs.map((f) => f.category))];

/** Runtime check on the API payload so a malformed response falls back instead of crashing pages. */
export function isCatalog(x: unknown): x is Catalog {
  const c = x as Partial<Catalog> | null;
  return !!c && Array.isArray(c.plans) && Array.isArray(c.devices) && Array.isArray(c.faqs)
    && c.plans.every((p) => p && typeof p.id === "string" && typeof p.devicePrice === "number" && Array.isArray(p.features))
    && c.devices.every((d) => d && typeof d.id === "string" && typeof d.category === "string" && Array.isArray(d.specs))
    && c.faqs.every((f) => f && typeof f.id === "string" && typeof f.q === "string")
    && (c.heroSlides === undefined || (Array.isArray(c.heroSlides) && c.heroSlides.every((h) => h && typeof h.id === "string" && typeof h.bgImage === "string" && typeof h.telematics === "object" && h.telematics !== null)))
    && (c.categories === undefined || (Array.isArray(c.categories) && c.categories.every((k) => k && typeof k.id === "string" && typeof k.name === "string")));
}
