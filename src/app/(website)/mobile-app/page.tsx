import MobileAppPage from "@/components/pages/MobileAppPage";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta(
  "GPS Tracking Mobile App",
  "Track vehicles live, get instant alerts and lock the engine from the Safety GPS Tracker app for Android, iOS and web.",
  "/mobile-app",
);

export default function Page() {
  return <MobileAppPage />;
}
