"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Field, inputCls } from "./Field";
import { phoneRegex } from "@/lib/validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().regex(phoneRegex, "Enter a valid Bangladeshi mobile number"),
  note: z.string().max(300).optional(),
});
type Values = z.infer<typeof schema>;

/** Generic "talk to our team" form (demo, request / quote / sales). */
export default function LeadModal() {
  const dispatch = useAppDispatch();
  const context = useAppSelector((s) => s.ui.demoModalSolution);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  useEffect(() => { if (!context) reset(); }, [context, reset]);

  const submit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Request received (demo). Our team would call you back.");
    dispatch(openDemoModal(null));
  };

  return (
    <Modal open={!!context} onClose={() => dispatch(openDemoModal(null))} title="Talk to our team">
      <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
        <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-text">{context}</p>
        <Field label="Full name" error={errors.name?.message}><input className={inputCls} autoComplete="name" {...register("name")} /></Field>
        <Field label="Mobile number" error={errors.phone?.message}><input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" autoComplete="tel" {...register("phone")} /></Field>
        <Field label="Notes (optional)" error={errors.note?.message}><textarea rows={3} className={inputCls} {...register("note")} /></Field>
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send request"}</Button>
        <p className="text-center text-xs text-slate-500">Demo form — nothing is sent to a server.</p>
      </form>
    </Modal>
  );
}
