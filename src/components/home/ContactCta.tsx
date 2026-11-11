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
    <section className={`pb-16 sm:pb-20 ${className}`}>
      <Container>
        <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-navy-800 via-navy-900 to-[#5a2410] px-6 py-10 text-white   ring-1 ring-white/10 sm:px-12">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.07] to-transparent" aria-hidden />
          <div className="pointer-events-none absolute right-[18%] top-1/2 hidden -translate-y-1/2 md:block" aria-hidden>
            {[0, 1, 2].map((k) => <span key={k} className="ring-pulse absolute left-1/2 top-1/2 -ml-28 -mt-28 h-56 w-56 rounded-full border border-brand-400/40" style={{ animationDelay: `${k}s` }} />)}
          </div>
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
              <p className="mt-2 max-w-lg text-sm text-brand-100">Talk to our sales team, or create an account to get started.</p>
              <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
                {PERKS.map((p) => (
                  <li key={p.t} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 backdrop-blur"><p.icon className="h-3.5 w-3.5 text-brand-300" />{p.t}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton href={`tel:${SITE.phone}`} variant="light" size="lg" className="   "><Phone className="h-4 w-4" />{SITE.phone}</LinkButton>
              <LinkButton href="/contact" variant="outline" size="lg" className="!border-white/40 !bg-transparent !text-white hover:!bg-white/10">Contact us</LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
