import { Check, Minus } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { solutions } from "@/data/solutions";

/** Which core features each industry leans on, built from the solutions data. */
export default function SolutionMatrix() {
  const feats = Array.from(new Set(solutions.flatMap((s) => s.features)));
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeading eyebrow="At a glance" title="Compare industries side by side" description="The core features each industry uses most." />
        <div className="glass overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-softer/60">
                <th className="sticky left-0 bg-softer/90 p-3 font-semibold text-ink">Feature</th>
                {solutions.map((s) => <th key={s.id} className="p-3 text-center text-xs font-semibold text-body-strong">{s.title}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {feats.map((f) => (
                <tr key={f} className="hover:bg-softer/40">
                  <th scope="row" className="sticky left-0 bg-surface p-3 font-medium text-body-strong">{f}</th>
                  {solutions.map((s) => (
                    <td key={s.id} className="p-3 text-center">
                      {s.features.includes(f) ? <Check className="mx-auto h-4 w-4 text-brand-600" aria-label="Included" /> : <Minus className="mx-auto h-4 w-4 text-line-strong" aria-label="Not featured" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
