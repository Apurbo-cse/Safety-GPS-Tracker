import { pricingFaqs } from "./pricing";
import { SITE } from "@/lib/site";

export const FAQ_CATEGORIES = [
  "Tracking & GPS",
  "Security & Relay",
  "Hardware & Sensors",
  "Pricing & Packages",
  "Billing & Support",
] as const;

export type FaqCategoryName = (typeof FAQ_CATEGORIES)[number];

export interface Faq {
  id: string;
  category: FaqCategoryName;
  q: string;
  a: string;
  tag: string;
}

/** Single source for FAQs — used by the home FAQ section and the /faq page. */
export const FAQS: Faq[] = [
  {
    id: "update-rate",
    category: "Tracking & GPS",
    q: "How fast does the GPS location update on the map?",
    a: "Safety GPS Tracker features an ultra-low latency 10-second satellite refresh rate. This ensures road turns, highway speed changes, and traffic stops are reflected accurately in real-time without sluggish delays.",
    tag: "10s Ultra-Fast Ping",
  },
  {
    id: "engine-immobilizer",
    category: "Security & Relay",
    q: "How does the Remote Engine Immobilizer work?",
    a: "Through your mobile app or web portal, you can tap 'Immobilize Engine'. An encrypted command is transmitted via the onboard 4G IoT relay in under 400 milliseconds to cut power to the fuel solenoid. A smart speed-latch ensures the command only executes safely when the vehicle slows down.",
    tag: "Solid-State Relay",
  },
  {
    id: "fuel-monitoring",
    category: "Hardware & Sensors",
    q: "Can I monitor fuel pilferage and diesel consumption?",
    a: "Yes. Our Fuel Monitoring Package pairs with capacitive and ultrasonic fuel sensor rods (±1% accuracy) installed in your vehicle's fuel tank, giving you instant alerts for sudden fuel drops, tank drainage, and refuel receipts.",
    tag: "99.5% Accuracy Rods",
  },
  {
    id: "dead-zones",
    category: "Tracking & GPS",
    q: "What happens if a vehicle enters cellular dead zones on remote highways?",
    a: "Our hardware uses Multi-Carrier 4G IoT SIM cards with automatic network switching across Grameenphone, Robi, and Banglalink towers. In rare instances where all networks are unreachable, internal flash memory stores up to 30,000 GPS points and uploads them automatically the moment signal returns.",
    tag: "Dual-SIM Roaming",
  },
  {
    id: "installation",
    category: "Hardware & Sensors",
    q: "Do you provide doorstep installation across all 64 districts in Bangladesh?",
    a: "Yes! Our certified telematics technicians provide free doorstep installation, covert wiring, and device calibration in Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, and all 64 districts.",
    tag: "64 Districts Coverage",
  },
  {
    id: "multi-login",
    category: "Billing & Support",
    q: "Can multiple dispatchers track the fleet simultaneously on Android, iOS, and PC?",
    a: "Absolutely. One account gives your dispatchers and executives simultaneous multi-login access on native Android and iOS mobile apps as well as any desktop web browser with role-based access control.",
    tag: "Multi-Platform Access",
  },
  {
    id: "btrc-approval",
    category: "Hardware & Sensors",
    q: "Is this tracking hardware approved by BTRC and BRTA compliant?",
    a: "Yes, 100%. All tracking units supplied by Safety GPS Tracker are officially BTRC approved (Reg. BTRC/LL/GPS-2021) and comply with BRTA digital safety guidelines for commercial and private motor vehicles.",
    tag: "BTRC Licensed",
  },
  {
    id: "tamper",
    category: "Security & Relay",
    q: "What happens if a thief attempts to cut or disconnect the tracker?",
    a: "The moment the primary wiring is severed, the device triggers an instant 'Power Cut / Tamper Alert' notification to your phone. The onboard backup battery keeps the GPS running for up to 72 hours while alerting our 24/7 recovery dispatch desk.",
    tag: "Tamper & Battery",
  },

  /* Pricing — from the published price-list FAQs */
  ...pricingFaqs.map((f, i): Faq => ({
    id: `pricing-${i + 1}`,
    category: "Pricing & Packages",
    q: f.q,
    a: f.a,
    tag: ["Device + Monthly", "Package Differences", "Voice & Video", "Fleet Packages", "Demo Checkout"][i] ?? "Pricing",
  })),

  /* General — based on information published on this site */
  {
    id: "apps",
    category: "Billing & Support",
    q: "Which apps can I use to track my vehicle?",
    a: "You can track and control your vehicles from the Android app, the iOS app, and the web platform in any desktop browser.",
    tag: "Android · iOS · Web",
  },
  {
    id: "pay-bill",
    category: "Billing & Support",
    q: "How do I pay my monthly bill?",
    a: "Use the Pay Bill page on this website to look up your account and pay the monthly charge. On this demo site the payment step is simulated and no money is taken.",
    tag: "Pay Bill Online",
  },
  {
    id: "support",
    category: "Billing & Support",
    q: "How do I reach customer support?",
    a: `Call the 24/7 helpline on ${SITE.phone}, email ${SITE.email}, or send a message from the Contact page and the right team will get back to you.`,
    tag: "24/7 Helpline",
  },
];
