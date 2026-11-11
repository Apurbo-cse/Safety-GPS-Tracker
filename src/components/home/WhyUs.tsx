"use client";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { whyUs } from "@/data/why";

export default function WhyUs() {
  return (
    <section className="bg-sec-white relative overflow-hidden py-16 sm:py-24 border-t border-line">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <Container className="relative">
        <SectionHeading
          eyebrow="The Safety GPS Advantage"
          title="Engineered for reliability on Bangladeshi roads"
          description="Designed to withstand intense heat, road vibration, monsoon humidity, and cellular dead zones across national highways."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((w, idx) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="spotlight card-pro group flex flex-col justify-between rounded-md glass border border-line p-5"
            >
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-md bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <w.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-sm font-black text-ink transition-colors group-hover:text-brand-text">
                  {w.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-body">{w.text}</p>
              </div>

              <div className="mt-4 border-t border-line-soft pt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Standard</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Verified</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
