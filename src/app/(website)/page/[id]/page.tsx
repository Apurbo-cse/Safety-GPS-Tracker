import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DbLegalPage from "@/components/legal/DbLegalPage";
import { getPage } from "@/lib/site.server";
import { stripHtml } from "@/components/common/RichText";
import { pageMeta } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = await getPage((await params).id);
  return p ? pageMeta(p.title, stripHtml(p.content).slice(0, 160), `/page/${p.id}`) : {};
}

/** Extra pages created in the admin panel (e.g. Refund policy) live at /page/<id>. */
export default async function ExtraPage({ params }: { params: Promise<{ id: string }> }) {
  const page = await DbLegalPage({ id: (await params).id });
  if (!page) notFound();
  return page;
}
