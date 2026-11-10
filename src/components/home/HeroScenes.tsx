"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { BellRing, Gauge, KeyRound, Lock, LockOpen, MapPin, Radio, ShieldCheck, Siren } from "lucide-react";
import VehicleArt, { type VehicleKind } from "@/components/art/VehicleArt";

const ROUTE = "M-20 360C80 330 140 250 230 250S360 330 440 270S540 150 620 120";
const ROADS = ["M120 -20C150 120 230 160 240 250S300 400 320 460", "M-20 150C150 170 300 110 620 220", "M420 -20C400 100 450 190 440 270S480 400 500 460"];

const RM_QUERY = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia(RM_QUERY); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => window.matchMedia(RM_QUERY).matches,
    () => false,
  );
}

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full bg-brand-500/20 border border-brand-500/30 px-2.5 py-1 text-[11px] font-semibold text-brand-300 backdrop-blur">{children}</span>
);

/** Slide 1 — a car drives along a route on a map while its live readout updates. */
export function LiveTrackingScene() {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick((n) => n + 1), 1200); return () => clearInterval(t); }, []);
  const speed = 42 + ((tick * 4) % 16);
  const lat = (23.7808 + tick * 0.00012).toFixed(5);
  const lng = (90.4163 + tick * 0.00017).toFixed(5);

  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#12151d] shadow-2xl shadow-black/60">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3">
        <span className="flex items-center gap-2 text-xs font-bold text-white tracking-wide">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping-slow absolute inset-0 rounded-full bg-emerald-400" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          TELEMETRY RELAY ACTIVE
        </span>
        <Chip>Dhaka Hub · 18 Sats</Chip>
      </div>
      <div className="relative aspect-[4/3]">
        <svg viewBox="0 0 600 440" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-label="Car moving along a tracked route on a map" role="img">
          <defs><pattern id="mg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" strokeOpacity=".05" /></pattern></defs>
          <rect width="600" height="440" fill="#12151d" /><rect width="600" height="440" fill="url(#mg)" />
          <rect x="40" y="40" width="120" height="70" rx="10" fill="#1a1e28" /><rect x="320" y="30" width="110" height="60" rx="10" fill="#1a1e28" /><rect x="470" y="310" width="110" height="90" rx="10" fill="#1a1e28" /><rect x="60" y="300" width="130" height="90" rx="10" fill="#193325" fillOpacity=".8" />
          {ROADS.map((d) => <path key={d} d={d} fill="none" stroke="#2c3340" strokeWidth="16" strokeLinecap="round" />)}
          <path d={ROUTE} fill="none" stroke="#2c3340" strokeWidth="22" strokeLinecap="round" />
          <path d={ROUTE} fill="none" stroke="#f05a22" strokeWidth="5" strokeLinecap="round" strokeDasharray="12 12" className={reduced ? "" : "route-flow"} />
          {!reduced && (<>
            <g><circle r="8" fill="#10b981" stroke="#fff" strokeWidth="2.5"><animateMotion dur="20s" repeatCount="indefinite" path={ROADS[1]} /></circle></g>
            <g><circle r="8" fill="#10b981" stroke="#fff" strokeWidth="2.5"><animateMotion dur="26s" repeatCount="indefinite" path={ROADS[0]} /></circle></g>
            <g><circle r="8" fill="#f59e0b" stroke="#fff" strokeWidth="2.5"><animateMotion dur="17s" repeatCount="indefinite" path={ROADS[2]} /></circle></g>
          </>)}
          <g transform={reduced ? "translate(230 250)" : undefined}>
            {!reduced && <animateMotion dur="16s" repeatCount="indefinite" rotate="auto" path={ROUTE} />}
            <circle r="18" fill="#f05a22" fillOpacity=".25"><animate attributeName="r" values="14;42" dur="1.6s" repeatCount="indefinite" /><animate attributeName="fill-opacity" values=".45;0" dur="1.6s" repeatCount="indefinite" /></circle>
            <g transform="scale(1.5)"><rect x="-15" y="-8" width="30" height="16" rx="5" fill="#f05a22" stroke="#fff" strokeWidth="1.6" /><rect x="-3" y="-6" width="10" height="12" rx="2.5" fill="#12141a" opacity=".85" /><rect x="10" y="-6.5" width="3" height="3" rx="1" fill="#fde68a" /><rect x="10" y="3.5" width="3" height="3" rx="1" fill="#fde68a" /></g>
          </g>
        </svg>

        {/* High-Tech HUD Telemetry Card */}
        <div className="absolute bottom-3 left-3 w-64 rounded-xl border border-white/15 bg-[#141822]/95 p-3.5 text-white backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-white">Delivery Van 01</p>
              <p className="font-mono text-[11px] text-slate-400">DHAKA-DA 11-2401</p>
            </div>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-400">Running</span>
          </div>

          <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-300"><MapPin className="h-3 w-3 text-brand-400" />Gulshan Avenue, Dhaka</p>

          <div className="mt-2.5 grid grid-cols-2 gap-2 rounded-lg bg-white/5 p-2 text-xs">
            <div>
              <span className="flex items-center gap-1 text-[11px] text-slate-400"><Gauge className="h-3 w-3 text-brand-400" />Speed</span>
              <p className="font-mono text-base font-black text-white">{speed} <span className="text-[11px] text-slate-400 font-normal">km/h</span></p>
            </div>
            <div>
              <span className="flex items-center gap-1 text-[11px] text-slate-400"><KeyRound className="h-3 w-3 text-emerald-400" />Ignition</span>
              <p className="font-mono text-base font-black text-emerald-400">ON <span className="text-[11px] text-slate-400 font-normal">(CAN)</span></p>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>{lat}, {lng}</span>
            <span className="text-brand-300">Ping 12ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const ALERTS = [
  { icon: KeyRound, t: "Ignition ON", d: "Sedan — Executive", c: "bg-brand-600" },
  { icon: MapPin, t: "Geo-fence exit", d: "Delivery Van 01 left Gulshan zone", c: "bg-amber-500" },
  { icon: Siren, t: "Panic button pressed", d: "CNG Auto 12", c: "bg-red-600" },
  { icon: Lock, t: "Engine locked", d: "Cargo Truck 11 · remote command", c: "bg-emerald-600" },
  { icon: BellRing, t: "Speed violation", d: "Pickup 09 · 64 km/h", c: "bg-amber-500" },
];

/** Slide 2 — a protected vehicle inside a geo-fence while alerts arrive. */
export function SecurityScene() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => n + 1), 2400); return () => clearInterval(t); }, []);
  const locked = i % 2 === 0;
  const visible = [0, 1, 2].map((k) => ALERTS[(i + k) % ALERTS.length]);
  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#12151d] to-[#241510] shadow-2xl shadow-black/60">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3">
        <span className="flex items-center gap-2 text-xs font-bold text-white tracking-wide"><ShieldCheck className="h-4 w-4 text-brand-400" />IMMOBILIZER & PERIMETER RADAR</span>
        <Chip>Active Shield</Chip>
      </div>
      <div className="relative grid aspect-[4/3] grid-cols-5 gap-3 p-4">
        <div className="relative col-span-3 grid place-items-center">
          {[0, 1, 2].map((k) => <span key={k} className="ring-pulse absolute h-44 w-44 rounded-full border-2 border-brand-500/70" style={{ animationDelay: `${k}s` }} />)}
          <span className="absolute h-44 w-44 rounded-full border-2 border-dashed border-white/25" />
          <div className="relative w-36"><VehicleArt kind="car" className="h-auto w-full drop-shadow-[0_8px_10px_rgba(0,0,0,.5)]" />
            <span className={`absolute -right-2 -top-6 grid h-9 w-9 place-items-center rounded-full text-white shadow-lg transition-colors ${locked ? "bg-emerald-600 ring-2 ring-emerald-400/50" : "bg-amber-500 ring-2 ring-amber-400/50"}`}>{locked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}</span></div>
          <p className="absolute bottom-0 text-[11px] font-bold text-white/90">Safe Zone Radar · {locked ? "Engine Locked" : "Ignition Active"}</p>
        </div>
        <ul className="col-span-2 flex flex-col justify-center gap-2">
          {visible.map((a, k) => (
            <li key={`${i}-${k}`} className={`flex items-center gap-2 rounded-xl border border-white/10 bg-[#161a24]/90 p-2.5 text-white shadow-lg backdrop-blur ${k === 0 ? "slide-in ring-1 ring-brand-500/40" : "opacity-75"}`}>
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white ${a.c}`}><a.icon className="h-3.5 w-3.5" /></span>
              <span className="min-w-0"><span className="block truncate text-[11px] font-bold">{a.t}</span><span className="block truncate text-[11px] text-slate-400">{a.d}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const LANES: { kind: VehicleKind; color?: string; name: string; speed: string; dur: number; delay: number }[] = [
  { kind: "truck", name: "Cargo Truck 07", speed: "58 km/h", dur: 14, delay: 0 },
  { kind: "bus", name: "Staff Bus 03", speed: "46 km/h", dur: 18, delay: -9 },
  { kind: "car", color: "#e8ebf0", name: "Sedan — Executive", speed: "62 km/h", dur: 11, delay: -4 },
];

/** Slide 3 — a fleet driving across lanes, each vehicle tagged with live details. */
export function FleetScene() {
  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#12151d] to-[#241510] shadow-2xl shadow-black/60">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3">
        <span className="flex items-center gap-2 text-xs font-bold text-white tracking-wide"><Radio className="h-4 w-4 text-brand-400" />12 FLEET UNITS · 8 MOVING</span>
        <Chip>GPS Relay</Chip>
      </div>
      <div className="space-y-2 bg-black/40 p-3">
        {LANES.map((l) => (
          <div key={l.name} className="relative h-[104px] overflow-hidden rounded-xl bg-[#090b0e] border border-white/5">
            <svg className="absolute inset-x-0 bottom-2.5 h-1 w-full" preserveAspectRatio="none"><line x1="0" y1="2" x2="100%" y2="2" stroke="#fff" strokeOpacity=".3" strokeWidth="2" strokeDasharray="14 14" className="road-dash" /></svg>
            <div className="drive-across top-1.5 w-[26%]" style={{ animationDuration: `${l.dur}s`, animationDelay: `${l.delay}s` }}>
              <span className="mb-0.5 ml-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#161a24] border border-white/15 px-2.5 py-0.5 text-[11px] font-bold text-white shadow"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />{l.name} · {l.speed}</span>
              <VehicleArt kind={l.kind} color={l.color} className="h-auto w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
