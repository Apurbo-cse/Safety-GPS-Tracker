"use client";
import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import Container from "@/components/common/Container";
import { useSite } from "@/components/providers/SiteProvider";
import { cn } from "@/utils/format";

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

/** Shared layout for legal pages: sticky table of contents + numbered sections. */
export default function LegalPage({ updated, intro, sections }: { updated: string; intro: React.ReactNode; sections: LegalSection[] }) {
  const site = useSite();
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [sections]);

  return (
    <Container className="grid gap-8 py-10 sm:py-14 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-text">On this page</p>
        <nav className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:overflow-visible">
          {sections.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className={cn("flex shrink-0 items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors lg:border-transparent", active === s.id ? "bg-brand-500/10 font-semibold text-brand-text" : "text-body hover:bg-softer/80 hover:text-ink dark:hover:bg-navy-900/90")}>
              <span className="font-mono text-xs opacity-60">{String(i + 1).padStart(2, "0")}</span>{s.title}
            </a>
          ))}
        </nav>
      </aside>

      <article className="min-w-0">
        <div className="rounded-md bg-softer/80 dark:bg-navy-900/90 p-5 sm:p-6">
          <p className="text-xs text-body">Last updated: <b className="text-ink">{updated}</b></p>
          <div className="mt-2 text-sm leading-relaxed text-body-strong">{intro}</div>
        </div>

        <div className="mt-6 space-y-8">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="flex items-center gap-2.5 text-lg font-black tracking-tight text-ink sm:text-xl">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-500/10 text-xs font-bold text-brand-600 dark:text-brand-400">{i + 1}</span>{s.title}
              </h2>
              <div className="legal-body mt-3 space-y-3 text-sm leading-relaxed text-body [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_strong]:text-ink [&_ul]:space-y-1.5">{s.body}</div>
            </section>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Phone, label: "Helpline (24×7)", value: site.phone, href: `tel:${site.phone}` },
            { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
            { icon: MapPin, label: "Office", value: site.address },
          ].map((c) => {
            const inner = (<><c.icon className="h-4 w-4 text-brand-text" /><p className="mt-2 text-xs text-body">{c.label}</p><p className="mt-0.5 break-words text-sm font-semibold text-ink">{c.value}</p></>);
            return c.href
              ? <a key={c.label} href={c.href} className="rounded-md bg-softer/80 dark:bg-navy-900/90 p-5 transition-all hover:-translate-y-1">{inner}</a>
              : <div key={c.label} className="rounded-md bg-softer/80 dark:bg-navy-900/90 p-5">{inner}</div>;
          })}
        </div>
      </article>
    </Container>
  );
}
