import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Container from "@/components/common/Container";
import ProductImage from "@/components/common/ProductImage";
import RichText from "@/components/common/RichText";
import { mediaUrl } from "@/lib/api";
import { getPost } from "@/lib/news.server";
import { pageMeta } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = await getPost((await params).id);
  return p ? pageMeta(p.title, p.excerpt, `/news/${p.id}`) : {};
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await getPost((await params).id);
  if (!p) notFound();
  return (
    <article className="bg-surface py-8 sm:py-12">
      <Container className="max-w-3xl">
        <Link href="/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-body hover:text-ink"><ArrowLeft className="h-4 w-4" />All news</Link>
        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">{p.title}</h1>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500"><CalendarDays className="h-4 w-4" />{new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        {p.cover && (
          <div className="relative mt-6 aspect-[16/8] overflow-hidden rounded-lg bg-soft dark:bg-navy-950/70">
            <ProductImage src={mediaUrl(p.cover)} alt="" fill priority sizes="(min-width:768px) 768px, 100vw" className="object-cover" />
          </div>
        )}
        <RichText html={p.content} className="mt-8 text-base" />
      </Container>
    </article>
  );
}
