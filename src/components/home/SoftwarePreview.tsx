"use client";
import { useEffect, useState } from "react";
import {
  Compass,
  Cpu,
  Fuel,
  Gauge,
  Lock,
  LockOpen,
  ShieldCheck,
} from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { cn } from "@/utils/format";

const PREVIEW_VEHICLES = [
  {
    id: "v1",
    name: "Delivery Van 01",
    plate: "DHAKA METRO-DA 11-2401",
    type: "Pickup",
    speed: 44,
    rpm: 1950,
    fuel: 68,
    battery: 13.8,
    temp: 88,
    sats: 17,
    status: "running",
    location: "Gulshan Avenue, Dhaka",
    locked: false,
  },
  {
    id: "v2",
    name: "Cargo Truck 07",
    plate: "DHAKA METRO-TA 13-8820",
    type: "Truck",
    speed: 58,
    rpm: 2200,
    fuel: 48,
    battery: 24.2,
    temp: 92,
    sats: 15,
    status: "running",
    location: "Mirpur Road, Dhanmondi",
    locked: false,
  },
  {
    id: "v4",
    name: "Sedan — Executive",
    plate: "DHAKA METRO-GA 20-5512",
    type: "Car",
    speed: 0,
    rpm: 750,
    fuel: 75,
    battery: 13.6,
    temp: 86,
    sats: 18,
    status: "idle",
    location: "Farmgate Intersection",
    locked: false,
  },
];

export default function SoftwarePreview() {
  const [activeTab, setActiveTab] = useState<"cockpit" | "obd" | "lock" | "geofence">("cockpit");
  const [selectedVehIndex, setSelectedVehIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [relayAck, setRelayAck] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPulse((p) => p + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const veh = PREVIEW_VEHICLES[selectedVehIndex];
  const currentSpeed = isLocked ? 0 : veh.speed + ((pulse * 3) % 7);
  const currentRpm = isLocked ? 0 : veh.rpm + ((pulse * 40) % 150);

  const handleToggleLock = () => {
    setRelayAck(true);
    setTimeout(() => {
      setIsLocked(!isLocked);
      setRelayAck(false);
    }, 450);
  };

  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-24">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[130px]" />

      <Container className="relative">
        <SectionHeading
          light
          eyebrow="Interactive Fleet Console"
          title="Engineered for mission-critical fleet operations"
          description="Explore real-time OBD-II telemetry, instant remote immobilizer relays, and geofence perimeter intelligence."
        />

        {/* Feature Tab Selector */}
        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2">
          {[
            { id: "cockpit", label: "Live GPS Cockpit", icon: Compass },
            { id: "obd", label: "OBD-II Diagnostics", icon: Cpu },
            { id: "lock", label: "Remote Immobilizer", icon: Lock },
            { id: "geofence", label: "Geofence Radar", icon: ShieldCheck },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as "cockpit" | "obd" | "lock" | "geofence")}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm",
                activeTab === t.id
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-2 ring-brand-400/40"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Console Container */}
        <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-[#12151c]/90 shadow-2xl backdrop-blur-md">
          {/* Top Console Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3 text-xs">
            {/* Vehicle Selector Chips */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400">Target Vehicle:</span>
              <div className="flex gap-1.5">
                {PREVIEW_VEHICLES.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVehIndex(i);
                      setIsLocked(false);
                    }}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-bold transition-all",
                      selectedVehIndex === i
                        ? "bg-brand-600 text-white"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                    )}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                OBD-II CAN Synchronized
              </span>
              <span className="hidden text-slate-500 sm:inline">|</span>
              <span className="hidden font-mono text-[11px] text-slate-400 sm:inline">
                Ping: 12ms
              </span>
            </div>
          </div>

          {/* Interactive Screen Body */}
          <div className="p-5 sm:p-7">
            {/* TAB 1: LIVE GPS COCKPIT */}
            {activeTab === "cockpit" && (
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Visual HUD Map Mockup */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-[#161a22] p-4 lg:col-span-2">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f05a22_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur border border-white/10">
                        <p className="text-xs font-bold text-white">{veh.name}</p>
                        <p className="font-mono text-[11px] text-brand-400">{veh.location}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                        GNSS Lock (18 Sats)
                      </span>
                    </div>

                    {/* Central Radar Pulse */}
                    <div className="relative mx-auto my-auto flex h-32 w-32 items-center justify-center">
                      <div className="absolute h-full w-full animate-ping-slow rounded-full border border-brand-500/40 bg-brand-500/10" />
                      <div className="absolute h-24 w-24 rounded-full border border-white/10" />
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-500/50">
                        <Compass className="h-6 w-6 animate-spin text-white" style={{ animationDuration: "12s" }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-black/60 p-2 text-xs backdrop-blur border border-white/10 font-mono">
                      <span>LAT: 23.78082</span>
                      <span className="text-slate-400">|</span>
                      <span>LNG: 90.41631</span>
                      <span className="text-slate-400">|</span>
                      <span className="text-emerald-400">HEADING: 080° ENE</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Readout Gauges */}
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Gauge className="h-4 w-4 text-brand-400" /> Ground Velocity
                    </p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-mono text-4xl font-black text-white">{currentSpeed}</span>
                      <span className="text-xs font-semibold text-slate-400">km/h</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-brand-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (currentSpeed / 80) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Fuel className="h-4 w-4 text-blue-400" /> Fuel Reserve (CAN-Bus)
                    </p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-black text-white">{veh.fuel}</span>
                      <span className="text-xs font-semibold text-slate-400">% (~38 Liters)</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full bg-blue-500" style={{ width: `${veh.fuel}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-white/[0.03] p-2.5 border border-white/5">
                      <span className="text-slate-400">Battery</span>
                      <p className="font-mono text-sm font-bold text-emerald-400">{veh.battery}V</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] p-2.5 border border-white/5">
                      <span className="text-slate-400">Coolant</span>
                      <p className="font-mono text-sm font-bold text-amber-400">{veh.temp}°C</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: OBD-II CAN-BUS DIAGNOSTICS */}
            {activeTab === "obd" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="text-xs text-slate-400">Engine Tachometer</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-mono text-3xl font-black text-white">{currentRpm}</span>
                    <span className="text-xs text-slate-400">RPM</span>
                  </div>
                  <p className="mt-2 text-xs text-emerald-400">Normal Idle / Cruise Range</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="text-xs text-slate-400">Alternator & Voltage</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-mono text-3xl font-black text-white">{veh.battery}</span>
                    <span className="text-xs text-slate-400">Volts DC</span>
                  </div>
                  <p className="mt-2 text-xs text-emerald-400">Healthy Charging Relay</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="text-xs text-slate-400">Coolant Temp Sensor</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-mono text-3xl font-black text-white">{veh.temp}</span>
                    <span className="text-xs text-slate-400">°C</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Optimal Operating Temp</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="text-xs text-slate-400">DTC Diagnostic Codes</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-mono text-3xl font-black text-emerald-400">0</span>
                    <span className="text-xs text-slate-400">Faults</span>
                  </div>
                  <p className="mt-2 text-xs text-emerald-400">All CAN-Bus ECU Clear</p>
                </div>

                <div className="sm:col-span-2 lg:col-span-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs font-mono">
                  <p className="text-slate-400 font-bold mb-2">OBD-II CAN Data Feed [J1939 Protocol]:</p>
                  <p className="text-slate-300">
                    ID: 0x18FEEE00 · SPEED: {currentSpeed} km/h · THROTTLE: 34% · OIL_PRESS: 3.8 bar · CABIN_AC: ON · ODO: 48,320 km
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: REMOTE IMMOBILIZER */}
            {activeTab === "lock" && (
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-red-500/10 p-6">
                <div className="mx-auto max-w-xl text-center">
                  <div
                    className={cn(
                      "mx-auto grid h-20 w-20 place-items-center rounded-full transition-all duration-500",
                      isLocked ? "bg-red-500/20 text-red-400 ring-4 ring-red-500/30" : "bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/30"
                    )}
                  >
                    {isLocked ? <Lock className="h-10 w-10" /> : <LockOpen className="h-10 w-10" />}
                  </div>

                  <h4 className="mt-4 text-xl font-bold">
                    {isLocked ? "Engine Locked (Immobilized)" : "Engine Ignition Active"}
                  </h4>
                  <p className="mt-1 text-xs text-slate-300">
                    {isLocked
                      ? "Fuel solenoid relay opened. Starter motor blocked. Vehicle cannot be driven."
                      : "Ignition relay closed. Vehicle is authorized for normal operation."}
                  </p>

                  <div className="mt-6 flex flex-col items-center gap-3">
                    <button
                      onClick={handleToggleLock}
                      disabled={relayAck}
                      className={cn(
                        "rounded-xl px-6 py-3 text-sm font-bold shadow-lg transition-all",
                        isLocked
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/25"
                          : "bg-red-600 text-white hover:bg-red-700 shadow-red-500/25"
                      )}
                    >
                      {relayAck
                        ? "Transmitting 4G Relay Command..."
                        : isLocked
                        ? "Restore Engine Ignition"
                        : "Test Remote Fuel Cut-Off"}
                    </button>

                    <p className="text-[11px] font-mono text-slate-400">
                      Target: {veh.name} ({veh.plate}) · Simulated Demo Command
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: GEOFENCE RADAR */}
            {activeTab === "geofence" && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-[#161a22] p-4 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />
                  {/* Radar Circles */}
                  <div className="relative flex h-48 w-48 items-center justify-center">
                    <div className="absolute h-full w-full rounded-full border-2 border-dashed border-emerald-500/50 bg-emerald-500/10" />
                    <div className="absolute h-32 w-32 rounded-full border border-emerald-500/30" />
                    <span className="absolute -top-3 rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                      Gulshan Depot Zone (1,000m)
                    </span>
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-white">
                      <Compass className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 flex flex-col justify-center">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold">Automated Geofence Alerts</h4>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                        Active Monitoring
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Receive instant SMS, push notification, and siren alert the second a vehicle crosses depot borders.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-3 border border-white/5">
                      <span className="text-slate-300">Delivery Van 01:</span>
                      <span className="text-emerald-400 font-bold">Inside Safe Zone</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-3 border border-white/5">
                      <span className="text-slate-300">Cargo Truck 07:</span>
                      <span className="text-amber-400 font-bold">Zone Exit 18m ago (Notified)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
