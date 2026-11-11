import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import Container from "@/components/common/Container";
import { solutionDetails } from "@/data/solutionDetails";
import { plans } from "@/data/pricing";
import { formatBDT } from "@/utils/format";

/** Challenges, suits, setup steps and recommended package for one industry. */
export default function SolutionExtras({ id }: { id: string }) {
  const d = solutionDetails[id];
  const plan = d && plans.find((p) => p.id === d.planId);
  if (!d) return null;
  return (
    <Container className="mt-8">
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="glass rounded-md border border-line p-4 lg:col-span-7">
          <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-text"><AlertTriangle className="h-3.5 w-3.5" />Common problems &amp; how tracking helps</h3>
          <ul className="divide-y divide-line">
            {d.problems.map((p) => (
              <li key={p.problem} className="grid gap-1 py-2.5 first:pt-0 last:pb-0 sm:grid-cols-2 sm:gap-4">
                <p className="text-sm font-semibold text-ink">{p.problem}</p>
                <p className="flex gap-2 text-sm text-body"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{p.answer}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
            <span className="text-xs font-semibold text-body">Suits:</span>
            {d.suits.map((s) => <span key={s} className="rounded-full bg-softer px-2.5 py-1 text-xs font-medium text-body-strong">{s}</span>)}
          </div>
        </div>

        <div className="grid gap-4 lg:col-span-5">
          {plan?.image && (
            <Link href="/pricing" className="group glass flex items-center gap-3 rounded-md border border-line p-3 transition-colors hover:border-brand-400">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-white"><Image src={plan.image} alt={plan.siteTitle ?? plan.name} fill sizes="80px" className="object-contain p-1.5" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-text">Recommended package</p>
                <p className="truncate text-sm font-bold text-ink">{plan.siteTitle ?? plan.name}</p>
                <p className="text-xs text-body">{d.planWhy}</p>
                <p className="mt-1 text-sm font-bold text-ink">{formatBDT(plan.devicePrice)} <span className="text-xs font-medium text-body">+ {formatBDT(plan.monthlyCharge)}/mo</span></p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-brand-text transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          <div className="glass rounded-md border border-line p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-text">Typical setup</h3>
            <ol className="space-y-2">
              {d.setup.map((s, i) => (
                <li key={s} className="flex items-center gap-2.5 text-sm text-body-strong">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span>{s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Container>
  );
}
