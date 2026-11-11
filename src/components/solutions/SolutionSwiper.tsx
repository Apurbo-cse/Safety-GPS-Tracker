"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { DynIcon } from "@/lib/icons";
import { solutions } from "@/data/solutions";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";
import SolutionExtras from "./SolutionExtras";
import { cn } from "@/utils/format";

export default function SolutionSwiper() {
  const dispatch = useAppDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Sync hash on mount and hash change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const idx = solutions.findIndex((s) => s.id === hash);
      if (idx !== -1) {
        if (swiperRef.current) {
          swiperRef.current.slideTo(idx);
        }
        setActiveIndex(idx);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Auto scroll active tab into view in the navigation chip bar
  useEffect(() => {
    if (!navContainerRef.current) return;
    const activeEl = navContainerRef.current.querySelector<HTMLElement>(`[data-solution-index="${activeIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

  const handleSlideChange = (swiper: SwiperType) => {
    const idx = swiper.activeIndex;
    setActiveIndex(idx);
    if (solutions[idx]) {
      window.history.replaceState(null, "", `#${solutions[idx].id}`);
    }
  };

  return (
    <div className="relative">
      {/* Clean Horizontal Industry Switcher Bar */}
      <div className="sticky top-14 z-30 bg-surface/90 dark:bg-navy-950/90 backdrop-blur-md lg:top-[4.25rem]">
        <Container>
          <div className="flex items-center justify-between gap-3 py-2 sm:py-3">
            <nav
              ref={navContainerRef}
              aria-label="Industries"
              className="-mx-3 px-3 sm:mx-0 sm:px-0 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] py-1"
            >
              {solutions.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  data-solution-index={idx}
                  onClick={() => {
                    swiperRef.current?.slideTo(idx);
                    setActiveIndex(idx);
                  }}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all",
                    activeIndex === idx
                      ? "bg-brand-500 text-white font-bold"
                      : "bg-softer/90 dark:bg-navy-900/90 text-body hover:text-ink"
                  )}
                >
                  <DynIcon name={s.icon} className="h-3.5 w-3.5" />
                  <span>{s.title}</span>
                </button>
              ))}
            </nav>

            {/* Quick Prev / Next Arrows */}
            <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="grid h-8 w-8 place-items-center rounded-md bg-softer/80 dark:bg-navy-900/80 text-ink transition-colors hover:bg-softer"
                aria-label="Previous solution"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="grid h-8 w-8 place-items-center rounded-md bg-softer/80 dark:bg-navy-900/80 text-ink transition-colors hover:bg-softer"
                aria-label="Next solution"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Solution Swiper: Clean, uncluttered and spacious */}
      <Swiper
        modules={[Navigation, EffectFade, Keyboard, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={300}
        autoHeight
        keyboard={{ enabled: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        className="w-full"
      >
        {solutions.map((s) => (
          <SwiperSlide key={s.id}>
            <section id={s.id} className="scroll-mt-24 overflow-x-clip py-4 sm:py-8">
              <Container>
                {/* Clean 2-Column Hero for the active solution */}
                <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
                  {/* Clean Media Panel */}
                  <div className="-mx-3 sm:mx-0 relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-none sm:rounded-md bg-softer/80 dark:bg-navy-900/90">
                    <Image
                      quality={90}
                      src={s.image}
                      alt={s.title}
                      fill
                      priority
                      sizes="(min-width:1024px) 640px, 100vw"
                      className={s.contain ? "object-contain p-4" : "object-cover"}
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Simple live status badge */}
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Live GPS
                    </span>

                    {/* Bottom vehicle title */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <p className="text-lg font-black text-white sm:text-xl">{s.title}</p>
                    </div>
                  </div>

                  {/* Clean Content Column: focused & readable */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Vehicle Telematics
                    </span>

                    <h2 className="mt-1 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
                      {s.title} Tracking &amp; Security
                    </h2>

                    <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-body">
                      {s.description}
                    </p>

                    {/* Key features bullets - shown ONCE, clean & distinct */}
                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Included Features
                      </p>
                      <ul className="mt-2.5 grid grid-cols-2 gap-2.5">
                        {s.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink">
                            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex items-center gap-3">
                      <Button
                        size="md"
                        className="font-bold"
                        onClick={() => dispatch(openDemoModal(`Demo request: ${s.title}`))}
                      >
                        Request Demo
                      </Button>
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-1 rounded-md bg-softer/80 hover:bg-softer px-4 py-2.5 text-sm font-semibold text-ink transition-colors"
                      >
                        Compare Packages <ArrowRight className="h-4 w-4 text-brand-text" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Streamlined Details: Recommended Plan & Common Q&A */}
                <SolutionExtras id={s.id} />
              </Container>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
