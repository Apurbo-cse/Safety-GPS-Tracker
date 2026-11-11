"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Gauge, MapPin, Route } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import { DynIcon } from "@/lib/icons";
import { solutions } from "@/data/solutions";
import { cn } from "@/utils/format";

const IDS = ["logistics", "construction", "public-transport", "motorcycles"];
const DURATION = 6000;

type Tone = "start" | "info" | "warn" | "ok";
interface Live {
  unit: string; place: string; metric: [string, string]; status: string; tone: string;
  moving: boolean;
  /** Where the marker rests when the vehicle is not moving */
  at?: [number, number];
  /** Route drawn over the photo (viewBox 0 0 160 100) */
  route: string;
  /** Demo trip events, oldest first; the last one is "now" */
  trip: [string, string, Tone][];
}

/** Demo live readout + trip for each use case */
const LIVE: Record<string, Live> = {
  logistics: {
    unit: "Cargo Truck 07", place: "Dhaka–Chattogram Hwy", metric: ["Speed", "58 km/h"], status: "On route", tone: "bg-green-500", moving: true,
    route: "M12 58 C 40 50, 52 30, 80 32 S 120 44, 148 18",
    trip: [["08:10", "Left Tejgaon depot", "start"], ["10:42", "Speed alert · 64 km/h", "warn"], ["12:05", "Passed Cumilla checkpoint", "info"], ["Now", "On route to Chattogram", "ok"]],
  },
  construction: {
    unit: "Excavator 02", place: "Purbachal site", metric: ["Engine hours", "6.4 h"], status: "On site", tone: "bg-amber-500", moving: true,
    route: "M60 50 C 70 30, 100 28, 110 42 S 90 62, 70 52 S 58 36, 60 50",
    trip: [["07:30", "Engine on at site", "start"], ["09:15", "Left geo-fence · alert sent", "warn"], ["09:22", "Back inside site zone", "info"], ["Now", "Working · 6.4 engine hours", "ok"]],
  },
  "public-transport": {
    unit: "Staff Bus 03", place: "Mirpur 10", metric: ["Speed", "46 km/h"], status: "Stop 5 of 12", tone: "bg-green-500", moving: true,
    route: "M10 20 C 40 22, 50 40, 76 40 S 110 30, 150 52",
    trip: [["07:00", "Departed Uttara", "start"], ["07:35", "Stop 3 · Banani", "info"], ["07:52", "Stop 4 · Mohakhali", "info"], ["Now", "Approaching Mirpur 10", "ok"]],
  },
  motorcycles: {
    unit: "Bike 12", place: "Dhanmondi 27", metric: ["Speed", "0 km/h"], status: "Engine locked", tone: "bg-amber-500", moving: false, at: [90, 34],
    route: "M30 56 C 50 40, 70 44, 90 34",
    trip: [["18:20", "Parked at home", "start"], ["21:05", "Ignition ON · alert sent", "warn"], ["21:06", "Engine locked from app", "info"], ["Now", "Secured inside geo-fence", "ok"]],
  },
};

const TONE: Record<Tone, string> = { start: "bg-slate-400", info: "bg-sky-500", warn: "bg-amber-500", ok: "bg-green-500" };

export default function UseCases() {
  const list = IDS.map((id) => solutions.find((s) => s.id === id)!).filter(Boolean);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % list.length), DURATION);
    return () => clearTimeout(t);
  }, [active, paused, list.length]);

  const s = list[active];
  const live = LIVE[s.id];

  return (
    <section className="bg-sec-white relative overflow-hidden py-14 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <Container className="relative">
        <SectionHeading eyebrow="Use cases" title="See how tracking works on the road" description="What each kind of fleet gets, and why it matters." />

        <Reveal>
          <div
            className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* ---------- Tabs ---------- */}
            <div
              role="tablist"
              aria-label="Use cases"
              className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:col-span-4 lg:flex lg:flex-col [&::-webkit-scrollbar]:hidden"
            >
              {list.map((u, i) => {
                const on = i === active;
                return (
                  <button
                    key={u.id}
                    role="tab"
                    aria-selected={on}
                    aria-controls="usecase-panel"
                    onClick={() => setActive(i)}
                    className={cn(
                      "group relative flex w-[78%] shrink-0 items-center gap-3 overflow-hidden rounded-md border p-3 text-left transition-all duration-300 sm:w-auto lg:p-4",
                      on ? "border-brand-500 bg-gradient-to-r from-brand-50 to-surface shadow-lg shadow-brand-600/10" : "glass border-line hover:border-brand-300",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-11 w-11 shrink-0 place-items-center rounded-md transition-colors",
                        on ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/30" : "bg-softer text-body group-hover:text-brand-text",
                      )}
                    >
                      <DynIcon name={u.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink">{u.title}</span>
                      <span className="block truncate text-xs text-slate-500">{LIVE[u.id]?.unit} · {LIVE[u.id]?.status}</span>
                    </span>
                    <span className="text-xs font-bold tabular-nums text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                    {/* progress */}
                    <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-line-soft">
                      {on && (
                        <motion.span
                          key={`${active}-${paused}`}
                          className="block h-full bg-gradient-to-r from-brand-600 to-brand-400"
                          initial={{ width: "0%" }}
                          animate={{ width: paused ? "0%" : "100%" }}
                          transition={{ duration: paused ? 0 : DURATION / 1000, ease: "linear" }}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ---------- Panel ---------- */}
            <div id="usecase-panel" role="tabpanel" className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.article
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="glass grid h-full overflow-hidden rounded-md border border-line md:grid-cols-2"
                >
                  {/* image + live HUD */}
                  <div className="relative aspect-[16/10] bg-white md:aspect-auto md:min-h-[360px]">
                    <motion.div className="absolute inset-0" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}>
                      <Image quality={90} src={s.image} alt={s.title} fill sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className={s.contain ? "object-contain p-4" : "object-cover"} />
                    </motion.div>
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/20" />
                    {live && (
                      <svg aria-hidden viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
                        <defs><filter id={`uc-glow-${s.id}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2" /></filter></defs>
                        <path d={live.route} fill="none" stroke="#f05a22" strokeOpacity=".45" strokeWidth="3" strokeLinecap="round" filter={`url(#uc-glow-${s.id})`} />
                        <motion.path
                          d={live.route} fill="none" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" strokeDasharray="2.5 2.5"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: "easeInOut" }}
                        />
                        <g transform={!live.moving && live.at ? `translate(${live.at[0]} ${live.at[1]})` : undefined}>
                          <circle r="4.5" fill="#f05a22" fillOpacity=".3"><animate attributeName="r" values="3;6;3" dur="1.6s" repeatCount="indefinite" /></circle>
                          <circle r="2.2" fill="#f05a22" stroke="#fff" strokeWidth=".8" />
                          {live.moving ? <animateMotion dur="7s" repeatCount="indefinite" path={live.route} /> : null}
                        </g>
                      </svg>
                    )}

                    <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" />
                        <span className="relative h-2 w-2 rounded-full bg-green-400" />
                      </span>
                      Live
                    </span>

                    {live && (
                      <div className="absolute inset-x-3 bottom-3 rounded-md border border-white/15 bg-navy-950/85 p-3 text-white backdrop-blur-md">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-bold">{live.unit}</p>
                          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold">
                            <span className={cn("h-1.5 w-1.5 rounded-full", live.tone)} />{live.status}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-slate-300">
                          <span className="flex min-w-0 items-center gap-1 truncate"><MapPin className="h-3 w-3 shrink-0 text-brand-400" />{live.place}</span>
                          <span className="flex shrink-0 items-center gap-1"><Gauge className="h-3 w-3 text-brand-400" />{live.metric[0]}: <b className="text-white">{live.metric[1]}</b></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* copy */}
                  <div className="flex flex-col justify-center p-4 sm:p-6">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-text">
                      <DynIcon name={s.icon} className="h-3.5 w-3.5" />Use case {active + 1} of {list.length}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-ink sm:text-xl">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-body">{s.description}</p>
                    <ul className="mt-4 space-y-2 text-sm text-body-strong">
                      {s.benefits.map((b, k) => (
                        <motion.li
                          key={b}
                          className="flex gap-2"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + k * 0.06 }}
                        >
                          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-600 text-white"><Check className="h-2.5 w-2.5" /></span>
                          {b}
                        </motion.li>
                      ))}
                    </ul>
                    {live && (
                      <div className="mt-4 rounded-md border border-line bg-surface p-3">
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ink"><Route className="h-3.5 w-3.5 text-brand-text" />Today&apos;s trip <span className="font-normal text-slate-400">· demo</span></p>
                        <ol className="relative space-y-2 pl-4">
                          <span aria-hidden className="absolute bottom-1.5 left-[4px] top-1.5 w-px bg-line-strong" />
                          {live.trip.map(([time, label, tone], k) => {
                            const now = k === live.trip.length - 1;
                            return (
                              <motion.li
                                key={label}
                                className="relative flex items-baseline gap-2 text-xs"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + k * 0.12 }}
                              >
                                <span className={cn("absolute -left-4 top-1 h-2.5 w-2.5 rounded-full ring-2 ring-surface", TONE[tone])}>
                                  {now && <span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" />}
                                </span>
                                <span className={cn("w-10 shrink-0 font-mono tabular-nums", now ? "font-bold text-green-600 dark:text-green-400" : "text-slate-500")}>{time}</span>
                                <span className={cn(now ? "font-semibold text-ink" : "text-body")}>{label}</span>
                              </motion.li>
                            );
                          })}
                        </ol>
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.features.map((f) => <span key={f} className="rounded-full bg-softer px-2 py-0.5 text-[11px] font-medium text-body-strong">{f}</span>)}
                    </div>
                    <Link href={`/solutions#${s.id}`} className="group mt-5 inline-flex items-center gap-1 self-start text-sm font-semibold text-brand-text">
                      Explore this solution <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
