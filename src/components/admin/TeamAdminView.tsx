"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Eye, EyeOff, KeyRound, Lock, Mail, Pencil, Phone, Plus, Search, ShieldCheck, Sparkles, Trash2, UserCheck, UserPlus, UserX, Users, Wand2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import { inputCls, textareaCls } from "@/components/forms/Field";
import type { Permission, RoleRow, StaffMember } from "@/lib/api";
import {
  errorMessage, useAddStaffMutation, useDeleteRoleMutation, useRemoveStaffMutation, useRolesQuery, useSaveRoleMutation,
  useSetStaffPasswordMutation, useStaffQuery, useUpdateStaffMutation,
} from "@/store/apiSlice";
import { useAppSelector } from "@/store/hooks";
import { cn, slug } from "@/utils/format";
import { CARD, EmptyState, ErrorState, PageHeader, Skeleton, StatCard, Switch, fmtDate, view } from "./ui";

type Tab = "staff" | "roles";

const AVATAR = ["bg-sky-500/20 text-sky-700 dark:text-sky-300", "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300", "bg-violet-500/20 text-violet-700 dark:text-violet-300", "bg-amber-500/20 text-amber-700 dark:text-amber-300", "bg-rose-500/20 text-rose-700 dark:text-rose-300", "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300"];
const tone = (key: string) => AVATAR[[...key].reduce((n, c) => n + c.charCodeAt(0), 0) % AVATAR.length];
const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";

function Avatar({ name, id, size = "md" }: { name: string; id: string; size?: "sm" | "md" | "lg" }) {
  return <span aria-hidden className={cn("grid shrink-0 place-items-center rounded-full font-bold", tone(id), size === "lg" ? "h-12 w-12 text-base" : size === "sm" ? "h-7 w-7 text-[10px] ring-2 ring-surface" : "h-10 w-10 text-sm")}>{initials(name)}</span>;
}

/** Permissions grouped by what they are about, so a long list is easy to scan. */
const GROUPS: { title: string; hint: string; ids: Permission[] }[] = [
  { title: "Orders", hint: "Installations, delivery and returns", ids: ["orders.view", "orders.manage"] },
  { title: "Shop & website", hint: "Products, stock and page content", ids: ["products.manage", "content.manage"] },
  { title: "Customers", hint: "People and what they send us", ids: ["customers.view", "messages.manage"] },
  { title: "Money & team", hint: "Sensitive — give carefully", ids: ["finance.view", "staff.manage"] },
];
const PRESETS: { name: string; perms: Permission[] }[] = [
  { name: "Read only", perms: ["orders.view", "customers.view"] },
  { name: "Support", perms: ["orders.view", "orders.manage", "customers.view", "messages.manage"] },
  { name: "Inventory", perms: ["products.manage", "orders.view"] },
];

/** Roles the signed-in person is allowed to hand out: only ones that need no more access than they have. */
function useGrantable() {
  const mine = useAppSelector((s) => s.auth.user?.permissions ?? []);
  return (r?: RoleRow) => !r || r.permissions.every((p) => mine.includes(p));
}

function useCopy() {
  const [done, setDone] = useState<string | null>(null);
  return { done, copy: (text: string) => { void navigator.clipboard?.writeText(text).then(() => { setDone(text); setTimeout(() => setDone(null), 1500); }).catch(() => undefined); } };
}

export default function TeamAdminView() {
  const [tab, setTab] = useState<Tab>("staff");
  return (
    <>
      <PageHeader title="Staff & roles" subtitle="Give each person only the access their job needs." />
      <div role="tablist" aria-label="Team" className="mb-5 inline-flex rounded-full bg-softer/80 p-1 dark:bg-navy-900/90">
        {([["staff", "Staff", Users], ["roles", "Roles & permissions", ShieldCheck]] as const).map(([k, l, Icon]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors", tab === k ? "bg-brand-500 text-white" : "text-body hover:text-ink")}><Icon className="h-4 w-4" />{l}</button>
        ))}
      </div>
      {tab === "staff" ? <StaffTab /> : <RolesTab />}
    </>
  );
}

/* ----------------------------------------------------------------- staff */
function StaffTab() {
  const staff = view(useStaffQuery());
  const roles = useRolesQuery();
  const me = useAppSelector((s) => s.auth.user?.id);
  const [update] = useUpdateStaffMutation();
  const [removeStaff] = useRemoveStaffMutation();
  const [adding, setAdding] = useState(false);
  const [pw, setPw] = useState<StaffMember | null>(null);
  const [edit, setEdit] = useState<StaffMember | null>(null);
  const [q, setQ] = useState("");
  const [roleF, setRoleF] = useState("");
  const [statusF, setStatusF] = useState<"all" | "active" | "blocked">("all");
  const { done, copy } = useCopy();
  const grantable = useGrantable();

  const roleOf = (id: string) => roles.data?.roles.find((r) => r.id === id);
  const act = async (p: Promise<unknown>, ok: string) => { try { await p; toast.success(ok); } catch (e) { toast.error(errorMessage(e, "Could not update")); } };

  const all = staff.data ?? [];
  const term = q.trim().toLowerCase();
  const shown = all.filter((m) => (!roleF || m.roleId === roleF) && (statusF === "all" || (statusF === "blocked") === m.disabled) && (!term || `${m.name} ${m.email} ${m.phone ?? ""}`.toLowerCase().includes(term)));
  const active = all.filter((m) => !m.disabled).length;

  return (
    <>
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="Team" value={String(all.length)} hint="People with admin access" tone="sky" />
        <StatCard icon={UserCheck} label="Active" value={String(active)} hint="Can sign in" tone="green" />
        <StatCard icon={UserX} label="Blocked" value={String(all.length - active)} hint="Sign-in turned off" tone="amber" />
        <StatCard icon={ShieldCheck} label="Roles" value={String(roles.data?.roles.length ?? "–")} hint="Ways to share access" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-52 flex-1 basis-60">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or phone" aria-label="Search staff" className={`${inputCls} !pl-9`} />
        </label>
        <select aria-label="Filter by role" value={roleF} onChange={(e) => setRoleF(e.target.value)} className={`${inputCls} !w-auto`}>
          <option value="">All roles</option>
          {roles.data?.roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <div role="group" aria-label="Filter by status" className="inline-flex rounded-lg bg-softer/80 p-0.5 dark:bg-navy-900/90">
          {(["all", "active", "blocked"] as const).map((k) => <button key={k} onClick={() => setStatusF(k)} aria-pressed={statusF === k} className={cn("rounded-md px-3 py-1.5 text-xs font-semibold capitalize", statusF === k ? "bg-brand-500 text-white" : "text-body hover:text-ink")}>{k}</button>)}
        </div>
        <button onClick={() => setAdding(true)} className="ml-auto inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"><UserPlus className="h-4 w-4" />Add staff</button>
      </div>

      {staff.error ? <ErrorState message={staff.error} onRetry={staff.reload} /> : !staff.data ? <Skeleton rows={3} /> : shown.length === 0 ? (
        <div className={CARD}><EmptyState icon={Users} title={all.length ? "No one matches" : "No staff yet"} text={all.length ? "Try a different search or filter." : "Add someone and choose what they can do."} /></div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((m) => {
            const self = m.id === me;
            const role = roleOf(m.roleId);
            return (
              <li key={m.id} className={cn(`${CARD} flex flex-col gap-3 p-4`, m.disabled && "opacity-70")}>
                <div className="flex items-start gap-3">
                  <Avatar name={m.name} id={m.id} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate text-sm font-bold text-ink">{m.name}{self && <span className="rounded bg-brand-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-600 dark:text-brand-300">You</span>}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500"><span className={cn("h-1.5 w-1.5 rounded-full", m.disabled ? "bg-red-500" : "bg-emerald-500")} />{m.disabled ? "Blocked" : "Active"} · since {fmtDate(m.createdAt)}</p>
                  </div>
                  <Switch on={!m.disabled} disabled={self || !grantable(role)} label={`${m.name} can sign in`} onChange={() => void act(update({ id: m.id, disabled: !m.disabled }).unwrap(), m.disabled ? `${m.name} can sign in again` : `${m.name} is blocked`)} />
                </div>

                <div className="space-y-1.5 text-xs">
                  <button type="button" onClick={() => copy(m.email)} title="Copy email" className="group flex w-full items-center gap-2 rounded-md bg-surface px-2.5 py-1.5 text-left text-body hover:text-ink dark:bg-navy-950/70"><Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" /><span className="min-w-0 flex-1 truncate">{m.email}</span>{done === m.email ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />}</button>
                  {m.phone && <button type="button" onClick={() => copy(m.phone!)} title="Copy number" className="group flex w-full items-center gap-2 rounded-md bg-surface px-2.5 py-1.5 text-left text-body hover:text-ink dark:bg-navy-950/70"><Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" /><span className="min-w-0 flex-1 truncate">{m.phone}</span>{done === m.phone ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />}</button>}
                </div>

                <div>
                  <select aria-label={`Role of ${m.name}`} value={m.roleId} disabled={self || !roles.data || !grantable(role)} title={role && !grantable(role) ? "This person has more access than you, so only someone with the same access can change them" : undefined} onChange={(e) => void act(update({ id: m.id, roleId: e.target.value }).unwrap(), `${m.name} is now ${roleOf(e.target.value)?.name ?? e.target.value}`)}
                    className="h-9 w-full rounded-lg bg-surface px-2.5 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-60 dark:bg-navy-950">
                    {!role && <option value={m.roleId}>{m.roleId}</option>}
                    {roles.data?.roles.map((r) => <option key={r.id} value={r.id} disabled={!grantable(r) && r.id !== m.roleId}>{r.name}{!grantable(r) && r.id !== m.roleId ? " (more access than you)" : ""}</option>)}
                  </select>
                  {role && <p className="mt-1.5 text-[11px] text-slate-500">{role.permissions.length} of {roles.data?.permissions.length ?? 8} permissions{role.description ? ` · ${role.description}` : ""}</p>}
                </div>

                <div className="mt-auto flex items-center justify-end gap-1 border-t border-line-soft pt-2.5">
                  <button disabled={!grantable(role) && !self} onClick={() => setEdit(m)} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-body hover:bg-surface hover:text-brand-600 disabled:opacity-40 dark:hover:bg-navy-950"><Pencil className="h-3.5 w-3.5" />Edit</button>
                  <button disabled={!grantable(role) && !self} onClick={() => setPw(m)} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-body hover:bg-surface hover:text-brand-600 dark:hover:bg-navy-950"><KeyRound className="h-3.5 w-3.5" />New password</button>
                  <button disabled={self || !grantable(role)} onClick={() => { if (window.confirm(`Remove ${m.name} from the staff? They keep a customer account.`)) void act(removeStaff(m.id).unwrap(), "Removed from staff"); }} aria-label={`Remove ${m.name}`} className="grid h-8 w-8 place-items-center rounded-lg text-body hover:bg-red-500/10 hover:text-red-600 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Add staff">{adding && <AddStaffForm roles={roles.data?.roles ?? []} onDone={() => setAdding(false)} />}</Modal>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit ? `Edit ${edit.name}` : ""}>{edit && <EditStaffForm member={edit} onDone={() => setEdit(null)} />}</Modal>
      <Modal open={!!pw} onClose={() => setPw(null)} title={pw ? `New password for ${pw.name}` : ""}>{pw && <PasswordForm member={pw} onDone={() => setPw(null)} />}</Modal>
    </>
  );
}

function EditStaffForm({ member, onDone }: { member: StaffMember; onDone: () => void }) {
  const [v, setV] = useState({ name: member.name, email: member.email, mobile: member.phone ?? "" });
  const [error, setError] = useState<string | null>(null);
  const [update, { isLoading }] = useUpdateStaffMutation();
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const body = {
      ...(v.name.trim() !== member.name ? { name: v.name.trim() } : {}),
      ...(v.email.trim().toLowerCase() !== member.email ? { email: v.email.trim() } : {}),
      ...(v.mobile.trim() && v.mobile.trim() !== (member.phone ?? "") ? { mobile: v.mobile.trim() } : {}),
    };
    if (!Object.keys(body).length) { onDone(); return; }
    try { await update({ id: member.id, ...body }).unwrap(); toast.success("Saved"); onDone(); }
    catch (err) { setError(errorMessage(err, "Could not save")); }
  };
  return (
    <form onSubmit={submit} className="grid gap-4 p-5">
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Name</span><input className={inputCls} value={v.name} onChange={set("name")} required minLength={2} maxLength={120} autoFocus /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Email</span><input type="email" className={inputCls} value={v.email} onChange={set("email")} required /><span className="mt-1 block text-xs text-slate-500">They sign in with this email, so tell them if it changes.</span></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Mobile</span><input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" value={v.mobile} onChange={set("mobile")} /></label>
      {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:text-ink">Cancel</button>
        <button type="submit" disabled={isLoading} className="h-10 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? "Saving…" : "Save"}</button>
      </div>
    </form>
  );
}

function AddStaffForm({ roles, onDone }: { roles: RoleRow[]; onDone: () => void }) {
  const grantable = useGrantable();
  const [v, setV] = useState({ email: "", roleId: roles.find((r) => r.id !== "owner" && grantable(r))?.id ?? "", name: "", mobile: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [add, { isLoading }] = useAddStaffMutation();
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    try {
      await add({ email: v.email.trim(), roleId: v.roleId, ...(v.name.trim() ? { name: v.name.trim() } : {}), ...(v.mobile.trim() ? { mobile: v.mobile.trim() } : {}), ...(v.password ? { password: v.password } : {}) }).unwrap();
      toast.success("Staff added"); onDone();
    } catch (err) { setError(errorMessage(err, "Could not add")); }
  };
  return (
    <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
      <p className="text-sm text-body sm:col-span-2">Enter the email of an existing customer to promote them, or fill in the details to create a new account.</p>
      <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-medium text-body-strong">Email</span><input type="email" className={inputCls} value={v.email} onChange={set("email")} required autoComplete="off" /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Role</span>
        <select className={inputCls} value={v.roleId} onChange={set("roleId")} required>{roles.map((r) => <option key={r.id} value={r.id} disabled={!grantable(r)}>{r.name}{grantable(r) ? "" : " (more access than you)"}</option>)}</select>
        <span className="mt-1 block text-xs text-slate-500">{roles.find((r) => r.id === v.roleId)?.description || "Choose what this person can do."}</span></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Name <span className="font-normal text-slate-500">(new accounts)</span></span><input className={inputCls} value={v.name} onChange={set("name")} autoComplete="off" /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Mobile <span className="font-normal text-slate-500">(new accounts)</span></span><input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" value={v.mobile} onChange={set("mobile")} autoComplete="off" /></label>
      <div className="sm:col-span-2"><PasswordField value={v.password} onChange={(p) => setV((s) => ({ ...s, password: p }))} label="Password (new accounts)" required={false} /></div>
      {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600 sm:col-span-2">{error}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={onDone} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:text-ink">Cancel</button>
        <button type="submit" disabled={isLoading} className="h-10 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? "Adding…" : "Add staff"}</button>
      </div>
    </form>
  );
}

const generatePassword = () => {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint32Array(12));
  return [...bytes].map((n) => chars[n % chars.length]).join("");
};

function PasswordField({ value, onChange, label = "Password", required = true }: { value: string; onChange: (v: string) => void; label?: string; required?: boolean }) {
  const [show, setShow] = useState(false);
  const strength = Math.min(4, (value.length >= 8 ? 1 : 0) + (value.length >= 12 ? 1 : 0) + (/[A-Z]/.test(value) && /[a-z]/.test(value) ? 1 : 0) + (/\d/.test(value) ? 1 : 0));
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-body-strong">{label}</span>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input type={show ? "text" : "password"} className={`${inputCls} !pr-10`} value={value} onChange={(e) => onChange(e.target.value)} required={required} autoComplete="new-password" aria-label={label} />
          <button type="button" onClick={() => setShow((x) => !x)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-slate-500 hover:text-ink">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
        </div>
        <button type="button" onClick={() => { onChange(generatePassword()); setShow(true); }} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-surface px-3 text-xs font-semibold text-ink hover:text-brand-600 dark:bg-navy-950/70"><Wand2 className="h-3.5 w-3.5" />Generate</button>
      </div>
      {value && <div className="mt-2 flex items-center gap-2" aria-hidden><div className="flex flex-1 gap-1">{[1, 2, 3, 4].map((n) => <span key={n} className={cn("h-1 flex-1 rounded-full", n <= strength ? (strength <= 1 ? "bg-red-500" : strength <= 2 ? "bg-amber-500" : "bg-emerald-500") : "bg-line-strong/50")} />)}</div><span className="text-[11px] text-slate-500">{["Too short", "Weak", "Okay", "Good", "Strong"][strength]}</span></div>}
    </div>
  );
}

function PasswordForm({ member, onDone }: { member: StaffMember; onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [setPw, { isLoading }] = useSetStaffPasswordMutation();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    try { await setPw({ id: member.id, password }).unwrap(); toast.success("Password changed"); onDone(); } catch (err) { setError(errorMessage(err, "Could not change the password")); }
  };
  return (
    <form onSubmit={submit} className="grid gap-4 p-5">
      <p className="text-sm text-body">Choose a password for <strong className="text-ink">{member.name}</strong> and share it with them privately.</p>
      <PasswordField value={password} onChange={setPassword} label="New password" />
      {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:text-ink">Cancel</button>
        <button type="submit" disabled={isLoading} className="h-10 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? "Saving…" : "Change password"}</button>
      </div>
    </form>
  );
}

/* ----------------------------------------------------------------- roles */
function RolesTab() {
  const roles = view(useRolesQuery());
  const staff = useStaffQuery();
  const [remove] = useDeleteRoleMutation();
  const [editing, setEditing] = useState<{ role: RoleRow | null } | null>(null);
  const total = roles.data?.permissions.length ?? 8;
  const label = (id: Permission) => roles.data?.permissions.find((p) => p.id === id)?.label ?? id;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-body">A role is a bundle of permissions. Give people a role instead of setting access one by one.</p>
        <button onClick={() => setEditing({ role: null })} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"><Plus className="h-4 w-4" />New role</button>
      </div>
      {roles.error ? <ErrorState message={roles.error} onRetry={roles.reload} /> : !roles.data ? <Skeleton rows={3} /> : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {roles.data.roles.map((r) => {
            const members = (staff.data ?? []).filter((m) => m.roleId === r.id);
            const pct = Math.round((r.permissions.length / total) * 100);
            return (
              <li key={r.id} className={`${CARD} flex flex-col gap-3 p-4`}>
                <div className="flex items-start gap-3">
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg", tone(r.id))}><ShieldCheck className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink">{r.name}{r.system && <span className="inline-flex items-center gap-1 rounded bg-slate-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300"><Lock className="h-3 w-3" />Built-in</span>}</p>
                    <p className="text-xs text-slate-500">{r.description || "No description"}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditing({ role: r })} aria-label={`Edit ${r.name}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-surface hover:text-brand-600 dark:hover:bg-navy-950"><Pencil className="h-4 w-4" /></button>
                    <button disabled={r.system || r.staff > 0} title={r.system ? "Built-in roles can't be deleted" : r.staff ? "Move its people to another role first" : undefined}
                      onClick={() => { if (window.confirm(`Delete the “${r.name}” role?`)) void remove(r.id).unwrap().then(() => toast.success("Role deleted")).catch((e) => toast.error(errorMessage(e, "Could not delete"))); }}
                      aria-label={`Delete ${r.name}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-red-500/10 hover:text-red-600 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-slate-500"><span>Access</span><span>{r.permissions.length} of {total}</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-line-strong/40" role="img" aria-label={`${pct}% of all permissions`}><div className={cn("h-full rounded-full", pct >= 75 ? "bg-amber-500" : "bg-brand-500")} style={{ width: `${pct}%` }} /></div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {GROUPS.map((g) => {
                    const has = g.ids.filter((i) => r.permissions.includes(i));
                    if (!has.length) return null;
                    return <span key={g.title} title={has.map(label).join(", ")} className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:text-brand-300">{g.title}{has.length < g.ids.length ? ` · ${has.map(label).join(", ")}` : ""}</span>;
                  })}
                  {r.permissions.length === 0 && <span className="text-xs text-slate-500">No permissions</span>}
                </div>

                <div className="mt-auto flex items-center gap-2 border-t border-line-soft pt-2.5">
                  {members.length > 0 && <span className="flex -space-x-1.5">{members.slice(0, 5).map((m) => <Avatar key={m.id} name={m.name} id={m.id} size="sm" />)}</span>}
                  <span className="text-xs text-slate-500">{members.length > 5 ? `+${members.length - 5} more · ` : ""}{r.staff} {r.staff === 1 ? "person" : "people"}{members.length > 0 && members.length <= 2 ? ` — ${members.map((m) => m.name.split(" ")[0]).join(", ")}` : ""}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Modal open={!!editing} onClose={() => setEditing(null)} wide="xl" title={editing?.role ? `Edit ${editing.role.name}` : "New role"}>
        {editing && roles.data && <RoleForm key={editing.role?.id ?? "new"} role={editing.role} all={roles.data.permissions} onDone={() => setEditing(null)} />}
      </Modal>
    </>
  );
}

function RoleForm({ role, all, onDone }: { role: RoleRow | null; all: { id: Permission; label: string }[]; onDone: () => void }) {
  const isNew = !role;
  const [v, setV] = useState({ id: role?.id ?? "", name: role?.name ?? "", description: role?.description ?? "" });
  const [perms, setPerms] = useState<Permission[]>(role?.permissions ?? []);
  const [error, setError] = useState<string | null>(null);
  const [save, { isLoading }] = useSaveRoleMutation();
  const toggle = (p: Permission) => setPerms((l) => (l.includes(p) ? l.filter((x) => x !== p) : [...l, p]));
  const labelOf = (id: Permission) => all.find((p) => p.id === id)?.label ?? id;
  const mine = useAppSelector((s) => s.auth.user?.permissions ?? []);
  const known = new Set(all.map((p) => p.id).filter((id) => mine.includes(id)));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const id = isNew ? (v.id || slug(v.name)).slice(0, 40) : role.id;
    if (!/^[a-z0-9][a-z0-9-]{1,39}$/.test(id)) { setError("Give the role a name with at least two letters or numbers"); return; }
    try { await save({ id, name: v.name.trim(), description: v.description.trim(), permissions: perms }).unwrap(); toast.success(isNew ? "Role created" : "Role saved"); onDone(); }
    catch (err) { setError(errorMessage(err, "Could not save")); }
  };
  const sensitive = perms.some((p) => p === "finance.view" || p === "staff.manage");
  return (
    <form onSubmit={submit} className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div className="space-y-4">
        <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Name</span><input className={inputCls} value={v.name} onChange={(e) => setV((s) => ({ ...s, name: e.target.value }))} required minLength={2} maxLength={60} placeholder="e.g. Accountant" autoFocus={isNew} /></label>
        <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Description</span><textarea className={`${textareaCls} min-h-16`} value={v.description} onChange={(e) => setV((s) => ({ ...s, description: e.target.value }))} maxLength={200} placeholder="Who is this role for?" /></label>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-body-strong">What this role can do</span>
            <span className="flex flex-wrap items-center gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-slate-400" aria-hidden />
              {PRESETS.map((p) => <button key={p.name} type="button" onClick={() => setPerms(p.perms.filter((x) => known.has(x)))} className="rounded-full bg-surface px-2.5 py-1 font-semibold text-body hover:text-brand-600 dark:bg-navy-950/70">{p.name}</button>)}
              <button type="button" onClick={() => setPerms(all.map((p) => p.id).filter((id) => known.has(id)))} className="rounded-full bg-surface px-2.5 py-1 font-semibold text-body hover:text-brand-600 dark:bg-navy-950/70">Everything</button>
              <button type="button" onClick={() => setPerms([])} className="rounded-full bg-surface px-2.5 py-1 font-semibold text-body hover:text-red-600 dark:bg-navy-950/70">Clear</button>
            </span>
          </div>
          <div className="space-y-3">
            {GROUPS.map((g) => {
              const ids = g.ids.filter((i) => known.has(i));
              if (!ids.length) return null;
              const on = ids.filter((i) => perms.includes(i)).length;
              return (
                <fieldset key={g.title} className="rounded-lg bg-surface p-3 dark:bg-navy-950/70">
                  <legend className="sr-only">{g.title}</legend>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div><p className="text-sm font-bold text-ink">{g.title}</p><p className="text-xs text-slate-500">{g.hint}</p></div>
                    <button type="button" onClick={() => setPerms((l) => (on === ids.length ? l.filter((x) => !ids.includes(x)) : [...new Set([...l, ...ids])]))} className="text-xs font-semibold text-brand-600 hover:underline">{on === ids.length ? "Remove all" : "Select all"}</button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ids.map((id) => (
                      <label key={id} className={cn("flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", perms.includes(id) ? "bg-brand-500/15 text-ink" : "bg-softer/80 text-body dark:bg-navy-900/90")}>
                        <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={perms.includes(id)} onChange={() => toggle(id)} />{labelOf(id)}
                      </label>
                    ))}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </div>

        {isNew && <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Id <span className="font-normal text-slate-500">(optional — made from the name)</span></span><input className={inputCls} value={v.id} onChange={(e) => setV((s) => ({ ...s, id: e.target.value }))} placeholder={slug(v.name) || "accountant"} /></label>}
      </div>

      <aside className="lg:sticky lg:top-16 lg:self-start">
        <div className={`${CARD} p-4`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Summary</p>
          <p className="mt-1 text-sm font-bold text-ink">{v.name || "New role"}</p>
          <p className="text-xs text-slate-500">{perms.length} of {all.length} permissions</p>
          <ul className="mt-3 space-y-1 text-xs text-body">{perms.length ? perms.map((p) => <li key={p} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />{labelOf(p)}</li>) : <li className="text-slate-500">Nothing selected yet.</li>}</ul>
          {sensitive && <p className="mt-3 rounded-lg bg-amber-500/15 p-2.5 text-xs font-medium text-amber-800 dark:text-amber-200">This role can see money or manage the team. Give it only to people you trust.</p>}
        </div>
        {error && <p role="alert" className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600">{error}</p>}
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" onClick={onDone} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:text-ink">Cancel</button>
          <button type="submit" disabled={isLoading} className="h-10 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? "Saving…" : "Save role"}</button>
        </div>
      </aside>
    </form>
  );
}
