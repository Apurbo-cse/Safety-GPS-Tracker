"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Quote, Star, CheckCircle, MapPin } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="bg-surface py-16 sm:py-24 border-t border-line">
      <Container>
        <SectionHeading
          eyebrow="Verified Case Studies"
          title="Trusted by fleet managers and vehicle owners across Bangladesh"
          description="Read how logistics directors, private vehicle owners, and commercial operators safeguard assets and eliminate operational waste."
        />

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: true }}
          spaceBetween={24}
          breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}
          className="!pb-12 mt-10"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id} className="!h-auto">
              <figure className="flex h-full flex-col justify-between rounded-lg border border-line bg-soft/40 p-6 sm:p-7   transition-all hover:border-brand-300  ">
                <div>
                  {/* Top Bar: Metric Badge & Star Rating */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {t.metric}
                    </span>
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(t.rating ?? 5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <Quote className="h-7 w-7 text-brand-500/30 mt-4" />
                  <blockquote className="mt-2 text-xs sm:text-sm leading-relaxed text-body-strong italic">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>

                <figcaption className="mt-6 border-t border-line-soft pt-4 flex items-center gap-3 text-xs">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500/10 text-brand-600 font-bold text-sm">
                    {t.author.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-ink text-sm">{t.author}</span>
                      <span title="Verified Customer">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
                      </span>
                    </div>
                    <p className="text-slate-500 truncate">{t.role} · {t.company}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] md:text-xs text-slate-400">
                      <MapPin className="h-3 w-3 text-brand-500" /> {t.location}
                    </p>
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
