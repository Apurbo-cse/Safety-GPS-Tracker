"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/common/Button";
import Container from "@/components/common/Container";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";
import { cn } from "@/utils/format";
import type { Solution } from "@/types";

export default function SolutionSection({ s, index }: { s: Solution; index: number }) {
  const dispatch = useAppDispatch();
  return (
    <section id={s.id} className={cn("scroll-mt-24 overflow-x-clip py-16 sm:py-20", index % 2 ? "bg-surface" : "bg-soft/30")}>
      <Container className={cn("grid items-center gap-10 lg:grid-cols-2", index % 2 === 1 && "lg:[&>div:first-child]:order-2")}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-white   transition-transform hover:scale-[1.01] sm:aspect-[16/11]"
        >
          <Image quality={90} src={s.image} alt={s.title} fill sizes="(min-width:1024px) 600px, 100vw" className={s.contain ? "object-contain p-6" : "object-cover"} />
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-navy-950/85 px-3 py-1 text-xs font-bold text-white   backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-brand-400" />
            {s.title}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: index % 2 === 1 ? -24 : 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-text mb-3">
            <Sparkles className="h-3 w-3" /> Industry Solution
          </div>
          <h2 className="text-2xl font-black text-ink sm:text-3xl">{s.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-body">{s.description}</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg glass border border-line p-4">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-text">Core Tracking Features</h3>
              <ul className="space-y-2 text-xs font-semibold text-body-strong">
                {s.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg glass border border-line p-4">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Business Impact & ROI</h3>
              <ul className="space-y-2 text-xs font-semibold text-body-strong">
                {s.benefits.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="md" className="font-bold" onClick={() => dispatch(openDemoModal(`Demo request: ${s.title}`))}>
              Request {s.title} Demo
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
