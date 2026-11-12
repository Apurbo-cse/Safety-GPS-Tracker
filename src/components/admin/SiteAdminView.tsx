"use client";
import { useState } from "react";
import { toast } from "sonner";
import { inputCls } from "@/components/forms/Field";
import type { SiteDetails } from "@/lib/api";
import { errorMessage, useAdminSiteQuery, useSaveSiteMutation } from "@/store/apiSlice";
import { CARD, ErrorState, PageHeader, Skeleton, view } from "./ui";

const FIELDS: { k: keyof SiteDetails; label: string; hint?: string; wide?: boolean; type?: string; ph?: string }[] = [
  { k: "name", label: "Company name" },
  { k: "tagline", label: "Tagline", hint: "A short line under the name." },
  { k: "phone", label: "Phone / helpline", hint: "Shown in the header, footer, contact page and every “Call” button.", ph: "01XXXXXXXXX" },
  { k: "email", label: "Email", type: "email" },
  { k: "address", label: "Office address", wide: true },
  { k: "hours", label: "Opening hours", hint: "Shown on the contact page.", wide: true, ph: "Sat–Thu, 9:00 AM – 8:00 PM · 24×7 helpline" },
  { k: "facebook", label: "Facebook page", ph: "https://facebook.com/…" },
  { k: "youtube", label: "YouTube channel", ph: "https://youtube.com/…" },
  { k: "linkedin", label: "LinkedIn page", ph: "https://linkedin.com/company/…" },
  { k: "instagram", label: "Instagram", ph: "https://instagram.com/…" },
];

export default function SiteAdminView() {
  const q = view(useAdminSiteQuery());
  return (
    <>
      <PageHeader title="Site details" subtitle="Company details used across the website: header, footer, contact page, invoices and policy pages. Changes appear within a minute." />
      {q.error ? <ErrorState message={q.error} onRetry={q.reload} /> : !q.data ? <Skeleton rows={4} /> : <SiteForm initial={q.data} />}
    </>
  );
}

function SiteForm({ initial }: { initial: SiteDetails }) {
  const [v, setV] = useState<SiteDetails>(initial);
  const [error, setError] = useState<string | null>(null);
  const [save, { isLoading }] = useSaveSiteMutation();
  const dirty = JSON.stringify(v) !== JSON.stringify(initial);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    try { await save(v).unwrap(); toast.success("Site details saved"); } catch (err) { setError(errorMessage(err, "Could not save")); }
  };
  return (
    <form onSubmit={submit} className={`${CARD} grid gap-4 p-5 sm:grid-cols-2 sm:p-6`}>
      {FIELDS.map((f) => (
        <label key={f.k} className={f.wide ? "block sm:col-span-2" : "block"}>
          <span className="mb-1.5 block text-sm font-medium text-body-strong">{f.label}</span>
          <input className={inputCls} type={f.type ?? "text"} value={v[f.k]} placeholder={f.ph} onChange={(e) => setV((s) => ({ ...s, [f.k]: e.target.value }))} required={["name", "phone", "email", "address"].includes(f.k)} />
          {f.hint && <span className="mt-1 block text-xs text-slate-500">{f.hint}</span>}
        </label>
      ))}
      {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600 sm:col-span-2">{error}</p>}
      <div className="flex justify-end sm:col-span-2">
        <button type="submit" disabled={!dirty || isLoading} className="h-11 rounded-lg bg-brand-500 px-7 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-50">{isLoading ? "Saving…" : "Save"}</button>
      </div>
    </form>
  );
}
