import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import DeviceCard from "@/components/devices/DeviceCard";
import { devices } from "@/data/devices";

export default function DeviceShowcase() {
  const show = ["premium-without-voice", "premium-pro-voice", "live-video-tracking"].map((id) => devices.find((d) => d.id === id)!);
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Tracking devices" title="Hardware for every kind of vehicle" description="GPS, voice monitoring and video & voice monitoring devices." />
        <div className="swipe-row grid gap-5 md:grid-cols-3">{show.map((d) => <DeviceCard key={d.id} device={d} />)}</div>
        <div className="mt-8 text-center"><Link href="/devices" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline">Browse all devices <ArrowRight className="h-4 w-4" /></Link></div>
      </Container>
    </section>
  );
}
