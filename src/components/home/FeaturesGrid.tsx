"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { features, homeFeatureIds } from "@/data/features";
import { DynIcon } from "@/lib/icons";
import { useAppDispatch } from "@/store/hooks";
import { openFeatureModal } from "@/store/slices/uiSlice";
import { cn } from "@/utils/format";

/** Picture for each home feature (photos use cover, device/app shots use contain) */
const MEDIA: Record<string, { src: string; contain?: boolean }> = {
  "real-time-gps-tracking": { src: "/img/platform.png", contain: true },
  "remote-engine-lock": { src: "/img/hero-bike.jpg" },
  "geo-fencing-alerts": { src: "/img/industries/logistics-bd.jpg" },
  "route-history-playback": { src: "/img/hero-truck.jpg" },
  "in-car-voice-monitoring": { src: "/img/packages/voice-gps.png", contain: true },
  "speed-violation-alerts": { src: "/img/hero-car.jpg" },
  "brta-document-expiry-alerts": { src: "/img/industries/business-fleet-v3.jpg" },
  "android-application": { src: "/img/platform.png", contain: true },
};

function FeatureImage({ id, alt, sizes, className }: { id: string; alt: string; sizes: string; className?: string }) {
  const m = MEDIA[id];
  if (!m) return null;
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-soft", className)}>
      <Image src={m.src} alt={alt} fill quality={85} sizes={sizes} className={m.contain ? "object-contain p-3" : "object-cover"} />
    </div>
  );
}

const items = homeFeatureIds.map((id) => features.find((f) => f.id === id)!).filter(Boolean);

export default function FeaturesGrid() {
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(0);
  const f = items[active];

  return (
    <section className="bg-sec-white py-10 sm:py-14">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="[&>div]:mb-0">
            <SectionHeading
              align="left"
              eyebrow="Main features"
              title="Everything you need to run vehicles with confidence"
              description="Tracking, security, driver monitoring, reports and reminders in one platform."
            />
          </div>
          <Link
            href="/features"
            className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-500 hover:text-brand-text sm:self-auto"
          >
            See all features <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_400px] lg:gap-6">
          {/* ---------- feature list ---------- */}
          <ul className="grid content-start gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {items.map((it, i) => {
              const on = i === active;
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-expanded={on}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-all duration-200",
                      on ? "border-brand-500 bg-brand-500/5" : "border-line bg-surface hover:border-brand-300",
                    )}
                  >
                    <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-md transition-colors", on ? "bg-brand-600 text-white" : "bg-softer text-body group-hover:text-brand-text")}>
                      <DynIcon name={it.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate text-sm font-bold", on ? "text-brand-text" : "text-ink")}>{it.title}</span>
                      <span className="block truncate text-xs text-slate-500">{it.category}</span>
                    </span>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform lg:-rotate-90", on && "rotate-180 text-brand-text lg:-rotate-90")} />
                  </button>

                  {/* inline details on phone / tablet */}
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="px-1 pb-1 pt-2 text-sm leading-relaxed text-body">
                          <FeatureImage id={it.id} alt={it.title} sizes="(min-width:640px) 50vw, 100vw" className="mb-2 aspect-[16/9]" />
                          <p>{it.description}</p>
                          <button onClick={() => dispatch(openFeatureModal(it.id))} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-text">
                            Learn more <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* ---------- preview (desktop) ---------- */}
          <div className="hidden lg:block">
            <div className="sticky top-24 overflow-hidden rounded-md border border-line bg-surface">
              <div aria-hidden className="h-1 bg-gradient-to-r from-brand-600 to-brand-400" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="p-4"
                >
                  <FeatureImage id={f.id} alt={f.title} sizes="400px" className="mb-3 aspect-[16/9] border border-line" />
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-text">{f.category}</span>
                    <span className="text-xs font-bold tabular-nums text-slate-400">{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-ink">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-body">{f.description}</p>
                  <p className="mt-3 flex gap-2 rounded-md bg-soft p-2.5 text-sm leading-relaxed text-body-strong">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{f.detail}
                  </p>
                  <button
                    onClick={() => dispatch(openFeatureModal(f.id))}
                    className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text"
                  >
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
