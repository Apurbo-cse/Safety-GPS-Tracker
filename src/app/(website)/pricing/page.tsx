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
import { pricingFaqs } from "@/data/pricing";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("GPS Tracking Pricing & Packages", "Compare Safety GPS Tracker packages: device price from ৳4,000 and monthly charges from ৳300.", "/pricing");

const how = [
  { icon: Wallet, t: "Pay for the device once", d: "The device price covers the tracking hardware." },
  { icon: CalendarClock, t: "Pay monthly for service", d: "The monthly charge keeps tracking, apps and alerts active." },
  { icon: Receipt, t: "Pay bills online", d: "Use the Pay Bill page to settle invoices (demo interface)." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero art="van" eyebrow="Pricing" title="Clear device prices and Monthlys" description="Eight packages from the published price list. Device prices range from ৳4,000 to ৳16,000 and monthly charges from ৳300 to ৳500.">
        <LinkButton href="#finder" variant="light">Find my plan</LinkButton>
        <LinkButton href="#compare" variant="outline" className="!border-white/30 !bg-transparent !text-white hover:!bg-white/10">Compare packages</LinkButton>
      </PageHero>
      <PricingSubNav />
      <PricingExplorer />
      <PlanFinder />
      <CostTimeline />
      <PackageComparison />
      <section className="py-14">
        <Container>
          <SectionHeading eyebrow="Monthly pricing" title="How pricing works" />
          <div className="grid gap-4 md:grid-cols-3">
            {how.map((h) => (
              <div key={h.t} className="rounded-md glass border border-line p-5">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-50 text-brand-text"><h.icon className="h-5 w-5" /></span>
                <h3 className="mt-3 text-base font-bold text-ink">{h.t}</h3><p className="mt-1 text-sm text-body">{h.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section id="faq" className="scroll-mt-32 pb-14">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Pricing FAQ" title="Questions about pricing" />
          <Accordion items={pricingFaqs} />
        </Container>
      </section>
      <CorporateCta />
    </>
  );
}
