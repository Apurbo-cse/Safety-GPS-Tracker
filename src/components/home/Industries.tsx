import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { DynIcon } from "@/lib/icons";
import { solutions } from "@/data/solutions";

export default function Industries() {
  return (
    <section className="bg-sec-white py-12 sm:py-16">
      <Container>
        <SectionHeading eyebrow="Industries we serve" title="Tracking for every kind of fleet" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {solutions.map((s) => (
            <Link
              key={s.id}
              href={`/solutions#${s.id}`}
              className="group relative isolate block aspect-[4/5] overflow-hidden rounded-md border border-line bg-navy-950 sm:aspect-[4/3] lg:aspect-[4/5]"
            >
              <Image
                quality={85}
                src={s.image}
                alt={s.title}
                fill
                sizes="(min-width:1024px) 25vw, 50vw"
                className={`-z-10 transition-transform duration-700 group-hover:scale-110 ${s.contain ? "bg-white object-contain p-4" : "object-cover"}`}
              />
              <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/95 via-navy-950/45 to-transparent" />

              <span className="absolute left-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-md bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition-colors group-hover:bg-brand-600 group-hover:ring-brand-500">
                <DynIcon name={s.icon} className="h-4 w-4" />
              </span>
              <span className="absolute right-2.5 top-2.5 grid h-8 w-8 translate-x-2 place-items-center rounded-full bg-white text-navy-950 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>

              <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                <p className="text-sm font-bold leading-snug sm:text-base">{s.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-snug text-slate-300">{s.description}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-brand-200 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />{s.features.length} key features
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
