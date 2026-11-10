"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { announceNavigation } from "@/lib/navigate";
import { Button } from "@/components/common/Button";
import { Field, Select, inputCls } from "./Field";
import PasswordInput from "./PasswordInput";
import { emailSchema, mobileSchema, passwordSchema } from "@/lib/validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { authStart, loginSuccess } from "@/store/slices/authSlice";

const VEHICLES = ["Private Car", "Motorcycle", "Truck / Logistics", "Bus / Public Transport", "Construction Equipment", "CNG Auto-Rickshaw", "Ship / Cargo", "Business Fleet"];
const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  mobile: mobileSchema,
  email: emailSchema,
  password: passwordSchema,
  confirm: z.string().min(1, "Confirm your password"),
  vehicleType: z.string().min(1, "Select a vehicle type"),
}).refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });
type V = z.infer<typeof schema>;

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.status === "loading");
  const { register, handleSubmit, formState: { errors } } = useForm<V>({ resolver: zodResolver(schema), defaultValues: { vehicleType: "" } });

  const onSubmit = async (v: V) => {
    dispatch(authStart());
    await new Promise((r) => setTimeout(r, 1000));
    dispatch(loginSuccess({ name: v.name, identifier: v.email, vehicleType: v.vehicleType }));
    toast.success("Account created (demo)");
    announceNavigation();
    router.push("/");
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
      <Field label="Vehicle type" error={errors.vehicleType?.message}>
        <Select {...register("vehicleType")}><option value="">Select…</option>{VEHICLES.map((v) => <option key={v}>{v}</option>)}</Select>
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? "Creating account…" : "Create account"}</Button>
    </form>
  );
}
