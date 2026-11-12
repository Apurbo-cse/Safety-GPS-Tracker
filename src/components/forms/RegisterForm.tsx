"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { announceNavigation } from "@/lib/navigate";
import { Button } from "@/components/common/Button";
import { Field, inputCls } from "./Field";
import PasswordInput from "./PasswordInput";
import { emailSchema, mobileSchema, passwordSchema } from "@/lib/validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signUp } from "@/store/thunks";
import { safeNext } from "@/lib/redirect";
import { errorMessage } from "@/store/apiSlice";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  mobile: mobileSchema,
  email: emailSchema,
  password: passwordSchema,
  confirm: z.string().min(1, "Confirm your password"),
}).refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });
type V = z.infer<typeof schema>;

export default function RegisterForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.status === "loading");
  const { register, handleSubmit, setError, formState: { errors } } = useForm<V>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: V) => {
    try {
      await dispatch(signUp({ name: v.name, mobile: v.mobile, email: v.email, password: v.password }));
      toast.success("Account created — welcome!");
      announceNavigation();
      router.push(next);
    } catch (e) {
      const msg = errorMessage(e, "Could not create the account. Please try again.");
      setError((e as { status?: number }).status === 409 ? "email" : "root", { message: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field label="Full name" error={errors.name?.message}><input className={inputCls} autoComplete="name" {...register("name")} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mobile number" error={errors.mobile?.message}><input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" {...register("mobile")} /></Field>
        <Field label="Email" error={errors.email?.message}><input type="email" className={inputCls} autoComplete="email" {...register("email")} /></Field>
        <Field label="Password" error={errors.password?.message}><PasswordInput autoComplete="new-password" {...register("password")} /></Field>
        <Field label="Confirm password" error={errors.confirm?.message}><PasswordInput autoComplete="new-password" {...register("confirm")} /></Field>
      </div>
      {errors.root && <p role="alert" className="text-sm font-medium text-red-600">{errors.root.message}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? "Creating account…" : "Create account"}</Button>
    </form>
  );
}
