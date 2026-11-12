import {
  AppBlock, CategoryGrid, DeviceCatalogue, EnquiryBlock, OtherProducts, FaqGrid, HeroDark, PartnerBorderGrid, ProductWheel, SoftwareBlock, WhyChecklist,
} from "@/components/home/style3/Sections";
import { CtaBand, HowItWorksStepper, IndustriesSlider, PlatformTour, StatsBand } from "@/components/home/style3/More";
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
      <StatsBand />
      <ProductWheel />
      <PlatformTour />
      <SoftwareBlock />
      <AppBlock />
      <CategoryGrid />
      <DeviceCatalogue />
      <OtherProducts />
      <HowItWorksStepper />
      <IndustriesSlider />
      <WhyChecklist />
      <PartnerBorderGrid />
      <LatestNews />
      <FaqGrid />
      <CtaBand />
      <EnquiryBlock />
    </>
  );
}
