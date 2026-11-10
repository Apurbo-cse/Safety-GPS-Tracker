"use client";
import { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Radio,
} from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import { LinkButton } from "@/components/common/Button";
import { cn } from "@/utils/format";

interface Category {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  hardware: string[];
  features: string[];
  badge: string;
  pricingHint: string;
}

const CATEGORIES: Category[] = [
  {
    id: "cars",
    name: "Cars & SUVs",
    icon: "🚗",
    tagline: "Total anti-theft security and remote engine control for private vehicles.",
    description: "Ideal for personal sedans, family SUVs, and executive cars. Get notified the second ignition is turned on, lock the engine if someone drives without permission, and monitor AC usage when the driver waits in parking.",
    hardware: ["Concox / Teltonika 4G Unit", "Solid-State Engine Relay", "In-Cabin Voice Mic", "Backup Lithium Battery"],
    features: ["Remote Engine Lock / Unlock", "AC ON/OFF Notification", "Live 10s Tracking", "Geo-fence Exit Alarms", "BRTA Document Reminders"],
    badge: "Most Popular",
    pricingHint: "Recommended: Premium Voice Monitoring (৳4,500 + ৳300/mo)",
  },
  {
    id: "trucks",
    name: "Heavy Cargo Trucks",
    icon: "🚛",
    tagline: "Highway fleet telematics, fuel theft prevention, and driver fatigue monitoring.",
    description: "Built for inter-district long haul trailers, covered vans, and cargo trucks. Supports CAN-bus diagnostics and high-precision ultrasonic fuel level rods to eliminate diesel pilferage on highways.",
    hardware: ["Teltonika Heavy-Duty CAN Tracker", "Capacitive Fuel Sensor Rod (±1%)", "External High-Gain GPS Antenna", "Rugged IP67 Enclosure"],
    features: ["Real-time Fuel Loss Alerts", "365 Days HD Route Playback", "Over-speeding Alert on Highways", "Driver Working Hour Reports", "Engine Health CAN Diagnostics"],
    badge: "Industrial Telematics",
    pricingHint: "Recommended: Fuel Monitoring Package (৳8,500 + ৳500/mo)",
  },
  {
    id: "pickups",
    name: "Delivery Vans & Pickups",
    icon: "🚐",
    tagline: "Last-mile courier and wholesale distribution monitoring across urban hubs.",
    description: "Track daily delivery routes, monitor turnaround times at retail drops, and eliminate unauthorized driver side-trips. Keep operations running on schedule across Dhaka, Chittagong, and all divisions.",
    hardware: ["SinoTrack / Concox 4G Tracker", "Engine Cut Relay", "Door Opening Sensor", "Panic Button for Driver"],
    features: ["Daily Mileage & Stop Duration", "Destination Arrival Alerts", "Door Open / Tamper Alert", "Multiple Vehicle View", "Live Traffic Overlay"],
    badge: "E-Commerce & Courier",
    pricingHint: "Recommended: Standard Vehicle Tracking (৳3,500 + ৳300/mo)",
  },
  {
    id: "bikes",
    name: "Motorbikes & Scooters",
    icon: "🏍️",
    tagline: "Ultra-compact waterproof GPS tracking for ride-sharing & food delivery fleets.",
    description: "Miniature design that conceals under the seat or fairing with zero battery drainage. Features sleep-mode power management, vibration motion sensors, and instant vehicle towing alerts.",
    hardware: ["Ultra-Compact Waterproof IP67 Unit", "Micro Ignition Cut Relay", "Ultra-Low Power Sleep Module"],
    features: ["Zero Battery Drain Mode", "Vibration / Towing Alarm", "Remote Engine Immobilizer", "Daily Trip & Speed Logs", "Instant Geofence Siren"],
    badge: "Ride-Sharing & Delivery",
    pricingHint: "Recommended: Motorcycle Tracking Package (৳3,000 + ৳300/mo)",
  },
  {
    id: "cng",
    name: "CNG Auto Rickshaws",
    icon: "🛺",
    tagline: "Durable wide-voltage GPS protection for commercial 3-wheelers.",
    description: "Engineered to withstand high vibrations and 12V-90V electrical spikes. Ensures owners can locate their vehicle anytime, confirm daily working hours, and recover stolen vehicles instantly.",
    hardware: ["Wide Voltage (12V-90V) Tracker", "Tamper Detection Harness", "Internal Backup Battery"],
    features: ["Daily Mileage Calculator", "Garage In/Out Time Logs", "Engine Immobilizer Relay", "SOS Button for Driver", "BRTA Fitness Expiry Alert"],
    badge: "Commercial 3-Wheelers",
    pricingHint: "Recommended: Standard Tracking (৳3,500 + ৳300/mo)",
  },
  {
    id: "buses",
    name: "Staff & School Buses",
    icon: "🚌",
    tagline: "Student and employee passenger safety with real-time route sharing.",
    description: "Equipped with passenger SOS alarms, speed limit compliance chimes, and shareable live tracking links for parents and corporate HR teams to see estimated arrival times.",
    hardware: ["Teltonika Passenger Telematics Hub", "Dual Driver RFID Card Reader", "Emergency Passenger SOS Switches"],
    features: ["Live Tracking Link for Parents", "Driver Identity RFID Cards", "Speed Governor Enforcement", "Delay & Route Deviation Alerts", "BRTA Route Permit Tracker"],
    badge: "Corporate & School",
    pricingHint: "Recommended: Fleet Master Package (৳5,500 + ৳400/mo)",
  },
  {
    id: "coldchain",
    name: "Refrigerated Vans",
    icon: "❄️",
    tagline: "Pharma, dairy, and meat cold-chain compliance with wireless temperature probes.",
    description: "Monitor freezer compartment temperature in real time. Get instant notifications if temperatures rise above required thresholds before food or medical vaccines spoil.",
    hardware: ["BLE Wireless Temperature Sensor (-40°C to +85°C)", "Door Magnetic Contacts", "Teltonika Cold-Chain Relay"],
    features: ["Continuous Temperature Logging", "Defrost & Door Left Open Alerts", "HACCP & DGDA Compliance Exports", "Trip Temperature Graph", "Automated Spoilage Warning"],
    badge: "Pharma & Cold-Chain",
    pricingHint: "Recommended: Cold-Chain Telematics (৳9,500 + ৳500/mo)",
  },
];

export default function FleetCoverage() {
  const [activeId, setActiveId] = useState("cars");
  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];

  return (
    <section className="relative overflow-hidden bg-surface py-16 sm:py-24 border-t border-line">
      <Container>
        <SectionHeading
          eyebrow="Fleet Ecosystem Coverage"
          title="Tailored telematics solutions for every vehicle type"
          description="From private executive cars to heavy industrial cargo fleets, our hardware and software adapt to your exact operational requirements."
        />

        {/* Category Horizontal Buttons */}
        <div className="mt-10 flex overflow-x-auto pb-2 scrollbar-none gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 text-xs sm:text-sm font-bold transition-all border shrink-0",
                activeId === c.id
                  ? "border-brand-600 bg-brand-600 text-white    "
                  : "border-line bg-soft/50 text-body hover:border-brand-400 hover:text-ink hover:bg-surface"
              )}
            >
              <span className="text-base">{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Category Details Card */}
        <div className="mt-6">
          <Reveal key={active.id}>
            <div className="grid gap-8 rounded-lg border border-line bg-gradient-to-br from-soft/40 via-surface to-surface p-6   lg:grid-cols-12 sm:p-8">
              {/* Left Column: Description & Feature Grid */}
              <div className="space-y-6 lg:col-span-7">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{active.icon}</span>
                    <h3 className="text-xl font-bold text-ink sm:text-2xl">{active.name}</h3>
                    <span className="rounded-full bg-brand-500/15 px-3 py-0.5 text-xs font-bold text-brand-text">
                      {active.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-brand-text">{active.tagline}</p>
                  <p className="mt-2 text-xs sm:text-sm text-body leading-relaxed">{active.description}</p>
                </div>

                {/* Features Pill Matrix */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Security & Telematics Features</h4>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {active.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 rounded-lg bg-soft/60 p-2.5 text-xs font-semibold text-ink border border-line-soft">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Hardware Kit & Recommended Package */}
              <div className="flex flex-col justify-between rounded-lg border border-line bg-softer/50 p-6 lg:col-span-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recommended Hardware Sensor Kit</h4>
                  <ul className="mt-3 space-y-2">
                    {active.hardware.map((hw) => (
                      <li key={hw} className="flex items-center gap-2.5 rounded-lg glass border border-white/60 dark:border-white/10 p-3 text-xs font-bold text-ink">
                        <Radio className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                        <span>{hw}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 rounded-lg border border-brand-500/20 bg-brand-500/5 p-4 text-xs">
                    <p className="font-bold text-ink">Pricing Recommendation:</p>
                    <p className="mt-0.5 text-brand-text font-semibold">{active.pricingHint}</p>
                    <p className="mt-1 text-[11px] md:text-xs text-slate-500">Includes Free Installation + 1 Year Device Replacement Warranty.</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <LinkButton href="/pricing" size="md" className="w-full text-center justify-center font-bold">
                    View Package Details <ChevronRight className="h-4 w-4" />
                  </LinkButton>
                  <LinkButton href="/contact" variant="ghost" size="sm" className="w-full text-center justify-center">
                    Talk to a Fleet Consultant
                  </LinkButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
