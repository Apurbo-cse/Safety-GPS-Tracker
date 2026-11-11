import { MapPin, Navigation, Satellite } from "lucide-react";
import VehicleArt, { type VehicleKind } from "./VehicleArt";

const KINDS: VehicleKind[] = ["car", "van", "truck", "bus", "bike", "cng", "pickup", "excavator", "ship"];
const ROUTE = "M40 250 C 110 250, 120 170, 190 165 S 290 200, 320 130 S 400 70, 440 60";

/** GPS-themed banner illustration: satellite uplink, city map, animated route and live tracking chips. */
export default function GpsHeroArt({ art }: { art?: string }) {
  const kind = KINDS.includes(art as VehicleKind) ? (art as VehicleKind) : undefined;

  return (
    <div className="relative aspect-[8/5] w-full" aria-hidden>
      <svg viewBox="0 0 480 300" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="gps-map" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22262e" />
            <stop offset="1" stopColor="#181b21" />
          </linearGradient>
          <clipPath id="gps-clip"><rect x="0" y="0" width="480" height="300" rx="10" /></clipPath>
        </defs>

        <g clipPath="url(#gps-clip)">
          <rect width="480" height="300" fill="url(#gps-map)" />
          {/* City blocks */}
          {[
            [20, 20, 90, 60], [130, 20, 70, 90], [220, 30, 110, 50], [350, 100, 110, 70],
            [20, 110, 80, 70], [230, 220, 100, 60], [360, 200, 100, 80], [120, 200, 60, 80],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#fff" fillOpacity=".035" />
          ))}
          {/* Streets */}
          <g stroke="#fff" strokeOpacity=".08" strokeWidth="10" fill="none">
            <path d="M0 95 H480" /><path d="M0 195 H480" /><path d="M115 0 V300" /><path d="M340 0 V300" />
          </g>
          <path d="M210 0 L 260 300" stroke="#fff" strokeOpacity=".05" strokeWidth="6" />
          {/* River */}
          <path d="M0 290 C 120 270, 200 300, 300 285 S 440 270, 480 280" stroke="#3b82f6" strokeOpacity=".25" strokeWidth="14" fill="none" />

          {/* Geofence */}
          <circle cx="320" cy="130" r="46" fill="#f05a22" fillOpacity=".07" stroke="#f05a22" strokeOpacity=".5" strokeDasharray="5 5" />

          {/* Route */}
          <path d={ROUTE} stroke="#f05a22" strokeOpacity=".25" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d={ROUTE} stroke="#f98a55" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="10 12" className="route-flow" />

          {/* Start */}
          <circle cx="40" cy="250" r="7" fill="#22c55e" stroke="#fff" strokeWidth="2.5" />

          {/* Moving tracker */}
          <g>
            <circle r="16" fill="#f05a22" fillOpacity=".25" />
            <circle r="7" fill="#f05a22" stroke="#fff" strokeWidth="2.5" />
            <animateMotion dur="9s" repeatCount="indefinite" path={ROUTE} />
          </g>

          {/* Signal from satellite to tracker area */}
          <g stroke="#fdba8c" strokeOpacity=".5" fill="none" strokeWidth="1.5">
            <path d="M96 62 Q 100 80 92 96" /><path d="M110 58 Q 118 84 104 108" />
          </g>
        </g>
        <rect x=".5" y=".5" width="479" height="299" rx="10" fill="none" stroke="#fff" strokeOpacity=".12" />
      </svg>

      {/* Destination pin */}
      <span className="absolute left-[91.6%] top-[20%] -translate-x-1/2 -translate-y-full">
        <span className="ring-pulse absolute left-1/2 top-full h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/40" />
        <MapPin className="relative h-8 w-8 fill-brand-600 text-white drop-shadow-lg" />
      </span>

      {/* Satellite */}
      <span className="absolute left-[12%] top-[6%] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-navy-900/80 text-brand-200 shadow-lg backdrop-blur">
        <Satellite className="h-5 w-5" />
      </span>

      {/* Live chip */}
      <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" />
          <span className="relative h-2 w-2 rounded-full bg-green-400" />
        </span>
        Live tracking
      </span>

      {/* Telemetry card */}
      <div className="absolute bottom-3 right-3 flex items-center gap-3 rounded-md border border-white/10 bg-navy-950/85 p-2.5 pr-3.5 shadow-xl backdrop-blur">
        {kind ? (
          <span className="grid h-10 w-14 place-items-center rounded-md bg-white/5">
            <VehicleArt kind={kind} className="h-auto w-12" />
          </span>
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-600 text-white"><Navigation className="h-4 w-4" /></span>
        )}
        <span className="leading-tight">
          <span className="block text-sm font-bold text-white">62 km/h <span className="font-medium text-green-400">· Moving</span></span>
          <span className="block font-mono text-xs text-slate-400">23.7513°N, 90.3727°E</span>
        </span>
      </div>
    </div>
  );
}
