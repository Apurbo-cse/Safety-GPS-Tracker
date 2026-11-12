"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight, Banknote, Calendar, Car, CheckCircle2, ChevronRight, CreditCard, Home, Lock, Mail, MapPin, Minus,
  Building2, Package, Phone, Plus, Receipt, ShieldCheck, ShoppingCart, Smartphone, Trash2, UserRound, Wrench,
} from "lucide-react";
import Container from "@/components/common/Container";
import { Field, Select, inputCls, textareaCls } from "@/components/forms/Field";
import { emailSchema, mobileSchema } from "@/lib/validation";
import { useSite } from "@/components/providers/SiteProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeFromCart, setQty } from "@/store/slices/cartSlice";
import type { Order, PaymentMethod } from "@/store/slices/ordersSlice";
import { errorMessage, useCreateOrderMutation, useQuoteOrderMutation, useUpdateProfileMutation } from "@/store/apiSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { cn, formatBDT } from "@/utils/format";
import { CARD, GateSkeleton, LoginGate, Pill } from "./AccountShell";

export const DIVISIONS = ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"] as const;
const VEHICLES = ["Private car", "Motorcycle", "Microbus / van", "Truck / covered van", "Bus", "CNG auto-rickshaw", "Construction equipment", "Other"] as const;
const PAYMENTS: { id: PaymentMethod; hint: string; icon: typeof Smartphone }[] = [
  { id: "bKash", hint: "Mobile wallet", icon: Smartphone },
  { id: "Nagad", hint: "Mobile wallet", icon: Smartphone },
  { id: "Rocket", hint: "Mobile wallet", icon: Smartphone },
  { id: "Card", hint: "Visa / Mastercard", icon: CreditCard },
  { id: "Cash on installation", hint: "Pay the technician", icon: Banknote },
];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  phone: mobileSchema,
  email: emailSchema,
  address: z.string().trim().min(6, "Enter the installation address"),
  division: z.enum(DIVISIONS),
  vehicleReg: z.string().trim().min(3, "Enter the registration number"),
  vehicleType: z.enum(VEHICLES),
  preferredDate: z.string().min(1, "Pick a preferred date"),
  note: z.string().max(300, "Keep it under 300 characters").optional(),
  payment: z.enum(["bKash", "Nagad", "Rocket", "Card", "Cash on installation"]),
  agree: z.literal(true, { message: "Please accept the terms to continue" }),
  saveProfile: z.boolean(),
  // billing: the invoice goes to the person ordering unless another party pays
  sameBilling: z.boolean(),
  company: z.string().trim().max(120).optional(),
  taxId: z.string().trim().regex(/^[A-Za-z0-9-]{0,30}$/, "Letters, digits and dashes only").optional(),
  billingName: z.string().trim().optional(),
  billingAddress: z.string().trim().optional(),
  billingDivision: z.enum(DIVISIONS),
  billingPostcode: z.string().trim().regex(/^\d{0,10}$/, "Digits only").optional(),
  billingPhone: z.string().trim().optional(),
  billingEmail: z.string().trim().optional(),
});

type In = z.input<typeof schema>;

/** The billing party's fields only count when "same as above" is off. Checked here (not in the schema) so every problem shows in one pass. */
const billingProblems = (v: In): Partial<Record<keyof In, { type: string; message: string }>> => {
  if (v.sameBilling) return {};
  const out: Partial<Record<keyof In, { type: string; message: string }>> = {};
  const need = (k: keyof In, ok: boolean, message: string) => { if (!ok) out[k] = { type: "custom", message }; };
  need("billingName", (v.billingName ?? "").trim().length >= 2, "Enter the name on the invoice");
  need("billingAddress", (v.billingAddress ?? "").trim().length >= 6, "Enter the billing address");
  need("billingPhone", mobileSchema.safeParse((v.billingPhone ?? "").trim()).success, "Enter a valid mobile number");
  need("billingEmail", emailSchema.safeParse((v.billingEmail ?? "").trim()).success, "Enter a valid email");
  return out;
};
const baseResolver = zodResolver(schema);
const resolver: Resolver<In, unknown, Out> = async (values, context, options) => {
  const r = await baseResolver(values, context, options);
  const extra = billingProblems(values);
  if (!Object.keys(extra).length) return r;
  return { values: {}, errors: { ...("errors" in r ? r.errors : {}), ...extra } } as ReturnType<typeof baseResolver> extends Promise<infer R> ? R : never;
};
type Out = z.output<typeof schema>;

const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); };

function Section({ n, icon: Icon, title, children }: { n: number; icon: typeof Car; title: string; children: React.ReactNode }) {
  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <h2 className="mb-5 flex items-center gap-3 text-lg font-black tracking-tight text-ink">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><Icon className="h-4 w-4" /></span>
        <span className="text-xs font-bold text-slate-400">0{n}</span>{title}
      </h2>
      {children}
    </section>
  );
}

export default function CheckoutView() {
  const site = useSite();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const profile = useAppSelector((s) => s.account.profile);
  const user = useAppSelector((s) => s.auth.user);
  const ready = useAppSelector((s) => s.auth.ready);
  const [placed, setPlaced] = useState<Order | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const device = items.reduce((n, i) => n + i.price * i.qty, 0);
  const monthly = items.reduce((n, i) => n + (i.monthly ?? 0) * i.qty, 0);
  const count = items.reduce((n, i) => n + i.qty, 0);

  const defaults = (): In => ({
    name: profile.name || user?.name || "",
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
    division: (DIVISIONS as readonly string[]).includes(profile.division) ? (profile.division as In["division"]) : "Dhaka",
    vehicleReg: "",
    vehicleType: "Private car",
    preferredDate: tomorrow(),
    note: "",
    payment: "bKash",
    agree: false as unknown as true,
    saveProfile: true,
    sameBilling: !profile.billingAddress,
    company: profile.company,
    taxId: profile.taxId,
    billingName: profile.name || user?.name || "",
    billingAddress: profile.billingAddress,
    billingDivision: (DIVISIONS as readonly string[]).includes(profile.billingDivision) ? (profile.billingDivision as In["billingDivision"]) : "Dhaka",
    billingPostcode: profile.billingPostcode,
    billingPhone: profile.phone,
    billingEmail: profile.email,
  });

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty } } = useForm<In, unknown, Out>({ resolver, defaultValues: defaults() });
  const payment = useWatch({ control, name: "payment" });
  const sameBilling = useWatch({ control, name: "sameBilling" });

  // fill in saved profile once it loads from this browser (unless the visitor already typed)
  useEffect(() => { if (!isDirty) reset(defaults()); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, user]);

  const [createOrder] = useCreateOrderMutation();
  // discount code: checked with the server; cleared whenever the cart changes so the shown discount is never stale
  const [quote] = useQuoteOrderMutation();
  const [couponInput, setCouponInput] = useState("");
  const [appliedFor, setApplied] = useState<{ code: string; discount: number; key: string } | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const cartKey = items.map((i) => `${i.id}:${i.qty}`).join(",");
  const applied = appliedFor && appliedFor.key === cartKey ? appliedFor : null; // a changed cart drops the discount until it is applied again
  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setChecking(true); setCouponMsg(null);
    try {
      const q = await quote({ items: items.map((i) => ({ id: i.id, qty: i.qty })), coupon: couponInput.trim() }).unwrap();
      setApplied({ code: q.couponCode ?? couponInput.trim().toUpperCase(), discount: q.discount, key: cartKey });
    } catch (e) { setApplied(null); setCouponMsg(errorMessage(e, "Could not check the coupon")); }
    setChecking(false);
  };
  const discount = applied?.discount ?? 0;
  const [updateProfile] = useUpdateProfileMutation();
  const onSubmit = async (v: Out) => {
    setServerError(null);
    try {
      // Only ids and quantities are sent — the server prices the order from its own catalogue.
      const order = await createOrder({
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
        payment: v.payment, name: v.name, phone: v.phone, email: v.email, address: v.address, division: v.division,
        vehicleReg: v.vehicleReg, vehicleType: v.vehicleType, preferredDate: v.preferredDate, note: v.note?.trim() || undefined,
        ...(applied ? { coupon: applied.code } : {}),
        // left out, the server bills the contact at the installation address
        ...(v.sameBilling && !v.company && !v.taxId ? {} : { billing: v.sameBilling
          ? { name: v.name, company: v.company || undefined, taxId: v.taxId || undefined, address: v.address, division: v.division, phone: v.phone, email: v.email }
          : { name: v.billingName!, company: v.company || undefined, taxId: v.taxId || undefined, address: v.billingAddress!, division: v.billingDivision, postcode: v.billingPostcode || undefined, phone: v.billingPhone!, email: v.billingEmail! } }),
      }).unwrap();
      dispatch(clearCart());
      if (v.saveProfile) void updateProfile({ name: v.name, phone: v.phone, email: v.email, address: v.address, division: v.division, company: v.company ?? "", taxId: v.taxId ?? "", ...(v.sameBilling ? {} : { billingAddress: v.billingAddress, billingDivision: v.billingDivision, billingPostcode: v.billingPostcode ?? "" }) }).unwrap().catch(() => { /* best effort */ });
      setPlaced(order);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success(`Order ${order.id} placed`);
    } catch (e) {
      const msg = errorMessage(e, "Could not place the order. Please try again.");
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <>
      {/* compact dark header */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e] text-white">
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-30" />
        <Container className="py-8 sm:py-10">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs text-slate-300">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-white"><Home className="h-3.5 w-3.5" />Home</Link>
            <ChevronRight className="h-3 w-3 text-slate-400" /><span className="font-medium text-slate-100">Checkout</span>
          </nav>
          <h1 className="text-2xl font-black tracking-tight sm:text-4xl">{placed ? "Order confirmed" : "Checkout"}</h1>
          <ol className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
            {["Cart", "Details & payment", "Confirmed"].map((s, i) => {
              const step = placed ? 2 : 1;
              return (
                <li key={s} className="flex items-center gap-2">
                  <span className={cn("grid h-6 w-6 place-items-center rounded-full", i < step ? "bg-green-500 text-white" : i === step ? "bg-brand-500 text-white" : "bg-white/10 text-slate-300")}>{i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}</span>
                  <span className={i <= step ? "text-white" : "text-slate-400"}>{s}</span>
                  {i < 2 && <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <section className="bg-surface py-8 sm:py-12">
        <Container>
          {placed ? (
            /* ---------------- success ---------------- */
            <div className="mx-auto max-w-2xl text-center">
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-500/15 text-green-600"><CheckCircle2 className="h-10 w-10" /></span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-ink">Thank you, {placed.contact.name.split(" ")[0]}!</h2>
              <p className="mt-2 text-sm text-body">Order <b className="text-ink">{placed.id}</b> is received. Our team will call {placed.contact.phone} to confirm and schedule installation for {new Date(placed.contact.preferredDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}.</p>
              <div className={`${CARD} mt-6 p-5 text-left`}>
                <dl className="grid gap-3 text-sm sm:grid-cols-3">
                  <div><dt className="text-xs text-slate-500">Device total</dt><dd className="text-lg font-black text-ink">{formatBDT(placed.deviceTotal - placed.discount)}</dd></div>
                  <div><dt className="text-xs text-slate-500">Monthly</dt><dd className="text-lg font-black text-ink">{formatBDT(placed.monthlyTotal)}<span className="text-xs font-medium text-body">/mo</span></dd></div>
                  <div><dt className="text-xs text-slate-500">Payment</dt><dd className="text-lg font-black text-ink">{placed.payment}</dd></div>
                </dl>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/orders" className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white transition-colors hover:bg-brand-600"><Package className="h-4 w-4" />View my orders</Link>
                <Link href="/products" className="inline-flex h-11 items-center gap-2 rounded-lg bg-softer/80 px-5 text-sm font-semibold text-ink transition-colors hover:text-brand-600 dark:bg-navy-900/90">Continue shopping</Link>
              </div>
              <p className="mt-4 text-xs text-slate-500">Our team will contact you to confirm. No payment has been taken.</p>
            </div>
          ) : items.length === 0 ? (
            /* ---------------- empty ---------------- */
            <div className={`${CARD} mx-auto max-w-lg p-10 text-center`}>
              <ShoppingCart className="mx-auto h-12 w-12 text-slate-400" />
              <h2 className="mt-3 text-xl font-black text-ink">Your cart is empty</h2>
              <p className="mt-1 text-sm text-body">Add a tracking package or device to check out.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/pricing" className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-bold text-white hover:bg-brand-600">See packages <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/products" className="inline-flex h-11 items-center rounded-lg bg-surface px-5 text-sm font-semibold text-ink hover:text-brand-600 dark:bg-navy-950/70">Browse products</Link>
              </div>
            </div>
          ) : !ready ? (
            <GateSkeleton />
          ) : !user ? (
            <LoginGate what="checkout" next="/checkout" />
          ) : (
            /* ---------------- form + summary ---------------- */
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
              <div className="space-y-5">
                <Section n={1} icon={UserRound} title="Contact details">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" required icon={UserRound} error={errors.name?.message}><input {...register("name")} autoComplete="name" className={inputCls} placeholder="Your name" aria-invalid={!!errors.name} /></Field>
                    <Field label="Mobile number" required icon={Phone} error={errors.phone?.message}><input {...register("phone")} type="tel" autoComplete="tel" className={inputCls} placeholder="01XXXXXXXXX" aria-invalid={!!errors.phone} /></Field>
                    <div className="sm:col-span-2"><Field label="Email" required icon={Mail} error={errors.email?.message}><input {...register("email")} type="email" autoComplete="email" className={inputCls} placeholder="you@example.com" aria-invalid={!!errors.email} /></Field></div>
                  </div>
                </Section>

                <Section n={2} icon={Wrench} title="Installation">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2"><Field label="Installation address" required icon={MapPin} error={errors.address?.message}><input {...register("address")} autoComplete="street-address" className={inputCls} placeholder="House, road, area" aria-invalid={!!errors.address} /></Field></div>
                    <Field label="Division" required><Select {...register("division")}>{DIVISIONS.map((d) => <option key={d}>{d}</option>)}</Select></Field>
                    <Field label="Preferred date" required icon={Calendar} error={errors.preferredDate?.message}><input {...register("preferredDate")} type="date" min={tomorrow()} className={inputCls} aria-invalid={!!errors.preferredDate} /></Field>
                    <Field label="Vehicle type" required><Select {...register("vehicleType")}>{VEHICLES.map((v) => <option key={v}>{v}</option>)}</Select></Field>
                    <Field label="Registration number" required icon={Car} error={errors.vehicleReg?.message}><input {...register("vehicleReg")} className={inputCls} placeholder="Dhaka Metro Ga 12-3456" aria-invalid={!!errors.vehicleReg} /></Field>
                    <div className="sm:col-span-2"><Field label="Note for the technician" error={errors.note?.message}><textarea {...register("note")} className={`${textareaCls} min-h-24`} placeholder="Parking spot, best time to call…" /></Field></div>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-xs text-body"><ShieldCheck className="h-4 w-4 text-green-600" />Doorstep installation by our technicians in all 64 districts.</p>
                </Section>

                <Section n={3} icon={Receipt} title="Billing">
                  <label className="mb-4 flex items-start gap-2.5 text-sm"><input type="checkbox" {...register("sameBilling")} className="mt-0.5 h-4 w-4 accent-brand-600" /><span className="text-body">Send the invoice to the contact and address above</span></label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Company (optional)" icon={Building2} error={errors.company?.message}><input {...register("company")} autoComplete="organization" className={inputCls} placeholder="For a company invoice" /></Field>
                    <Field label="BIN / TIN (optional)" error={errors.taxId?.message}><input {...register("taxId")} className={inputCls} placeholder="Tax or BIN number" aria-invalid={!!errors.taxId} /></Field>
                    {!sameBilling && (
                      <>
                        <Field label="Name on the invoice" required icon={UserRound} error={errors.billingName?.message}><input {...register("billingName")} className={inputCls} aria-invalid={!!errors.billingName} /></Field>
                        <Field label="Billing mobile" required icon={Phone} error={errors.billingPhone?.message}><input {...register("billingPhone")} type="tel" className={inputCls} placeholder="01XXXXXXXXX" aria-invalid={!!errors.billingPhone} /></Field>
                        <div className="sm:col-span-2"><Field label="Billing email" required icon={Mail} error={errors.billingEmail?.message}><input {...register("billingEmail")} type="email" className={inputCls} aria-invalid={!!errors.billingEmail} /></Field></div>
                        <div className="sm:col-span-2"><Field label="Billing address" required icon={MapPin} error={errors.billingAddress?.message}><input {...register("billingAddress")} className={inputCls} placeholder="House, road, area" aria-invalid={!!errors.billingAddress} /></Field></div>
                        <Field label="Division" required><Select {...register("billingDivision")}>{DIVISIONS.map((d) => <option key={d}>{d}</option>)}</Select></Field>
                        <Field label="Postcode (optional)" error={errors.billingPostcode?.message}><input {...register("billingPostcode")} inputMode="numeric" className={inputCls} placeholder="1207" aria-invalid={!!errors.billingPostcode} /></Field>
                      </>
                    )}
                  </div>
                </Section>

                <Section n={4} icon={CreditCard} title="Payment">
                  <div role="radiogroup" aria-label="Payment method" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {PAYMENTS.map((p) => {
                      const on = payment === p.id;
                      return (
                        <label key={p.id} className={cn("relative flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500/40",
                          on ? "bg-brand-500/10 ring-2 ring-brand-500" : "bg-surface hover:-translate-y-0.5 dark:bg-navy-950/70")}>
                          <input type="radio" value={p.id} {...register("payment")} className="sr-only" />
                          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", on ? "bg-brand-500 text-white" : "bg-softer text-body dark:bg-navy-900")}><p.icon className="h-4 w-4" /></span>
                          <span className="min-w-0"><span className="block truncate text-sm font-semibold text-ink">{p.id}</span><span className="block text-xs text-slate-500">{p.hint}</span></span>
                          {on && <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-brand-600" />}
                        </label>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{payment === "Cash on installation" ? "Pay the device price to the technician after installation." : "You'll get a payment link after our team confirms the order."}</p>
                </Section>

                <div className="space-y-2 text-sm">
                  <label className="flex items-start gap-2.5"><input type="checkbox" {...register("saveProfile")} className="mt-0.5 h-4 w-4 accent-brand-600" /><span className="text-body">Save these details to my profile</span></label>
                  <label className="flex items-start gap-2.5"><input type="checkbox" {...register("agree")} className="mt-0.5 h-4 w-4 accent-brand-600" aria-invalid={!!errors.agree} />
                    <span className="text-body">I agree to the <Link href="/terms" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">Terms of Service</Link> and <Link href="/privacy" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">Privacy Policy</Link>.</span></label>
                  {errors.agree && <p role="alert" className="text-xs font-medium text-red-600">{errors.agree.message}</p>}
                </div>
              </div>

              {/* summary */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className={`${CARD} p-5 sm:p-6`}>
                  <div className="flex items-center justify-between"><Pill>Order summary</Pill><span className="text-xs text-slate-500">{count} item{count === 1 ? "" : "s"}</span></div>
                  <ul className="mt-4 space-y-3">
                    {items.map((i) => (
                      <li key={i.id} className="rounded-lg bg-surface p-3 dark:bg-navy-950/70">
                        <div className="flex justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">{i.name}</p>
                            <p className="text-xs text-slate-500">{i.kind === "plan" ? "Package" : "Device"} · {formatBDT(i.price)}{i.monthly ? ` + ${formatBDT(i.monthly)}/mo` : ""}</p>
                          </div>
                          <button type="button" onClick={() => dispatch(removeFromCart(i.id))} aria-label={`Remove ${i.name}`} className="text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-lg bg-softer/80 dark:bg-navy-900">
                            <button type="button" className="grid h-8 w-8 place-items-center" aria-label="Decrease" onClick={() => dispatch(setQty({ id: i.id, qty: i.qty - 1 }))}><Minus className="h-3.5 w-3.5" /></button>
                            <span className="w-7 text-center text-sm font-semibold tabular-nums">{i.qty}</span>
                            <button type="button" className="grid h-8 w-8 place-items-center" aria-label="Increase" onClick={() => dispatch(setQty({ id: i.id, qty: i.qty + 1 }))}><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                          <span className="text-sm font-bold tabular-nums text-ink">{formatBDT(i.price * i.qty)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    {applied ? (
                      <p className="flex items-center justify-between rounded-lg bg-green-500/10 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400">Coupon applied<button type="button" onClick={() => { setApplied(null); setCouponInput(""); }} className="text-xs font-semibold underline">Remove</button></p>
                    ) : (
                      <div className="flex gap-2">
                        <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void applyCoupon(); } }} placeholder="Discount code" aria-label="Discount code" maxLength={30} className={`${inputCls} h-10 uppercase`} />
                        <button type="button" onClick={() => void applyCoupon()} disabled={checking || !couponInput.trim()} className="h-10 shrink-0 rounded-lg bg-surface px-4 text-sm font-semibold text-ink hover:text-brand-600 disabled:opacity-50 dark:bg-navy-950/70">{checking ? "…" : "Apply"}</button>
                      </div>
                    )}
                    {couponMsg && <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">{couponMsg}</p>}
                  </div>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-body">Devices (one-time)</dt><dd className="font-semibold tabular-nums text-ink">{formatBDT(device)}</dd></div>
                    {applied && <div className="flex justify-between"><dt className="text-body">Coupon <span className="font-mono text-xs">{applied.code}</span></dt><dd className="font-semibold tabular-nums text-green-600">−{formatBDT(discount)}</dd></div>}
                    <div className="flex justify-between"><dt className="text-body">Installation</dt><dd className="font-semibold text-green-600">Free</dd></div>
                    <div className="flex justify-between"><dt className="text-body">Monthly service</dt><dd className="font-semibold tabular-nums text-ink">{formatBDT(monthly)}/mo</dd></div>
                    <div className="flex items-baseline justify-between pt-3"><dt className="font-semibold text-ink">Due today</dt><dd className="text-2xl font-black tabular-nums text-ink">{formatBDT(payment === "Cash on installation" ? 0 : device - discount)}</dd></div>
                  </dl>
                  {serverError && <p role="alert" className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600">{serverError}</p>}
                  <button type="submit" disabled={isSubmitting} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 text-sm font-bold text-white transition-all hover:bg-brand-600 active:scale-[.98] disabled:opacity-70">
                    {isSubmitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Placing order…</> : <><Lock className="h-4 w-4" />Place order</>}
                  </button>
                  <p className="mt-3 text-center text-xs text-slate-500">No payment is taken online. Our team confirms by phone. Questions? Call <a href={`tel:${site.phone}`} className="font-semibold text-ink">{site.phone}</a></p>
                </div>
              </aside>
            </form>
          )}
        </Container>
      </section>
    </>
  );
}
