import { Gauge, KeyRound, MapPin, Navigation } from "lucide-react";
import { cn } from "@/utils/format";

export interface TrackInfo {
  vehicle: string;
  plate: string;
  place: string;
  speed: string;
  ignition: "ON" | "OFF" | "LOCKED";
  status: string;
  route: string;
}

const ROADS = ["M0 40 H320", "M0 120 H320", "M70 0 V180", "M230 0 V180", "M0 160 C 100 150, 180 60, 320 70"];

/** Small live-tracking card shown over the hero photo. */
export default function HeroTrackCard({ t }: { t: TrackInfo }) {
  const moving = t.ignition === "ON";
  return (
    <div className="w-full max-w-[340px] overflow-hidden rounded-md border border-white/15 bg-navy-950/80 text-white shadow-2xl shadow-black/40 backdrop-blur-md">
      {/* header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3.5 py-2.5">
        <span className="flex min-w-0 items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" />
            <span className="relative h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{t.vehicle}</span>
            <span className="block font-mono text-[10px] text-slate-400">{t.plate}</span>
          </span>
        </span>
        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", moving ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-300")}>{t.status}</span>
      </div>

      {/* map */}
      <div className="relative h-40" aria-hidden>
        <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
          <rect width="320" height="180" fill="#151922" />
          {[[10, 52, 50, 56], [88, 8, 128, 24], [88, 52, 128, 56], [246, 52, 64, 56], [10, 132, 50, 40], [246, 132, 64, 40]].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#fff" fillOpacity=".04" />
          ))}
          <g stroke="#2a303b" strokeWidth="8" fill="none" strokeLinecap="round">{ROADS.map((d) => <path key={d} d={d} />)}</g>
          <path d={t.route} fill="none" stroke="#f05a22" strokeOpacity=".3" strokeWidth="7" strokeLinecap="round" />
          <path d={t.route} fill="none" stroke="#f98a55" strokeWidth="2.5" strokeDasharray="6 7" strokeLinecap="round" className="route-flow" />
          <g>
            <circle r="13" fill="#f05a22" fillOpacity=".25">
              <animate attributeName="r" values="9;18;9" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle r="6" fill="#f05a22" stroke="#fff" strokeWidth="2.5" />
            {moving && <animateMotion dur="9s" repeatCount="indefinite" path={t.route} />}
          </g>
        </svg>
        <MapPin className="absolute right-2.5 top-2 h-6 w-6 fill-brand-600 text-white drop-shadow" />
        <span className="absolute bottom-2 left-2 flex max-w-[85%] items-center gap-1 truncate rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-slate-200 backdrop-blur">
          <Navigation className="h-3 w-3 shrink-0 text-brand-400" />{t.place}
        </span>
      </div>

      {/* readout */}
      <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 text-center">
        <div className="px-2 py-2">
          <p className="flex items-center justify-center gap-1 text-[10px] text-slate-400"><Gauge className="h-3 w-3" />Speed</p>
          <p className="text-sm font-bold tabular-nums">{t.speed}</p>
        </div>
        <div className="px-2 py-2">
          <p className="flex items-center justify-center gap-1 text-[10px] text-slate-400"><KeyRound className="h-3 w-3" />Ignition</p>
          <p className={cn("text-sm font-bold", t.ignition === "ON" ? "text-green-400" : t.ignition === "LOCKED" ? "text-amber-300" : "text-slate-300")}>{t.ignition}</p>
        </div>
        <div className="px-2 py-2">
          <p className="text-[10px] text-slate-400">Updated</p>
          <p className="text-sm font-bold">10s ago</p>
        </div>
      </div>
    </div>
  );
}
