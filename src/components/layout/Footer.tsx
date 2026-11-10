import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/common/Logo";
import Container from "@/components/common/Container";
import { PLAY_STORE_URL, SITE } from "@/lib/site";

const cols = [
  { title: "Product", links: [["Features", "/features"], ["Pricing", "/pricing"], ["Tracking Devices", "/devices"], ["Solutions", "/solutions"]] },
  { title: "Company", links: [["About Us", "/about"], ["Contact", "/contact"], ["Pay Bill", "/pay-bill"]] },
  { title: "Account", links: [["Login", "/login"], ["Register", "/register"], ["Forgot Password", "/forgot-password"]] },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {SITE.tagline}. Our GPS tracking software lets you track the accurate location of your fleet and vehicles.
          </p>
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block" aria-label="Get the Android app on Google Play"><Image src="/img/app/play-badge.png" alt="Get it on Google Play" width={150} height={50} className="h-11 w-auto" /></a>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /><a href={`tel:${SITE.phone}`} className="hover:text-white">{SITE.phone}</a></li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></li>
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />{SITE.address}</li>
          </ul>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="mb-3 text-sm font-semibold text-white">{c.title}</h3>
            <ul className="space-y-2 text-sm">
              {c.links.map(([label, href]) => (
                <li key={href}><Link href={href} className="text-slate-400 hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-1 py-5 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Safety GPS Tracker. All rights reserved.</p>
          <p>Frontend demo — tracking visuals are simulated and no payments are processed.</p>
        </Container>
      </div>
    </footer>
  );
}
