"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Banknote, Briefcase, CheckCircle2, Headset, Mail, Phone, Send, Tag, Truck, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Field, Select, inputCls, textareaCls } from "./Field";
import { emailSchema, mobileSchema } from "@/lib/validation";

const DEPARTMENTS = [
  { value: "sales", label: "Sales", desc: "Plans & quotes", icon: Briefcase },
  { value: "support", label: "Support", desc: "Device or app help", icon: Headset },
  { value: "billing", label: "Billing", desc: "Payments & invoices", icon: Banknote },
] as const;

const FLEET_SIZES = ["1 vehicle", "2–5 vehicles", "6–20 vehicles", "21–100 vehicles", "100+ vehicles"];
const MAX = 1000;

const schema = z.object({
  department: z.enum(["sales", "support", "billing"]),
  name: z.string().min(2, "Enter your full name"),
  email: emailSchema,
  mobile: mobileSchema,
  fleet: z.string().min(1, "Select your fleet size"),
  subject: z.string().min(3, "Enter a subject"),
  message: z.string().min(10, "Please write at least 10 characters").max(MAX, `Maximum ${MAX} characters`),
});
type Values = z.infer<typeof schema>;

export default function ContactForm({ showHeader = true }: { showHeader?: boolean } = {}) {
  const [sent, setSent] = useState<string | null>(null);
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { department: "sales", fleet: "" },
  });
  const department = useWatch({ control, name: "department" });
  const length = useWatch({ control, name: "message" })?.length ?? 0;

  const onSubmit = async (v: Values) => {
    await new Promise((r) => setTimeout(r, 900));
    setSent(v.name);
    toast.success("Message sent successfully (demo)");
    reset();
  };

  if (sent) {
    return (
      <div className="grid place-items-center rounded-md border border-green-200 bg-green-50 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <h2 className="mt-3 text-xl font-bold text-ink">Thank you, {sent}</h2>
        <p className="mt-1 max-w-sm text-sm text-body">Your message has been recorded in this demo. No data was sent to a server; a live site would reply by phone or email.</p>
        <Button className="mt-5" variant="outline" onClick={() => setSent(null)}>Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-lg bg-softer/80 dark:bg-navy-900/90 p-5 sm:p-7">
      {showHeader && (
        <div>
          <h2 className="text-lg font-bold text-ink">Send us a message</h2>
          <p className="mt-0.5 text-sm text-body">Pick a team and we&apos;ll route it to the right people.</p>
        </div>
      )}

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-body-strong">Department<span className="ml-0.5 text-brand-600" aria-hidden>*</span></legend>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {DEPARTMENTS.map((d) => {
            const active = department === d.value;
            return (
              <label
                key={d.value}
                className={`relative flex cursor-pointer flex-col items-center gap-1.5 rounded-md border p-3 text-center transition-all duration-200 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-500/20 sm:flex-row sm:items-start sm:text-left ${
                  active ? "border-brand-500 bg-brand-50 shadow-[0_0_0_1px_var(--color-brand-500)]" : "border-line-strong bg-surface/80 hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                <input type="radio" value={d.value} className="sr-only" {...register("department")} />
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md transition-colors ${active ? "bg-brand-600 text-white" : "bg-softer text-body"}`}>
                  <d.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">{d.label}</span>
                  <span className="block text-[11px] leading-tight text-slate-500 sm:text-xs">{d.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required icon={User} error={errors.name?.message}>
          <input className={inputCls} placeholder="Your name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="Email" required icon={Mail} error={errors.email?.message}>
          <input type="email" className={inputCls} placeholder="you@company.com" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        </Field>
        <Field label="Mobile number" required icon={Phone} error={errors.mobile?.message}>
          <input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" autoComplete="tel" aria-invalid={!!errors.mobile} {...register("mobile")} />
        </Field>
        <Field label="Fleet size" required icon={Truck} error={errors.fleet?.message}>
          <Select aria-invalid={!!errors.fleet} {...register("fleet")}>
            <option value="" disabled>Select fleet size…</option>
            {FLEET_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
      </div>

      <Field label="Subject" required icon={Tag} error={errors.subject?.message}>
        <input className={inputCls} placeholder="What is this about?" aria-invalid={!!errors.subject} {...register("subject")} />
      </Field>

      <Field
        label="Message / complaint"
        required
        error={errors.message?.message}
        aside={<span className={`text-xs tabular-nums ${length > MAX ? "text-red-600" : length > MAX * 0.9 ? "text-amber-700" : "text-slate-500"}`}>{length}/{MAX}</span>}
      >
        <span className="relative block">
          <textarea rows={5} className={textareaCls} placeholder="Tell us how we can help…" aria-invalid={!!errors.message} {...register("message")} />
          <span className="pointer-events-none absolute inset-x-3 bottom-2 h-0.5 overflow-hidden rounded-full bg-line-soft">
            <span className={`block h-full rounded-full transition-[width] duration-300 ${length > MAX ? "bg-red-500" : "bg-brand-500"}`} style={{ width: `${Math.min(100, (length / MAX) * 100)}%` }} />
          </span>
        </span>
      </Field>

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">We usually reply within one business day.</p>
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full gap-2 sm:w-auto">
          {isSubmitting ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Sending…</>
          ) : (
            <><Send className="h-4 w-4" /> Send message</>
          )}
        </Button>
      </div>
    </form>
  );
}
