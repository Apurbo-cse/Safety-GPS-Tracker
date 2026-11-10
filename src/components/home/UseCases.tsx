import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { DynIcon } from "@/lib/icons";
import { solutions } from "@/data/solutions";
import { cn } from "@/utils/format";

const IDS = ["logistics", "construction", "public-transport", "motorcycles"];

export default function UseCases() {
  const list = IDS.map((id) => solutions.find((s) => s.id === id)!);
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeading eyebrow="Use cases" title="See how tracking works on the road" description="What each kind of fleet gets, and why it matters." />
        <div className="space-y-5 sm:space-y-6">
          {list.map((s, i) => (
            <article key={s.id} className="glass grid overflow-hidden rounded-lg border border-line md:grid-cols-2">
              <div className={cn("relative aspect-[16/10] bg-white md:aspect-auto md:min-h-[280px]", i % 2 === 1 && "md:order-2")}>
                <Image quality={90} src={s.image} alt={s.title} fill sizes="(min-width:768px) 50vw, 100vw" className={s.contain ? "object-contain p-4" : "object-cover"} />
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-navy-950/85 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                  <DynIcon name={s.icon} className="h-3.5 w-3.5" />{s.title}
                </span>
              </div>
              <div className="flex flex-col justify-center p-4 sm:p-6">
                <h3 className="text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{s.description}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-body-strong">
                  {s.benefits.map((b) => <li key={b} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />{b}</li>)}
                </ul>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.features.map((f) => <span key={f} className="rounded-full bg-softer px-2.5 py-1 text-xs font-medium text-body-strong">{f}</span>)}
                </div>
                <Link href={`/solutions#${s.id}`} className="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-brand-text hover:underline">Learn more <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
