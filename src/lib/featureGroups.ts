import { BarChart3, Headset, Mic, Radio, ShieldCheck, Smartphone, Wrench, type LucideIcon } from "lucide-react";

export interface FeatureGroup { title: string; icon: LucideIcon; test: (f: string) => boolean }

export const FEATURE_GROUPS: FeatureGroup[] = [
  { title: "Tracking", icon: Radio, test: (f) => /^(Live Tracking|Travel History|Live Traffic Update|Destination Alert|Working Hours)$/.test(f) },
  { title: "Security & safety", icon: ShieldCheck, test: (f) => /(Engine Lock|Engine On|Geo Fencing|Panic|Accident|Device Removal|Door Open|Speed Violation)/.test(f) },
  { title: "Monitoring", icon: Mic, test: (f) => /(Voice|Video)/.test(f) },
  { title: "Reports & driver", icon: BarChart3, test: (f) => /(Mileage|Driver|AC On)/.test(f) },
  { title: "Reminders", icon: Wrench, test: (f) => /(BRTA|Insurance|Oil)/.test(f) },
  { title: "Apps & support", icon: Smartphone, test: (f) => /(App|Helpline)/.test(f) },
];

/** Splits a list of feature names into the groups above; anything left goes into "Also included". */
export function groupFeatures(features: string[]) {
  const left = new Set(features);
  const out = FEATURE_GROUPS.map((g) => {
    const items = features.filter((f) => g.test(f) && left.has(f));
    items.forEach((f) => left.delete(f));
    return { title: g.title, icon: g.icon, items };
  }).filter((g) => g.items.length);
  if (left.size) out.push({ title: "Also included", icon: Headset, items: [...left] });
  return out;
}
