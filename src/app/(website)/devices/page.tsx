import PageHero from "@/components/common/PageHero";
import DevicesExplorer from "@/components/devices/DevicesExplorer";
import ContactCta from "@/components/home/ContactCta";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("GPS Tracking Devices", "GPS, voice monitoring and video & voice monitoring devices and vehicle GPS hardware.", "/devices");

export default function DevicesPage() {
  return (
    <>
      <PageHero art="truck" eyebrow="Tracking devices" title="GPS tracking hardware for cars, trucks and bikes" description="Choose from GPS trackers, voice monitoring devices, video & voice monitoring terminals and supporting vehicle hardware." />
      <DevicesExplorer />
      <ContactCta title="Not sure which device you need?" />
    </>
  );
}
