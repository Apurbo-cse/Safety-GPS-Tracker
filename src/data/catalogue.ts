import type { Device } from "@/types";
import { slugify } from "@/lib/catalogData";

export { slugify, buildCatalogue, type CatalogueNode } from "@/lib/catalogData";

export const deviceUrl = (d: Pick<Device, "id">) => `/products/${d.id}`;
export const productUrl = deviceUrl;
export const categoryUrl = (cat: string, sub?: string) => `/products/category/${slugify(cat)}${sub ? `/${slugify(sub)}` : ""}`;
