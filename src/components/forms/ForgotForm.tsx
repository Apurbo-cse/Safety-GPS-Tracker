"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Field, inputCls } from "./Field";
import { phoneRegex } from "@/lib/validation";

const schema = z.object({ identifier: z.string().min(1, "Enter your email or mobile number").refine((v) => z.string().email().safeParse(v).success || phoneRegex.test(v), "Enter a valid email or mobile number") });
type V = z.infer<typeof schema>;

export default function ForgotForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(schema) });
  if (sentTo) return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
      <MailCheck className="mx-auto h-10 w-10 text-green-600" />
      <p className="mt-2 font-semibold text-ink">Reset instructions “sent” to {sentTo}</p>
      <p className="mt-1 text-sm text-body">Demo only — no message was actually sent.</p>
    </div>
  );
  return (
    <form onSubmit={handleSubmit(async (v) => { await new Promise((r) => setTimeout(r, 800)); setSentTo(v.identifier); toast.success("Reset link sent (demo)"); })} noValidate className="space-y-4">
      <Field label="Email / mobile number" error={errors.identifier?.message}><input className={inputCls} {...register("identifier")} /></Field>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send reset link"}</Button>
    </form>
  );
}
