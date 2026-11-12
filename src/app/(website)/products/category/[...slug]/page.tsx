import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DeviceShop from "@/components/devices/DeviceShop";
import { categoryUrl } from "@/data/catalogue";
import { buildCatalogue } from "@/lib/catalogData";
import { getCatalog, getShopPage } from "@/lib/catalog.server";
import { pageMeta } from "@/lib/metadata";

/** Resolves /products/category/<category>[/<subcategory>] to catalogue nodes. */
async function resolve(slug: string[]) {
  const { devices, categories } = await getCatalog();
  const catalogue = buildCatalogue(devices, categories);
  const cat = catalogue.find((c) => c.slug === slug[0]);
  if (!cat || slug.length > 2) return null;
  const sub = slug[1] ? cat.subs.find((s) => s.slug === slug[1]) : undefined;
  if (slug[1] && !sub) return null;
  return { cat, sub };
}

export async function generateStaticParams() {
  const { devices, categories } = await getCatalog();
  const catalogue = buildCatalogue(devices, categories);
  return catalogue.flatMap((c) => [{ slug: [c.slug] }, ...c.subs.map((s) => ({ slug: [c.slug, s.slug] }))]);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const r = await resolve((await params).slug);
  if (!r) return {};
  const name = r.sub ? `${r.sub.name} — ${r.cat.name}` : r.cat.name;
  return pageMeta(name, `Browse ${r.sub?.name ?? r.cat.name} from Safety GPS Tracker: prices, features and quick ordering.`, categoryUrl(r.cat.name, r.sub?.name));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const r = await resolve((await params).slug);
  if (!r) notFound();
  return <DeviceShop category={r.cat.name} subcategory={r.sub?.name} initial={await getShopPage(r.cat.name, r.sub?.name)} />;
}
