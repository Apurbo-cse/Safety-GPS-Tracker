"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Mail,
  Phone,
  Search,
  X,
} from "lucide-react";
import Container from "@/components/common/Container";
import { useSite } from "@/components/providers/SiteProvider";
import { useCatalog } from "@/components/providers/CatalogProvider";
import RichText, { isHtml, stripHtml } from "@/components/common/RichText";
import { cn } from "@/utils/format";

type FaqCategory = string;

// Home shows the core questions; the full list (and the pricing ones) live on their own pages
const HOME_FAQS = 8;

export default function HomeFaq() {
  const site = useSite();
  const { faqs: ALL_FAQS } = useCatalog();
  const FAQS = useMemo(() => ALL_FAQS.filter((f) => f.category !== "Pricing & Packages").slice(0, HOME_FAQS), [ALL_FAQS]);
  const CATEGORIES: FaqCategory[] = useMemo(() => ["All", ...new Set(FAQS.map((f) => f.category))], [FAQS]);
  const [activeCat, setActiveCat] = useState<FaqCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null | undefined>(undefined); // undefined: the first question starts open

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((f) => {
      const matchCat = activeCat === "All" || f.category === activeCat;
      const matchSearch =
        searchQuery.trim() === "" ||
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stripHtml(f.a).toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCat, searchQuery, FAQS]);

  return (
    <section className="relative overflow-hidden bg-sec-warm py-16 sm:py-24" id="faq">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left Column: Heading, Categories & Live Support Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-md border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-text">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Got Questions? <br />
                <span className="text-brand-text">We Have the Answers.</span>
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-body">
                Everything you need to know about our GPS tracking platform, remote engine immobilizer, fuel sensor calibration, and nationwide doorstep technician network.
              </p>
            </div>

            {/* Category Filter Pills (rounded-md) */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const count =
                  cat === "All"
                    ? FAQS.length
                    : FAQS.filter((f) => f.category === cat).length;
                const isSelected = activeCat === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCat(cat);
                      setOpenId(null);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
                      isSelected
                        ? "bg-brand-600 text-white shadow-sm"
                        : "border border-line bg-surface text-body hover:border-brand-400 hover:text-ink"
                    )}
                  >
                    <span>{cat}</span>
                    <span
                      className={cn(
                        "rounded px-1 text-[10px] font-mono",
                        isSelected ? "bg-white/20 text-white" : "text-slate-400"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 24/7 Helpline Support Box (rounded-md) */}
            <div className="rounded-md border border-brand-500/30 bg-gradient-to-br from-brand-950/20 via-surface to-brand-900/10 p-5 shadow-sm">
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>24/7 DISPATCH DESK ONLINE</span>
              </div>

              <h4 className="mt-2 text-sm font-bold text-ink">
                Still have unanswered questions?
              </h4>
              <p className="mt-1 text-xs text-body leading-relaxed">
                Speak directly with our Dhaka engineering team for fleet quotations or custom telematics queries.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-brand-500 active:scale-95"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call {site.phone}</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-2 text-xs font-semibold text-body hover:border-brand-400 hover:text-ink transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-brand-text" />
                  <span>Contact Form</span>
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-2 text-xs font-semibold text-body hover:border-brand-400 hover:text-ink transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-brand-text" />
                  <span>All {ALL_FAQS.length} FAQs</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Search & Interactive Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search Input Bar (rounded-md) */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. engine lock, fuel accuracy, 4G, warranty)..."
                className="w-full rounded-md border border-line bg-surface py-2.5 pl-10 pr-9 text-xs sm:text-sm text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear FAQ search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Empty Search State */}
            {filteredFaqs.length === 0 ? (
              <div className="rounded-md border border-dashed border-line-strong p-8 text-center bg-surface/50">
                <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm font-bold text-ink">
                  No matching questions found
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Try searching with different terms or select &quot;All&quot; category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCat("All");
                  }}
                  className="mt-3 rounded-md bg-brand-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-500"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = (openId === undefined ? FAQS[0]?.id : openId) === faq.id;
                  const itemNumber = (index + 1).toString().padStart(2, "0");

                  return (
                    <div
                      key={faq.id}
                      className={cn(
                        "overflow-hidden rounded-md border bg-surface transition-all duration-200",
                        isOpen
                          ? "border-brand-500/60 ring-1 ring-brand-500/20"
                          : "border-line hover:border-brand-400/50"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-start justify-between gap-4 p-4 text-left transition-colors hover:bg-soft/50 sm:p-5"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span
                            className={cn(
                              "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[11px] font-bold transition-colors",
                              isOpen
                                ? "bg-brand-600 text-white"
                                : "bg-soft text-slate-400"
                            )}
                          >
                            {itemNumber}
                          </span>
                          <div className="min-w-0">
                            <span
                              className={cn(
                                "block text-xs sm:text-sm font-bold transition-colors",
                                isOpen ? "text-brand-text" : "text-ink"
                              )}
                            >
                              {faq.q}
                            </span>
                            <span className="mt-1 inline-block rounded-md bg-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-500">
                              {faq.tag}
                            </span>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-all duration-200",
                            isOpen
                              ? "border-brand-500 bg-brand-500/10 text-brand-text rotate-180"
                              : "border-line bg-soft text-slate-400"
                          )}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-line/60 bg-soft/30 px-5 py-4 pl-12 text-xs sm:text-sm leading-relaxed text-body">
                              {isHtml(faq.a) ? <RichText html={faq.a} /> : <p>{faq.a}</p>}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
