"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, FileText, Headset, Info, Landmark, Lock, Phone, Printer, Receipt, ShieldCheck, User,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Field, inputCls } from "./Field";
import { mobileSchema } from "@/lib/validation";
import { plans } from "@/data/pricing";
import { SITE } from "@/lib/site";
import { formatBDT, cn } from "@/utils/format";

const METHODS = ["bKash", "Nagad", "Rocket", "Bank Transfer"] as const;
type Method = (typeof METHODS)[number];
const METHOD_STYLE: Record<Method, { color: string; note: string }> = {
  bKash: { color: "#e2136e", note: "Mobile wallet" },
  Nagad: { color: "#f6921e", note: "Mobile wallet" },
  Rocket: { color: "#8c3494", note: "Mobile wallet" },
  "Bank Transfer": { color: "#1e3a5f", note: "Any bank" },
};
/** Quick amounts: the published monthly charges, plus 3-month and 6-month multiples of the lowest */
const MONTHLY = [...new Set(plans.map((p) => p.monthlyCharge))].sort((a, b) => a - b);
const QUICK = [...MONTHLY, MONTHLY[0] * 3, MONTHLY[0] * 6];

const schema = z.object({
  customerId: z.string().min(3, "Enter your customer ID"),
  mobile: mobileSchema,
  invoice: z.string().min(4, "Enter the invoice number"),
  amount: z.coerce.number({ message: "Enter an amount" }).min(1, "Amount must be at least ৳1").max(1000000, "Amount is too large"),
  method: z.enum(METHODS, { message: "Choose a payment method" }),
});
type In = z.input<typeof schema>;
type Out = z.output<typeof schema>;
type Step = "form" | "preview" | "done";
const STEPS: { id: Step; label: string }[] = [{ id: "form", label: "Details" }, { id: "preview", label: "Review" }, { id: "done", label: "Done" }];

function MethodBadge({ m, size = "h-8 w-8" }: { m: Method; size?: string }) {
  const s = METHOD_STYLE[m];
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-md text-xs font-black text-white", size)} style={{ background: s.color }}>
      {m === "Bank Transfer" ? <Landmark className="h-4 w-4" /> : m.charAt(0)}
    </span>
  );
}

export default function PayBillForm() {
  const [step, setStep] = useState<Step>("form");
  const [data, setData] = useState<Out | null>(null);
  const [ref, setRef] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<In, unknown, Out>({ resolver: zodResolver(schema), defaultValues: { method: "bKash" } });
  const live = useWatch({ control });
  const method = (live.method ?? "bKash") as Method;
  const amount = Number(live.amount) || 0;
  const stepIdx = STEPS.findIndex((s) => s.id === step);

  const confirm = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRef(`DEMO-${Date.now().toString().slice(-8)}`);
    setPaidAt(new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }));
    setBusy(false);
    setStep("done");
    toast.success("Demo payment confirmed — no money was processed");
  };
  const restart = () => { setStep("form"); setData(null); reset({ method: "bKash" }); };

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1fr_280px]">
      {/* ================= main card ================= */}
      <div className="overflow-hidden rounded-md border border-line bg-surface shadow-sm">
        {/* stepper */}
        <div className="border-b border-line bg-soft px-4 py-2.5">
          <ol className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const done = i < stepIdx, on = i === stepIdx;
              return (
                <li key={s.id} className="flex flex-1 items-center gap-2 last:flex-none">
                  <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors", done ? "bg-green-600 text-white" : on ? "bg-brand-600 text-white" : "bg-line text-slate-500")}>
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className={cn("text-xs font-semibold sm:text-sm", on ? "text-ink" : "text-slate-500")}>{s.label}</span>
                  {i < STEPS.length - 1 && <span className="mx-1 h-0.5 flex-1 overflow-hidden rounded-full bg-line"><span className={cn("block h-full bg-green-600 transition-all duration-500", done ? "w-full" : "w-0")} /></span>}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {/* -------- step 1: details -------- */}
            {step === "form" && (
              <motion.form key="form" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
                onSubmit={handleSubmit((v) => { setData(v); setStep("preview"); })} noValidate className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Customer ID" required icon={User} error={errors.customerId?.message}><input className={inputCls} placeholder="e.g. SGT-10245" aria-invalid={!!errors.customerId} {...register("customerId")} /></Field>
                  <Field label="Mobile number" required icon={Phone} error={errors.mobile?.message}><input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" aria-invalid={!!errors.mobile} {...register("mobile")} /></Field>
                  <Field label="Invoice number" required icon={FileText} error={errors.invoice?.message} hint="Example: INV-2026-0011"><input className={inputCls} placeholder="INV-…" aria-invalid={!!errors.invoice} {...register("invoice")} /></Field>
                  <Field label="Payment amount (৳)" required icon={Receipt} error={errors.amount?.message}><input type="number" min={1} inputMode="numeric" className={inputCls} placeholder="0" aria-invalid={!!errors.amount} {...register("amount")} /></Field>
                </div>

                <div>
                  <p className="mb-1.5 text-xs font-semibold text-slate-500">Quick amount</p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK.map((v) => (
                      <button key={v} type="button" onClick={() => setValue("amount", v, { shouldValidate: true })}
                        className={cn("rounded-full border px-3 py-1 text-xs font-semibold tabular-nums transition-colors", amount === v ? "border-brand-500 bg-brand-500/10 text-brand-text" : "border-line-strong bg-surface text-body hover:border-brand-400")}>
                        {formatBDT(v)}
                      </button>
                    ))}
                  </div>
                </div>

                <fieldset>
                  <legend className="mb-1.5 text-sm font-medium text-body-strong">Payment method<span className="ml-0.5 text-brand-600">*</span></legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {METHODS.map((m) => {
                      const on = method === m;
                      return (
                        <label key={m} className={cn("relative flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500/30", on ? "border-brand-500 bg-brand-500/5 shadow-sm" : "border-line-strong hover:border-brand-300")}>
                          <input type="radio" value={m} className="sr-only" {...register("method")} onChange={() => setValue("method", m, { shouldValidate: true })} />
                          <MethodBadge m={m} size="h-7 w-7" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-ink">{m === "Bank Transfer" ? "Bank" : m}</span>
                                                      </span>
                          {on && <Check className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-brand-text" />}
                        </label>
                      );
                    })}
                  </div>
                  {errors.method && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.method.message}</p>}
                </fieldset>

                <Button type="submit" className="w-full">Review payment <ArrowRight className="h-4 w-4" /></Button>
              </motion.form>
            )}

            {/* -------- step 2: review -------- */}
            {step === "preview" && data && (
              <motion.div key="preview" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-4">
                <div className="rounded-md border border-line">
                  <div className="flex items-start justify-between gap-3 border-b border-dashed border-line-strong p-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Invoice</p>
                      <p className="text-base font-bold text-ink">{data.invoice}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-brand-text">Safety GPS Tracker</p>
                      <p className="text-xs text-slate-500">{new Date().toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 p-4 text-sm">
                    <div><dt className="text-xs text-slate-500">Customer ID</dt><dd className="font-semibold text-ink">{data.customerId}</dd></div>
                    <div><dt className="text-xs text-slate-500">Mobile</dt><dd className="font-semibold text-ink">{data.mobile}</dd></div>
                    <div className="col-span-2"><dt className="text-xs text-slate-500">Pay with</dt><dd className="mt-1 flex items-center gap-2 font-semibold text-ink"><MethodBadge m={data.method} size="h-6 w-6" />{data.method}</dd></div>
                  </dl>
                  <div className="flex items-center justify-between rounded-b-md bg-soft p-4">
                    <span className="text-sm text-body">Amount to pay</span>
                    <span className="text-xl font-black tabular-nums text-ink">{formatBDT(data.amount)}</span>
                  </div>
                </div>
                <p className="flex gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><Info className="h-4 w-4 shrink-0" /><span><b>Demo only.</b> Confirming does not take any money and no data leaves your browser.</span></p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("form")} disabled={busy}><ArrowLeft className="h-4 w-4" />Edit</Button>
                  <Button className="flex-1" onClick={confirm} disabled={busy}>
                    {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Processing…</> : <><Lock className="h-4 w-4" />Confirm {formatBDT(data.amount)}</>}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* -------- step 3: receipt -------- */}
            {step === "done" && data && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="text-center">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }} className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-green-500/15">
                  <CheckCircle2 className="h-7 w-7 text-green-600" />
                </motion.span>
                <h2 className="mt-2 text-lg font-bold text-ink">Payment confirmed</h2>
                <p className="text-sm text-body">Demo receipt — no money was processed.</p>
                <dl className="mx-auto mt-4 max-w-sm divide-y divide-dashed divide-line-strong rounded-md border border-line bg-soft text-left text-sm">
                  {[["Reference", ref], ["Invoice", data.invoice], ["Customer ID", data.customerId], ["Method", data.method], ["Date", paidAt]].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 px-4 py-2.5"><dt className="text-slate-500">{k}</dt><dd className="truncate font-semibold text-ink">{v}</dd></div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-3"><dt className="font-semibold text-ink">Amount paid</dt><dd className="text-lg font-black tabular-nums text-green-600">{formatBDT(data.amount)}</dd></div>
                </dl>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print receipt</Button>
                  <Button onClick={restart}>Make another payment</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ================= side ================= */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        {/* live summary */}
        <div className="overflow-hidden rounded-md border border-line bg-surface shadow-sm">
          <div className="relative bg-navy-950 px-4 py-3 text-white">
            <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
            <div className="relative">
              <p className="text-xs text-slate-400">Payment summary</p>
              <p className="text-2xl font-black tabular-nums">{formatBDT(step === "form" ? amount : data?.amount ?? 0)}</p>
              <p className="mt-1 flex items-center gap-2 text-xs text-slate-300"><MethodBadge m={step === "form" ? method : (data?.method ?? method)} size="h-5 w-5" />via {step === "form" ? method : data?.method}</p>
            </div>
          </div>
          <dl className="space-y-1.5 px-4 py-3 text-sm">
            <div className="flex justify-between"><dt className="text-body">Invoice</dt><dd className="font-semibold text-ink">{(step === "form" ? live.invoice : data?.invoice) || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-body">Customer ID</dt><dd className="font-semibold text-ink">{(step === "form" ? live.customerId : data?.customerId) || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-body">Service charge</dt><dd className="font-semibold text-green-600">{formatBDT(0)}</dd></div>
          </dl>
          <p className="flex items-center gap-1.5 border-t border-line px-4 py-2 text-xs text-slate-500"><ShieldCheck className="h-3.5 w-3.5 text-green-600" />Demo · nothing is charged</p>
          <a href={`tel:${SITE.phone}`} className="flex items-center gap-1.5 border-t border-line px-4 py-2 text-xs font-semibold text-brand-text hover:bg-soft"><Headset className="h-3.5 w-3.5" />Billing help: {SITE.phone}</a>
        </div>

      </aside>
    </div>
  );
}
