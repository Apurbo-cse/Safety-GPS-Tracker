"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  BarChart3, Bell, Check, Fence, Gauge, KeyRound, Lock, LockOpen, MapPin, Pause, Play, Radio, Route as RouteIcon, User, type LucideIcon,
} from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { cn } from "@/utils/format";

/* ------------------------------------------------------------------ data */
type Status = "running" | "idle" | "parked" | "offline";
interface Veh { id: string; name: string; driver: string; place: string; status: Status; x: number; y: number; speed: number }

const VEHICLES: Veh[] = [
  { id: "v1", name: "Delivery Van 01", driver: "Rafiq Ahmed", place: "Gulshan Avenue", status: "running", x: 372, y: 120, speed: 42 },
  { id: "v2", name: "Cargo Truck 07", driver: "Kamal Hossain", place: "Mirpur Road", status: "running", x: 168, y: 232, speed: 58 },
  { id: "v3", name: "Staff Bus 03", driver: "Jahid Karim", place: "Banani Depot", status: "parked", x: 470, y: 250, speed: 0 },
  { id: "v4", name: "Sedan — Executive", driver: "Sumon Das", place: "Farmgate", status: "idle", x: 292, y: 308, speed: 0 },
  { id: "v5", name: "CNG Auto 12", driver: "Abdul Malek", place: "Motijheel", status: "running", x: 104, y: 112, speed: 31 },
  { id: "v6", name: "Cargo Truck 11", driver: "Mizanur Rahman", place: "Jatrabari", status: "offline", x: 520, y: 80, speed: 0 },
];

const STATUS: Record<Status, { label: string; dot: string; hex: string }> = {
  running: { label: "Running", dot: "bg-green-500", hex: "#22c55e" },
  idle: { label: "Idle", dot: "bg-amber-500", hex: "#f59e0b" },
  parked: { label: "Parked", dot: "bg-sky-500", hex: "#38bdf8" },
  offline: { label: "Offline", dot: "bg-slate-500", hex: "#64748b" },
};

const ROADS = [
  "M-20 300C120 260 200 330 320 290S520 220 640 250",
  "M60 -20C110 120 90 220 150 400",
  "M300 -20C330 90 300 200 360 400",
  "M-20 90C160 130 300 60 640 130",
  "M520 -20C500 120 560 260 540 400",
];
const ROUTE = "M40 320C120 300 150 220 230 210S330 250 400 170S520 110 570 60";

const ALERTS = [
  { id: "a1", sev: "critical", title: "Possible accident detected", who: "Cargo Truck 07", when: "9 min ago" },
  { id: "a2", sev: "warning", title: "Speed violation · 64 km/h", who: "Pickup 09", when: "2 min ago" },
  { id: "a3", sev: "warning", title: "Device offline for 3 hours", who: "Cargo Truck 11", when: "3 hr ago" },
  { id: "a4", sev: "info", title: "Geo-fence exit · Gulshan depot", who: "Delivery Van 01", when: "18 min ago" },
  { id: "a5", sev: "info", title: "Ignition ON", who: "Sedan — Executive", when: "35 sec ago" },
  { id: "a6", sev: "warning", title: "BRTA papers expire in 15 days", who: "CNG Auto 12", when: "Today" },
] as const;
type Sev = (typeof ALERTS)[number]["sev"];
const SEV: Record<Sev, string> = { critical: "bg-red-500", warning: "bg-amber-500", info: "bg-sky-500" };

const TABS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "live", label: "Live map", icon: Radio },
  { id: "playback", label: "Route playback", icon: RouteIcon },
  { id: "fence", label: "Geo-fence", icon: Fence },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

/* --------------------------------------------------------------- map base */
function MapBase({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 600 380" className={cn("h-full w-full", className)} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Demo map">
      <defs><pattern id="sp-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" strokeOpacity=".05" /></pattern></defs>
      <rect width="600" height="380" fill="#171a21" /><rect width="600" height="380" fill="url(#sp-grid)" />
      <rect x="20" y="20" width="90" height="56" rx="8" fill="#1d2129" /><rect x="400" y="300" width="130" height="60" rx="8" fill="#1d2129" /><rect x="210" y="130" width="70" height="50" rx="8" fill="#1d2129" />
      <rect x="40" y="320" width="110" height="46" rx="8" fill="#17261f" />
      {ROADS.map((d) => <path key={d} d={d} fill="none" stroke="#2b313c" strokeWidth="14" strokeLinecap="round" />)}
      {children}
    </svg>
  );
}

const Marker = ({ x, y, color, selected, pulse }: { x: number; y: number; color: string; selected?: boolean; pulse?: boolean }) => (
  <g transform={`translate(${x} ${y})`}>
    {pulse && <circle r="16" fill={color} fillOpacity=".25"><animate attributeName="r" values="10;26" dur="1.8s" repeatCount="indefinite" /><animate attributeName="fill-opacity" values=".4;0" dur="1.8s" repeatCount="indefinite" /></circle>}
    {selected && <circle r="17" fill="none" stroke="#f05a22" strokeWidth="2.5" />}
    <circle r="9" fill={color} stroke="#fff" strokeWidth="2.5" />
  </g>
);

/* ------------------------------------------------------------------ tabs */
function LiveTab() {
  const [sel, setSel] = useState("v1");
  const [locked, setLocked] = useState<Record<string, boolean>>({});
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick((n) => n + 1), 1400); return () => clearInterval(t); }, []);
  const v = VEHICLES.find((x) => x.id === sel)!;
  const speed = v.status === "running" ? v.speed + ((tick * 5) % 9) - 4 : 0;
  const isLocked = !!locked[v.id];

  const toggleLock = () => {
    setLocked((l) => ({ ...l, [v.id]: !l[v.id] }));
    toast.success(`${v.name}: engine ${isLocked ? "unlocked" : "locked"} (demo command)`);
  };

  return (
    <div className="grid gap-3 lg:grid-cols-[230px_1fr]">
      <ul className="max-h-[360px] space-y-1 overflow-y-auto pr-1" aria-label="Vehicles">
        {VEHICLES.map((x) => (
          <li key={x.id}>
            <button onClick={() => setSel(x.id)} aria-pressed={sel === x.id}
              className={cn("flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors", sel === x.id ? "border-brand-500/60 bg-brand-500/10" : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]")}>
              <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", STATUS[x.status].dot)} />
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-white">{x.name}</span><span className="block truncate text-xs text-slate-400">{x.place}</span></span>
              <span className="text-xs tabular-nums text-slate-300">{x.status === "running" ? `${x.speed} km/h` : STATUS[x.status].label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="grid gap-3 md:grid-cols-[1fr_210px] lg:grid-cols-1 xl:grid-cols-[1fr_220px]">
        <div className="relative h-[260px] overflow-hidden rounded-md border border-white/10 sm:h-[340px]">
          <MapBase>
            {VEHICLES.map((x) => <g key={x.id} onClick={() => setSel(x.id)} className="cursor-pointer"><Marker x={x.x} y={x.y} color={STATUS[x.status].hex} selected={x.id === sel} pulse={x.status === "running"} /></g>)}
          </MapBase>
          <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur">Demo data · simulated positions</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-bold text-white">{v.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400"><MapPin className="h-3 w-3" />{v.place}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-white/5 p-2"><p className="flex items-center gap-1 text-slate-400"><Gauge className="h-3 w-3" />Speed</p><p className="mt-0.5 text-base font-bold tabular-nums text-white">{Math.max(speed, 0)}<span className="text-xs font-medium text-slate-400"> km/h</span></p></div>
            <div className="rounded-md bg-white/5 p-2"><p className="flex items-center gap-1 text-slate-400"><KeyRound className="h-3 w-3" />Ignition</p><p className={cn("mt-0.5 text-base font-bold", v.status === "running" || v.status === "idle" ? "text-green-400" : "text-slate-300")}>{v.status === "running" || v.status === "idle" ? "ON" : "OFF"}</p></div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-300"><User className="h-3 w-3 text-slate-400" />{v.driver}</p>
          <button onClick={toggleLock} disabled={v.status === "offline"}
            className={cn("mt-4 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40", isLocked ? "bg-green-600 text-white hover:bg-green-500" : "gloss-btn text-white")}>
            {isLocked ? <><LockOpen className="h-4 w-4" />Unlock engine</> : <><Lock className="h-4 w-4" />Lock engine</>}
          </button>
          {v.status === "offline" && <p className="mt-2 text-xs text-slate-500">Device offline — commands unavailable.</p>}
        </div>
      </div>
    </div>
  );
}

function PlaybackTab() {
  const pathRef = useRef<SVGPathElement>(null);
  const progRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [pt, setPt] = useState({ x: 40, y: 320 });

  const seek = useCallback((p: number) => {
    const c = Math.min(1, Math.max(0, p));
    progRef.current = c;
    setProgress(c);
    const el = pathRef.current;
    if (el) { const q = el.getPointAtLength(c * el.getTotalLength()); setPt({ x: q.x, y: q.y }); }
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      const n = progRef.current + 0.006 * rate;
      if (n >= 1) { seek(1); setPlaying(false); } else seek(n);
    }, 60);
    return () => clearInterval(t);
  }, [playing, rate, seek]);

  const speeds = useMemo(() => Array.from({ length: 60 }, (_, i) => Math.round(34 + 22 * Math.sin(i / 5) + 10 * Math.sin(i / 2.2))), []);
  const idx = Math.min(59, Math.floor(progress * 59));
  const chart = speeds.map((s, i) => `${(i / 59) * 300},${70 - (s / 80) * 62}`).join(" ");
  const maxSoFar = Math.max(...speeds.slice(0, idx + 1));
  const stops = Math.floor(progress * 3);

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
      <div>
        <div className="relative h-[260px] overflow-hidden rounded-md border border-white/10 sm:h-[340px]">
          <MapBase>
            <path ref={pathRef} d={ROUTE} fill="none" stroke="#3a414d" strokeWidth="6" strokeLinecap="round" />
            <path d={ROUTE} fill="none" stroke="#f05a22" strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - progress} />
            <Marker x={40} y={320} color="#22c55e" /><Marker x={570} y={60} color="#ef4444" />
            <g transform={`translate(${pt.x} ${pt.y})`}><circle r="14" fill="#f05a22" fillOpacity=".25" /><circle r="8" fill="#f05a22" stroke="#fff" strokeWidth="2.5" /></g>
          </MapBase>
          <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur">Delivery Van 01 · demo trip</span>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3">
          <button onClick={() => { if (progress >= 1) seek(0); setPlaying((p) => !p); }} aria-label={playing ? "Pause" : "Play"} className="gloss-btn grid h-10 w-10 shrink-0 place-items-center rounded-full text-white">
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <input type="range" min={0} max={1000} value={Math.round(progress * 1000)} onChange={(e) => { setPlaying(false); seek(Number(e.target.value) / 1000); }} aria-label="Trip position" className="h-1.5 flex-1 cursor-pointer accent-brand-600" />
          <div className="flex shrink-0 rounded-md border border-white/10 p-0.5 text-xs font-semibold">
            {[1, 2, 4].map((r) => <button key={r} onClick={() => setRate(r)} aria-pressed={rate === r} className={cn("rounded px-2 py-1", rate === r ? "bg-white/15 text-white" : "text-slate-400")}>{r}×</button>)}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
          {[["Distance", `${(progress * 18.6).toFixed(1)} km`], ["Duration", `${Math.round(progress * 42)} min`], ["Top speed", `${maxSoFar} km/h`]].map(([k, val]) => (
            <div key={k} className="rounded-md border border-white/10 bg-white/[0.03] p-3"><p className="text-xs text-slate-400">{k}</p><p className="text-lg font-bold tabular-nums text-white">{val}</p></div>
          ))}
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
          <p className="mb-1 flex justify-between text-xs text-slate-400"><span>Speed</span><span>{stops} stop{stops === 1 ? "" : "s"}</span></p>
          <svg viewBox="0 0 300 76" className="h-16 w-full" role="img" aria-label="Speed over the trip">
            <polyline points={chart} fill="none" stroke="#f05a22" strokeWidth="2" strokeLinejoin="round" />
            <line x1={(idx / 59) * 300} x2={(idx / 59) * 300} y1="0" y2="76" stroke="#fff" strokeOpacity=".5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function FenceTab() {
  const CX = 300, CY = 190;
  const [radius, setRadius] = useState(110);
  const [t, setT] = useState(0);
  const [moving, setMoving] = useState(false);
  const [log, setLog] = useState<{ id: number; text: string; out: boolean }[]>([{ id: 0, text: "Delivery Van 01 entered Gulshan zone", out: false }]);
  const lastOut = useRef(false);
  const pos = { x: CX + 40 + t * 210, y: CY - 20 - t * 100 };
  const dist = Math.hypot(pos.x - CX, pos.y - CY);
  const outside = dist > radius;

  useEffect(() => {
    if (outside !== lastOut.current) {
      lastOut.current = outside;
      const text = outside ? "Delivery Van 01 left Gulshan zone" : "Delivery Van 01 entered Gulshan zone";
      setLog((l) => [{ id: l.length + 1, text, out: outside }, ...l].slice(0, 5));
      if (outside) toast.warning("Geo-fence exit alert (demo)");
    }
  }, [outside]);

  useEffect(() => {
    if (!moving) return;
    const i = setInterval(() => setT((p) => { const n = p + 0.015; if (n >= 1) { setMoving(false); return 1; } return n; }), 40);
    return () => clearInterval(i);
  }, [moving]);

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_250px]">
      <div className="relative h-[260px] overflow-hidden rounded-md border border-white/10 sm:h-[340px]">
        <MapBase>
          <circle cx={CX} cy={CY} r={radius} fill={outside ? "#ef4444" : "#f05a22"} fillOpacity=".14" stroke={outside ? "#ef4444" : "#f05a22"} strokeWidth="2.5" strokeDasharray="8 6" />
          <Marker x={CX} y={CY} color="#38bdf8" />
          <Marker x={pos.x} y={pos.y} color={outside ? "#ef4444" : "#22c55e"} pulse />
        </MapBase>
        <span className={cn("absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur", outside ? "bg-red-600/80 text-white" : "bg-green-600/80 text-white")}>
          {outside ? "Outside zone" : <><Check className="h-3 w-3" />Inside zone</>}
        </span>
      </div>
      <div className="space-y-3">
        <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
          <label className="flex justify-between text-xs text-slate-400"><span>Zone radius</span><span className="tabular-nums text-white">{Math.round(radius * 9)} m</span></label>
          <input type="range" min={50} max={170} value={radius} onChange={(e) => setRadius(Number(e.target.value))} aria-label="Zone radius" className="mt-2 w-full cursor-pointer accent-brand-600" />
          <div className="mt-3 flex gap-2">
            <button onClick={() => { if (t >= 1) setT(0); setMoving(true); }} disabled={moving} className="gloss-btn flex-1 rounded-md px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Drive out</button>
            <button onClick={() => { setMoving(false); setT(0); }} className="rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5">Reset</button>
          </div>
        </div>
        <ul className="space-y-1.5" aria-live="polite">
          {log.map((l) => (
            <li key={l.id} className="flex items-start gap-2 rounded-md border border-white/10 bg-white/[0.03] p-2.5 text-xs text-slate-200"><span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", l.out ? "bg-red-500" : "bg-green-500")} />{l.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AlertsTab() {
  const [filter, setFilter] = useState<"all" | Sev>("all");
  const [done, setDone] = useState<string[]>([]);
  const list = ALERTS.filter((a) => filter === "all" || a.sev === filter);
  const open = ALERTS.filter((a) => !done.includes(a.id)).length;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(["all", "critical", "warning", "info"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={cn("rounded-full border px-3 py-1 text-xs font-semibold capitalize", filter === f ? "border-brand-500 bg-brand-500/15 text-white" : "border-white/10 text-slate-300 hover:bg-white/5")}>{f}</button>
        ))}
        <span className="ml-auto text-xs text-slate-400">{open} open</span>
      </div>
      <ul className="grid gap-2 md:grid-cols-2">
        {list.map((a) => {
          const resolved = done.includes(a.id);
          return (
            <li key={a.id} className={cn("flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3 transition-opacity", resolved && "opacity-45")}>
              <span className={cn("h-9 w-1.5 shrink-0 rounded-full", SEV[a.sev])} />
              <span className="min-w-0 flex-1"><span className={cn("block truncate text-sm font-semibold text-white", resolved && "line-through")}>{a.title}</span><span className="block truncate text-xs text-slate-400">{a.who} · {a.when}</span></span>
              <button onClick={() => setDone((d) => (resolved ? d.filter((x) => x !== a.id) : [...d, a.id]))} aria-label={resolved ? "Reopen alert" : "Resolve alert"} className={cn("grid h-8 w-8 place-items-center rounded-full border", resolved ? "border-green-500 bg-green-500/20 text-green-400" : "border-white/15 text-slate-400 hover:text-white")}><Check className="h-4 w-4" /></button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ReportsTab() {
  const [range, setRange] = useState<7 | 30>(7);
  const [hover, setHover] = useState<number | null>(null);
  const data = useMemo(() => Array.from({ length: range }, (_, i) => Math.round(520 + 190 * Math.sin(i * 0.9) + 90 * Math.cos(i * 0.4) + (i % 3) * 30)), [range]);
  const max = Math.max(...data);
  const total = data.reduce((a, b) => a + b, 0);
  const shown = hover !== null ? data[hover] : Math.round(total / data.length);
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
      <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div><p className="text-xs text-slate-400">{hover !== null ? `Day ${hover + 1}` : "Daily average"}</p><p className="text-2xl font-bold tabular-nums text-white">{shown} <span className="text-sm font-medium text-slate-400">km</span></p></div>
          <div className="flex rounded-md border border-white/10 p-0.5 text-xs font-semibold">
            {([7, 30] as const).map((r) => <button key={r} onClick={() => { setRange(r); setHover(null); }} aria-pressed={range === r} className={cn("rounded px-2.5 py-1", range === r ? "bg-white/15 text-white" : "text-slate-400")}>{r} days</button>)}
          </div>
        </div>
        <div className="flex h-44 items-end gap-1" onMouseLeave={() => setHover(null)}>
          {data.map((d, i) => (
            <button key={i} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} aria-label={`Day ${i + 1}: ${d} km`} className="group flex h-full flex-1 items-end">
              <motion.span initial={{ height: 0 }} animate={{ height: `${(d / max) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.012 }} className={cn("block w-full rounded-t-sm transition-colors", hover === i ? "bg-brand-400" : "bg-brand-600/80")} />
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
        {[["Total distance", `${total.toLocaleString("en-US")} km`], ["Running time", `${Math.round(total / 38)} h`], ["Parked time", `${Math.round(total / 22)} h`]].map(([k, v]) => (
          <div key={k} className="rounded-md border border-white/10 bg-white/[0.03] p-3"><p className="text-xs text-slate-400">{k}</p><p className="text-lg font-bold tabular-nums text-white">{v}</p></div>
        ))}
      </div>
    </div>
  );
}

const PANELS: Record<string, React.ReactNode> = {
  live: <LiveTab />, playback: <PlaybackTab />, fence: <FenceTab />, alerts: <AlertsTab />, reports: <ReportsTab />,
};

/* --------------------------------------------------------------- section */
export default function SoftwarePreview() {
  const [tab, setTab] = useState("live");
  const current = TABS.find((t) => t.id === tab)!;

  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-20">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl" aria-hidden />
      <Container className="relative">
        <SectionHeading light eyebrow="Tracking software preview" title="Try the fleet console" description="An interactive demo with simulated data — lock an engine, replay a trip, drag a geo-fence, clear alerts." />

        <div className="mx-auto max-w-6xl overflow-hidden rounded-md border border-white/10 bg-[#0f1217]">
          {/* top bar */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <span className="text-sm font-bold">Fleet console</span>
            <span className="truncate text-xs text-slate-500">/ {current.label}</span>
            <span className="ml-auto text-xs text-slate-500">Demo data</span>
            <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />Live
            </span>
          </div>

          <div className="md:grid md:grid-cols-[180px_1fr]">
            {/* tabs */}
            <nav role="tablist" aria-label="Software preview"
              className="flex gap-1 overflow-x-auto border-b border-white/10 p-2 [scrollbar-width:none] md:flex-col md:overflow-visible md:border-b-0 md:border-r [&::-webkit-scrollbar]:hidden">
              {TABS.map((t) => {
                const on = tab === t.id;
                return (
                  <button key={t.id} role="tab" aria-selected={on} onClick={() => setTab(t.id)}
                    className={cn("flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                      on ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white")}>
                    <t.icon className="h-4 w-4" />{t.label}
                  </button>
                );
              })}
            </nav>

            {/* panel */}
            <div className="min-w-0 p-3 sm:p-4" role="tabpanel" aria-label={current.label}>
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                  {PANELS[tab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
