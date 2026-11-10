"use client";
import Image from "next/image";
import { Check, MapPin } from "lucide-react";
import { Button } from "@/components/common/Button";
import Container from "@/components/common/Container";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";
import { cn } from "@/utils/format";
import type { Solution } from "@/types";

export default function SolutionSection({ s, index }: { s: Solution; index: number }) {
  const dispatch = useAppDispatch();
  return (
    <section id={s.id} className={cn("scroll-mt-24 py-14", index % 2 ? "bg-surface" : "")}>
      <Container className={cn("grid items-center gap-10 lg:grid-cols-2", index % 2 === 1 && "lg:[&>div:first-child]:order-2")}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-white shadow-sm sm:aspect-[16/11]">
          <Image src={s.image} alt={s.title} fill sizes="(min-width:1024px) 600px, 100vw" className={s.contain ? "object-contain p-6" : "object-cover"} />
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-navy-950/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur"><MapPin className="h-3 w-3 text-brand-400" />{s.title}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-ink">{s.title}</h2>
          <p className="mt-2 text-body">{s.description}</p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div><h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-text">Tracking features</h3>
              <ul className="space-y-1.5 text-sm text-body-strong">{s.features.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" />{f}</li>)}</ul></div>
            <div><h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-text">Business benefits</h3>
              <ul className="space-y-1.5 text-sm text-body-strong">{s.benefits.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{f}</li>)}</ul></div>
          </div>
          <Button className="mt-6" onClick={() => dispatch(openDemoModal(`Demo request: ${s.title}`))}>Request a Demo</Button>
        </div>
      </Container>
    </section>
  );
}
