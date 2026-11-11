"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  BadgeDollarSign, ChevronDown, Cpu, Headset, HelpCircle, Link2, Mail, MapPin, Phone, Search, ShieldCheck, X, type LucideIcon,
} from "lucide-react";
import Container from "@/components/common/Container";
import { FAQ_CATEGORIES, FAQS, type FaqCategoryName } from "@/data/faqs";
import { SITE } from "@/lib/site";
import { cn } from "@/utils/format";

const ICONS: Record<FaqCategoryName, LucideIcon> = {
  "Tracking & GPS": MapPin,
  "Security & Relay": ShieldCheck,
  "Hardware & Sensors": Cpu,
  "Pricing & Packages": BadgeDollarSign,
  "Billing & Support": Headset,
};

const slug = (c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Wrap matches of `q` in <mark> */
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return <>{parts.map((p, i) => (p.toLowerCase() === q.toLowerCase() ? <mark key={i} className="rounded bg-brand-500/20 px-0.5 text-inherit">{p}</mark> : p))}</>;
}

export default function FaqExplorer() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<FaqCategoryName | "All">("All");
  const [open, setOpen] = useState<Set<string>>(() => new Set([FAQS[0].id]));

  /* Deep link: /faq#question-id opens and scrolls to that question */
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id || !FAQS.some((f) => f.id === id)) return;
    requestAnimationFrame(() => {
      setOpen((s) => new Set(s).add(id));
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  const q = query.trim().toLowerCase();
  const results = useMemo(
    () => FAQS.filter((f) => (cat === "All" || f.category === cat) && (!q || `${f.q} ${f.a} ${f.tag}`.toLowerCase().includes(q))),
    [cat, q],
  );
  const groups = FAQ_CATEGORIES.map((c) => ({ c, items: results.filter((f) => f.category === c) })).filter((g) => g.items.length);

  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allOpen = results.length > 0 && results.every((f) => open.has(f.id));
  const copyLink = async (id: string) => {
    const url = `${location.origin}/faq#${id}`;
    try { await navigator.clipboard.writeText(url); toast.success("Link copied"); } catch { toast.error("Could not copy link"); }
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <section className="bg-surface py-12 sm:py-16">
      <Container className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
        {/* ---------- sidebar ---------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions…"
              aria-label="Search FAQs"
              className="h-10 w-full rounded-md border border-line-strong bg-surface pl-9 pr-9 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded text-slate-400 hover:text-ink">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <nav aria-label="FAQ categories" className="-mx-3 mt-3 flex gap-1.5 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 lg:flex-col lg:gap-1 [&::-webkit-scrollbar]:hidden">
            {(["All", ...FAQ_CATEGORIES] as const).map((c) => {
              const on = cat === c;
              const Icon = c === "All" ? HelpCircle : ICONS[c];
              const count = c === "All" ? FAQS.length : FAQS.filter((f) => f.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  aria-pressed={on}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors lg:w-full",
                    on ? "bg-brand-600 text-white" : "bg-softer/80 dark:bg-navy-900/90 text-body hover:text-ink",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="lg:flex-1 lg:text-left">{c}</span>
                  <span className={cn("rounded px-1.5 text-xs tabular-nums", on ? "bg-white/20" : "bg-softer text-slate-500")}>{count}</span>
                </button>
              );
            })}
          </nav>

          {/* help card (desktop) */}
          <div className="relative mt-5 hidden overflow-hidden rounded-md bg-navy-950 p-4 text-white lg:block">
            <div aria-hidden className="grid-bg absolute inset-0 opacity-60" />
            <div className="relative">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
                <span className="relative flex h-1.5 w-1.5"><span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" /><span className="relative h-1.5 w-1.5 rounded-full bg-green-400" /></span>
                Helpline open 24/7
              </p>
              <p className="mt-2 text-sm font-bold">Can&apos;t find an answer?</p>
              <a href={`tel:${SITE.phone}`} className="gloss-btn mt-3 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-semibold"><Phone className="h-4 w-4" />{SITE.phone}</a>
              <Link href="/contact" className="mt-2 flex items-center justify-center gap-1.5 rounded-md border border-white/20 py-2 text-sm font-semibold hover:bg-white/10"><Mail className="h-4 w-4" />Contact form</Link>
            </div>
          </div>
        </aside>

        {/* ---------- questions ---------- */}
        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-body" aria-live="polite">
              <b className="text-ink">{results.length}</b> question{results.length === 1 ? "" : "s"}
              {q && <> for &ldquo;<span className="text-ink">{query}</span>&rdquo;</>}
            </p>
            {results.length > 0 && (
              <button
                onClick={() => setOpen(allOpen ? new Set() : new Set(results.map((f) => f.id)))}
                className="text-sm font-semibold text-brand-text hover:underline"
              >
                {allOpen ? "Collapse all" : "Expand all"}
              </button>
            )}
          </div>

          {groups.length === 0 ? (
            <div className="rounded-md bg-softer/80 dark:bg-navy-900/90 p-10 text-center">
              <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-bold text-ink">No matching questions</p>
              <p className="mt-1 text-sm text-body">Try another word, or ask our team directly.</p>
              <div className="mt-4 flex justify-center gap-2">
                <button onClick={() => { setQuery(""); setCat("All"); }} className="rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-500">Reset search</button>
                <Link href="/contact" className="rounded-md bg-surface px-3 py-2 text-sm font-semibold text-ink hover:text-brand-text dark:bg-navy-950/70">Ask a question</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {groups.map(({ c, items }) => {
                const Icon = ICONS[c];
                return (
                  <section key={c} id={slug(c)} aria-labelledby={`${slug(c)}-h`} className="scroll-mt-24">
                    <h2 id={`${slug(c)}-h`} className="mb-3 flex items-center gap-2 text-base font-bold text-ink">
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 text-white"><Icon className="h-4 w-4" /></span>
                      {c}
                      <span className="text-sm font-medium text-slate-400">· {items.length}</span>
                    </h2>
                    <div className="space-y-2">
                      {items.map((f) => {
                        const isOpen = open.has(f.id) || !!q;
                        return (
                          <div
                            key={f.id}
                            id={f.id}
                            className={cn(
                              "scroll-mt-28 overflow-hidden rounded-md bg-softer/80 dark:bg-navy-900/90 transition-all",
                              !isOpen && "hover:-translate-y-0.5",
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => toggle(f.id)}
                              aria-expanded={isOpen}
                              aria-controls={`${f.id}-a`}
                              className="flex w-full items-start justify-between gap-3 p-4 text-left"
                            >
                              <span className="min-w-0">
                                <span className={cn("block text-sm font-bold sm:text-base", isOpen ? "text-brand-text" : "text-ink")}>
                                  <Highlight text={f.q} q={q} />
                                </span>
                                <span className="mt-1 inline-block rounded bg-softer px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">{f.tag}</span>
                              </span>
                              <ChevronDown className={cn("mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200", isOpen && "rotate-180 text-brand-text")} />
                            </button>
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  id={`${f.id}-a`}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: "easeOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="border-t border-line px-4 pb-4 pt-3 text-sm leading-relaxed text-body">
                                    <p><Highlight text={f.a} q={q} /></p>
                                    <button onClick={() => copyLink(f.id)} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-text">
                                      <Link2 className="h-3.5 w-3.5" />Copy link to this answer
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {/* help card (phone / tablet) */}
          <div className="mt-8 flex flex-col gap-3 rounded-md bg-navy-950 p-4 text-white sm:flex-row sm:items-center lg:hidden">
            <div className="flex-1">
              <p className="text-sm font-bold">Can&apos;t find an answer?</p>
              <p className="text-xs text-slate-400">Our helpline is open 24/7.</p>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${SITE.phone}`} className="gloss-btn flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold"><Phone className="h-4 w-4" />Call</a>
              <Link href="/contact" className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/10"><Mail className="h-4 w-4" />Contact</Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
