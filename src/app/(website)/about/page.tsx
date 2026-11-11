import { AboutAuto } from "@/components/pages/AutoPages";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("About Safety GPS Tracker", "Safety GPS Tracker provides real-time GPS vehicle tracking software for vehicles and fleets in Bangladesh.", "/about");

/** Previous layout: src/components/pages/AboutClassic.tsx */
export default function AboutPage() {
  return <AboutAuto />;
}
