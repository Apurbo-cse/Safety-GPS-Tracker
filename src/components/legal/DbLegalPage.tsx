import PageHero from "@/components/common/PageHero";
import RichText, { stripHtml } from "@/components/common/RichText";
import LegalPage, { type LegalSection } from "./LegalPage";
import { fillPlaceholders, getPage, getSite } from "@/lib/site.server";

const slugOf = (t: string) => t.toLowerCase().replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "section";

/** Text before the first heading is the intro; every <h2> starts a numbered section with its own link. */
export function splitSections(html: string): { intro: string; sections: { id: string; title: string; html: string }[] } {
  const parts = html.split(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const used = new Set<string>();
  const sections: { id: string; title: string; html: string }[] = [];
  for (let i = 1; i < parts.length; i += 2) {
    const title = stripHtml(parts[i]);
    let id = slugOf(title); let n = 2;
    while (used.has(id)) id = `${slugOf(title)}-${n++}`;
    used.add(id);
    sections.push({ id, title, html: parts[i + 1] ?? "" });
  }
  return { intro: parts[0] ?? "", sections };
}

export interface LegalHero { art?: string; eyebrow: string; title: string; titleHighlight?: string; description: string }

/** A text page from the admin panel (Pages), shown with the sticky table of contents. Returns null when there is no such published page. */
export default async function DbLegalPage({ id, hero }: { id: string; hero?: LegalHero }) {
  const [page, site] = await Promise.all([getPage(id), getSite()]);
  if (!page) return null;
  const { intro, sections } = splitSections(fillPlaceholders(page.content, site));
  const list: LegalSection[] = sections.map((s) => ({ id: s.id, title: s.title, body: <RichText html={s.html} /> }));
  const updated = new Date(page.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return (
    <>
      <PageHero art={hero?.art ?? "car"} eyebrow={hero?.eyebrow ?? "Information"} title={hero?.title ?? page.title} titleHighlight={hero?.titleHighlight} description={hero?.description ?? (stripHtml(intro).slice(0, 180) || page.title)} />
      <LegalPage updated={updated} intro={<RichText html={intro} />} sections={list} />
    </>
  );
}
