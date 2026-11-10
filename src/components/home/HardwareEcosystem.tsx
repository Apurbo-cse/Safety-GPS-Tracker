"use client";
import { useState } from "react";
import {
  Camera,
  Droplets,
  KeyRound,
  Lock,
  Siren,
  Snowflake,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import { LinkButton } from "@/components/common/Button";
import { cn } from "@/utils/format";

interface SensorItem {
  id: string;
  name: string;
  icon: LucideIcon;
  category: string;
  tagline: string;
  description: string;
  specs: [string, string][];
  badge: string;
}

const SENSORS: SensorItem[] = [
  {
    id: "fuel",
    name: "Capacitive Fuel Sensor Rod",
    icon: Droplets,
    category: "Fuel Analytics",
    tagline: "Stop diesel theft and highway siphoning with ±1% precision.",
    description: "Installed directly into the vehicle's fuel tank. Measures fuel levels in real time and sends instant alerts for sudden fuel drops, night pilferage, and refueling quantity receipts.",
    specs: [["Accuracy", "±1% Precision"], ["Signal", "CAN-Bus / RS485"], ["Tank Length", "350mm – 1200mm"], ["Fuel Types", "Diesel, Octane, Petrol"]],
    badge: "Popular with Cargo Fleets",
  },
  {
    id: "relay",
    name: "Solid-State Engine Immobilizer Relay",
    icon: Lock,
    category: "Anti-Theft Security",
    tagline: "Safely cuts off fuel and starter motor in under 400 milliseconds.",
    description: "Rugged waterproof relay that connects into the vehicle's fuel pump or ignition wiring. Governed by a safe-speed latch so engines are only cut when the vehicle slows down safely.",
    specs: [["Voltage", "12V / 24V Auto-detect"], ["Switch Time", "<400ms"], ["Protection", "IP67 Waterproof"], ["Safety", "Speed-gated Latch"]],
    badge: "Included in All Packages",
  },
  {
    id: "temp",
    name: "BLE Wireless Temperature Probe",
    icon: Snowflake,
    category: "Cold-Chain Logistics",
    tagline: "Continuous -40°C to +85°C climate monitoring for perishables.",
    description: "Wireless Bluetooth probe placed inside cold storage boxes and refrigerated containers. Transmits temperature data every 10 seconds to ensure ice cream, dairy, and pharmaceuticals never spoil.",
    specs: [["Range", "-40°C to +85°C"], ["Battery Life", "Up to 5 Years"], ["Wireless", "Bluetooth 5.0 BLE"], ["Standard", "HACCP & DGDA Compliant"]],
    badge: "Pharma & Dairy",
  },
  {
    id: "rfid",
    name: "RFID Driver Identification Card",
    icon: KeyRound,
    category: "Driver Management",
    tagline: "Authorize vehicle ignition only when a valid driver taps their card.",
    description: "Prevents unauthorized drivers from operating the vehicle. Automatically logs driver shifts, duty start times, and calculates overtime and driver safety scorecards.",
    specs: [["Reader Type", "13.56MHz Mifare"], ["Card Capacity", "Unlimited Drivers"], ["Buzzer", "85dB Ignition Warning"], ["Output", "1-Wire / RS232"]],
    badge: "Corporate & Buses",
  },
  {
    id: "dashcam",
    name: "AI Dual-Channel ADAS & DMS Dashcam",
    icon: Camera,
    category: "Video & AI Telematics",
    tagline: "Real-time AI detection for driver drowsiness, phone use, and lane drift.",
    description: "Dual cameras record road view and driver cabin simultaneously in 1080p HD. AI algorithms alert when a driver nods off, yawns, uses a mobile phone while driving, or tailgates dangerously.",
    specs: [["Resolution", "Dual 1080p HD"], ["AI Features", "ADAS + DMS Detection"], ["Storage", "Dual MicroSD 256GB"], ["Streaming", "4G Live Stream Video"]],
    badge: "Video & Voice Package",
  },
  {
    id: "sos",
    name: "Driver Emergency SOS Panic Button",
    icon: Siren,
    category: "Emergency & Safety",
    tagline: "Concealed push button that alerts dispatchers during hijack or accidents.",
    description: "Discreetly placed within easy reach of the driver. When pressed during a robbery, accident, or medical distress, it instantly triggers high-priority app sirens and SMS broadcasts.",
    specs: [["Trigger Delay", "Instant (<1 sec)"], ["Placement", "Concealed Driver Foot/Dash"], ["Type", "Physical Micro-Switch"], ["Notification", "App Siren + SMS + Portal"]],
    badge: "Essential Security",
  },
];

export default function HardwareEcosystem() {
  const [selectedId, setSelectedId] = useState("fuel");
  const selected = SENSORS.find((s) => s.id === selectedId) ?? SENSORS[0];

  return (
    <section className="relative overflow-hidden bg-surface py-16 sm:py-24 border-t border-line">
      <Container>
        <SectionHeading
          eyebrow="Hardware & Sensor Ecosystem"
          title="Modular telemetry sensors built for tough road environments"
          description="Every vehicle faces different challenges. Connect our certified modular sensors to monitor fuel, climate, driver behavior, and cargo security."
        />

        <div className="mx-auto mt-12 max-w-5xl">
          {/* Sensor Tabs Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {SENSORS.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === selectedId;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all",
                    isActive
                      ? "border-brand-600 bg-brand-500/10 text-brand-text   ring-2 ring-brand-500/30"
                      : "border-line bg-soft/50 text-slate-600 dark:text-slate-300 hover:border-brand-400 hover:bg-surface"
                  )}
                >
                  <div
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-lg",
                      isActive ? "bg-brand-600 text-white" : "bg-softer text-slate-500"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold leading-tight line-clamp-2">{s.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Sensor Deep-Dive Card */}
          <div className="mt-8">
            <Reveal key={selected.id}>
              <div className="grid gap-8 rounded-lg border border-line bg-gradient-to-br from-soft/50 via-surface to-surface p-6   lg:grid-cols-12 sm:p-8">
                <div className="space-y-4 lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-bold text-brand-text">
                      {selected.category}
                    </span>
                    <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-slate-500 border border-line">
                      {selected.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-ink">{selected.name}</h3>
                  <p className="text-sm font-bold text-brand-text">{selected.tagline}</p>
                  <p className="text-xs sm:text-sm text-body leading-relaxed">{selected.description}</p>
                </div>

                {/* Specs Box */}
                <div className="flex flex-col justify-between rounded-lg border border-line bg-softer/60 p-6 lg:col-span-5">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Specifications</h4>
                    <dl className="mt-3 divide-y divide-line-soft text-xs space-y-1">
                      {selected.specs.map(([k, v]) => (
                        <div key={k} className="flex justify-between py-2">
                          <dt className="text-slate-500">{k}</dt>
                          <dd className="font-bold text-ink font-mono">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <LinkButton href="/devices" size="sm" variant="outline" className="w-full text-center justify-center font-bold">
                      View Hardware Specs
                    </LinkButton>
                    <LinkButton href="/contact" size="sm" className="w-full text-center justify-center font-bold">
                      Request Sensor Quote
                    </LinkButton>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
