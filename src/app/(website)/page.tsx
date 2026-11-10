import Hero from "@/components/home/Hero";
import Partners from "@/components/home/Partners";
import Overview from "@/components/home/Overview";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import HowItWorks from "@/components/home/HowItWorks";
import SoftwarePreview from "@/components/home/SoftwarePreview";
import DeviceShowcase from "@/components/home/DeviceShowcase";
import PricingPreview from "@/components/home/PricingPreview";
import Industries from "@/components/home/Industries";
import AppPlatform from "@/components/home/AppPlatform";
import WhyUs from "@/components/home/WhyUs";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import HomeFaq from "@/components/home/HomeFaq";
import ContactCta from "@/components/home/ContactCta";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta(
  "GPS Vehicle Tracking & Fleet Management in Bangladesh",
  "Track vehicles in real time, lock the engine remotely, set geo-fences and get reports with Safety GPS Tracker.",
  "/",
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <Partners />
      <Overview />
      <FeaturesGrid />
      <HowItWorks />
      <SoftwarePreview />
      <DeviceShowcase />
      <PricingPreview />
      <Industries />
      <AppPlatform />
      <WhyUs />
      <Stats />
      <Testimonials />
      <HomeFaq />
      <ContactCta />
    </>
  );
}
