"use client";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import Container from "@/components/common/Container";
import { SITE } from "@/lib/site";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";

/** Dark photo CTA band — same look as the Features page closing band. */
export default function CorporateCta() {
  const dispatch = useAppDispatch();
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] text-white">
      <Image src="/img/hero-truck.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-60" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0c1e31]/95 via-[#0c1e31]/75 to-[#0c1e31]/30" />
      <div aria-hidden className="pointer-events-none absolute -left-10 top-1/2 -z-10 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
      <Container className="flex flex-col items-start justify-between gap-5 py-12 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight sm:text-4xl">Need a custom fleet package?</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-200">Tell us your fleet size and requirements — our corporate sales team will prepare a proposal with volume pricing.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            onClick={() => dispatch(openDemoModal("Custom corporate package enquiry"))}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white transition-all hover:bg-brand-600 active:scale-95"
          >
            Request a proposal <ArrowRight className="h-4 w-4" />
          </button>
          <a href={`tel:${SITE.phone}`} className="inline-flex h-11 items-center gap-2 rounded-lg bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20">
            <Phone className="h-4 w-4" />{SITE.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
