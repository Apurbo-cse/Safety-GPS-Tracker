import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Eye, Mail, MapPin, Phone, Radio, Target } from "lucide-react";
import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import ContactCta from "@/components/home/ContactCta";
import PartnerLogos from "@/components/common/PartnerLogos";
import { LinkButton } from "@/components/common/Button";
import { DynIcon } from "@/lib/icons";
import { whyUs } from "@/data/why";
import { features } from "@/data/features";
import { solutions } from "@/data/solutions";
import { plans } from "@/data/pricing";
import { journey, services, techFlow, values } from "@/data/about";
import { DEVICE_PARTNER_LOGOS, SITE, TELECOM_PARTNER_LOGOS } from "@/lib/site";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("About Safety GPS Tracker", "Safety GPS Tracker provides real-time GPS vehicle tracking software for vehicles and fleets in Bangladesh.", "/about");

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`;

// every number here is counted from the site's own data
const STATS = [
  { value: "10 sec", label: "Location updates" },
  { value: String(features.length), label: "Platform features" },
  { value: String(solutions.length), label: "Industries served" },
  { value: String(plans.length), label: "Packages" },
  { value: String(DEVICE_PARTNER_LOGOS.length + TELECOM_PARTNER_LOGOS.length), label: "Device & telecom partners" },
  { value: "24×7", label: "Helpline" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero art="pickup" eyebrow="About us" title="Real-time GPS vehicle tracking solution" description="Safety GPS Tracker provides GPS tracking software that helps customers monitor accurate locations of their vehicles and fleets.">
        <LinkButton href="#story" variant="light">Our story</LinkButton>
        <LinkButton href="/contact" variant="outline" className="!border-white/30 !bg-transparent !text-white hover:!bg-white/10">Contact us</LinkButton>
      </PageHero>

      {/* stats strip */}
      <Container className="relative z-10 -mt-6">
        <div className="glass grid grid-cols-2 divide-line overflow-hidden rounded-lg border border-line sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          {STATS.map((s) => (
            <div key={s.label} className="border-b border-line p-3 text-center sm:p-4 lg:border-b-0">
              <p className="text-xl font-black text-ink sm:text-2xl">{s.value}</p>
              <p className="mt-0.5 text-xs text-body">{s.label}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* story */}
      <Container id="story" className="grid scroll-mt-24 items-center gap-8 py-12 sm:py-16 lg:grid-cols-2">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-text"><span className="h-px w-6 bg-brand-500" />Company introduction</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">Tracking that keeps vehicles visible and safe</h2>
          <p className="mt-3 leading-relaxed text-body">Safety GPS Tracker offers a real-time GPS vehicle tracking solution. Our tracking software enables you to see the accurate location of your fleet and vehicles — whether for personal use or for business — from the web and from Android and iOS apps.</p>
          <p className="mt-3 leading-relaxed text-body">We serve logistics, private cars, construction equipment, public transport, motorbikes, ships and cargo, CNG auto-rickshaws and business transport.</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {solutions.map((s) => (
              <Link key={s.id} href={`/solutions#${s.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-body-strong transition-colors hover:border-brand-400 hover:text-brand-text">
                <DynIcon name={s.icon} className="h-3.5 w-3.5 text-brand-text" />{s.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
            <div aria-hidden className="grid-bg absolute inset-0 opacity-30" />
            <span className="relative grid h-10 w-10 place-items-center rounded-lg bg-white/15"><Target className="h-5 w-5" /></span>
            <h3 className="relative mt-3 text-lg font-bold">Mission</h3>
            <p className="relative mt-1 text-sm text-white/85">Give every vehicle owner accurate, timely location and security information through simple tracking software.</p>
          </div>
          <div className="relative overflow-hidden rounded-lg bg-navy-950 p-5 text-white">
            <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
            <span className="relative grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-brand-400"><Eye className="h-5 w-5" /></span>
            <h3 className="relative mt-3 text-lg font-bold">Vision</h3>
            <p className="relative mt-1 text-sm text-slate-300">Be a dependable tracking partner for personal vehicles and business fleets across Bangladesh.</p>
          </div>
          {values.map((v) => (
            <div key={v.title} className="glass rounded-lg border border-line p-4 transition-colors hover:border-brand-400">
              <v.icon className="h-5 w-5 text-brand-text" />
              <h3 className="mt-2 text-sm font-bold text-ink">{v.title}</h3>
              <p className="mt-1 text-sm text-body">{v.text}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* services */}
      <section className="border-y border-line bg-surface py-12 sm:py-16">
        <Container>
          <SectionHeading eyebrow="What we do" title="Our services" description="Everything you need to see, protect and manage your vehicles." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <div key={s.title} className="group glass relative overflow-hidden rounded-lg border border-line p-4 transition-all hover:-translate-y-0.5 hover:border-brand-400">
                <span className="absolute right-3 top-3 font-mono text-xs font-bold text-line-strong">{String(i + 1).padStart(2, "0")}</span>
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/10 text-brand-text transition-colors group-hover:bg-brand-600 group-hover:text-white"><s.icon className="h-5 w-5" /></span>
                <h3 className="mt-3 font-bold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-body">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* technology */}
      <section className="relative overflow-hidden bg-navy-950 py-12 text-white sm:py-16">
        <div aria-hidden className="grid-bg absolute inset-0 opacity-60" />
        <div aria-hidden className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-300"><Cpu className="h-3.5 w-3.5" />Technology &amp; platform</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">From the vehicle to your phone</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">Tracking devices report vehicle position and events to the platform, which supports 10-second location updates, multiple map views, live traffic and Google Street View. Customers use the web platform or the Android and iOS apps, with email and popup notifications.</p>
            <ol className="mt-6 space-y-0">
              {techFlow.map((t, i) => (
                <li key={t.title} className="relative flex gap-3 pb-5 last:pb-0">
                  {i < techFlow.length - 1 && <span aria-hidden className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-brand-500 to-white/10" />}
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-brand-400"><t.icon className="h-5 w-5" /></span>
                  <div>
                    <p className="font-semibold text-white">{t.title}</p>
                    <p className="text-sm text-slate-400">{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative">
            <Image src="/img/platform.png" alt="Safety GPS Tracker web platform and mobile app" width={1200} height={1137} sizes="(min-width:1024px) 600px, 100vw" quality={90} className="h-auto w-full" />
          </div>
        </Container>
      </section>

      {/* journey */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading eyebrow="Working with us" title="From first call to ongoing support" />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {journey.map((j, i) => (
              <li key={j.title} className="glass relative rounded-lg border border-line p-4">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{i + 1}</span>
                  <j.icon className="h-5 w-5 text-brand-text" />
                </div>
                <h3 className="mt-3 font-bold text-ink">{j.title}</h3>
                <p className="mt-1 text-sm text-body">{j.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* partners */}
      <section className="border-y border-line bg-surface py-12 sm:py-16">
        <Container>
          <SectionHeading eyebrow="Partners" title="Built with trusted hardware and networks" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass rounded-lg border border-line p-5">
              <h3 className="flex items-center gap-2 font-bold text-ink"><Cpu className="h-5 w-5 text-brand-text" />Device partners <span className="ml-auto rounded-full bg-softer px-2 py-0.5 text-xs font-semibold text-body">{DEVICE_PARTNER_LOGOS.length}</span></h3>
              <div className="mt-4"><PartnerLogos items={DEVICE_PARTNER_LOGOS} /></div>
            </div>
            <div className="glass rounded-lg border border-line p-5">
              <h3 className="flex items-center gap-2 font-bold text-ink"><Radio className="h-5 w-5 text-brand-text" />Telecom partners <span className="ml-auto rounded-full bg-softer px-2 py-0.5 text-xs font-semibold text-body">{TELECOM_PARTNER_LOGOS.length}</span></h3>
              <div className="mt-4"><PartnerLogos items={TELECOM_PARTNER_LOGOS} /></div>
            </div>
          </div>
        </Container>
      </section>

      {/* why us */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading eyebrow="Why choose us" title="What you get with Safety GPS Tracker" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{whyUs.map((w) => (
            <div key={w.title} className="group glass flex gap-4 rounded-lg border border-line p-4 transition-colors hover:border-brand-400">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-text transition-colors group-hover:bg-brand-600 group-hover:text-white"><w.icon className="h-5 w-5" /></span>
              <div><h3 className="font-bold text-ink">{w.title}</h3><p className="mt-1 text-sm text-body">{w.text}</p></div>
            </div>
          ))}</div>
        </Container>
      </section>

      {/* office */}
      <Container className="pb-12 sm:pb-16">
        <div className="grid overflow-hidden rounded-lg border border-line lg:grid-cols-3">
          <div className="relative bg-navy-950 p-5 text-white sm:p-6 lg:col-span-1">
            <div aria-hidden className="grid-bg absolute inset-0 opacity-50" />
            <p className="relative text-xs font-bold uppercase tracking-wider text-brand-300">Visit or call</p>
            <h2 className="relative mt-1 text-xl font-bold">Our office</h2>
            <p className="relative mt-2 text-sm text-slate-300">Come by, or call the helpline any time — it is open 24×7.</p>
            <Link href="/contact" className="relative mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-300 hover:underline">Contact page <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-px bg-line sm:grid-cols-3 lg:col-span-2">
            {[
              { icon: MapPin, label: "Address", value: SITE.address, href: MAPS_URL, ext: true },
              { icon: Phone, label: "Helpline", value: SITE.phone, href: `tel:${SITE.phone}` },
              { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
            ].map((c) => (
              <a key={c.label} href={c.href} {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group bg-surface p-5 transition-colors hover:bg-soft">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/10 text-brand-text transition-colors group-hover:bg-brand-600 group-hover:text-white"><c.icon className="h-4 w-4" /></span>
                <p className="mt-3 text-xs text-body">{c.label}</p>
                <p className="mt-0.5 break-words text-sm font-semibold text-ink">{c.value}</p>
              </a>
            ))}
          </div>
        </div>
      </Container>

      <ContactCta />
    </>
  );
}
