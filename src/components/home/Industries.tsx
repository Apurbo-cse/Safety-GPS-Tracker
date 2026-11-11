import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { solutions } from "@/data/solutions";

export default function Industries() {
  return (
    <section className="bg-sec-white py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Industries we serve" title="Tracking for every kind of fleet" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {solutions.map((s) => (
            <Link key={s.id} href={`/solutions#${s.id}`} className="group overflow-hidden rounded-md glass border border-line transition-all hover:-translate-y-0.5 hover:border-brand-200  ">
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <Image quality={90} src={s.image} alt={s.title} fill sizes="(min-width:1024px) 25vw, 50vw" className={`${s.contain ? "object-contain p-4" : "object-cover"} transition-transform duration-500 group-hover:scale-105`} />
              </div>
              <span className="block px-4 py-3 text-sm font-semibold text-ink group-hover:text-brand-text">{s.title}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
