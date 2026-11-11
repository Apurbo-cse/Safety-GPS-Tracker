"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/common/Button";
import Container from "@/components/common/Container";
import { DynIcon } from "@/lib/icons";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";
import SolutionExtras from "@/components/solutions/SolutionExtras";
import { cn } from "@/utils/format";
import type { Solution } from "@/types";

export default function SolutionSection({ s, index }: { s: Solution; index: number }) {
  const dispatch = useAppDispatch();
  const flip = index % 2 === 1;

  return (
    <section
      id={s.id}
      className={cn(
        "scroll-mt-24 overflow-x-clip py-8 sm:py-14",
        flip ? "bg-surface" : "bg-soft"
      )}
    >
      <Container>
        {/* Clean 2-Column Hero: Media + Value Props */}
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Media Panel (Edge-to-edge on mobile, alternating on desktop) */}
          <div
            className={cn(
              "-mx-3 sm:mx-0 relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-none sm:rounded-md bg-softer/80 dark:bg-navy-900/90",
              flip && "lg:order-2"
            )}
          >
            <Image
              quality={90}
              src={s.image}
              alt={s.title}
              fill
              priority={index < 2}
              sizes="(min-width:1024px) 640px, 100vw"
              className={s.contain ? "object-contain p-4" : "object-cover"}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            />

            {/* Live GPS Status Pill */}
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live GPS
            </span>

            {/* Bottom Title Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-500 text-white">
                <DynIcon name={s.icon} className="h-4 w-4" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  Fleet Telematics
                </span>
                <p className="text-base font-black text-white sm:text-xl leading-tight">
                  {s.title}
                </p>
              </div>
            </div>
          </div>

          {/* Content Column: Clean, readable, uncluttered */}
          <div className={cn(flip && "lg:order-1")}>
            <div className="inline-flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-bold text-brand-600 dark:text-brand-400">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                Industry Telematics
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
              {s.title} Tracking &amp; Security
            </h2>

            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-body">
              {s.description}
            </p>

            {/* Included Capabilities: Clean 2-column checklist */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Included Capabilities
              </p>
              <ul className="mt-2.5 grid grid-cols-2 gap-2 sm:gap-2.5">
                {s.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span className="truncate">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
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

        {/* Streamlined Recommended Package & Common Questions */}
        <SolutionExtras id={s.id} />
      </Container>
    </section>
  );
}
