"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Info, Landmark, Printer, Smartphone } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Field, inputCls } from "./Field";
import { mobileSchema } from "@/lib/validation";
import { formatBDT, cn } from "@/utils/format";

const METHODS = ["bKash", "Nagad", "Rocket", "Bank Transfer"] as const;
const schema = z.object({
  customerId: z.string().min(3, "Enter your customer ID"),
  mobile: mobileSchema,
  invoice: z.string().min(4, "Enter the invoice number"),
  amount: z.coerce.number({ message: "Enter an amount" }).min(1, "Amount must be at least ৳1").max(1000000, "Amount is too large"),
  method: z.enum(METHODS, { message: "Choose a payment method" }),
});
type In = z.input<typeof schema>;
type Out = z.output<typeof schema>;

export default function PayBillForm() {
  const [step, setStep] = useState<"form" | "preview" | "done">("form");
  const [data, setData] = useState<Out | null>(null);
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<In, unknown, Out>({ resolver: zodResolver(schema), defaultValues: { method: "bKash" } });
  const method = useWatch({ control, name: "method" });

  const confirm = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRef(`DEMO-${Date.now().toString().slice(-8)}`);
    setBusy(false);
    setStep("done");
    toast.success("Demo payment confirmed — no money was processed");
  };

  const banner = (
    <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <Info className="mt-0.5 h-4 w-4 shrink-0" /><p><strong>Demo only.</strong> No actual payment is processed and no data leaves your browser.</p>
    </div>
  );

  if (step === "done" && data) {
    return (
      <div className="space-y-4 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
        <h2 className="text-xl font-bold text-ink">Payment confirmation (demo)</h2>
        <dl className="mx-auto max-w-sm divide-y divide-line-soft rounded-lg glass border border-white/60 dark:border-white/10 text-left text-sm">
          {[["Reference", ref], ["Invoice", data.invoice], ["Method", data.method], ["Amount", formatBDT(data.amount)]].map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-2.5"><dt className="text-slate-500">{k}</dt><dd className="font-semibold text-ink">{v}</dd></div>
          ))}
        </dl>
        {banner}
        <Button variant="outline" onClick={() => { setStep("form"); setData(null); }}>Make another demo payment</Button>
      </div>
    );
  }

  if (step === "preview" && data) {
    return (
      <div className="space-y-4">
        {banner}
        <div className="rounded-lg glass border border-white/60 dark:border-white/10 p-5">
          <div className="flex items-start justify-between">
            <div><p className="text-xs uppercase tracking-wide text-slate-500">Invoice preview</p><p className="text-lg font-bold text-ink">{data.invoice}</p></div>
            <p className="text-sm font-semibold text-brand-text">Safety GPS Tracker</p>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-slate-500">Customer ID</dt><dd className="font-semibold">{data.customerId}</dd></div>
            <div><dt className="text-slate-500">Mobile</dt><dd className="font-semibold">{data.mobile}</dd></div>
            <div><dt className="text-slate-500">Payment method</dt><dd className="font-semibold">{data.method}</dd></div>
            <div><dt className="text-slate-500">Date</dt><dd className="font-semibold">{new Date().toLocaleDateString("en-GB")}</dd></div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-4"><span className="text-sm text-body">Amount to pay</span><span className="text-2xl font-bold text-ink">{formatBDT(data.amount)}</span></div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep("form")} disabled={busy}>Edit</Button>
          <Button className="flex-1" onClick={confirm} disabled={busy}>{busy ? "Processing demo…" : `Confirm demo payment`}</Button>
          <Button variant="ghost" onClick={() => window.print()} aria-label="Print invoice"><Printer className="h-4 w-4" /></Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((v) => { setData(v); setStep("preview"); })} noValidate className="space-y-4">
      {banner}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Customer ID" error={errors.customerId?.message}><input className={inputCls} aria-invalid={!!errors.customerId} {...register("customerId")} /></Field>
        <Field label="Mobile number" error={errors.mobile?.message}><input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" aria-invalid={!!errors.mobile} {...register("mobile")} /></Field>
        <Field label="Invoice number" error={errors.invoice?.message} hint="Example: INV-2026-0011"><input className={inputCls} aria-invalid={!!errors.invoice} {...register("invoice")} /></Field>
        <Field label="Payment amount (৳)" error={errors.amount?.message}><input type="number" min={1} className={inputCls} aria-invalid={!!errors.amount} {...register("amount")} /></Field>
      </div>
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-body-strong">Payment method</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {METHODS.map((m) => (
            <label key={m} className={cn("flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition-colors", method === m ? "border-brand-600 bg-brand-50 text-brand-text" : "border-line-strong text-body-strong hover:border-brand-400")}>
              <input type="radio" value={m} className="sr-only" {...register("method")} onChange={() => setValue("method", m, { shouldValidate: true })} />
              {m === "Bank Transfer" ? <Landmark className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}{m}
            </label>
          ))}
        </div>
        {errors.method && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.method.message}</p>}
      </fieldset>
      <Button type="submit" size="lg" className="w-full">Preview invoice</Button>
    </form>
  );
}
