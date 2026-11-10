import { Cpu, Eye, Radio, Target, Wrench } from "lucide-react";
import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import ContactCta from "@/components/home/ContactCta";
import { whyUs } from "@/data/why";
import PartnerLogos from "@/components/common/PartnerLogos";
import { DEVICE_PARTNER_LOGOS, SITE, TELECOM_PARTNER_LOGOS } from "@/lib/site";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("About Safety GPS Tracker", "Safety GPS Tracker provides real-time GPS vehicle tracking software for vehicles and fleets in Bangladesh.", "/about");

const services = ["Real-time GPS vehicle tracking", "Voice, and video & voice monitoring", "Engine lock & unlock and security alerts", "Reports, history and maintenance reminders", "Android, iOS and web tracking apps", "24×7 helpline facility"];

export default function AboutPage() {
  return (
    <>
      <PageHero art="pickup" eyebrow="About us" title="Real-time GPS vehicle tracking solution" description="Safety GPS Tracker provides GPS tracking software that helps customers monitor accurate locations of their vehicles and fleets." />
      <Container className="grid gap-10 py-14 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-ink">Company introduction</h2>
          <p className="mt-3 leading-relaxed text-body">Safety GPS Tracker offers a real-time GPS vehicle tracking solution. Our tracking software enables you to see the accurate location of your fleet and vehicles — whether for personal use or for business — from the web and from Android and iOS apps.</p>
          <p className="mt-3 leading-relaxed text-body">We serve logistics, private cars, construction equipment, public transport, motorbikes, ships and cargo, CNG auto-rickshaws and business transport.</p>
          <p className="mt-4 rounded-lg bg-softer p-3 text-sm text-body-strong"><strong>Office:</strong> {SITE.address}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg glass border border-white/60 dark:border-white/10 p-5"><span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-text"><Target className="h-5 w-5" /></span><h3 className="mt-3 font-bold text-ink">Mission</h3><p className="mt-1 text-sm text-body">Give every vehicle owner accurate, timely location and security information through simple tracking software.</p></div>
          <div className="rounded-lg glass border border-white/60 dark:border-white/10 p-5"><span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-text"><Eye className="h-5 w-5" /></span><h3 className="mt-3 font-bold text-ink">Vision</h3><p className="mt-1 text-sm text-body">Be a dependable tracking partner for personal vehicles and business fleets across Bangladesh.</p></div>
        </div>
      </Container>
      <section className="bg-surface py-14">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-ink"><Wrench className="h-6 w-6 text-brand-text" />Our services</h2>
            <ul className="mt-4 space-y-2 text-sm text-body-strong">{services.map((s) => <li key={s} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />{s}</li>)}</ul>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-ink"><Cpu className="h-6 w-6 text-brand-text" />Technology &amp; platform</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">Tracking devices report vehicle position and events to the platform, which supports 10-second location updates, multiple map views, live traffic and Google Street View. Customers use the web platform or the Android and iOS apps, with email and popup notifications.</p>
          </div>
        </Container>
      </section>
      <Container className="grid gap-6 py-14 md:grid-cols-2">
        <div className="rounded-lg glass border border-white/60 dark:border-white/10 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink"><Cpu className="h-5 w-5 text-brand-text" />Device partners</h2>
          <div className="mt-4"><PartnerLogos items={DEVICE_PARTNER_LOGOS} /></div>
        </div>
        <div className="rounded-lg glass border border-white/60 dark:border-white/10 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink"><Radio className="h-5 w-5 text-brand-text" />Telecom partners</h2>
          <div className="mt-4"><PartnerLogos items={TELECOM_PARTNER_LOGOS} /></div>
        </div>
      </Container>
      <section className="pb-14">
        <Container>
          <SectionHeading eyebrow="Why choose us" title="What you get with Safety GPS Tracker" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{whyUs.map((w) => (
            <div key={w.title} className="flex gap-4 rounded-lg glass border border-white/60 dark:border-white/10 p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-text"><w.icon className="h-5 w-5" /></span><div><h3 className="text-[14px] font-bold text-ink">{w.title}</h3><p className="mt-1 text-sm text-body">{w.text}</p></div></div>
          ))}</div>
        </Container>
      </section>
      <ContactCta />
    </>
  );
}
