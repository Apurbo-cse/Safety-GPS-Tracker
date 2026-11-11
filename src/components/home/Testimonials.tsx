import { BadgeCheck, MapPin, Star } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { testimonials } from "@/data/testimonials";

const avg = testimonials.reduce((n, t) => n + (t.rating ?? 5), 0) / testimonials.length;

const Stars = ({ n }: { n: number }) => (
  <span className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
    {[...Array(5)].map((_, i) => <Star key={i} className={i < n ? "h-3.5 w-3.5 fill-amber-400 text-amber-400" : "h-3.5 w-3.5 text-slate-300"} />)}
  </span>
);

export default function Testimonials() {
  return (
    <section className="bg-sec-white border-t border-line py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Customer reviews"
          title="Trusted by fleet managers and vehicle owners across Bangladesh"
        />

        <p className="-mt-4 mb-8 flex items-center justify-center gap-2 text-sm text-body">
          <Stars n={Math.round(avg)} />
          <b className="text-ink">{avg.toFixed(1)}</b> average from {testimonials.length} verified reviews
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <figure key={t.id} className="flex flex-col rounded-md border border-line bg-surface p-5">
              <Stars n={t.rating ?? 5} />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-body-strong">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{t.author.charAt(0)}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 text-sm font-bold text-ink">
                    {t.author}
                    <BadgeCheck className="h-4 w-4 shrink-0 fill-blue-500 text-white" aria-label="Verified customer" />
                  </span>
                  <span className="block truncate text-xs text-body">{t.role} · {t.company}</span>
                  <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{t.location}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
