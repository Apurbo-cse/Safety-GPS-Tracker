import PageHero from "@/components/common/PageHero";
import SolutionSection from "@/components/home/SolutionSection";
import IndustryNav from "@/components/solutions/IndustryNav";
import SolutionMatrix from "@/components/solutions/SolutionMatrix";
import ContactCta from "@/components/home/ContactCta";
import { solutions } from "@/data/solutions";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("GPS Tracking Solutions by Industry", "GPS tracking for private cars, logistics, construction, public transport, motorcycles, ships, CNG auto-rickshaws and business fleets.", "/solutions");

export default function SolutionsPage() {
  return (
    <>
      <PageHero art="bus" eyebrow="Industries & solutions" title="GPS tracking tailored to how you use vehicles" description="From a single family car to a business-wide fleet, see how tracking helps in each setting." />
      <IndustryNav />
      {solutions.map((s, i) => <SolutionSection key={s.id} s={s} index={i} />)}
      <SolutionMatrix />
      <div className="pt-4"><ContactCta /></div>
    </>
  );
}
