import { Phone } from "lucide-react";
import Container from "@/components/common/Container";
import { LinkButton } from "@/components/common/Button";
import { SITE } from "@/lib/site";

export default function ContactCta({ title = "Ready to track your vehicles?" }: { title?: string }) {
  return (
    <section className="pb-16 sm:pb-20">
      <Container>
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-navy-800 via-navy-900 to-[#5a2410] px-6 py-10 text-white   ring-1 ring-white/10 sm:px-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.07] to-transparent" aria-hidden />
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
              <p className="mt-2 max-w-lg text-sm text-brand-100">Talk to our sales team, or create an account to get started.</p>
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
