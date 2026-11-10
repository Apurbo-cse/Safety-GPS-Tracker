"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Field, inputCls } from "./Field";
import PasswordInput from "./PasswordInput";
import { phoneRegex } from "@/lib/validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { authStart, loginSuccess } from "@/store/slices/authSlice";

const schema = z.object({
  identifier: z.string().min(1, "Enter your email or mobile number").refine((v) => z.string().email().safeParse(v).success || phoneRegex.test(v), "Enter a valid email or mobile number"),
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().optional(),
});
type V = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.status === "loading");
  const { register, handleSubmit, formState: { errors } } = useForm<V>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: V) => {
    dispatch(authStart());
    await new Promise((r) => setTimeout(r, 900));
    dispatch(loginSuccess({ name: "Demo Customer", identifier: v.identifier }));
    toast.success("Signed in (demo)");
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field label="Email / mobile number" error={errors.identifier?.message}><input className={inputCls} autoComplete="username" aria-invalid={!!errors.identifier} {...register("identifier")} /></Field>
      <Field label="Password" error={errors.password?.message}><PasswordInput autoComplete="current-password" aria-invalid={!!errors.password} {...register("password")} /></Field>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-body-strong"><input type="checkbox" className="h-4 w-4 accent-brand-600" {...register("remember")} />Remember me</label>
        <Link href="/forgot-password" className="font-semibold text-brand-text hover:underline">Forgot password?</Link>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? "Signing in…" : "Login"}</Button>
    </form>
  );
}
