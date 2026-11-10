import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Logo from "@/components/common/Logo";

export default function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between"><Logo /><ThemeToggle /></div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          <p className="mt-1 text-sm text-body">{subtitle}</p>
          <div className="mt-6">{children}</div>
          <p className="mt-6 text-center text-sm text-body">{footer}</p>
          <p className="mt-6 rounded-lg bg-softer p-3 text-center text-xs text-slate-500">Demo authentication — no credentials are verified or stored. <Link href="/" className="font-semibold text-brand-text">Back to website</Link></p>
        </div>
      </div>
      <aside className="relative hidden overflow-hidden bg-navy-950 text-white lg:block">
        <div className="grid-bg absolute inset-0 opacity-60" /><div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="relative flex h-full flex-col justify-center px-14">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/10 ring-1 ring-white/20"><ShieldCheck className="h-6 w-6" /></span>
          <h2 className="mt-5 text-3xl font-bold leading-tight">Know where every vehicle is, every time you check.</h2>
          <p className="mt-3 max-w-md text-slate-300">Create an account to order GPS tracking packages and devices and pay your monthly bill.</p>
        </div>
      </aside>
    </div>
  );
}
