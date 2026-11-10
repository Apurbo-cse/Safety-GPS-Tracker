import Hero from "@/components/home/Hero";
import Partners from "@/components/home/Partners";
import Overview from "@/components/home/Overview";
import Stats from "@/components/home/Stats";
import SoftwarePreview from "@/components/home/SoftwarePreview";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import HowItWorks from "@/components/home/HowItWorks";
import DeviceShowcase from "@/components/home/DeviceShowcase";
import PricingPreview from "@/components/home/PricingPreview";
import Industries from "@/components/home/Industries";
import AppPlatform from "@/components/home/AppPlatform";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import HomeFaq from "@/components/home/HomeFaq";
import ContactCta from "@/components/home/ContactCta";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta(
  "GPS Vehicle Tracking & Fleet Telematics in Bangladesh",
  "Track vehicles in real time with 10-second updates, emergency remote engine immobilizer, ultrasonic fuel rods, and automated BRTA reminders.",
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
