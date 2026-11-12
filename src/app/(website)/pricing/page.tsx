import { CalendarClock, Receipt, Wallet } from "lucide-react";
import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Accordion from "@/components/common/Accordion";
import PricingExplorer from "@/components/pricing/PricingExplorer";
import PricingSubNav from "@/components/pricing/PricingSubNav";
import PlanFinder from "@/components/pricing/PlanFinder";
import CostTimeline from "@/components/pricing/CostTimeline";
import PackageComparison from "@/components/pricing/PackageComparison";
import { LinkButton } from "@/components/common/Button";
import CorporateCta from "@/components/pricing/CorporateCta";
import { getCatalog } from "@/lib/catalog.server";
import { formatBDT } from "@/utils/format";
import { pageMeta } from "@/lib/metadata";

const PRICING_FAQ_CATEGORY = "Pricing & Packages";

/** The description quotes today's lowest prices from the catalogue instead of a fixed sentence. */
export async function generateMetadata() {
  const { plans } = await getCatalog();
  const prices = plans.length ? ` Device price from ${formatBDT(Math.min(...plans.map((p) => p.devicePrice)))} and monthly charges from ${formatBDT(Math.min(...plans.map((p) => p.monthlyCharge)))}.` : "";
  return pageMeta("GPS Tracking Pricing & Packages", `Compare ${plans.length || ""} Safety GPS Tracker packages.${prices}`.replace("Compare  ", "Compare "), "/pricing");
}

const how = [
  { icon: Wallet, t: "Pay for the device once", d: "The device price covers the tracking hardware and installation-ready setup." },
  { icon: CalendarClock, t: "Pay monthly for service", d: "The monthly charge keeps live tracking, apps, alerts and support active." },
  { icon: Receipt, t: "Pay bills online", d: "Settle invoices any time from the Pay Bill page with bKash, Nagad or Rocket." },
];


export default async function PricingPage() {
  const { plans, faqs } = await getCatalog();
  const pricingFaqs = faqs.filter((f) => f.category === PRICING_FAQ_CATEGORY).map((f) => ({ q: f.q, a: f.a }));
  const minDevice = plans.length ? Math.min(...plans.map((p) => p.devicePrice)) : 0;
  const minMonthly = plans.length ? Math.min(...plans.map((p) => p.monthlyCharge)) : 0;
  const stats: [string, string, string][] = [
    [String(plans.length), "", "Tracking packages"],
    [formatBDT(minDevice), "+", "One-time device price"],
    [formatBDT(minMonthly), "/mo", "Monthly service from"],
    ["0", "৳", "Hidden charges"],
  ];
  return (
    <>
      <PageHero
        art="van"
        eyebrow="Pricing Plans"
        badgeText="Transparent BDT Pricing"
        title="Certified GPS Tracking Packages"
        titleHighlight="With Zero Hidden Charges"
        description={`Choose from ${plans.length} tracking packages. Pay once for the device, then a simple monthly charge for live tracking, apps and 24×7 support.`}
      >
        <LinkButton href="#plans" variant="light">Explore Packages</LinkButton>
        <LinkButton href="#compare" variant="outline" className="!bg-white/10 !text-white hover:!bg-white/20">Compare Packages</LinkButton>
      </PageHero>

      {/* stats (About style) */}
      <section className="bg-surface py-10 sm:py-12">
        <Container>
          <dl className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            {stats.map(([n, suffix, l]) => (
              <div key={l} className="rounded-lg bg-softer/80 p-5 dark:bg-navy-900/90 sm:p-6">
                <dd className="text-2xl font-black tracking-tight text-ink sm:text-4xl">{n}<span className="text-brand-500">{suffix}</span></dd>
                <dt className="mt-1.5 text-xs font-medium uppercase tracking-wider text-body">{l}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <PricingSubNav />

      <section className="bg-soft py-12 sm:py-16">
        <Container>
          <SectionHeading eyebrow="Packages" title="Choose Your Tracking Package" description="Every package includes live tracking, the Android, iOS and web apps, and our 24×7 helpline. Tick “Compare” on any two to see them side by side." />
        </Container>
        <PricingExplorer />
      </section>

      <section className="bg-surface py-12 sm:py-16">
        <Container>
          <SectionHeading eyebrow="How it works" title="Simple, Two-Part Pricing" description="No contracts to decode — just a device price and a monthly service charge." />
          <div className="grid gap-5 md:grid-cols-3">
            {how.map((h, i) => (
              <div key={h.t} className="relative rounded-lg bg-softer/80 p-6 text-center transition-all hover:-translate-y-1 dark:bg-navy-900/90">
                <span className="absolute right-4 top-3 text-3xl font-black text-ink/5 dark:text-white/5">0{i + 1}</span>
                <h.icon className="mx-auto h-12 w-12 text-brand-500" strokeWidth={1.5} />
                <h3 className="mt-3 text-lg font-bold text-ink">{h.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-body">{h.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <PlanFinder />
      <CostTimeline />
      <PackageComparison />

      {pricingFaqs.length > 0 && (
        <section id="faq" className="scroll-mt-32 bg-surface py-12 sm:py-16">
          <Container className="max-w-3xl">
            <SectionHeading eyebrow="Pricing FAQ" title="Questions About Pricing" />
            <Accordion items={pricingFaqs} />
          </Container>
        </section>
      )}

      <CorporateCta />
    </>
  );
}
