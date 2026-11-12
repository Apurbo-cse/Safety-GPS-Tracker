"use client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowRight, ArrowUp, ArrowUpRight, CheckCircle2, Headset, Mail, MapPin, Phone, PhoneCall, type LucideIcon } from "lucide-react";
import Logo from "@/components/common/Logo";
import Container from "@/components/common/Container";
import AppStoreBadges from "@/components/common/AppStoreBadges";
import { useSite } from "@/components/providers/SiteProvider";
import { mapsUrl, type SiteInfo } from "@/lib/site";
import { phoneRegex } from "@/lib/validation";

const ROUTE = "M0 30 C 160 30, 220 8, 380 10 S 620 44, 820 26 S 1080 4, 1240 18 S 1400 34, 1440 30";

const PRODUCT_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing & Packages", href: "/pricing" },
  { label: "Products", href: "/products" },
  { label: "Fleet Solutions", href: "/solutions" },
  { label: "Pay Bill Online", href: "/pay-bill" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const contactsOf = (SITE: SiteInfo): { icon: LucideIcon; label: string; value: string; href: string; external?: boolean; live?: boolean }[] => [
  { icon: Phone, label: "24/7 helpline", value: SITE.phone, href: `tel:${SITE.phone}`, live: true },
  { icon: Mail, label: "Email us", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MapPin, label: "Visit our office", value: SITE.address, href: mapsUrl(SITE.address), external: true },
];

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
        <span className="h-px w-4 bg-brand-500" />{title}
      </h4>
      <ul className="space-y-1.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="group inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white">
              <ArrowRight className="h-3 w-3 -translate-x-1 text-brand-400 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              <span className="-ml-4 transition-all group-hover:ml-0">{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CallbackForm() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneRegex.test(phone.trim())) { setError("Enter a valid Bangladeshi mobile number"); return; }
    setError("");
    setSent(true);
    toast.success("Call-back request recorded (demo)");
  };
  if (sent) {
    return (
      <p className="flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
        <CheckCircle2 className="h-4 w-4 shrink-0" />Thanks! A demo request was recorded for {phone}.
      </p>
    );
  }
  return (
    <form onSubmit={submit} noValidate>
      <div className="flex gap-2">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Mobile number</span>
          <Phone aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" value={phone}
            onChange={(e) => { setPhone(e.target.value); if (error) setError(""); }}
            aria-invalid={!!error}
            className="h-10 w-full rounded-md border border-white/15 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-brand-500 focus:outline-none aria-[invalid=true]:border-red-500"
          />
        </label>
        <button type="submit" className="gloss-btn inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md px-3.5 text-sm font-semibold text-white">
          <PhoneCall className="h-4 w-4" /><span>Call me</span>
        </button>
      </div>
      {error && <p role="alert" className="mt-1.5 text-xs text-red-400">{error}</p>}
    </form>
  );
}

export default function FooterClassic() {
  const site = useSite();
  const CONTACTS = contactsOf(site);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-navy-950 text-slate-300 antialiased">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand-600/15 blur-3xl" />
      <svg aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-10 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d={ROUTE} fill="none" stroke="#f05a22" strokeOpacity=".25" strokeWidth="6" vectorEffect="non-scaling-stroke" />
        <path d={ROUTE} fill="none" stroke="#f98a55" strokeWidth="1.5" strokeDasharray="6 10" className="route-flow" vectorEffect="non-scaling-stroke" />
      </svg>
      <div aria-hidden className="footer-tracker pointer-events-none absolute top-[14px] h-3 w-3 rounded-full bg-brand-500 shadow-[0_0_0_4px_rgb(240_90_34/0.25),0_0_16px_#f05a22]" />

      <Container className="relative pb-8 pt-8 sm:pt-10">
        {/* ---------- contact tiles ---------- */}
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {CONTACTS.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="spotlight group flex h-full items-center gap-3 overflow-hidden rounded-md border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/50 hover:bg-white/[0.06]"
              >
                <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                  <c.icon className="h-5 w-5" />
                  {c.live && (
                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                      <span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" />
                      <span className="relative h-3 w-3 rounded-full border-2 border-navy-950 bg-green-400" />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-slate-500">{c.label}</span>
                  <span className="block truncate text-sm font-semibold text-white">{c.value}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-400" />
              </a>
            </li>
          ))}
        </ul>

        {/* ---------- main grid ---------- */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-3 sm:col-span-2 lg:col-span-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Real-time GPS tracking and vehicle security across Bangladesh. Track live location, monitor fuel consumption, and lock engines remotely.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              <Headset className="h-3.5 w-3.5 text-brand-400" />24/7 Customer Helpline
            </div>
          </div>

          <div className="lg:col-span-2">
            <LinkColumn title="Product" links={PRODUCT_LINKS} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Company" links={COMPANY_LINKS} />
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <p className="text-sm font-semibold text-white">Request a call back</p>
            <div className="mt-2"><CallbackForm /></div>
            <p className="mt-4 text-sm font-semibold text-white">Track from your phone</p>
            <div className="mt-2"><AppStoreBadges showQr={false} /></div>
          </div>
        </div>


        {/* ---------- watermark ---------- */}
        <p
          aria-hidden
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--wx", `${e.clientX - r.left}px`);
            e.currentTarget.style.setProperty("--wy", `${e.clientY - r.top}px`);
          }}
          className="footer-mark mt-8 select-none bg-clip-text text-center text-[clamp(3rem,15vw,11rem)] font-black leading-none tracking-tighter text-transparent"
        >
          SAFETY GPS
        </p>
      </Container>

      {/* ---------- bottom bar ---------- */}
      <div className="relative border-t border-white/10 bg-black/40 py-4 text-xs text-slate-500">
        <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Image src="/img/app/icon.png" alt="Safety GPS Tracker" width={20} height={20} className="h-5 w-auto" />
            <span>© {new Date().getFullYear()} Safety GPS Tracker. All rights reserved.</span>
          </div>
          <span className="flex items-center gap-1.5 self-start rounded-full border border-green-500/25 bg-green-500/10 px-2.5 py-1 text-green-400 sm:self-auto">
            <span className="relative flex h-1.5 w-1.5"><span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" /><span className="relative h-1.5 w-1.5 rounded-full bg-green-400" /></span>
            All systems online
          </span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-slate-300">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="transition-colors hover:text-slate-300">Terms of Service</Link>
            <span>·</span>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="grid h-7 w-7 place-items-center rounded-full border border-white/15 text-slate-400 transition-colors hover:border-brand-500 hover:bg-brand-600 hover:text-white"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </Container>
      </div>
    </footer>
  );
}
