"use client";
import { LifeBuoy, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

/** Self-service reset needs an email/SMS provider (not connected yet), so route people to support. */
export default function ForgotForm() {
  return (
    <div className="rounded-lg bg-softer/80 p-6 text-center dark:bg-navy-900/90">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400"><LifeBuoy className="h-7 w-7" /></span>
      <p className="mt-3 font-semibold text-ink">We&apos;ll reset it for you</p>
      <p className="mt-1 text-sm text-body">Call our 24×7 helpline with your registered mobile number and we&apos;ll verify you and set a new password.</p>
      <a href={`tel:${SITE.phone}`} className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-bold text-white hover:bg-brand-600"><Phone className="h-4 w-4" />{SITE.phone}</a>
      <p className="mt-3 text-xs text-slate-500">If you&apos;re signed in, you can also change it any time in Settings → Security.</p>
    </div>
  );
}
