import { Banknote, Briefcase, Headset, Mail, MapPin } from "lucide-react";
import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import LocationMap from "@/components/common/LocationMap";
import ContactForm from "@/components/forms/ContactForm";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("Contact Safety GPS Tracker", "Call corporate sales, support or billing, email us or visit our Dhaka office.", "/contact");

const rows = [
  { icon: Briefcase, label: "Corporate Sales", value: SITE.phone, href: `tel:${SITE.phone}` },
  { icon: Headset, label: "Support", value: SITE.phone, href: `tel:${SITE.phone}` },
  { icon: Banknote, label: "Billing", value: SITE.phone, href: `tel:${SITE.phone}` },
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
];

export default function ContactPage() {
  return (
    <>
      <PageHero art="cng" eyebrow="Contact" title="Talk to Safety GPS Tracker" description="Sales questions, support requests or billing queries — reach the right team." />
      <Container className="grid gap-8 py-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={r.label}>
                <a href={r.href} className="flex items-center gap-4 rounded-lg glass border border-white/60 dark:border-white/10 p-4 transition-colors hover:border-brand-300">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 text-brand-text"><r.icon className="h-5 w-5" /></span>
                  <span><span className="block text-xs text-slate-500">{r.label}</span><span className="text-sm font-bold text-ink">{r.value}</span></span>
                </a>
              </li>
            ))}
            <li className="flex items-start gap-4 rounded-lg glass border border-white/60 dark:border-white/10 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-text"><MapPin className="h-5 w-5" /></span>
              <span><span className="block text-xs text-slate-500">Office</span><span className="text-sm font-bold text-ink">{SITE.address}</span></span>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-3"><ContactForm /></div>
      </Container>
      <Container className="pb-16">
        <div className="overflow-hidden rounded-lg border border-line" style={{ height: 380 }}>
          <LocationMap lat={23.7513} lng={90.3727} label="Meem Tower, Shukrabad, Dhaka (approximate location)" />
        </div>
        <p className="mt-2 text-xs text-slate-500">Map pin is an approximate location for the Shukrabad area.</p>
      </Container>
    </>
  );
}
