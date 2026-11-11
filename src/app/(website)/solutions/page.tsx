import PageHero from "@/components/common/PageHero";
import IndustryNav from "@/components/solutions/IndustryNav";
import SolutionSection from "@/components/home/SolutionSection";
import SolutionMatrix from "@/components/solutions/SolutionMatrix";
import ContactCta from "@/components/home/ContactCta";
import { solutions } from "@/data/solutions";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta(
  "GPS Tracking Solutions by Industry",
  "GPS tracking for private cars, logistics, construction, public transport, motorcycles, ships, CNG auto-rickshaws and business fleets.",
  "/solutions"
);

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        art="bus"
        eyebrow="Industries & Fleet Solutions"
        badgeText="Tailored Sector Telematics"
        title="Smart GPS Tracking Engineered For"
        titleHighlight="Every Industry Sector"
        description="From private personal cars and motorcycles to freight logistics, public transport, CNGs, and heavy equipment — discover specialized telematics for your operational needs."
      />
      <IndustryNav />
      {solutions.map((s, i) => (
        <SolutionSection key={s.id} s={s} index={i} />
      ))}
      <SolutionMatrix />
      <div className="pt-4">
        <ContactCta />
      </div>
    </>
  );
}
