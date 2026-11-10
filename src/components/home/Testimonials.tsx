"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import { Quote } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Customer feedback" title="What fleet owners value" description="Illustrative sample feedback shown for layout purposes — not attributed to named customers." />
        <Swiper modules={[Pagination, Autoplay]} pagination={{ clickable: true }} autoplay={{ delay: 5000, disableOnInteraction: true }} spaceBetween={20}
          breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }} className="!pb-10">
          {testimonials.map((t) => (
            <SwiperSlide key={t.id} className="!h-auto">
              <figure className="flex h-full flex-col rounded-xl border border-line bg-soft/60 p-6">
                <Quote className="h-6 w-6 text-brand-400" />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-body-strong">{t.quote}</blockquote>
                <figcaption className="mt-4 flex items-center gap-3 text-sm"><Image src="/img/avatar.png" alt="" width={36} height={36} className="h-9 w-9 rounded-full" /><span><span className="font-bold text-ink">{t.role}</span><span className="text-slate-500"> · {t.segment}</span></span></figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
}
