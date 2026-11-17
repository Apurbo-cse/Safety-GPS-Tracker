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
    <section className="py-16 sm:py-24 bg-white dark:bg-[#00122b] border-t border-slate-200 dark:border-slate-800">
      <Container>
        <div className="flex flex-col gap-3 mb-8 sm:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
              <span className="w-5 h-[2px] bg-brand-500" />
              FIELD UPDATES
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0c1f38] dark:text-white tracking-tight leading-snug">
              Announcements, deployment logs &amp; regulatory notes
            </h2>
            <p className="mt-2 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Official news, field service schedules, BRTA compliance updates, and telematics firmware advisories.
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 dark:text-brand-400 shrink-0"
          >
            <span>ARCHIVE</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/news/${p.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#00224f] transition-all hover:border-brand-500"
              >
                <div className="relative aspect-[16/9] bg-slate-100 dark:bg-[#001838]">
                  {p.cover ? (
                    <ProductImage
                      src={mediaUrl(p.cover)}
                      alt=""
                      fill
                      sizes="(min-width:768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="grid h-full place-items-center">
                      <Newspaper className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5 text-brand-500" />
                    {new Date(p.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mt-2 text-sm sm:text-base font-bold leading-snug tracking-tight text-[#0c1f38] dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {p.excerpt}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
