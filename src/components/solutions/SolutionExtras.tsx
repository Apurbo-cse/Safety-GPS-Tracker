import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { solutionDetails } from "@/data/solutionDetails";
import { plans } from "@/data/pricing";
import { formatBDT } from "@/utils/format";

/** Clean, uncluttered recommended package & key solution Q&A. */
export default function SolutionExtras({ id }: { id: string }) {
  const d = solutionDetails[id];
  const plan = d && plans.find((p) => p.id === d.planId);
  if (!d) return null;

  return (
    <div className="mt-6 pt-6 sm:mt-8 sm:pt-8 border-t border-line/30">
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {/* Card 1: Recommended Hardware & Package */}
        {plan && (
          <div className="-mx-3 sm:mx-0 rounded-none sm:rounded-md flex flex-col justify-between bg-softer/80 dark:bg-navy-900/90 p-4 sm:p-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Recommended Package
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Hardware &amp; Service
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md bg-surface/90 dark:bg-navy-950/70 p-1">
                  {plan.image ? (
                    <Image
                      src={plan.image}
                      alt={plan.siteTitle ?? plan.name}
                      fill
                      sizes="96px"
                      className="object-contain p-1"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-black text-ink">{plan.siteTitle ?? plan.name}</h3>
                  <p className="mt-0.5 text-xs text-body leading-relaxed">{d.planWhy}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-black text-ink">{formatBDT(plan.devicePrice)}</span>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                      +{formatBDT(plan.monthlyCharge)}/month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-line/30 flex items-center justify-between">
              <span className="text-xs text-body">Doorstep installation included</span>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                View Plan Details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Card 2: Key Questions & Telematics Answers */}
        <div className="-mx-3 sm:mx-0 rounded-none sm:rounded-md flex flex-col justify-between bg-softer/80 dark:bg-navy-900/90 p-4 sm:p-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Safety &amp; Telematics
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                24/7 Monitoring
              </span>
            </div>

            <h3 className="mt-2 text-base font-black text-ink">
              Common Questions &amp; How It Works
            </h3>

            <div className="mt-4 space-y-3.5">
              {d.problems.slice(0, 2).map((p) => (
                <div key={p.problem} className="text-xs sm:text-sm">
                  <p className="font-bold text-ink">{p.problem}</p>
                  <p className="mt-1 flex items-start gap-1.5 text-body leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{p.answer}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-line/30 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Suits:</span>
            <div className="flex flex-wrap gap-1.5">
              {d.suits.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-surface/90 dark:bg-navy-950/70 px-2.5 py-0.5 text-[11px] font-semibold text-ink"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
