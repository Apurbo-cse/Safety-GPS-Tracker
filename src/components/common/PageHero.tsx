import Container from "./Container";
import VehicleScene from "@/components/art/VehicleScene";
import type { VehicleKind } from "@/components/art/VehicleArt";

export default function PageHero({ eyebrow, title, description, children, art }: { eyebrow: string; title: string; description: string; children?: React.ReactNode; art?: VehicleKind }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" aria-hidden />
      <Container className="relative grid items-center gap-8 py-14 sm:py-16 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-200">{eyebrow}</p>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">{description}</p>
          {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
        </div>
        {art && <VehicleScene kind={art} className="hidden aspect-[16/10] rounded-2xl border border-white/10 lg:block" />}
      </Container>
    </section>
  );
}
