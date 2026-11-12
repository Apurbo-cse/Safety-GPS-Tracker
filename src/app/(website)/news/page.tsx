import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import ProductImage from "@/components/common/ProductImage";
import { mediaUrl } from "@/lib/api";
import { getPosts } from "@/lib/news.server";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("News & Updates", "Announcements, product news and tips from the Safety GPS Tracker team.", "/news");

const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const n = Number((await searchParams).page);
  const { items, page, pages, total } = await getPosts(Number.isInteger(n) && n > 0 ? n : 1);
  return (
    <>
      <PageHero art="van" eyebrow="News" title="News &" titleHighlight="Updates" description="Announcements, new products and practical tips for keeping your vehicles safe." />
      <section className="bg-surface py-12 sm:py-16">
        <Container>
          {items.length === 0 ? (
            <div className="mx-auto max-w-md rounded-lg bg-softer/80 p-10 text-center dark:bg-navy-900/90">
              <Newspaper className="mx-auto h-12 w-12 text-slate-400" />
              <h2 className="mt-3 text-xl font-black text-ink">No news yet</h2>
              <p className="mt-1 text-sm text-body">Check back soon — we post product updates and announcements here.</p>
            </div>
          ) : (
            <>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <li key={p.id}>
                    <Link href={`/news/${p.id}`} className="group flex h-full flex-col overflow-hidden rounded-lg bg-softer/80 transition-all hover:-translate-y-1 dark:bg-navy-900/90">
                      <div className="relative aspect-[16/9] bg-soft dark:bg-navy-950/70">
                        {p.cover ? <ProductImage src={mediaUrl(p.cover)} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" /> : <span className="grid h-full place-items-center"><Newspaper className="h-10 w-10 text-slate-300" /></span>}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <p className="flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{day(p.publishedAt)}</p>
                        <h2 className="mt-2 text-lg font-black leading-snug tracking-tight text-ink group-hover:text-brand-600">{p.title}</h2>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-body">{p.excerpt}</p>
                        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-600 dark:text-brand-400">Read more <ArrowRight className="h-4 w-4" /></span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              {pages > 1 && (
                <nav aria-label="News pages" className="mt-10 flex items-center justify-center gap-3 text-sm">
                  {page > 1 ? <Link href={`/news?page=${page - 1}`} className="inline-flex h-10 items-center gap-1 rounded-lg bg-softer/80 px-4 font-semibold text-ink hover:text-brand-600 dark:bg-navy-900/90"><ChevronLeft className="h-4 w-4" />Newer</Link> : <span />}
                  <span className="text-body">Page {page} of {pages} · {total} posts</span>
                  {page < pages ? <Link href={`/news?page=${page + 1}`} className="inline-flex h-10 items-center gap-1 rounded-lg bg-softer/80 px-4 font-semibold text-ink hover:text-brand-600 dark:bg-navy-900/90">Older<ChevronRight className="h-4 w-4" /></Link> : <span />}
                </nav>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}
