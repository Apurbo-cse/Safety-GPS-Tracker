import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DeviceShop from "@/components/devices/DeviceShop";
import { catalogue, categoryUrl, findCategory } from "@/data/catalogue";
import { pageMeta } from "@/lib/metadata";

/** Resolves /products/category/<category>[/<subcategory>] to catalogue nodes. */
function resolve(slug: string[]) {
  const cat = findCategory(slug[0]);
  if (!cat || slug.length > 2) return null;
  const sub = slug[1] ? cat.subs.find((s) => s.slug === slug[1]) : undefined;
  if (slug[1] && !sub) return null;
  return { cat, sub };
}

export function generateStaticParams() {
  return catalogue.flatMap((c) => [{ slug: [c.slug] }, ...c.subs.map((s) => ({ slug: [c.slug, s.slug] }))]);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const r = resolve((await params).slug);
  if (!r) return {};
  const name = r.sub ? `${r.sub.name} — ${r.cat.name}` : r.cat.name;
  return pageMeta(name, `Browse ${r.sub?.name ?? r.cat.name} from Safety GPS Tracker: prices, features and quick ordering.`, categoryUrl(r.cat.name, r.sub?.name));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const r = resolve((await params).slug);
  if (!r) notFound();
  return <DeviceShop category={r.cat.name} subcategory={r.sub?.name} />;
}
