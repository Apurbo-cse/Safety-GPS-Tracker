"use client";
import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Lock, Pencil, Plus, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import Modal from "@/components/common/Modal";
import { inputCls, textareaCls } from "@/components/forms/Field";
import type { Permission, RoleRow, StaffMember } from "@/lib/api";
import {
  errorMessage, useAddStaffMutation, useDeleteRoleMutation, useRemoveStaffMutation, useRolesQuery, useSaveRoleMutation,
  useSetStaffPasswordMutation, useStaffQuery, useUpdateStaffMutation,
} from "@/store/apiSlice";
import { useAppSelector } from "@/store/hooks";
import { cn, slug } from "@/utils/format";
import { CARD, EmptyState, ErrorState, PageHeader, Skeleton, Switch, fmtDate, view } from "./ui";

type Tab = "staff" | "roles";

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

  const roleName = (id: string) => roles.data?.roles.find((r) => r.id === id)?.name ?? id;
  const act = async (p: Promise<unknown>, ok: string) => { try { await p; toast.success(ok); } catch (e) { toast.error(errorMessage(e, "Could not update")); } };

  return (
    <>
      <div className="mb-4 flex justify-end"><button onClick={() => setAdding(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"><UserPlus className="h-4 w-4" />Add staff</button></div>

      {staff.error ? <ErrorState message={staff.error} onRetry={staff.reload} /> : !staff.data ? <Skeleton rows={3} /> : staff.data.length === 0 ? (
        <div className={CARD}><EmptyState icon={Users} title="No staff yet" text="Add someone and choose what they can do." /></div>
      ) : (
        <ul className="space-y-2">
          {staff.data.map((m) => {
            const self = m.id === me;
            return (
              <li key={m.id} className={cn(`${CARD} flex flex-wrap items-center gap-x-4 gap-y-2 p-3.5 sm:px-5`, m.disabled && "opacity-60")}>
                <div className="min-w-0 flex-1 basis-56">
                  <p className="truncate text-sm font-bold text-ink">{m.name}{self && <span className="ml-2 rounded bg-brand-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-600 dark:text-brand-300">You</span>}</p>
                  <p className="truncate text-xs text-slate-500">{m.email}{m.phone ? ` · ${m.phone}` : ""} · since {fmtDate(m.createdAt)}</p>
                </div>
                <select aria-label={`Role of ${m.name}`} value={m.roleId} disabled={self || !roles.data} onChange={(e) => void act(update({ id: m.id, roleId: e.target.value }).unwrap(), `${m.name} is now ${roleName(e.target.value)}`)}
                  className="h-9 rounded-lg bg-surface px-2.5 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-60 dark:bg-navy-950">
                  {!roles.data?.roles.some((r) => r.id === m.roleId) && <option value={m.roleId}>{m.roleId}</option>}
                  {roles.data?.roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <div className="flex items-center gap-1">
                  <Switch on={!m.disabled} disabled={self} label={`${m.name} can sign in`} onChange={() => void act(update({ id: m.id, disabled: !m.disabled }).unwrap(), m.disabled ? `${m.name} can sign in again` : `${m.name} is blocked`)} />
                  <button onClick={() => setPw(m)} aria-label={`Set a new password for ${m.name}`} className="ml-2 grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-surface hover:text-brand-600 dark:hover:bg-navy-950"><KeyRound className="h-4 w-4" /></button>
                  <button disabled={self} onClick={() => { if (window.confirm(`Remove ${m.name} from the staff? They keep a customer account.`)) void act(removeStaff(m.id).unwrap(), "Removed from staff"); }} aria-label={`Remove ${m.name}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-red-500/10 hover:text-red-600 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Add staff">{adding && <AddStaffForm roles={roles.data?.roles ?? []} onDone={() => setAdding(false)} />}</Modal>
      <Modal open={!!pw} onClose={() => setPw(null)} title={pw ? `New password for ${pw.name}` : ""}>{pw && <PasswordForm member={pw} onDone={() => setPw(null)} />}</Modal>
    </>
  );
}

function AddStaffForm({ roles, onDone }: { roles: RoleRow[]; onDone: () => void }) {
  const [v, setV] = useState({ email: "", roleId: roles.find((r) => r.id !== "owner")?.id ?? "", name: "", mobile: "", password: "" });
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
        <select className={inputCls} value={v.roleId} onChange={set("roleId")} required>{roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Name <span className="font-normal text-slate-500">(new accounts)</span></span><input className={inputCls} value={v.name} onChange={set("name")} autoComplete="off" /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Mobile <span className="font-normal text-slate-500">(new accounts)</span></span><input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" value={v.mobile} onChange={set("mobile")} autoComplete="off" /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Password <span className="font-normal text-slate-500">(new accounts)</span></span><input type="password" className={inputCls} value={v.password} onChange={set("password")} autoComplete="new-password" /></label>
      {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600 sm:col-span-2">{error}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={onDone} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:text-ink">Cancel</button>
        <button type="submit" disabled={isLoading} className="h-10 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? "Adding…" : "Add staff"}</button>
      </div>
    </form>
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
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">New password</span><input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" /></label>
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
  const [remove] = useDeleteRoleMutation();
  const [editing, setEditing] = useState<{ role: RoleRow | null } | null>(null);
  const label = (id: Permission) => roles.data?.permissions.find((p) => p.id === id)?.label ?? id;

  return (
    <>
      <div className="mb-4 flex justify-end"><button onClick={() => setEditing({ role: null })} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"><Plus className="h-4 w-4" />New role</button></div>
      {roles.error ? <ErrorState message={roles.error} onRetry={roles.reload} /> : !roles.data ? <Skeleton rows={3} /> : (
        <ul className="space-y-2">
          {roles.data.roles.map((r) => (
            <li key={r.id} className={`${CARD} p-4 sm:px-5`}>
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1 basis-56">
                  <p className="flex items-center gap-2 text-sm font-bold text-ink">{r.name}{r.system && <span className="inline-flex items-center gap-1 rounded bg-slate-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300"><Lock className="h-3 w-3" />Built-in</span>}</p>
                  <p className="text-xs text-slate-500">{r.description || "—"} · {r.staff} {r.staff === 1 ? "person" : "people"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditing({ role: r })} aria-label={`Edit ${r.name}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-surface hover:text-brand-600 dark:hover:bg-navy-950"><Pencil className="h-4 w-4" /></button>
                  <button disabled={r.system || r.staff > 0} title={r.system ? "Built-in roles can't be deleted" : r.staff ? "Move its people to another role first" : undefined}
                    onClick={() => { if (window.confirm(`Delete the “${r.name}” role?`)) void remove(r.id).unwrap().then(() => toast.success("Role deleted")).catch((e) => toast.error(errorMessage(e, "Could not delete"))); }}
                    aria-label={`Delete ${r.name}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-red-500/10 hover:text-red-600 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {r.permissions.length ? r.permissions.map((p) => <span key={p} className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:text-brand-300">{label(p)}</span>) : <span className="text-xs text-slate-500">No permissions</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Modal open={!!editing} onClose={() => setEditing(null)} wide title={editing?.role ? `Edit ${editing.role.name}` : "New role"}>
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
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const id = isNew ? (v.id || slug(v.name)).slice(0, 40) : role.id;
    if (!/^[a-z0-9][a-z0-9-]{1,39}$/.test(id)) { setError("The id must be 2–40 characters: lower-case letters, numbers and dashes"); return; }
    try { await save({ id, name: v.name.trim(), description: v.description.trim(), permissions: perms }).unwrap(); toast.success(isNew ? "Role created" : "Role saved"); onDone(); }
    catch (err) { setError(errorMessage(err, "Could not save")); }
  };
  return (
    <form onSubmit={submit} className="grid gap-4 p-5">
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Name</span><input className={inputCls} value={v.name} onChange={(e) => setV((s) => ({ ...s, name: e.target.value }))} required minLength={2} maxLength={60} /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Description</span><textarea className={`${textareaCls} min-h-16`} value={v.description} onChange={(e) => setV((s) => ({ ...s, description: e.target.value }))} maxLength={200} /></label>
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-body-strong">What this role can do</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {all.map((p) => (
            <label key={p.id} className={cn("flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium", perms.includes(p.id) ? "bg-brand-500/15 text-ink" : "bg-surface text-body dark:bg-navy-950")}>
              <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={perms.includes(p.id)} onChange={() => toggle(p.id)} />{p.label}
            </label>
          ))}
        </div>
      </fieldset>
      {isNew && <label className="block"><span className="mb-1.5 block text-sm font-medium text-body-strong">Id <span className="font-normal text-slate-500">(optional — made from the name)</span></span><input className={inputCls} value={v.id} onChange={(e) => setV((s) => ({ ...s, id: e.target.value }))} placeholder={slug(v.name) || "accountant"} /></label>}
      {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:text-ink">Cancel</button>
        <button type="submit" disabled={isLoading} className="h-10 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{isLoading ? "Saving…" : "Save role"}</button>
      </div>
    </form>
  );
}
