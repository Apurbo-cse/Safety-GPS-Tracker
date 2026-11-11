import FeaturesExplorer from "@/components/features/FeaturesExplorer";
import { ServiceTop } from "@/components/pages/AutoPages";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("GPS Tracking Features", "Real-time tracking, engine lock, geo-fencing, reports, driver monitoring and maintenance reminders.", "/features");

export default function FeaturesPage() {
  return (
    <>
      <ServiceTop />
      <FeaturesExplorer />
    </>
  );
}
