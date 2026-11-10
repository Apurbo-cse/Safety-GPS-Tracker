"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Headset, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/common/Logo";
import Container from "@/components/common/Container";
import AppStoreBadges from "@/components/common/AppStoreBadges";
import { SITE } from "@/lib/site";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Meem Tower, 104 Shukrabad Main Road, Dhaka, Bangladesh"
)}`;

const PRODUCT_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing & Packages", href: "/pricing" },
  { label: "Tracking Devices", href: "/devices" },
  { label: "Fleet Solutions", href: "/solutions" },
  { label: "Pay Bill Online", href: "/pay-bill" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative border-t border-white/10 bg-navy-950 text-slate-300 antialiased">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand & App Download */}
          <div className="space-y-4 lg:col-span-4">
            <Logo light />
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Real-time GPS tracking and vehicle security across Bangladesh. Track live location, monitor fuel consumption, and lock engines remotely.
            </p>
            <div className="pt-2">
              <p className="mb-2.5 text-xs font-semibold text-slate-400">Download Mobile Apps</p>
              <AppStoreBadges showQr={false} />
            </div>
          </div>

          {/* Product Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-3">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">
              Contact & Support
            </h4>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              <Headset className="h-3.5 w-3.5 text-brand-400" />
              <span>24/7 Customer Helpline</span>
            </div>

            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`tel:${SITE.phone}`}
                  className="flex items-center gap-2.5 text-slate-400 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                  <span>{SITE.phone}</span>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2.5 text-slate-400 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                  <span>{SITE.email}</span>
                </a>
              </li>

              <li>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-slate-400 transition-colors hover:text-white"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <span className="leading-snug">{SITE.address}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Clean Bottom Copyright Bar */}
      <div className="border-t border-white/10 bg-black/40 py-4 text-xs text-slate-500">
        <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/img/app/icon.png"
              alt="Safety GPS Tracker"
              width={20}
              height={20}
              className="h-5 w-auto"
            />
            <span>
              © {new Date().getFullYear()} Safety GPS Tracker. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-slate-300">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms" className="transition-colors hover:text-slate-300">
              Terms of Service
            </Link>
            <span>·</span>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="grid h-6 w-6 place-items-center rounded-full border border-white/15 text-slate-400 transition-colors hover:border-brand-500 hover:bg-brand-600 hover:text-white"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </Container>
      </div>
    </footer>
  );
}
