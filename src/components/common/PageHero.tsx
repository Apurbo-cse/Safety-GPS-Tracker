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

export default function PageHero({
  eyebrow,
  title,
  titleHighlight,
  description,
  children,
  art,
}: {
  eyebrow: string;
  title: string;
  titleHighlight?: string;
  description: string;
  children?: React.ReactNode;
  art?: string;
  badgeText?: string;
}) {
  const photo = (art && PHOTOS[art]) || DEFAULT_PHOTO;
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] text-white">
      {/* Background image with high clarity and luminous atmospheric gradient overlays */}
      <Image
        src={photo}
        alt=""
        fill
        priority
        quality={80}
        sizes="100vw"
        className="-z-30 object-cover object-center opacity-70"
      />
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-r from-[#0c1e31]/95 via-[#0c1e31]/75 to-[#0c1e31]/30" />
      <div aria-hidden className="absolute -left-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -right-20 bottom-1/4 -z-10 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
      <div aria-hidden className="grid-bg absolute inset-0 -z-10 opacity-30 pointer-events-none" />

      <Container className="relative py-10 sm:py-14 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-slate-300">
          <Link href="/" className="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-white">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-medium text-slate-100">{eyebrow}</span>
        </nav> 
        
        <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl text-white">
          {title}
          {titleHighlight && (
            <span className="block mt-1 sm:inline sm:ml-2 bg-gradient-to-r from-brand-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              {titleHighlight}
            </span>
          )}
        </h1>

        <p className="mt-3  text-sm leading-relaxed text-slate-200/90 sm:text-base">
          {description}
        </p>

        {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      </Container>

      {/* GPS route along the bottom edge */}
      <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-6 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d={ROUTE} fill="none" stroke="#f05a22" strokeOpacity=".3" strokeWidth="5" vectorEffect="non-scaling-stroke" />
        <path d={ROUTE} fill="none" stroke="#f98a55" strokeWidth="1.5" strokeDasharray="6 10" className="route-flow" vectorEffect="non-scaling-stroke" />
      </svg>
    </section>
  );
}
