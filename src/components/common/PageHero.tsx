import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import Container from "./Container";

/** Background photo for each page's `art` key */
const PHOTOS: Record<string, string> = {
  car: "/img/hero-car.jpg",
  truck: "/img/hero-truck.jpg",
  bike: "/img/hero-bike.jpg",
  van: "/img/industries/business-fleet-v3.jpg",
  cng: "/img/industries/cng-v3.jpg",
  bus: "/img/industries/public-transport-bd2.jpg",
  pickup: "/img/industries/logistics-bd.jpg",
};
const DEFAULT_PHOTO = "/img/industries/private-cars-hd.jpg";
const ROUTE = "M0 30 C 160 30, 220 8, 380 10 S 620 44, 820 26 S 1080 4, 1240 18 S 1400 34, 1440 30";

export default function PageHero({ eyebrow, title, description, children, art }: { eyebrow: string; title: string; description: string; children?: React.ReactNode; art?: string }) {
  const photo = (art && PHOTOS[art]) || DEFAULT_PHOTO;
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <Image src={photo} alt="" fill priority quality={80} sizes="100vw" className="-z-20 object-cover object-center" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/40" />
      <div aria-hidden className="grid-bg absolute inset-0 -z-10 opacity-40" />

      <Container className="relative py-7 sm:py-10">
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1 text-xs text-slate-400">
          <Link href="/" className="flex items-center gap-1 hover:text-white"><Home className="h-3 w-3" />Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-200">{eyebrow}</span>
        </nav>

        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-brand-200 backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping-slow absolute inset-0 rounded-full bg-brand-400" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-brand-400" />
          </span>
          {eyebrow}
        </p>
        <h1 className="mt-2 max-w-3xl text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">{description}</p>
        {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
      </Container>

      {/* GPS route along the bottom edge */}
      <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-6 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d={ROUTE} fill="none" stroke="#f05a22" strokeOpacity=".3" strokeWidth="5" vectorEffect="non-scaling-stroke" />
        <path d={ROUTE} fill="none" stroke="#f98a55" strokeWidth="1.5" strokeDasharray="6 10" className="route-flow" vectorEffect="non-scaling-stroke" />
      </svg>
    </section>
  );
}
