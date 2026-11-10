import Container from "./Container";
import GpsHeroArt from "@/components/art/GpsHeroArt";

export default function PageHero({ eyebrow, title, description, children, art }: { eyebrow: string; title: string; description: string; children?: React.ReactNode; art?: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-brand-600/25 blur-3xl" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-px bg-white/15" aria-hidden />
      <Container className="relative grid items-center gap-8 py-10 sm:py-12 md:grid-cols-[1fr_minmax(0,400px)] lg:grid-cols-[1fr_460px]">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-200">{eyebrow}</p>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">{description}</p>
          {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
        </div>
        <div className="mx-auto w-full max-w-md md:max-w-none">
          <GpsHeroArt art={art} />
        </div>
      </Container>
    </section>
  );
}
