import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/devices/ProductDetail";
import { deviceUrl } from "@/data/catalogue";
import { getCatalog, getProduct } from "@/lib/catalog.server";
import { pageMeta } from "@/lib/metadata";

export async function generateStaticParams() {
  return (await getCatalog()).devices.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const d = await getProduct((await params).id);
  if (!d) return {};
  return pageMeta(d.name, d.summary, deviceUrl(d));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const d = await getProduct((await params).id);
  if (!d) notFound();
  return <ProductDetail id={d.id} device={d} />;
}
