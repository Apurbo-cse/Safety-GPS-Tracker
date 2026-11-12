import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import Container from "@/components/common/Container";
import ProductImage from "@/components/common/ProductImage";
import { mediaUrl } from "@/lib/api";
import { getPosts } from "@/lib/news.server";

/** The newest three posts from Admin → News. Shows nothing when there are no posts, so an empty blog never leaves a hole on the home page. */
export default async function LatestNews() {
  const { items } = await getPosts(1);
  const posts = items.slice(0, 3);
  if (!posts.length) return null;
  return (
    <section className="bg-soft py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">News &amp; tips</span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Latest from our team</h2>
          </div>
          <Link href="/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">All news<ArrowRight className="h-4 w-4" /></Link>
        </div>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/news/${p.id}`} className="group flex h-full flex-col overflow-hidden rounded-lg bg-softer/80 transition-all hover:-translate-y-1 dark:bg-navy-900/90">
                <div className="relative aspect-[16/9] bg-surface dark:bg-navy-950/70">
                  {p.cover ? <ProductImage src={mediaUrl(p.cover)} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" /> : <span className="grid h-full place-items-center"><Newspaper className="h-10 w-10 text-slate-300" /></span>}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                  <h3 className="mt-2 text-lg font-black leading-snug tracking-tight text-ink group-hover:text-brand-600">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-body">{p.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
