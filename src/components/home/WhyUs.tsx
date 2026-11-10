import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { whyUs } from "@/data/why";

export default function WhyUs() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Why choose us" title="Practical tracking, clearly priced" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((w) => (
            <div key={w.title} className="spotlight flex gap-4 rounded-xl border border-line bg-surface p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-text"><w.icon className="h-5 w-5" /></span>
              <div><h3 className="text-[14px] font-bold text-ink">{w.title}</h3><p className="mt-1 text-sm text-body">{w.text}</p></div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
