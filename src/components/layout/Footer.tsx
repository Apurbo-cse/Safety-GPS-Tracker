"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/common/Logo";
import Container from "@/components/common/Container";
import AppStoreBadges from "@/components/common/AppStoreBadges";
import { SITE } from "@/lib/site";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Meem Tower, 104 Shukrabad Main Road, Dhaka, Bangladesh"
)}`;

const FLEET_SOLUTIONS = [
  { label: "Corporate Logistics & Cargo", href: "/solutions#corporate-logistics" },
  { label: "Cold-Chain Refrigerated Fleets", href: "/solutions#cold-chain" },
  { label: "Construction & Heavy Dumpers", href: "/solutions#construction" },
  { label: "School Bus & Student Safety", href: "/solutions#school-buses" },
  { label: "Ride-Sharing & Rental Fleets", href: "/solutions#rental-cars" },
  { label: "Motorbike Courier & Delivery", href: "/solutions#motorbikes" },
];

const COMPANY_LINKS = [
  { label: "About Telematics Lab", href: "/about" },
  { label: "Pricing Packages & ROI", href: "/pricing" },
  { label: "Tracking Devices & Specs", href: "/devices" },
  { label: "Features Matrix", href: "/features" },
  { label: "Pay Bill Online", href: "/pay-bill" },
  { label: "Contact Dispatch Center", href: "/contact" },
];


function LinkList({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-white">{title}</h4>
      <ul className="space-y-2 text-xs">
        {items.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="group flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white">
              <ChevronRight className="h-3 w-3 text-brand-400 transition-transform group-hover:translate-x-0.5" />
              <span>{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-slate-300 antialiased">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/80 to-transparent" />

      <Container className="py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <Logo light />
            <p className="text-xs leading-relaxed text-slate-400">
              Real-time GPS tracking, engine lock, fuel monitoring and 24/7 theft recovery assistance for vehicles across Bangladesh.
            </p>
            <AppStoreBadges showQr={true} />
          </div>

          <div className="lg:col-span-3 lg:col-start-6"><LinkList title="Fleet Solutions" items={FLEET_SOLUTIONS} /></div>
          <div className="lg:col-span-3"><LinkList title="Company" items={COMPANY_LINKS} /></div>

          <div className="space-y-3 text-xs lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact</h4>
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 text-slate-400 hover:text-white"><Phone className="h-3.5 w-3.5 shrink-0 text-brand-400" />{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 break-all text-slate-400 hover:text-white"><Mail className="h-3.5 w-3.5 shrink-0 text-brand-400" />{SITE.email}</a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-slate-400 hover:text-white"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400" />{SITE.address}</a>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/5 bg-black/60 py-3 text-xs text-slate-500">
        <Container className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Image src="/img/app/icon.png" alt="Safety GPS Tracker icon" width={20} height={20} className="h-5 w-auto" />
            <span>© {new Date().getFullYear()} Safety GPS Tracker Bangladesh. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] md:text-xs">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/pay-bill" className="hover:text-slate-300">Online Bill Pay</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
