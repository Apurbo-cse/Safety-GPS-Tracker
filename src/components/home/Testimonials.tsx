"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Quote, Star, BadgeCheck, MapPin, TrendingUp, Truck } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { testimonials } from "@/data/testimonials";

const avg = testimonials.reduce((n, t) => n + (t.rating ?? 5), 0) / testimonials.length;
const cities = new Set(testimonials.map((t) => t.location.split(",").pop()!.trim())).size;

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-surface py-12 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-64 w-[44rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Verified Case Studies"
          title="Trusted by fleet managers and vehicle owners across Bangladesh"
          description="Read how logistics directors, private vehicle owners, and commercial operators safeguard assets and eliminate operational waste."
        />

        {/* rating summary */}
        <div className="glass mx-auto -mt-2 mb-8 grid max-w-2xl grid-cols-3 divide-x divide-line rounded-lg border border-line text-center">
          <div className="p-3">
            <p className="flex items-center justify-center gap-1 text-lg font-bold text-ink sm:text-2xl">{avg.toFixed(1)}<Star className="h-4 w-4 fill-amber-400 text-amber-400" /></p>
            <p className="text-xs text-body">Average rating</p>
          </div>
          <div className="p-3">
            <p className="text-lg font-bold text-ink sm:text-2xl">{testimonials.length}</p>
            <p className="text-xs text-body">Verified reviews</p>
          </div>
          <div className="p-3">
            <p className="text-lg font-bold text-ink sm:text-2xl">{cities}</p>
            <p className="text-xs text-body">Locations</p>
          </div>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: true }}
          spaceBetween={16}
          breakpoints={{ 0: { slidesPerView: 1.08 }, 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}
          className="!pb-12"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id} className="!h-auto">
              <figure className="group glass relative flex h-full flex-col overflow-hidden rounded-lg border border-line p-4 transition-all hover:-translate-y-0.5 hover:border-brand-400 sm:p-5">
                <Quote aria-hidden className="absolute -right-2 -top-2 h-20 w-20 rotate-180 text-brand-500/10" />

                <div className="relative flex items-center justify-between gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(t.rating ?? 5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3 w-3" />{t.metric}
                  </span>
                </div>

                <blockquote className="relative mt-3 flex-1 text-sm leading-relaxed text-body-strong">&ldquo;{t.quote}&rdquo;</blockquote>

                {t.segment && (
                  <p className="relative mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-softer px-2.5 py-1 text-xs font-medium text-body-strong">
                    <Truck className="h-3 w-3 text-brand-text" />{t.segment}
                  </p>
                )}

                <figcaption className="relative mt-4 flex items-center gap-3 border-t border-line pt-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-bold text-white ring-2 ring-brand-500/20">
                    {t.author.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-sm font-bold text-ink">
                      <span className="truncate">{t.author}</span>
                      <BadgeCheck className="h-4 w-4 shrink-0 fill-blue-500 text-white" aria-label="Verified customer" />
                    </p>
                    <p className="truncate text-xs text-body">{t.role} · {t.company}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-body"><MapPin className="h-3 w-3 text-brand-500" />{t.location}</p>
                  </div>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
}
