"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Mail, MapPin, Phone, ShieldCheck, ChevronRight } from "lucide-react";
import Logo from "@/components/common/Logo";
import Container from "@/components/common/Container";
import { AppleAppStoreBadge, GooglePlayStoreBadge } from "@/components/common/AppStoreBadges";
import { useSite } from "@/components/providers/SiteProvider";

const PRODUCT_LINKS = [
  { label: "Car GPS Trackers", href: "/products/category/gps-tracking-devices/car-trackers" },
  { label: "Bike & Motorcycle Trackers", href: "/products/category/gps-tracking-devices/bike-trackers" },
  { label: "Voice & Video Monitoring", href: "/products/category/gps-tracking-devices/voice-video-monitoring" },
  { label: "All Products Catalogue", href: "/products" },
  { label: "Fleet & Commercial Solutions", href: "/solutions" },
  { label: "Hardware & Accessories", href: "/products/category/hardware-accessories" },
];

const QUICK_LINKS = [
  { label: "Features & Sensors", href: "/features" },
  { label: "Pricing & Packages", href: "/pricing" },
  { label: "Pay Bill Online", href: "/pay-bill" },
  { label: "Frequently Asked Questions", href: "/faq" },
  { label: "About Our Company", href: "/about" },
  { label: "News & Updates", href: "/news" },
  { label: "Contact & Support", href: "/contact" },
];

export default function Footer() {
  const site = useSite();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-[#07131e] text-white">
      {/* Top Value / Hotline Banner */}
      <div className="border-b border-white/10 bg-[#0a1928]">
        <Container className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <p className="text-xs font-medium text-slate-300 sm:text-sm">
              <span className="font-bold text-white">24/7 Live Monitoring Support:</span> Call our emergency dispatch team anytime at{" "}
              <a href={`tel:${site.phone}`} className="font-bold text-brand-400 hover:text-brand-300 hover:underline">
                {site.phone}
              </a>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-400" />
              <span>BTRC Approved</span>
            </span>
            <span className="text-white/20">•</span>
            <span>64 Districts Doorstep Setup</span>
          </div>
        </Container>
      </div>

      {/* Main 4-Column Footer Grid */}
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        {/* Col 1: About & Info (lg:col-span-4) */}
        <div className="lg:col-span-4">
          <div className="inline-block rounded-md bg-white p-2">
            <Logo className="h-7 w-auto" />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
            Bangladesh&apos;s trusted real-time GPS tracking and vehicle telematics platform. BTRC approved hardware, 24/7 emergency remote engine immobilizer, and nationwide doorstep technician installation.
          </p>

          <div className="mt-6 space-y-3 text-xs sm:text-sm text-slate-300">
            <a href={`tel:${site.phone}`} className="flex items-center gap-3 transition-colors hover:text-white">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/10 text-brand-400">
                <Phone className="h-4 w-4" />
              </span>
              <span>{site.phone} (24/7 Helpline)</span>
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 transition-colors hover:text-white">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/10 text-cyan-400">
                <Mail className="h-4 w-4" />
              </span>
              <span>{site.email}</span>
            </a>
            <div className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/10 text-amber-400 mt-0.5">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="leading-snug">{site.address}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Products & Solutions (lg:col-span-3) */}
        <div className="lg:col-span-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-500" />
            Products & Solutions
          </h3>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
            {PRODUCT_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-1.5 text-slate-300 transition-colors hover:text-brand-400"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-400" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Quick Links (lg:col-span-2) */}
        <div className="lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-500" />
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-1.5 text-slate-300 transition-colors hover:text-brand-400"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-400" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Apps & Telematics (lg:col-span-3) */}
        <div className="lg:col-span-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-500" />
            Mobile Tracking App
          </h3>
          <p className="mt-4 text-xs leading-relaxed text-slate-300">
            Download our iOS and Android app to track vehicles with 10s updates, lock engines remotely, and get push alerts.
          </p>

          <div className="mt-5 space-y-2.5">
            <GooglePlayStoreBadge className="!w-full !justify-start !bg-white/10 !border-white/15 hover:!bg-white/15" />
            <AppleAppStoreBadge className="!w-full !justify-start !bg-white/10 !border-white/15 hover:!bg-white/15" />
          </div>

          <div className="mt-5 rounded-md border border-white/10 bg-white/[0.04] p-3 text-xs text-slate-300">
            <p className="font-semibold text-white">Govt. Certified VTS</p>
            <p className="mt-0.5 text-[11px] text-slate-400">BRTA and Bangladesh Police compatible tracking logs & alerts.</p>
          </div>
        </div>
      </Container>

      {/* Payment Methods Banner */}
      <div className="border-t border-white/10 bg-[#050f18] py-4">
        <Container className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Secure Payment Methods
          </span>
          <div className="overflow-hidden rounded bg-white p-1.5 shadow-sm">
            <Image
              src="/img/payments.png"
              alt="Supported payment methods: bKash, Nagad, Rocket, Visa, Mastercard, AMEX"
              width={1400}
              height={226}
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </div>
        </Container>
      </div>

      {/* Bottom Copyright & Legal Strip */}
      <div className="border-t border-white/10 bg-[#040c14] py-4 text-xs text-slate-400">
        <Container className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            {site.pages.map((p) => (<span key={p.id} className="contents"><span>•</span><Link href={`/page/${p.id}`} className="hover:text-white transition-colors">{p.title}</Link></span>))}
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>

          {(site.facebook || site.youtube || site.linkedin || site.instagram) && (
            <div className="flex items-center gap-3">
              {([[site.facebook, "Facebook"], [site.youtube, "YouTube"], [site.linkedin, "LinkedIn"], [site.instagram, "Instagram"]] as const).filter(([u]) => u).map(([u, label]) => (
                <a key={label} href={u} target="_blank" rel="noopener noreferrer" className="text-slate-400 transition-colors hover:text-white">{label}</a>
              ))}
            </div>
          )}

          <button
            onClick={scrollToTop}
            type="button"
            aria-label="Back to top"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-white"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </Container>
      </div>
    </footer>
  );
}
