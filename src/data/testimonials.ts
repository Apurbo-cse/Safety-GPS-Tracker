import type { FaqItem, Testimonial } from "@/types";

/** Illustrative sample feedback — not attributed to real customers. */
export const testimonials: Testimonial[] = [
  { id: "t1", role: "Fleet manager", segment: "Logistics", quote: "Seeing every truck on one map has cut the number of check-in calls we make to drivers." },
  { id: "t2", role: "Car owner", segment: "Private vehicle", quote: "The ignition alert and engine lock give me real confidence when my car is parked overnight." },
  { id: "t3", role: "Operations lead", segment: "Business transport", quote: "Document expiry reminders for BRTA papers and insurance keep our vehicles compliant." },
  { id: "t4", role: "Site supervisor", segment: "Construction", quote: "Geo-fence alerts tell us right away when equipment leaves the site." },
];

export const homeFaqs: FaqItem[] = [
  { q: "How often does the location update?", a: "The platform supports 10-second location updates, so the map stays close to real vehicle movement." },
  { q: "Can I track from my phone?", a: "Yes. Packages include an Android and iOS app in addition to the web-based platform." },
  { q: "Can I lock the engine remotely?", a: "Engine Lock & Unlock is part of every published package." },
  { q: "Which packages include voice or video monitoring?", a: "Voice monitoring is in the Premium Voice Monitoring and Voice Monitoring GPS packages. Live video and voice monitoring is in the Video & Voice Monitoring package." },
  { q: "Is there a helpline?", a: "Every published package lists a 24×7 helpline facility." },
  { q: "Is this website a live tracking system?", a: "No. This website is a frontend demo. The tracking visuals on it are simulated animations, not real vehicle data." },
];
