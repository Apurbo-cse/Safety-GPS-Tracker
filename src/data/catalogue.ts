import type { Device } from "@/types";
import { devices, deviceCategories } from "./devices";

/** Category → subcategory catalogue built from the products themselves. */
export const slugify = (t: string) => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export interface CatalogueNode { name: string; slug: string; count: number; subs: { name: string; slug: string; count: number }[] }

/** Category → subcategory tree, built from the products themselves. */
export const catalogue: CatalogueNode[] = deviceCategories
  .filter((c) => c !== "All")
  .map((name) => {
    const items = devices.filter((d) => d.category === name);
    const subs = [...new Set(items.map((d) => d.subcategory))].map((sub) => ({ name: sub, slug: slugify(sub), count: items.filter((d) => d.subcategory === sub).length }));
    return { name, slug: slugify(name), count: items.length, subs };
  });

/** Rendered product artwork in public/img/products (falls back to the price-list image). */
export const productImage = (d: Device) => `/img/products/${d.id}.png`;

export const deviceUrl = (d: Device) => `/products/${d.id}`;
export const productUrl = (d: Device) => `/products/${d.id}`;
export const categoryUrl = (cat: string, sub?: string) => `/products/category/${slugify(cat)}${sub ? `/${slugify(sub)}` : ""}`;
export const findCategory = (slug: string) => catalogue.find((c) => c.slug === slug);
