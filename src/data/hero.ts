/**
 * Home-page hero slides. In production these come from the API (admin → Catalogue → Hero slides);
 * this list is the fallback used when the API is unreachable at build/dev time, and the seed for a new database.
 */
export type HeroIcon = "shield" | "bike" | "truck";
export type HeroAccent = "brand" | "sky" | "emerald";

export interface HeroTelematics { vehicle: string; plate: string; place: string; speed: string; ignition: "ON" | "OFF" | "LOCKED"; status: string; route: string; sensor: string; fuel: string }

export interface HeroSlide {
  id: string;
  tab: string;
  badge: string;
  badgeIcon: HeroIcon;
  titleMain: string;
  titleHighlight: string;
  text: string;
  /** A file in /public */
  bgImage: string;
  accent: HeroAccent;
  ctaLabel: string;
  ctaHref: string;
  telematics: HeroTelematics;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "car-tracking", tab: "Private cars", badge: "Bangladesh's Leading GPS Platform", badgeIcon: "shield",
    titleMain: "Monitor Your Vehicle & Keep It", titleHighlight: "Out Of The Stolen List",
    text: "Track your vehicle in real time with 10s updates, shut down the engine remotely from your smartphone, and receive instant anti-theft alerts.",
    bgImage: "/img/hero-car.jpg", accent: "brand", ctaLabel: "Explore Products", ctaHref: "/products",
    telematics: { vehicle: "Toyota Premio 2022", plate: "Dhaka Metro Ga 32-1142", place: "Mirpur Road, Dhanmondi", speed: "44 km/h", ignition: "ON", status: "In Transit", route: "M10 160 C 80 150, 120 70, 230 70 S 300 120, 310 120", sensor: "AC: ON · Door: Closed", fuel: "78% Fuel" },
  },
  {
    id: "bike-security", tab: "Motorcycles", badge: "Motorcycle Security & Alarm", badgeIcon: "bike",
    titleMain: "Compact Waterproof GPS for", titleHighlight: "Bikes & Scooters",
    text: "Hidden compact tracker with vibration shock alert, ignition notification, and remote engine lock from your smartphone to stop bike theft cold.",
    bgImage: "/img/hero-bike.jpg", accent: "brand", ctaLabel: "View Bike Trackers", ctaHref: "/products/category/gps-tracking-devices/bike-trackers",
    telematics: { vehicle: "Yamaha R15 V4", plate: "Dhaka Metro Ha 19-4820", place: "Bashundhara R/A, Dhaka", speed: "0 km/h", ignition: "OFF", status: "Parked & Armed", route: "M20 40 H280 V140 H60 Z", sensor: "Shock Sensor: Armed", fuel: "12.8V Battery" },
  },
  {
    id: "fleet-management", tab: "Fleets", badge: "Fleet & Heavy Commercial", badgeIcon: "truck",
    titleMain: "Complete Fleet Control &", titleHighlight: "Fuel Rod Monitoring",
    text: "Ultrasonic fuel rods to detect theft, trip mileage logs, speed violation alerts, and automated BRTA reminders.",
    bgImage: "/img/hero-truck.jpg", accent: "sky", ctaLabel: "Fleet Solutions", ctaHref: "/solutions",
    telematics: { vehicle: "Isuzu 5-Ton Covered Van", plate: "Dhaka Metro Ta 14-8831", place: "Gazipur Bypass, Highway", speed: "58 km/h", ignition: "ON", status: "Highway Route", route: "M10 40 C 90 40, 160 160, 250 160 S 300 40, 310 40", sensor: "BRTA Tax & Fitness: Valid", fuel: "86% (Ultrasonic)" },
  },
];
