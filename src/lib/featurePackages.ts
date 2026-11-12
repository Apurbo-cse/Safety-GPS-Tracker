import type { PricingPlan } from "@/types";

/**
 * Website feature id -> the label(s) the published price list uses for it.
 * A package "includes" a feature when it lists any of these labels.
 * Features not listed here (map views, street view, fuel monitoring, …) are platform
 * capabilities that the price list does not break down per package.
 */
const MAP: Record<string, string[]> = {
  "real-time-gps-tracking": ["Live Tracking"],
  "live-vehicle-location": ["Live Tracking"],
  "live-traffic-updates": ["Live Traffic Update"],
  "remote-engine-lock": ["Engine Lock & Unlock"],
  "remote-engine-unlock": ["Engine Lock & Unlock"],
  "ignition-on-off-alerts": ["Engine On & Off Alert"],
  "door-open-alerts": ["Door Open Alert"],
  "device-removal-alerts": ["Device Removal Alert"],
  "panic-sos-button": ["Panic Button"],
  "accident-alerts": ["Car Accident Alert"],
  "geo-fencing-alerts": ["Geo Fencing"],
  "daily-mileage-reports": ["Daily Mileage Report"],
  "travel-history": ["Travel History"],
  "working-hour-reports": ["Working Hours"],
  "in-car-voice-monitoring": ["Car Inside Voice Monitoring", "Voice Monitoring"],
  "live-video-voice-monitoring": ["Live Video & Voice Monitoring"],
  "driver-details-management": ["Add Driver Details"],
  "speed-violation-alerts": ["Speed Violation Alert"],
  "destination-alerts": ["Destination Alert"],
  "brta-document-expiry-alerts": ["BRTA Papers Update Alert"],
  "insurance-expiry-alerts": ["Insurance Expire Alert"],
  "engine-oil-change-reminders": ["Engine Oil Change Alert"],
  "ac-on-notifications": ["AC On Notification"],
  "android-application": ["Android and iOS App"],
  "ios-application": ["Android and iOS App"],
};

export const isPackageFeature = (id: string) => id in MAP;
export const packagesFor = (id: string, plans: PricingPlan[]): PricingPlan[] => {
  const labels = MAP[id];
  return labels ? plans.filter((p) => labels.some((l) => p.features.includes(l))) : [];
};

/** Packages that include every mapped feature in `ids`, cheapest first-year cost first. */
export function packagesWithAll(ids: string[], plans: PricingPlan[]) {
  const mapped = ids.filter(isPackageFeature);
  const list = plans.filter((p) => mapped.every((id) => packagesFor(id, plans).some((x) => x.id === p.id)))
    .sort((a, b) => a.devicePrice + a.monthlyCharge * 12 - (b.devicePrice + b.monthlyCharge * 12));
  return { mapped, unmapped: ids.length - mapped.length, list };
}
