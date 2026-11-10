import type { Device } from "@/types";
import { plans } from "@/data/pricing";

/**
 * Products come from the company price list: each package image carries a
 * product title and the package carries the price. Specs list only what the
 * package establishes; everything else is "on request".
 */
const plan = (id: string) => plans.find((p) => p.id === id)!;
const pick = (id: string, wanted: string[]) => plan(id).features.filter((f) => wanted.includes(f)).slice(0, 5);
const base = (id: string) => {
  const p = plan(id);
  return {
    price: p.devicePrice,
    monthly: p.monthlyCharge,
    planId: p.id,
    image: p.image,
    siteTitle: p.siteTitle,
    priceNote: `Device price from the ${p.name} package`,
  };
};
const KEY = ["Live Tracking", "Engine Lock & Unlock", "Geo Fencing", "Travel History", "Device Removal Alert", "Panic Button", "Speed Violation Alert", "Daily Mileage Report", "Car Inside Voice Monitoring", "Voice Monitoring", "Live Video & Voice Monitoring", "AC On Notification", "Door Open Alert", "Working Hours"];
const common = (id: string) => [
  { label: "Device price", value: `৳${plan(id).devicePrice.toLocaleString("en-US")}` },
  { label: "Monthly charge", value: `৳${plan(id).monthlyCharge}` },
  { label: "Location updates", value: "Every 10 seconds" },
  { label: "Apps", value: "Android, iOS and web" },
];

export const devices: Device[] = [
  { id: "premium-pro-voice", name: "Premium Pro With Voice", category: "Voice Monitoring Devices", visual: "voice", summary: "Voice monitoring tracker with AC On and Door Open notifications.", specs: common("premium-voice"), features: pick("premium-voice", KEY), ...base("premium-voice") },
  { id: "premium-with-voice", name: "Premium Device With Voice", category: "Voice Monitoring Devices", visual: "voice", summary: "Tracker with in-car voice monitoring and full security alerts.", specs: common("standard-gps"), features: pick("standard-gps", KEY), ...base("standard-gps") },
  { id: "premium-without-voice", name: "Premium Without Voice", category: "GPS Tracking Devices", visual: "tracker", summary: "Everyday GPS tracker for cars with live tracking, history and alerts.", specs: common("gps-1"), features: pick("gps-1", KEY), ...base("gps-1") },
  { id: "bike-premium", name: "Bike Premium Device", category: "GPS Tracking Devices", visual: "tracker", summary: "Tracker for motorcycles with live location, engine lock and alerts.", specs: common("gps-2"), features: pick("gps-2", KEY), ...base("gps-2") },
  { id: "excavator-device", name: "Excavator Device", category: "GPS Tracking Devices", visual: "tracker", summary: "Tracking for construction equipment with working hours and engine alerts.", specs: common("gps-3"), features: pick("gps-3", KEY), ...base("gps-3") },
  { id: "truck-tracking", name: "Truck Tracking Device", category: "GPS Tracking Devices", visual: "voice", summary: "Tracking for trucks and commercial vehicles with voice monitoring.", specs: common("voice-gps"), features: pick("voice-gps", KEY), ...base("voice-gps") },
  { id: "live-video-tracking", name: "Live Video & Tracking", category: "Video & Voice Monitoring Devices", visual: "video", summary: "Live video and voice monitoring terminal for high-assurance fleets.", specs: common("video-voice"), features: pick("video-voice", KEY), ...base("video-voice") },
  { id: "easy-obd", name: "Easy OBD Device", category: "Vehicle GPS Hardware", visual: "tracker", summary: "Plug-in style tracker for passenger vehicles.", specs: common("voice-gps-2"), features: pick("voice-gps-2", KEY), ...base("voice-gps-2") },
  {
    id: "engine-lock-relay", name: "Engine Lock Relay Kit", category: "Vehicle GPS Hardware", visual: "relay",
    summary: "Wiring accessory that lets the tracker cut and restore engine power remotely.",
    specs: [{ label: "Price", value: "Request quote" }, { label: "Function", value: "Remote engine lock & unlock" }, { label: "Technical specs", value: "On request" }],
    features: ["Engine Lock & Unlock", "Engine On & Off Alert"], priceNote: "Price not published — request a quote",
  },
  {
    id: "panic-sos-button", name: "Panic / SOS Button", category: "Vehicle GPS Hardware", visual: "sos",
    summary: "Driver-operated emergency button that raises an alert to the account owner.",
    specs: [{ label: "Price", value: "Request quote" }, { label: "Function", value: "Emergency alert" }, { label: "Technical specs", value: "On request" }],
    features: ["Panic Button", "Car Accident Alert"], priceNote: "Price not published — request a quote",
  },
];

export const deviceCategories = [
  "All",
  "GPS Tracking Devices",
  "Voice Monitoring Devices",
  "Video & Voice Monitoring Devices",
  "Vehicle GPS Hardware",
] as const;
