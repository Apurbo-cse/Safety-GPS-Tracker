"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, TrendingUp } from "lucide-react";
import { Button } from "@/components/common/Button";
import Container from "@/components/common/Container";
import { DynIcon } from "@/lib/icons";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";
import SolutionExtras from "@/components/solutions/SolutionExtras";
import { solutions } from "@/data/solutions";
import { cn } from "@/utils/format";
import type { Solution } from "@/types";

const pad = (n: number) => String(n).padStart(2, "0");

export default function SolutionSection({ s, index }: { s: Solution; index: number }) {
  const dispatch = useAppDispatch();
  const flip = index % 2 === 1;
  return (
    <section id={s.id} className={cn("scroll-mt-32 overflow-x-clip py-10 sm:py-16", flip ? "bg-surface" : "bg-soft/30")}>
      <Container className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-10">
        {/* media panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("group relative min-h-[320px] overflow-hidden rounded-lg border border-line bg-white sm:min-h-[420px]", flip && "lg:order-2")}
        >
          <Image
            quality={90}
            src={s.image}
            alt={s.title}
            fill
            sizes="(min-width:1024px) 640px, 100vw"
            className={cn("transition-transform duration-700 group-hover:scale-105", s.contain ? "object-contain p-6 pb-28" : "object-cover")}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/25 to-transparent" />

          {/* top row */}
          <div className="absolute inset-x-3 top-3 flex items-center justify-between">
            <span className="rounded-full bg-navy-950/80 px-2.5 py-1 font-mono text-xs font-bold text-white backdrop-blur">
              {pad(index + 1)} <span className="text-white/50">/ {pad(solutions.length)}</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-navy-950/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" />
                <span className="relative h-2 w-2 rounded-full bg-green-400" />
              </span>
              Tracking live
            </span>
          </div>

          {/* bottom overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
                <DynIcon name={s.icon} className="h-5 w-5" />
              </span>
              <p className="text-lg font-bold text-white sm:text-xl">{s.title}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.features.map((f) => (
                <span key={f} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* content */}
        <motion.div
          initial={{ opacity: 0, x: flip ? -24 : 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-text">
            <span className="h-px w-6 bg-brand-500" />Industry solution {pad(index + 1)}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">{s.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-body">{s.description}</p>

          <h3 className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />Business impact
          </h3>
          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
            {s.benefits.map((b, i) => (
              <div key={b} className="glass relative rounded-lg border border-line p-3 transition-colors hover:border-emerald-500/40">
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{pad(i + 1)}</span>
                <p className="mt-1 text-sm font-semibold leading-snug text-ink">{b}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-brand-text">Core tracking features</h3>
          <ul className="mt-2.5 grid gap-x-4 gap-y-2 sm:grid-cols-2">
            {s.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm font-medium text-body-strong">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/10"><Check className="h-3 w-3 text-brand-600" /></span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button size="md" className="font-bold" onClick={() => dispatch(openDemoModal(`Demo request: ${s.title}`))}>
              Request {s.title} Demo
            </Button>
            <Link href="/pricing" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline">
              See packages <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </Container>
      <SolutionExtras id={s.id} />
    </section>
  );
}
