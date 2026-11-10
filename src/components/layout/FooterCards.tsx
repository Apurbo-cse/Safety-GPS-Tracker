"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import QRCode from "qrcode";
import { CheckCircle2, PhoneCall, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { mobileSchema } from "@/lib/validation";
import { PLAY_STORE_URL, SITE } from "@/lib/site";

const schema = z.object({ name: z.string().min(2, "Enter your name"), mobile: mobileSchema });
type V = z.infer<typeof schema>;

const field = "w-full rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 aria-[invalid=true]:border-red-500";

/** Inline "request a call back" form (frontend demo — nothing is sent). */
export function CallbackCard() {
  const [doneFor, setDoneFor] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(schema) });
  const submit = async (v: V) => {
    await new Promise((r) => setTimeout(r, 700));
    setDoneFor(v.name);
    toast.success("Call-back request recorded (demo)");
    reset();
  };
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5   backdrop-blur">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-600/20 text-brand-400"><PhoneCall className="h-5 w-5" /></span>
        <div><h3 className="text-base font-semibold text-white">Request a call back</h3><p className="text-xs text-slate-400">Leave your number and our team will call you. Or call {SITE.phone} any time — helpline is 24×7.</p></div>
      </div>
      {doneFor ? (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3.5 text-sm text-green-300" role="status">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Thanks, {doneFor}. In a live site our team would call you back. <button onClick={() => setDoneFor(null)} className="font-semibold underline">Send another</button></span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(submit)} noValidate className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="block"><span className="sr-only">Your name</span><input className={field} placeholder="Your name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />{errors.name && <span role="alert" className="mt-1 block text-xs text-red-400">{errors.name.message}</span>}</label>
          <label className="block"><span className="sr-only">Mobile number</span><input className={field} placeholder="01XXXXXXXXX" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.mobile} {...register("mobile")} />{errors.mobile && <span role="alert" className="mt-1 block text-xs text-red-400">{errors.mobile.message}</span>}</label>
          <button type="submit" disabled={isSubmitting} className="gloss-btn h-[2.6rem] rounded-lg px-5 text-sm font-semibold text-white disabled:opacity-60">{isSubmitting ? "Sending…" : "Call me"}</button>
        </form>
      )}
      <p className="mt-3 text-xs text-slate-500">Demo form — nothing is sent to a server.</p>
    </div>
  );
}

/** Android app card with a scannable QR code for the Play Store listing. */
export function AppCard() {
  const [qr, setQr] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    QRCode.toString(PLAY_STORE_URL, { type: "svg", margin: 1, width: 96, color: { dark: "#0b0c0f", light: "#ffffff" } }).then((s) => { if (alive) setQr(s); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  return (
    <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5   backdrop-blur">
      <Image src="/img/app/icon.png" alt="Safety GPS Tracker app icon" width={48} height={52} className="h-14 w-auto shrink-0 drop-shadow-lg" />
      <div className="min-w-0 flex-1">
        <h3 className="flex items-center gap-1.5 text-base font-semibold text-white"><Smartphone className="h-4 w-4 text-brand-400" />Track on the go</h3>
        <p className="mt-0.5 text-xs text-slate-400">Android and iOS tracking apps are included with every package.</p>
        <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Get the Android app on Google Play" className="mt-3 inline-block transition-transform hover:-translate-y-0.5"><Image src="/img/app/play-badge.png" alt="Get it on Google Play" width={130} height={40} className="h-9 w-auto rounded-lg" /></a>
      </div>
      <div className="hidden shrink-0 text-center sm:block">
        <div className="grid h-[104px] w-[104px] place-items-center overflow-hidden rounded-lg bg-white p-1" role="img" aria-label="QR code for the Android app on Google Play">
          {qr ? <span className="block h-24 w-24 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qr }} /> : <span className="h-24 w-24 animate-pulse rounded bg-slate-200" />}
        </div>
        <p className="mt-1.5 text-xs text-slate-500">Scan for Android</p>
      </div>
    </div>
  );
}
