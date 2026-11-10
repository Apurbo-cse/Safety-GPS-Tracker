"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Field, inputCls } from "./Field";
import { emailSchema, mobileSchema } from "@/lib/validation";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: emailSchema,
  mobile: mobileSchema,
  subject: z.string().min(3, "Enter a subject"),
  message: z.string().min(10, "Please write at least 10 characters").max(1000, "Maximum 1000 characters"),
});
type Values = z.infer<typeof schema>;

export default function ContactForm() {
  const [sent, setSent] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: Values) => {
    await new Promise((r) => setTimeout(r, 900));
    setSent(v.name);
    toast.success("Message sent successfully (demo)");
    reset();
  };

  if (sent) {
    return (
      <div className="grid place-items-center rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <h2 className="mt-3 text-xl font-bold text-ink">Thank you, {sent}</h2>
        <p className="mt-1 max-w-sm text-sm text-body">Your message has been recorded in this demo. No data was sent to a server; a live site would reply by phone or email.</p>
        <Button className="mt-5" variant="outline" onClick={() => setSent(null)}>Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name?.message}><input className={inputCls} autoComplete="name" aria-invalid={!!errors.name} {...register("name")} /></Field>
        <Field label="Email" error={errors.email?.message}><input type="email" className={inputCls} autoComplete="email" aria-invalid={!!errors.email} {...register("email")} /></Field>
        <Field label="Mobile number" error={errors.mobile?.message}><input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" autoComplete="tel" aria-invalid={!!errors.mobile} {...register("mobile")} /></Field>
        <Field label="Subject" error={errors.subject?.message}><input className={inputCls} aria-invalid={!!errors.subject} {...register("subject")} /></Field>
      </div>
      <Field label="Message / complaint" error={errors.message?.message}><textarea rows={5} className={inputCls} aria-invalid={!!errors.message} {...register("message")} /></Field>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">{isSubmitting ? "Sending…" : "Submit"}</Button>
    </form>
  );
}
