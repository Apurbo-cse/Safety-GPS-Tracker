"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import { features, homeFeatureIds } from "@/data/features";
import { DynIcon } from "@/lib/icons";
import { useAppDispatch } from "@/store/hooks";
import { openFeatureModal } from "@/store/slices/uiSlice";

export default function FeaturesGrid() {
  const dispatch = useAppDispatch();
  const items = homeFeatureIds.map((id) => features.find((f) => f.id === id)!).filter(Boolean);
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Main features" title="Everything you need to run vehicles with confidence" description="Tracking, security, driver monitoring, reports and reminders in one platform." />
        <div className="swipe-row grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((f, i) => {
            return (
              <Reveal key={f.id} delay={(i % 4) * 0.05}>
                <div className="spotlight group flex h-full flex-col rounded-xl border border-line bg-soft/50 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:bg-surface hover:shadow-md">
                  {f.image ? <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-line"><Image src={f.image} alt="" width={56} height={56} className="h-full w-full object-contain" /></span> : <span className="grid h-14 w-14 place-items-center rounded-xl bg-navy-900 text-white transition-colors group-hover:bg-brand-600"><DynIcon name={f.icon} className="h-6 w-6" /></span>}
                  <h3 className="mt-4 text-[14px] font-bold text-ink">{f.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-body">{f.description}</p>
                  <button onClick={() => dispatch(openFeatureModal(f.id))} className="mt-3 inline-flex items-center gap-1 self-start text-sm font-semibold text-brand-text hover:underline">Learn more <ArrowRight className="h-3.5 w-3.5" /></button>
                </div>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-8 text-center"><Link href="/features" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline">See all features <ArrowRight className="h-4 w-4" /></Link></div>
      </Container>
    </section>
  );
}
