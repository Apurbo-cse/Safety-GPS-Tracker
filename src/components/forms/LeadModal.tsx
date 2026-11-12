"use client";
import { useEffect, useState } from "react";
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
import { errorMessage, useSendContactMutation } from "@/store/apiSlice";

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
  const [send] = useSendContactMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const submit = async (v: Values) => {
    setServerError(null);
    try {
      await send({ kind: "lead", name: v.name, phone: v.phone, subject: context ?? "Call-back request", message: v.note?.trim() || `Please call me back. (${context ?? "website"})` }).unwrap();
      toast.success("Request received — our team will call you back.");
      dispatch(openDemoModal(null));
    } catch (e) { setServerError(errorMessage(e, "Could not send your request. Please try again or call us.")); }
  };

  return (
    <Modal open={!!context} onClose={() => dispatch(openDemoModal(null))} title="Talk to our team">
      <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
        <p className="rounded-md bg-brand-50 px-3 py-2 text-sm font-medium text-brand-text">{context}</p>
        <Field label="Full name" error={errors.name?.message}><input className={inputCls} autoComplete="name" {...register("name")} /></Field>
        <Field label="Mobile number" error={errors.phone?.message}><input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" autoComplete="tel" {...register("phone")} /></Field>
        <Field label="Notes (optional)" error={errors.note?.message}><textarea rows={3} className={inputCls} {...register("note")} /></Field>
        {serverError && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600">{serverError}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send request"}</Button>
        <p className="text-center text-xs text-slate-500">We will call you back on this number.</p>
      </form>
    </Modal>
  );
}
