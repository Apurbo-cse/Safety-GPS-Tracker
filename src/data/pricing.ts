import type { FaqItem, PricingPlan } from "@/types";

/**
 * Prices and feature lists are taken from the reference price list
 * (packages 1–8). The reference site does not name packages; names follow
 * the project brief. Feature labels are shown as published.
 */
const CORE = [
  "Live Tracking",
  "Daily Mileage Report",
  "Engine Lock & Unlock",
  "Engine On & Off Alert",
  "Speed Violation Alert",
  "Geo Fencing",
  "Panic Button",
  "BRTA Papers Update Alert",
  "Car Accident Alert",
  "Live Traffic Update",
  "Working Hours",
  "Android and iOS App",
  "Destination Alert",
  "Add Driver Details",
  "Insurance Expire Alert",
  "Engine Oil Change Alert",
  "24×7 Helpline Facility",
];

const STANDARD = [
  ...CORE,
  "Car Inside Voice Monitoring",
  "Device Removal Alert",
  "Travel History",
];
const VOICE = [...CORE, "Voice Monitoring", "Device Removal Alert", "Travel History"];
const VIDEO = [
  ...CORE,
  "Live Video & Voice Monitoring",
  "Device Removal Alert",
  "Travel History",
];
const PREMIUM = [
  ...CORE,
  "Car Inside Voice Monitoring",
  "AC On Notification",
  "Door Open Alert",
];

export const plans: PricingPlan[] = [
  { id: "premium-voice", image: "/img/packages/premium-voice.png", siteTitle: "Premium Pro With Voice", name: "Premium Voice Monitoring", devicePrice: 7000, monthlyCharge: 500, features: PREMIUM, sourceNo: 1, highlight: "Most complete cabin alerts" },
  { id: "standard-gps", image: "/img/packages/standard-gps.png", siteTitle: "Premium Device With Voice", name: "Standard GPS", devicePrice: 6000, monthlyCharge: 400, features: STANDARD, sourceNo: 2 },
  { id: "gps-1", image: "/img/packages/gps-1.png", siteTitle: "Premium Without Voice", name: "GPS Package 1", devicePrice: 4000, monthlyCharge: 400, features: STANDARD, sourceNo: 3 },
  { id: "gps-2", image: "/img/packages/gps-2.png", siteTitle: "Bike Premium Device", name: "GPS Package 2", devicePrice: 4000, monthlyCharge: 300, features: STANDARD, sourceNo: 4, highlight: "Lowest monthly charge" },
  { id: "gps-3", image: "/img/packages/gps-3.png", siteTitle: "Excavator Device", name: "GPS Package 3", devicePrice: 4000, monthlyCharge: 300, features: STANDARD, sourceNo: 5 },
  { id: "voice-gps", image: "/img/packages/voice-gps.png", siteTitle: "Truck Tracking Device", name: "Voice Monitoring GPS", devicePrice: 4000, monthlyCharge: 300, features: VOICE, sourceNo: 6 },
  { id: "video-voice", image: "/img/packages/video-voice.png", siteTitle: "Live Video & Tracking", name: "Video & Voice Monitoring", devicePrice: 16000, monthlyCharge: 500, features: VIDEO, sourceNo: 7, highlight: "Live video + voice" },
  { id: "voice-gps-2", image: "/img/packages/voice-gps-2.png", siteTitle: "Easy OBD Device", name: "Voice Monitoring GPS 2", devicePrice: 4000, monthlyCharge: 300, features: VOICE, sourceNo: 8 },
];

/** Union of all features in display order for the comparison table */
export const comparisonFeatures: string[] = [
  ...CORE,
  "Car Inside Voice Monitoring",
  "Voice Monitoring",
  "Live Video & Voice Monitoring",
  "Device Removal Alert",
  "Travel History",
  "AC On Notification",
  "Door Open Alert",
];

export const pricingFaqs: FaqItem[] = [
  {
    q: "What do the device price and monthly charge cover?",
    a: "The device price is a one-time hardware cost. The monthly charge is the recurring subscription for the tracking service and the features listed on the package.",
  },
  {
    q: "Why do some packages look the same?",
    a: "Several packages share the same published feature list and differ only in device price and monthly charge. Contact sales to confirm which one suits your vehicle and budget.",
  },
  {
    q: "Which package has voice or video monitoring?",
    a: "Premium Voice Monitoring lists Car Inside Voice Monitoring. Voice Monitoring GPS and Voice Monitoring GPS 2 list Voice Monitoring. Video & Voice Monitoring lists Live Video & Voice Monitoring.",
  },
  {
    q: "Can I get a package for a larger fleet?",
    a: "Yes. Use the Contact Sales button or the corporate package request below and the sales team will discuss fleet requirements with you.",
  },
  {
    q: "Is payment processed on this website?",
    a: "No. This site is a frontend demo. Buy Now adds a package to a demo cart and no payment is taken.",
  },
];
