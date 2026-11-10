import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import PlanCard from "@/components/pricing/PlanCard";
import { plans } from "@/data/pricing";

export default function PricingPreview() {
  const show = ["gps-2", "premium-voice", "video-voice"].map((id) => plans.find((p) => p.id === id)!);
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Pricing plans" title="Simple device price plus monthly charge" description="Pay once for the device, then a monthly subscription for the tracking service." />
        <div className="swipe-row grid gap-5 md:grid-cols-3">{show.map((p) => <PlanCard key={p.id} plan={p} showCompare={false} compact />)}</div>
        <div className="mt-8 text-center"><Link href="/pricing" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline">Compare all 8 packages <ArrowRight className="h-4 w-4" /></Link></div>
      </Container>
    </section>
  );
}
