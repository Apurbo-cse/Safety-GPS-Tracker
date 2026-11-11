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
import UseCases from "@/components/home/UseCases";
import PackageGallery from "@/components/home/PackageGallery";
import HomeFaq from "@/components/home/HomeFaq";
import ContactCta from "@/components/home/ContactCta";

/** Previous home page layout — swap it back into src/app/(website)/page.tsx to restore. */
export default function HomeClassic() {
  return (
    <>
      <Hero />
      <Overview />
      <FeaturesGrid />
      <HowItWorks />
      <UseCases />
      <SoftwarePreview />
      <DeviceShowcase />
      <PackageGallery />
      <PricingPreview />
      <Industries />
      <AppPlatform />
      <WhyUs />
      <Stats />
      <Testimonials /> 
      <HomeFaq />
      <ContactCta className="bg-sec-white pt-16 sm:pt-20" />
      <Partners />
    </>
  );
}
