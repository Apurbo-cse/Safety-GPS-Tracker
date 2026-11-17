import {
  AppBlock, BlueprintSection, CapabilitySnapshot, CategoryGrid, CertificationsSection, DeviceCatalogue, FaqGrid, FundamentalCommitments, HardwareCatalogueSection,
  HeroDark, InnovationGrid, OtherProducts, PartnerBorderGrid, ProductWheel, SectorsDeliver, SoftwareBlock, SolutionChips, TenderCtaSection, WhyChecklist,
} from "@/components/home/style3/Sections";
import { HowItWorksStepper, IndustriesSlider, PlatformTour, StatsBand } from "@/components/home/style3/More";
import LatestNews from "@/components/home/LatestNews";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta(
  "GPS Vehicle Tracking & Fleet Telematics in Bangladesh",
  "Track vehicles in real time with 10-second updates, emergency remote engine immobilizer, ultrasonic fuel rods, and automated BRTA reminders.",
  "/",
);

// Other layouts: src/components/home/HomeClassic.tsx and src/components/home/style2/Sections.tsx
export default function HomePage() {
  return (
    <>
      <HeroDark />
      <ProductWheel />
      <StatsBand />
      <CapabilitySnapshot />
      <FundamentalCommitments />
      <SectorsDeliver />
      <PlatformTour />
      <SoftwareBlock />
      <AppBlock />
      <CategoryGrid />
      <HardwareCatalogueSection />
      <DeviceCatalogue />
      <OtherProducts />
      <HowItWorksStepper />
      <BlueprintSection />
      <IndustriesSlider />
      <WhyChecklist />
      <CertificationsSection />
      <InnovationGrid />
      <PartnerBorderGrid />
      <LatestNews />
      <FaqGrid />
      <TenderCtaSection />
      <SolutionChips />
    </>
  );
}
