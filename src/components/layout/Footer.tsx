"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Search, ChevronDown, Copy, CreditCard, Headset, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/common/Logo";
import Container from "@/components/common/Container";
import { solutions } from "@/data/solutions";
import {PLAY_STORE_URL, SITE  } from "@/lib/site";
import { cn } from "@/utils/format";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Meem Tower, 104 Shukrabad Main Road, Dhaka, Bangladesh")}`;

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  { title: "Product", links: [{ label: "Features", href: "/features" }, { label: "Pricing", href: "/pricing" }, { label: "Tracking Devices", href: "/devices" }, { label: "Solutions", href: "/solutions" }] },
  { title: "Solutions", links: solutions.map((s) => ({ label: s.title, href: `/solutions#${s.id}` })) },
  { title: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "Pay Bill", href: "/pay-bill" }] },
  { title: "Account", links: [{ label: "Login", href: "/login" }, { label: "Register", href: "/register" }, { label: "Forgot Password", href: "/forgot-password" }] },
];

const ACTIONS = [
  { icon: Phone, label: "Call sales", value: SITE.phone, href: `tel:${SITE.phone}`, external: false },
  { icon: Mail, label: "Email us", value: SITE.email, href: `mailto:${SITE.email}`, external: false },
  { icon: MapPin, label: "Visit office", value: "Shukrabad, Dhaka", href: MAPS_URL, external: true },
  { icon: CreditCard, label: "Pay your bill", value: "Demo payment page", href: "/pay-bill", external: false },
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      toast.success(`${label} copied`);
      setTimeout(() => setDone(false), 1600);
    } catch {
      toast.error("Could not copy — please copy it manually");
    }
  };
  return (
    <button onClick={copy} aria-label={`Copy ${label}`} className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-500 transition-colors hover:bg-white/10 hover:text-white">
      {done ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

/** Link column: always open on desktop, collapsible accordion on phones and tablets. */
function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-1 lg:border-0 lg:py-0">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-white lg:pointer-events-none lg:py-0 lg:pb-3">
        {title}
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform lg:hidden", open && "rotate-180")} />
      </button>
      <ul className={cn("space-y-2.5 pb-3 text-sm lg:block lg:pb-0", open ? "block" : "hidden")}>
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="group inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-white">
              <span className="h-px w-0 bg-brand-500 transition-all group-hover:w-3" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-slate-300">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-600/15 blur-3xl" aria-hidden />
      <p aria-hidden className="pointer-events-none absolute inset-x-0 bottom-10 select-none text-center text-[clamp(3rem,13vw,11rem)] font-black uppercase leading-none tracking-tighter text-white/[0.025]">Safety GPS</p>
      <div className="pointer-events-none absolute -right-24 bottom-24 h-72 w-72 rounded-full bg-brand-600/10 blur-3xl" aria-hidden />

      <Container className="relative pt-12 sm:pt-14">
       

        {/* main grid */}
        <div className="grid gap-10 py-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">{SITE.tagline}. Our GPS tracking software lets you track the accurate location of your fleet and vehicles.</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200"><Headset className="h-3.5 w-3.5 text-brand-400" />24×7 helpline facility</p>

            <ul className="mt-5 space-y-1 text-sm">
              <li className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-white/[0.04]">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                <a href={`tel:${SITE.phone}`} className="min-w-0 flex-1 text-slate-200 hover:text-white"><span className="block truncate">{SITE.phone}</span><span className="block truncate text-[11px] text-slate-500">Corporate Sales · Sales · Support · Billing</span></a>
           
              </li>
              <li className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-white/[0.04]">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <a href={`mailto:${SITE.email}`} className="min-w-0 flex-1 text-slate-200 hover:text-white"><span className="block truncate">{SITE.email}</span><span className="block truncate text-[11px] text-slate-500">Email</span></a>
              
              </li>
              <li className="flex items-start gap-2 rounded-lg px-1 py-1 hover:bg-white/[0.04]">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-brand-400" />
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 text-slate-200 hover:text-white">{SITE.address}<span className="block text-[11px] text-slate-500">Open in Google Maps</span></a>
      
              </li>
            </ul>

            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block transition-transform hover:-translate-y-0.5" aria-label="Get the Android app on Google Play">
              <Image src="/img/app/play-badge.png" alt="Get it on Google Play" width={150} height={50} className="h-11 w-auto rounded-md" />
            </a>
          </div>

          <div className="grid gap-x-8 lg:col-span-8 lg:grid-cols-4">
            {COLUMNS.map((c) => <Column key={c.title} {...c} />)}
          </div>
        </div>

      </Container>

      {/* bottom bar */}
      <div className="relative border-t border-white/10 bg-black/30">
        <Container className="flex flex-col gap-4 py-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between lg:pr-20">
          <p className="flex items-start gap-2.5 md:items-center">
            <Image src="/img/app/icon.png" alt="" width={22} height={24} className="h-6 w-auto shrink-0" />
            <span>
              © {new Date().getFullYear()} Safety GPS Tracker. All rights reserved.

            </span>
            
          </p><span className="block text-brand-400">Tracking visuals are simulated and no payments are processed.</span>
        </Container>
      </div>
    </footer>
  );
}
