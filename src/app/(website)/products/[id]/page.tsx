import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/devices/ProductDetail";
import { devices } from "@/data/devices";
import { deviceUrl } from "@/data/catalogue";
import { pageMeta } from "@/lib/metadata";

export function generateStaticParams() {
  return devices.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const d = devices.find((x) => x.id === id);
  if (!d) return {};
  return pageMeta(d.name, d.summary, deviceUrl(d));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = devices.find((x) => x.id === id);
  if (!d) notFound();
  return <ProductDetail id={d.id} />;
}
