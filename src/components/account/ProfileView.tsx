"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Building2, CreditCard, Heart, Mail, MapPin, Package, Phone, Save, Settings, ShoppingCart, UserRound, type LucideIcon } from "lucide-react";
import { Field, Select, inputCls } from "@/components/forms/Field";
import { phoneRegex } from "@/lib/validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfile } from "@/store/slices/accountSlice";
import { setCartOpen } from "@/store/slices/uiSlice";
import { formatBDT } from "@/utils/format";
import AccountShell, { CARD, Pill, useDisplayName } from "./AccountShell";
import { DIVISIONS } from "./CheckoutView";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  phone: z.string().refine((v) => !v || phoneRegex.test(v), "Enter a valid Bangladeshi mobile number"),
  email: z.string().refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email"),
  company: z.string().max(80),
  address: z.string().max(160),
  division: z.string(),
});
type Values = z.infer<typeof schema>;

export default function ProfileView() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.account.profile);
  const user = useAppSelector((s) => s.auth.user);
  const orders = useAppSelector((s) => s.orders.list);
  const wish = useAppSelector((s) => s.wishlist.ids.length);
  const cart = useAppSelector((s) => s.cart.items.reduce((n, i) => n + i.qty, 0));
  const name = useDisplayName();

  const fromStore = (): Values => ({ ...profile, name: profile.name || user?.name || "" });
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: fromStore() });
  useEffect(() => { reset(fromStore()); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, user]);

  const onSubmit = (v: Values) => { dispatch(updateProfile(v)); toast.success("Profile saved"); };

  const active = orders.filter((o) => o.status !== "cancelled");
  const spent = active.reduce((n, o) => n + o.deviceTotal, 0);
  const stats: { icon: LucideIcon; v: string; l: string; href?: string; onClick?: () => void }[] = [
    { icon: Package, v: String(active.length), l: "Active orders", href: "/orders" },
    { icon: CreditCard, v: formatBDT(spent), l: "Devices ordered" },
    { icon: Heart, v: String(wish), l: "Wishlist", href: "/products#wishlist" },
    { icon: ShoppingCart, v: String(cart), l: "In cart", onClick: () => dispatch(setCartOpen(true)) },
  ];

  return (
    <AccountShell title={`Hi, ${name.split(" ")[0]}`} subtitle="Manage your details, orders and preferences.">
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const body = (<>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><s.icon className="h-5 w-5" /></span>
            <dd className="mt-3 truncate text-2xl font-black tracking-tight text-ink">{s.v}</dd>
            <dt className="text-xs font-medium uppercase tracking-wider text-body">{s.l}</dt>
          </>);
          const cls = `${CARD} block p-5 text-left transition-all hover:-translate-y-1`;
          return s.href ? <Link key={s.l} href={s.href} className={cls}>{body}</Link>
            : s.onClick ? <button key={s.l} onClick={s.onClick} className={cls}>{body}</button>
            : <div key={s.l} className={cls}>{body}</div>;
        })}
      </dl>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className={`${CARD} mt-6 p-5 sm:p-6`}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><Pill>Personal details</Pill><h2 className="mt-2 text-xl font-black tracking-tight text-ink">Your profile</h2></div>
          <p className="text-xs text-slate-500">Used to pre-fill checkout and support requests.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required icon={UserRound} error={errors.name?.message}><input {...register("name")} autoComplete="name" className={inputCls} aria-invalid={!!errors.name} /></Field>
          <Field label="Mobile number" icon={Phone} error={errors.phone?.message}><input {...register("phone")} type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" className={inputCls} aria-invalid={!!errors.phone} /></Field>
          <Field label="Email" icon={Mail} error={errors.email?.message}><input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" className={inputCls} aria-invalid={!!errors.email} /></Field>
          <Field label="Company (optional)" icon={Building2}><input {...register("company")} autoComplete="organization" className={inputCls} /></Field>
          <Field label="Address" icon={MapPin}><input {...register("address")} autoComplete="street-address" placeholder="House, road, area" className={inputCls} /></Field>
          <Field label="Division"><Select {...register("division")}>{DIVISIONS.map((d) => <option key={d}>{d}</option>)}</Select></Field>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={!isDirty || isSubmitting} className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-4 w-4" />Save changes</button>
          {isDirty && <button type="button" onClick={() => reset(fromStore())} className="text-sm font-semibold text-body hover:text-ink">Discard</button>}
        </div>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/orders", icon: Package, t: "Track orders", d: "Installation progress" },
          { href: "/pay-bill", icon: CreditCard, t: "Pay a bill", d: "bKash, Nagad, Rocket" },
          { href: "/settings", icon: Settings, t: "Alert settings", d: "Choose what you hear about" },
        ].map((q) => (
          <Link key={q.href} href={q.href} className={`${CARD} group flex items-center gap-3 p-4 transition-all hover:-translate-y-1`}>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-400"><q.icon className="h-5 w-5" /></span>
            <span><b className="block text-sm text-ink">{q.t}</b><span className="text-xs text-body">{q.d}</span></span>
          </Link>
        ))}
      </div>
    </AccountShell>
  );
}
