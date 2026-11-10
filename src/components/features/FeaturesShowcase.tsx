"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Fence, FileBarChart, Lock, LockOpen, MapPin, Radio, type LucideIcon } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { useAppDispatch } from "@/store/hooks";
import { openFeatureModal } from "@/store/slices/uiSlice";
import { cn } from "@/utils/format";

const ROUTE = "M30 250C100 230 120 150 200 140S330 190 400 120S500 70 560 40";

/* ---- demo 1: live tracking */
function LiveDemo() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick((n) => n + 1), 1100); return () => clearInterval(t); }, []);
  return (
    <div className="relative h-full min-h-[240px] sm:min-h-[300px]">
      <svg viewBox="0 0 600 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-label="Vehicle moving along a route" role="img">
        <rect width="600" height="300" fill="#171a21" />
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={i * 120} y1="0" x2={i * 120} y2="300" stroke="#fff" strokeOpacity=".05" />)}
        {[0, 1, 2, 3].map((i) => <line key={i} x1="0" y1={i * 100} x2="600" y2={i * 100} stroke="#fff" strokeOpacity=".05" />)}
        <path d="M-10 90C150 120 300 60 620 140" fill="none" stroke="#2b313c" strokeWidth="14" strokeLinecap="round" />
        <path d={ROUTE} fill="none" stroke="#2b313c" strokeWidth="18" strokeLinecap="round" />
        <path d={ROUTE} fill="none" stroke="#f05a22" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10" className="route-flow" />
        <g>
          <animateMotion dur="12s" repeatCount="indefinite" rotate="auto" path={ROUTE} />
          <circle r="22" fill="#f05a22" fillOpacity=".25"><animate attributeName="r" values="12;32" dur="1.6s" repeatCount="indefinite" /><animate attributeName="fill-opacity" values=".4;0" dur="1.6s" repeatCount="indefinite" /></circle>
          <rect x="-14" y="-8" width="28" height="16" rx="5" fill="#f05a22" stroke="#fff" strokeWidth="1.6" /><rect x="-2" y="-6" width="9" height="12" rx="2" fill="#12141a" />
        </g>
      </svg>
      <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 p-3 text-slate-900  ">
        <p className="flex items-center gap-1.5 text-xs font-bold"><MapPin className="h-3.5 w-3.5 text-brand-600" />Delivery Van 01</p>
        <p className="mt-1 text-xs text-slate-600"><b className="tabular-nums">{38 + ((tick * 7) % 19)}</b> km/h · updated {tick % 10 || 10} sec ago</p>
      </div>
    </div>
  );
}

/* ---- demo 2: remote engine lock */
function LockDemo() {
  const [locked, setLocked] = useState(false);
  const [log, setLog] = useState<string[]>(["Ignition ON — Sedan, Farmgate"]);
  const toggle = () => {
    setLocked((l) => !l);
    const msg = locked ? "Engine unlocked by owner" : "Engine locked remotely";
    setLog((l) => [msg, ...l].slice(0, 4));
    toast.success(`${msg} (demo)`);
  };
  return (
    <div className="grid h-full min-h-[240px] sm:min-h-[300px] place-items-center p-6">
      <div className="w-full max-w-xs text-center">
        <div className="relative mx-auto grid h-28 w-28 place-items-center">
          {locked && <span className="ring-pulse absolute inset-0 rounded-full border-2 border-green-400/70" />}
          <button onClick={toggle} aria-pressed={locked} aria-label={locked ? "Unlock engine" : "Lock engine"} className={cn("relative grid h-24 w-24 place-items-center rounded-full text-white   transition-colors active:scale-95", locked ? "bg-green-600" : "gloss-btn")}>
            {locked ? <Lock className="h-9 w-9" /> : <LockOpen className="h-9 w-9" />}
          </button>
        </div>
        <p className="mt-3 text-base font-bold text-white">{locked ? "Engine locked" : "Engine running"}</p>
        <p className="text-xs text-slate-400">Tap the button to send the command</p>
        <ul className="mt-4 space-y-1.5 text-left" aria-live="polite">{log.map((l, i) => <li key={l + i} className={cn("rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-200", i === 0 && "slide-in")}>{l}</li>)}</ul>
      </div>
    </div>
  );
}

/* ---- demo 3: geo-fence */
function FenceDemo() {
  const [out, setOut] = useState(false);
  useEffect(() => { const t = setInterval(() => setOut((o) => !o), 3200); return () => clearInterval(t); }, []);
  return (
    <div className="relative h-full min-h-[240px] sm:min-h-[300px]">
      <svg viewBox="0 0 600 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-label="Vehicle crossing a geo-fence" role="img">
        <rect width="600" height="300" fill="#171a21" />
        <path d="M-10 190C150 170 300 230 620 180" fill="none" stroke="#2b313c" strokeWidth="14" strokeLinecap="round" />
        <circle cx="300" cy="150" r="95" fill={out ? "#ef4444" : "#f05a22"} fillOpacity=".14" stroke={out ? "#ef4444" : "#f05a22"} strokeWidth="2.5" strokeDasharray="8 6" style={{ transition: "all .4s" }} />
        <circle cx="300" cy="150" r="7" fill="#38bdf8" stroke="#fff" strokeWidth="2" />
        <motion.circle r="10" stroke="#fff" strokeWidth="2.5" animate={{ cx: out ? 470 : 330, cy: out ? 80 : 170, fill: out ? "#ef4444" : "#22c55e" }} transition={{ duration: 1.4, ease: "easeInOut" }} />
      </svg>
      <AnimatePresence mode="wait">
        <motion.p key={String(out)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn("absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white", out ? "bg-red-600/90" : "bg-green-600/90")}>
          {out ? "Alert: vehicle left the zone" : "Vehicle inside the zone"}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ---- demo 4: reports */
const BARS = [62, 78, 70, 92, 54, 48, 66];
function ReportDemo() {
  const [hov, setHov] = useState<number | null>(null);
  return (
    <div className="flex h-full min-h-[240px] sm:min-h-[300px] flex-col p-6">
      <p className="text-xs text-slate-400">Daily mileage</p>
      <p className="text-2xl font-bold tabular-nums text-white">{hov === null ? "Last 7 days" : `${BARS[hov] * 9} km`}</p>
      <div className="mt-6 flex min-h-44 flex-1 items-end gap-2 sm:gap-3" onMouseLeave={() => setHov(null)}>
        {BARS.map((b, i) => (
          <button key={i} onMouseEnter={() => setHov(i)} onFocus={() => setHov(i)} aria-label={`${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}: ${b * 9} km`} className="flex h-full flex-1 flex-col justify-end gap-1.5">
            <motion.span initial={{ height: 0 }} whileInView={{ height: `${b}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.06 }} className={cn("block w-full rounded-t-md transition-colors", hov === i ? "bg-brand-400" : "bg-brand-600/80")} />
            <span className="text-center text-xs text-slate-400">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const DEMOS: { id: string; label: string; icon: LucideIcon; title: string; text: string; points: string[]; feature: string; view: () => React.ReactNode }[] = [
  { id: "live", label: "Live tracking", icon: Radio, title: "See every vehicle move", text: "Watch your vehicles on one map with speed, ignition and last-update time. Positions refresh about every 10 seconds.", points: ["10-second location updates", "Speed and ignition status", "Android, iOS and web"], feature: "real-time-gps-tracking", view: () => <LiveDemo /> },
  { id: "lock", label: "Engine lock", icon: Lock, title: "Stop a stolen vehicle remotely", text: "Cut engine power from your phone and restore it when the situation is resolved.", points: ["Remote lock & unlock", "Ignition on/off alerts", "Panic button alerts"], feature: "remote-engine-lock", view: () => <LockDemo /> },
  { id: "fence", label: "Geo-fence", icon: Fence, title: "Know when a vehicle leaves a zone", text: "Draw a zone around a depot, site or customer and get an alert the moment a vehicle crosses it.", points: ["Entry and exit alerts", "Speed violation alerts", "Destination alerts"], feature: "geo-fencing-alerts", view: () => <FenceDemo /> },
  { id: "reports", label: "Reports", icon: FileBarChart, title: "Turn trips into clear reports", text: "Daily mileage, travel history, parking and working hours — ready whenever you need them.", points: ["Daily mileage reports", "Route history playback", "Working hour reports"], feature: "daily-mileage-reports", view: () => <ReportDemo /> },
];

export default function FeaturesShowcase() {
  const dispatch = useAppDispatch();
  const [id, setId] = useState("live");
  const d = DEMOS.find((x) => x.id === id)!;
  return (
    <section id="showcase" className="scroll-mt-32 py-9 sm:py-12">
      <Container>
        <SectionHeading eyebrow="See it in action" title="Four features you'll use every day" description="Interactive demos with simulated data." />
        <div className="grid items-stretch gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="min-w-0">
            <div role="tablist" aria-label="Feature demos" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:overflow-visible">
              {DEMOS.map((x) => (
                <button key={x.id} role="tab" aria-selected={id === x.id} onClick={() => setId(x.id)} className={cn("flex shrink-0 items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-all lg:w-full", id === x.id ? "border-brand-500 bg-brand-50 text-ink" : "border-line-strong bg-surface text-body hover:border-brand-400")}>
                  <span className={cn("grid h-8 w-8 place-items-center rounded-lg", id === x.id ? "bg-brand-600 text-white" : "bg-softer text-brand-text")}><x.icon className="h-4.5 w-4.5" /></span>{x.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={d.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="mt-4">
                <h3 className="text-lg font-bold text-ink">{d.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{d.text}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-body-strong">{d.points.map((p) => <li key={p} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />{p}</li>)}</ul>
                <button onClick={() => dispatch(openFeatureModal(d.feature))} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text hover:underline">Feature details <ArrowRight className="h-4 w-4" /></button>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#0f1217]  ">
            <span className="absolute right-3 top-3 z-10 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur">Demo · simulated data</span>
            <AnimatePresence mode="wait"><motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">{d.view()}</motion.div></AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
