"use client";
import { createContext, useContext, useMemo } from "react";
import { buildCatalogue, comparisonFeaturesOf, faqCategoriesOf, type Catalog } from "@/lib/catalogData";

const empty: Catalog = { plans: [], devices: [], faqs: [] };
const Ctx = createContext<Catalog>(empty);

/** Makes the server-fetched catalogue available to every client component under the website layout. */
export default function CatalogProvider({ catalog, children }: { catalog: Catalog; children: React.ReactNode }) {
  return <Ctx.Provider value={catalog}>{children}</Ctx.Provider>;
}

/** Plans, devices and FAQs (live from the database) plus values derived from them. */
export function useCatalog() {
  const c = useContext(Ctx);
  return useMemo(() => ({
    ...c,
    heroSlides: c.heroSlides ?? [],
    catalogue: buildCatalogue(c.devices, c.categories),
    comparisonFeatures: comparisonFeaturesOf(c.plans),
    faqCategories: faqCategoriesOf(c.faqs),
  }), [c]);
}
