import PageHero from "@/components/common/PageHero";
import FeaturesExplorer from "@/components/features/FeaturesExplorer";
import ContactCta from "@/components/home/ContactCta";
import { LinkButton } from "@/components/common/Button";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("GPS Tracking Features", "Real-time tracking, engine lock, geo-fencing, reports, driver monitoring and maintenance reminders.", "/features");

export default function FeaturesPage() {
  return (
    <>
      <PageHero art="car" eyebrow="Features" title="Everything your fleet needs, in one tracking platform" description="Browse 40 capabilities across tracking, security, reports, driver monitoring, maintenance and apps. Which features are included depends on the package.">
        <LinkButton href="/pricing" variant="light">Compare packages</LinkButton>
      </PageHero>
      <FeaturesExplorer />
      <ContactCta />
    </>
  );
}
