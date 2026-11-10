"use client";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { whyUs } from "@/data/why";

export default function WhyUs() {
  return (
    <section className="py-16 sm:py-24 bg-soft/30 border-t border-line">
      <Container>
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
              className="group flex flex-col justify-between rounded-lg glass border border-white/60 dark:border-white/10 p-5   transition-all hover:-translate-y-1 hover:border-brand-400  "
            >
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <w.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-sm font-black text-ink transition-colors group-hover:text-brand-text">
                  {w.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-body">{w.text}</p>
              </div>

              <div className="mt-4 border-t border-line-soft pt-3 flex items-center justify-between text-[11px] md:text-xs text-slate-400">
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
