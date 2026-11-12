"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Bell, DoorOpen, Fence, FileText, KeyRound, Mail, MessageSquare, Palette, Power, Receipt, RotateCcw, ShieldAlert,
  ShieldCheck, Siren, Smartphone, Trash2, Zap, type LucideIcon,
} from "lucide-react";
import { Field, Select } from "@/components/forms/Field";
import PasswordInput from "@/components/forms/PasswordInput";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { passwordSchema } from "@/lib/validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetSettings, toggleAlert, toggleChannel, updateSettings, type AlertKey, type Channel } from "@/store/slices/accountSlice";
import { deleteAccount, saveSettings } from "@/store/thunks";
import { api, ApiError } from "@/lib/api";
import AccountShell, { CARD, Pill, Toggle } from "./AccountShell";

const ALERTS: { key: AlertKey; icon: LucideIcon; t: string; d: string }[] = [
  { key: "ignition", icon: Power, t: "Ignition on / off", d: "When an engine starts or stops." },
  { key: "geofence", icon: Fence, t: "Geo-fence", d: "When a vehicle enters or leaves a zone." },
  { key: "speed", icon: Zap, t: "Over-speed", d: "When a vehicle passes your speed limit." },
  { key: "tamper", icon: DoorOpen, t: "Tamper & device removal", d: "If the tracker is disconnected or a door opens." },
  { key: "sos", icon: Siren, t: "Panic / SOS", d: "Always recommended — emergency button presses." },
  { key: "documents", icon: FileText, t: "BRTA & insurance reminders", d: "Before papers or insurance expire." },
  { key: "billing", icon: Receipt, t: "Billing", d: "New invoices and payment confirmations." },
];
const CHANNELS: { key: Channel; icon: LucideIcon; t: string }[] = [
  { key: "push", icon: Smartphone, t: "App push" },
  { key: "sms", icon: MessageSquare, t: "SMS" },
  { key: "email", icon: Mail, t: "Email" },
];

const pwSchema = z.object({
  current: z.string().min(1, "Enter your current password"),
  next: passwordSchema,
  confirm: z.string(),
}).refine((v) => v.next === v.confirm, { path: ["confirm"], message: "Passwords don't match" });
type Pw = z.infer<typeof pwSchema>;

function Card({ icon: Icon, pill, title, children, aside }: { icon: LucideIcon; pill: string; title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><Icon className="h-5 w-5" /></span>
          <div><Pill>{pill}</Pill><h2 className="mt-1 text-lg font-black tracking-tight text-ink">{title}</h2></div>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Row({ icon: Icon, t, d, children }: { icon?: LucideIcon; t: string; d?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface p-3.5 dark:bg-navy-950/70">
      {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-400" />}
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink">{t}</p>{d && <p className="text-xs text-body">{d}</p>}</div>
      {children}
    </div>
  );
}

export default function SettingsView() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const s = useAppSelector((st) => st.account.settings);
  const loaded = useAppSelector((st) => st.account.loaded);
  const anyChannel = Object.values(s.channels).some(Boolean);

  // ---- autosave: any change is sent to the server after a short pause
  const lastSaved = useRef<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  useEffect(() => {
    if (!loaded) return;
    const json = JSON.stringify(s);
    if (lastSaved.current === null) { lastSaved.current = json; return; } // first load from the server
    if (json === lastSaved.current) return;
    setSaveState("saving");
    const t = setTimeout(() => {
      dispatch(saveSettings(s))
        .then(() => { lastSaved.current = json; setSaveState("saved"); })
        .catch((e) => { setSaveState("error"); toast.error(e instanceof ApiError ? e.message : "Couldn't save your settings"); });
    }, 700);
    return () => clearTimeout(t);
  }, [s, loaded, dispatch]);

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<Pw>({ resolver: zodResolver(pwSchema) });
  const changePw = async (v: Pw) => {
    try { await api.changePassword({ current: v.current, next: v.next }); reset(); toast.success("Password updated"); }
    catch (e) { setError(e instanceof ApiError && e.status === 401 ? "current" : "next", { message: e instanceof ApiError ? e.message : "Could not update the password" }); }
  };

  const removeAccount = async () => {
    if (!window.confirm("Delete your account permanently? Your profile, settings and order history will be removed. This can't be undone.")) return;
    try { await dispatch(deleteAccount()); toast.success("Your account was deleted"); router.push("/"); }
    catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not delete the account"); }
  };

  return (
    <AccountShell title="Settings" subtitle="Alerts, appearance, security and privacy. Changes save automatically." what="your settings">
      <div className="space-y-5">
        <Card icon={Bell} pill="Vehicle alerts" title="What should we tell you about?"
          aside={<div className="flex items-center gap-4"><span role="status" className="text-xs font-semibold text-slate-500">{saveState === "saving" ? "Saving…" : saveState === "saved" ? "✓ Saved" : saveState === "error" ? "Not saved" : ""}</span><button onClick={() => dispatch(resetSettings())} className="inline-flex items-center gap-1.5 text-xs font-semibold text-body hover:text-ink"><RotateCcw className="h-3.5 w-3.5" />Reset defaults</button></div>}>
          <div className="grid gap-2.5 md:grid-cols-2">
            {ALERTS.map((a) => (
              <Row key={a.key} icon={a.icon} t={a.t} d={a.d}><Toggle on={s.alerts[a.key]} onChange={() => dispatch(toggleAlert(a.key))} label={a.t} /></Row>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-surface p-4 dark:bg-navy-950/70">
            <div className="flex items-center justify-between text-sm"><span className="font-semibold text-ink">Speed limit</span><span className="font-black tabular-nums text-brand-600 dark:text-brand-400">{s.speedLimit} {s.units === "km" ? "km/h" : "mph"}</span></div>
            <input type="range" min={30} max={140} step={5} value={s.speedLimit} disabled={!s.alerts.speed} onChange={(e) => dispatch(updateSettings({ speedLimit: Number(e.target.value) }))} aria-label="Speed limit" className="mt-3 w-full accent-brand-600 disabled:opacity-40" />
            <p className="mt-1 text-xs text-body">Over-speed alerts fire above this limit{!s.alerts.speed && " (turn on over-speed alerts to change it)"}.</p>
          </div>
        </Card>

        <Card icon={Smartphone} pill="Delivery" title="How should alerts reach you?">
          <div className="grid gap-2.5 sm:grid-cols-3">
            {CHANNELS.map((c) => <Row key={c.key} icon={c.icon} t={c.t}><Toggle on={s.channels[c.key]} onChange={() => dispatch(toggleChannel(c.key))} label={c.t} /></Row>)}
          </div>
          {!anyChannel && <p role="alert" className="mt-3 flex items-center gap-2 text-xs font-semibold text-amber-600"><ShieldAlert className="h-4 w-4" />All channels are off — you won&apos;t receive any alerts.</p>}
        </Card>

        <Card icon={Palette} pill="Preferences" title="Appearance & language">
          <div className="grid gap-2.5 md:grid-cols-3">
            <Row t="Theme" d="Light or dark"><ThemeToggle /></Row>
            <div className="rounded-lg bg-surface p-3.5 dark:bg-navy-950/70">
              <Field label="SMS & support language"><Select value={s.language} onChange={(e) => dispatch(updateSettings({ language: e.target.value as "en" | "bn" }))}><option value="en">English</option><option value="bn">বাংলা (Bangla)</option></Select></Field>
            </div>
            <div className="rounded-lg bg-surface p-3.5 dark:bg-navy-950/70">
              <Field label="Distance units"><Select value={s.units} onChange={(e) => dispatch(updateSettings({ units: e.target.value as "km" | "mi" }))}><option value="km">Kilometres</option><option value="mi">Miles</option></Select></Field>
            </div>
          </div>
        </Card>

        <Card icon={KeyRound} pill="Security" title="Password & sign-in">
          <Row icon={ShieldCheck} t="Two-step verification" d="Ask for an SMS code when signing in on a new device.">
            <Toggle on={s.twoFactor} onChange={() => dispatch(updateSettings({ twoFactor: !s.twoFactor }))} label="Two-step verification" />
          </Row>
            <form onSubmit={handleSubmit(changePw)} noValidate className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field label="Current password" error={errors.current?.message}><PasswordInput {...register("current")} autoComplete="current-password" aria-invalid={!!errors.current} /></Field>
              <Field label="New password" error={errors.next?.message} hint="8+ characters, a letter and a number"><PasswordInput {...register("next")} autoComplete="new-password" aria-invalid={!!errors.next} /></Field>
              <Field label="Confirm new password" error={errors.confirm?.message}><PasswordInput {...register("confirm")} autoComplete="new-password" aria-invalid={!!errors.confirm} /></Field>
              <div className="sm:col-span-3"><button type="submit" disabled={isSubmitting} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">Update password</button></div>
            </form>
        </Card>

        <Card icon={ShieldAlert} pill="Privacy" title="Communication & data">
          <Row icon={Mail} t="Offers & product news" d="Occasional emails about new devices and packages.">
            <Toggle on={s.marketing} onChange={() => dispatch(updateSettings({ marketing: !s.marketing }))} label="Offers and product news" />
          </Row>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-500/5 p-4">
            <div><p className="text-sm font-semibold text-ink">Delete my account</p><p className="text-xs text-body">Permanently removes your profile, settings and order history.</p></div>
            <button onClick={removeAccount} className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"><Trash2 className="h-4 w-4" />Delete account</button>
          </div>
        </Card>
      </div>
    </AccountShell>
  );
}
