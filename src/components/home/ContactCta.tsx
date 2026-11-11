import { Clock, MapPin, Phone, ShieldCheck } from "lucide-react";
import Container from "@/components/common/Container";
import { LinkButton } from "@/components/common/Button";
import { SITE } from "@/lib/site";

const PERKS = [
  { icon: ShieldCheck, t: "Engine lock & alerts" },
  { icon: MapPin, t: "10-sec live location" },
  { icon: Clock, t: "24×7 helpline" },
];

export default function ContactCta({ title = "Ready to track your vehicles?", className = "" }: { title?: string; className?: string }) {
  return (
    <section className={`pb-8 sm:pb-20 ${className}`}>
      <Container>
        <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] px-4 py-6 text-white sm:px-12 sm:py-10">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent" aria-hidden />
          <div className="pointer-events-none absolute right-[18%] top-1/2 hidden -translate-y-1/2 md:block" aria-hidden>
            {[0, 1, 2].map((k) => <span key={k} className="ring-pulse absolute left-1/2 top-1/2 -ml-28 -mt-28 h-56 w-56 rounded-full border border-brand-400/40" style={{ animationDelay: `${k}s` }} />)}
          </div>
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -left-16 -bottom-20 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-black sm:text-3xl lg:text-4xl">{title}</h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-200">Talk to our telematics sales team, or get in touch for custom commercial fleet proposals.</p>
              <ul className="mt-2.5 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-200">
                {PERKS.map((p) => (
                  <li key={p.t} className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/15 px-2.5 py-0.5 sm:px-3 sm:py-1 text-brand-300 backdrop-blur"><p.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand-400" />{p.t}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
              <LinkButton href={`tel:${SITE.phone}`} variant="light" size="sm" className="flex-1 sm:flex-initial"><Phone className="h-4 w-4" />{SITE.phone}</LinkButton>
              <LinkButton href="/contact" variant="outline" size="sm" className="flex-1 sm:flex-initial !border-white/30 !bg-white/10 !text-white backdrop-blur hover:!bg-white/20">Contact us</LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
