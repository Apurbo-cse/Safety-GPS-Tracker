import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { plans } from "@/data/pricing";
import { formatBDT } from "@/utils/format";

export default function PackageGallery() {
  return (
    <section className="bg-sec-white py-12 sm:py-16">
      <Container>
        <SectionHeading eyebrow="All packages" title="Pick the device that fits your vehicle" description="Device price plus a monthly charge. Tap a package to compare." />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {plans.filter((p) => p.image && p.siteTitle).map((p) => (
            <Link key={p.id} href="/pricing" className="group glass relative overflow-hidden rounded-md border border-line transition-all hover:-translate-y-0.5 hover:border-brand-400">
              {p.highlight && <span className="absolute left-2 top-2 z-10 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold text-white md:text-xs">{p.highlight}</span>}
              <div className="relative aspect-square bg-white">
                <Image quality={90} src={p.image!} alt={p.siteTitle!} fill sizes="(min-width:768px) 25vw, 50vw" className="object-contain p-3 transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-bold text-ink">{p.siteTitle}</p>
                <p className="mt-0.5 text-xs text-body">{p.name}</p>
                <p className="mt-2 text-sm font-bold text-brand-text">{formatBDT(p.devicePrice)} <span className="text-xs font-medium text-body">+ {formatBDT(p.monthlyCharge)}/mo</span></p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center"><Link href="/pricing" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline">Compare all packages <ArrowRight className="h-4 w-4" /></Link></div>
      </Container>
    </section>
  );
}
