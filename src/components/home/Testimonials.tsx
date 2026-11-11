"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, MapPin, Quote, Star, TrendingUp, Truck } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/utils/format";

const DURATION = 7000;
const avg = testimonials.reduce((n, t) => n + (t.rating ?? 5), 0) / testimonials.length;
const cities = new Set(testimonials.map((t) => t.location.split(",").pop()!.trim())).size;

const Stars = ({ n, className = "h-3.5 w-3.5" }: { n: number; className?: string }) => (
  <span className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
    {[...Array(5)].map((_, i) => <Star key={i} className={cn(className, i < n ? "fill-amber-400 text-amber-400" : "text-slate-300")} />)}
  </span>
);

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;
  const go = (d: number) => setActive((a) => (a + d + n) % n);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % n), DURATION);
    return () => clearTimeout(t);
  }, [active, paused, n]);

  const t = testimonials[active];

  return (
    <section className="bg-sec-white relative overflow-hidden border-t border-line py-14 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-64 w-[44rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Verified Case Studies"
          title="Trusted by fleet managers and vehicle owners across Bangladesh"
          description="Read how logistics directors, private vehicle owners, and commercial operators safeguard assets and eliminate operational waste."
        />

        <div className="grid gap-5 lg:grid-cols-[340px_1fr]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {/* ---------- left: summary + reviewers ---------- */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-navy-950 via-navy-900 to-[#3a1a0c] p-5 text-white">
              <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
              <div className="relative flex items-end gap-4">
                <p className="text-5xl font-black leading-none tabular-nums">{avg.toFixed(1)}</p>
                <div className="pb-1">
                  <Stars n={Math.round(avg)} className="h-4 w-4" />
                  <p className="mt-1 text-xs text-slate-400">Average customer rating</p>
                </div>
              </div>
              <dl className="relative mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-md border border-white/10 bg-white/5 p-2"><dd className="text-lg font-bold">{n}</dd><dt className="text-[11px] text-slate-400">Verified reviews</dt></div>
                <div className="rounded-md border border-white/10 bg-white/5 p-2"><dd className="text-lg font-bold">{cities}</dd><dt className="text-[11px] text-slate-400">Locations</dt></div>
              </dl>
            </div>

            <ul role="tablist" aria-label="Customer reviews" className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:flex lg:flex-col [&::-webkit-scrollbar]:hidden">
              {testimonials.map((r, i) => {
                const on = i === active;
                return (
                  <li key={r.id} className="w-[72%] shrink-0 sm:w-auto">
                    <button
                      role="tab"
                      aria-selected={on}
                      onClick={() => setActive(i)}
                      className={cn(
                        "relative flex w-full items-center gap-3 overflow-hidden rounded-md border p-3 text-left transition-all duration-300",
                        on ? "border-brand-500 bg-gradient-to-r from-brand-50 to-surface shadow-md shadow-brand-600/10" : "glass border-line hover:border-brand-300",
                      )}
                    >
                      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white transition-all", on ? "bg-gradient-to-br from-brand-400 to-brand-700 ring-2 ring-brand-500/30" : "bg-slate-400")}>
                        {r.author.charAt(0)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-ink">{r.author}</span>
                        <span className="block truncate text-xs text-body">{r.company}</span>
                      </span>
                      <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-line-soft">
                        {on && (
                          <motion.span
                            key={`${active}-${paused}`}
                            className="block h-full bg-gradient-to-r from-brand-600 to-brand-400"
                            initial={{ width: "0%" }}
                            animate={{ width: paused ? "0%" : "100%" }}
                            transition={{ duration: paused ? 0 : DURATION / 1000, ease: "linear" }}
                          />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ---------- right: featured quote ---------- */}
          <div className="glass relative flex min-h-[360px] flex-col overflow-hidden rounded-md border border-line p-5 sm:p-8" role="tabpanel" aria-live="polite">
            <Quote aria-hidden className="absolute -right-4 -top-4 h-40 w-40 rotate-180 text-brand-500/10" />
            <AnimatePresence mode="wait">
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-1 flex-col"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Stars n={t.rating ?? 5} className="h-4 w-4" />
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3 w-3" />{t.metric}
                  </span>
                  {t.segment && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-softer px-2.5 py-1 text-xs font-medium text-body-strong">
                      <Truck className="h-3 w-3 text-brand-text" />{t.segment}
                    </span>
                  )}
                </div>

                <blockquote className="mt-5 flex-1 text-lg font-medium leading-relaxed text-ink sm:text-xl">&ldquo;{t.quote}&rdquo;</blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-base font-bold text-white ring-4 ring-brand-500/15">{t.author.charAt(0)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1 text-base font-bold text-ink">
                      <span className="truncate">{t.author}</span>
                      <BadgeCheck className="h-4 w-4 shrink-0 fill-blue-500 text-white" aria-label="Verified customer" />
                    </span>
                    <span className="block truncate text-sm text-body">{t.role} · {t.company}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-body"><MapPin className="h-3 w-3 text-brand-500" />{t.location}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            <div className="relative mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold tabular-nums text-slate-400">{String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
              <div className="flex gap-2">
                <button onClick={() => go(-1)} aria-label="Previous review" className="grid h-9 w-9 place-items-center rounded-full border border-line-strong bg-surface text-body transition-colors hover:border-brand-500 hover:bg-brand-600 hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => go(1)} aria-label="Next review" className="grid h-9 w-9 place-items-center rounded-full border border-line-strong bg-surface text-body transition-colors hover:border-brand-500 hover:bg-brand-600 hover:text-white"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
