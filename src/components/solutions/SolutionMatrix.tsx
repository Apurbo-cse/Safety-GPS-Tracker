"use client";
import { useState } from "react";
import { Check, Columns3, GitCompare, LayoutGrid, Minus, ShieldCheck, Sparkles } from "lucide-react";
import Container from "@/components/common/Container";
import { DynIcon } from "@/lib/icons";
import { solutions } from "@/data/solutions";
import { cn } from "@/utils/format";

interface FeatureDetail {
  name: string;
  desc: string;
}

const FEATURE_CATEGORIES: {
  category: string;
  icon: typeof ShieldCheck;
  items: FeatureDetail[];
}[] = [
  {
    category: "Anti-Theft & Security",
    icon: ShieldCheck,
    items: [
      { name: "Live Tracking", desc: "10-second real-time GPS position updates" },
      { name: "Engine Lock & Unlock", desc: "Shut down engine remotely via mobile app" },
      { name: "Geo Fencing", desc: "Alerts when vehicle crosses designated boundaries" },
      { name: "Panic Button", desc: "Instant SOS emergency alert notification" },
      { name: "Device Removal Alert", desc: "Warning if tracker power or wire is disconnected" },
    ],
  },
  {
    category: "Route & Trip Intelligence",
    icon: Sparkles,
    items: [
      { name: "Route History Playback", desc: "Full route visual replay of any previous trip" },
      { name: "Travel History", desc: "Archived location logs and stop duration history" },
      { name: "Destination Alert", desc: "Notification upon reaching delivery or destination zone" },
      { name: "Multiple vehicle monitoring", desc: "Track all vehicles simultaneously on one screen" },
      { name: "Live Traffic Update", desc: "Traffic density overlay for optimal routing" },
    ],
  },
  {
    category: "Fleet Operations & Compliance",
    icon: LayoutGrid,
    items: [
      { name: "Daily Mileage Report", desc: "Automated daily distance and running log" },
      { name: "Working Hours", desc: "Engine runtime and equipment operating hours tracking" },
      { name: "Engine On & Off Alert", desc: "Instant notification when ignition starts or stops" },
      { name: "Speed Violation Alert", desc: "Warning when driver exceeds pre-set speed limit" },
      { name: "Add Driver Details", desc: "Assign driver profile, license and phone number" },
      { name: "BRTA Papers Update Alert", desc: "Advance reminder before fitness or tax token expires" },
      { name: "Insurance Expire Alert", desc: "Automated notice before vehicle insurance lapse" },
    ],
  },
];

const ALL_FEATURES = FEATURE_CATEGORIES.flatMap((c) => c.items);

/** Advanced, unbreakable feature matrix with edge-to-edge full width mobile view. */
export default function SolutionMatrix() {
  const [view, setView] = useState<"vehicle" | "compare" | "table">("vehicle");
  const [selectedVehicle, setSelectedVehicle] = useState(solutions[0].id);
  const [compareA, setCompareA] = useState(solutions[0].id);
  const [compareB, setCompareB] = useState(solutions[1].id);

  const activeSolution = solutions.find((s) => s.id === selectedVehicle) || solutions[0];
  const solA = solutions.find((s) => s.id === compareA) || solutions[0];
  const solB = solutions.find((s) => s.id === compareB) || solutions[1];

  return (
    <section className="py-5 sm:py-12 overflow-x-clip">
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between mb-3.5 sm:mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-2.5 py-0.5 text-[11px] font-bold text-brand-600 dark:text-brand-400">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Telematics Compatibility Matrix
            </span>
            <h2 className="mt-1 text-lg sm:text-2xl font-black tracking-tight text-ink">
              Feature Availability by Vehicle Type
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-body">
              Explore standard telematics capabilities supported for each vehicle category.
            </p>
          </div>

          {/* View Mode Selector Tabs */}
          <div className="flex items-center gap-1 rounded-md bg-softer/90 dark:bg-navy-900/90 p-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setView("vehicle")}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all",
                view === "vehicle"
                  ? "bg-brand-500 text-white"
                  : "text-body hover:text-ink"
              )}
            >
              <DynIcon name={activeSolution.icon} className="h-3.5 w-3.5" />
              <span>By Vehicle</span>
            </button>
            <button
              type="button"
              onClick={() => setView("compare")}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all",
                view === "compare"
                  ? "bg-brand-500 text-white"
                  : "text-body hover:text-ink"
              )}
            >
              <GitCompare className="h-3.5 w-3.5" />
              <span>Compare 2</span>
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all",
                view === "table"
                  ? "bg-brand-500 text-white"
                  : "text-body hover:text-ink"
              )}
            >
              <Columns3 className="h-3.5 w-3.5" />
              <span>Full Grid</span>
            </button>
          </div>
        </div>

        {/* ======================================================== VIEW 1: BY VEHICLE (EDGE-TO-EDGE ON MOBILE) */}
        {view === "vehicle" && (
          <div className="space-y-2.5 sm:space-y-4">
            {/* Vehicle Selector Chips (Edge-to-edge scroll on mobile) */}
            <div className="-mx-3 px-3 sm:mx-0 sm:px-0 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
              {solutions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedVehicle(s.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold transition-all",
                    selectedVehicle === s.id
                      ? "bg-brand-500 text-white"
                      : "bg-softer/80 dark:bg-navy-900/80 text-body hover:text-ink hover:bg-softer"
                  )}
                >
                  <DynIcon name={s.icon} className="h-3.5 w-3.5" />
                  <span>{s.title}</span>
                </button>
              ))}
            </div>

            {/* Categorized Features Breakdown (Edge-to-edge full width on mobile) */}
            <div className="-mx-3 sm:mx-0 rounded-none sm:rounded-md bg-softer/80 dark:bg-navy-900/90 p-3 sm:p-6">
              {/* Active Category Subtitle */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-line/30">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-md bg-brand-500 text-white">
                    <DynIcon name={activeSolution.icon} className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-base font-black text-ink">{activeSolution.title}</h3>
                    <p className="text-[10px] sm:text-xs text-body">{activeSolution.features.length} core features active</p>
                  </div>
                </div>
                <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-brand-600 dark:text-brand-400">
                  Active
                </span>
              </div>

              {/* 3 Structured Categories (Edge-to-edge on mobile, 3-col grid on desktop) */}
              <div className="mt-3 grid gap-2 sm:gap-4 lg:grid-cols-3">
                {FEATURE_CATEGORIES.map((cat) => (
                  <div
                    key={cat.category}
                    className="rounded-md bg-surface/90 dark:bg-navy-950/70 p-3 sm:p-4"
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-line/20">
                      <cat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-600 dark:text-brand-400" />
                      <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-ink">
                        {cat.category}
                      </h4>
                    </div>

                    <ul className="mt-2 space-y-1.5 sm:space-y-2">
                      {cat.items.map((item) => {
                        const isSupported = activeSolution.features.includes(item.name);
                        return (
                          <li
                            key={item.name}
                            className="flex items-center justify-between gap-2 py-0.5"
                          >
                            <div className="min-w-0 flex-1">
                              <p className={cn(
                                "text-xs font-semibold leading-tight",
                                isSupported ? "text-ink" : "text-slate-400"
                              )}>
                                {item.name}
                              </p>
                              <p className="text-[10px] text-body line-clamp-1 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                            {isSupported ? (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                <Check className="h-2.5 w-2.5 stroke-[3]" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex shrink-0 items-center text-[10px] text-slate-400 px-1">
                                <Minus className="h-3 w-3" />
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== VIEW 2: COMPARE 2 VEHICLES (EDGE-TO-EDGE ON MOBILE) */}
        {view === "compare" && (
          <div className="space-y-2.5 sm:space-y-4">
            {/* Selectors */}
            <div className="-mx-3 px-3 sm:mx-0 sm:px-0 grid grid-cols-2 gap-2 sm:gap-4">
              <div className="rounded-md bg-softer/80 dark:bg-navy-900/90 p-2 sm:p-3.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Vehicle 1
                </label>
                <select
                  value={compareA}
                  onChange={(e) => setCompareA(e.target.value)}
                  aria-label="Select Vehicle 1"
                  className="w-full cursor-pointer appearance-none rounded-md bg-surface dark:bg-navy-950 px-2.5 py-1.5 text-xs font-bold text-ink focus:outline-none"
                >
                  {solutions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-md bg-softer/80 dark:bg-navy-900/90 p-2 sm:p-3.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Vehicle 2
                </label>
                <select
                  value={compareB}
                  onChange={(e) => setCompareB(e.target.value)}
                  aria-label="Select Vehicle 2"
                  className="w-full cursor-pointer appearance-none rounded-md bg-surface dark:bg-navy-950 px-2.5 py-1.5 text-xs font-bold text-ink focus:outline-none"
                >
                  {solutions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Table (Edge-to-edge on mobile) */}
            <div className="-mx-3 sm:mx-0 rounded-none sm:rounded-md bg-softer/80 dark:bg-navy-900/90 p-3 sm:p-6">
              <div className="flex items-center justify-between pb-2 border-b border-line/30 text-xs font-bold">
                <div className="w-1/2 text-slate-400 uppercase tracking-wider text-[10px]">
                  Feature
                </div>
                <div className="w-1/4 text-center text-brand-600 dark:text-brand-400 truncate px-1 text-xs">
                  {solA.title}
                </div>
                <div className="w-1/4 text-center text-sky-600 dark:text-sky-400 truncate px-1 text-xs">
                  {solB.title}
                </div>
              </div>

              <div className="mt-2 space-y-2.5">
                {FEATURE_CATEGORIES.map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                      {cat.category}
                    </p>
                    <div className="divide-y divide-line/20 rounded-md bg-surface/90 dark:bg-navy-950/70 overflow-hidden">
                      {cat.items.map((item) => {
                        const inA = solA.features.includes(item.name);
                        const inB = solB.features.includes(item.name);
                        return (
                          <div
                            key={item.name}
                            className="flex items-center justify-between px-2.5 py-1.5 sm:py-2 text-xs"
                          >
                            <div className="w-1/2 min-w-0 pr-2">
                              <p className="font-semibold text-ink truncate text-xs">{item.name}</p>
                            </div>
                            <div className="w-1/4 text-center">
                              {inA ? (
                                <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center text-slate-300 dark:text-slate-600">
                                  <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                </span>
                              )}
                            </div>
                            <div className="w-1/4 text-center">
                              {inB ? (
                                <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center text-slate-300 dark:text-slate-600">
                                  <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== VIEW 3: FULL GRID */}
        {view === "table" && (
          <div className="-mx-3 sm:mx-0 rounded-none sm:rounded-md overflow-x-auto bg-softer/80 dark:bg-navy-900/90 [scrollbar-width:thin]">
            <table className="w-full min-w-[760px] text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-softer/95 dark:bg-navy-950/90 border-b border-line/30">
                  <th
                    scope="col"
                    className="sticky left-0 z-20 w-48 sm:w-56 bg-softer dark:bg-navy-950 p-3 sm:p-4 font-bold text-ink"
                  >
                    Feature
                  </th>
                  {solutions.map((s) => (
                    <th
                      key={s.id}
                      scope="col"
                      className="w-24 sm:w-28 p-2.5 sm:p-3 text-center text-xs font-bold text-ink"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="grid h-7 w-7 place-items-center rounded-md bg-surface dark:bg-navy-900 text-brand-600 dark:text-brand-400">
                          <DynIcon name={s.icon} className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-[11px] leading-tight text-center">{s.title}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line/20">
                {ALL_FEATURES.map((f) => (
                  <tr
                    key={f.name}
                    className="hover:bg-surface/50 dark:hover:bg-navy-950/40 transition-colors"
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-10 w-48 sm:w-56 bg-softer dark:bg-navy-950 p-2.5 sm:p-3.5 font-medium text-body-strong"
                    >
                      <span>{f.name}</span>
                    </th>
                    {solutions.map((s) => {
                      const hasFeat = s.features.includes(f.name);
                      return (
                        <td key={s.id} className="p-2.5 sm:p-3.5 text-center">
                          {hasFeat ? (
                            <span className="grid h-6 w-6 mx-auto place-items-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                              <Check className="h-3.5 w-3.5 stroke-[3]" aria-label="Included" />
                            </span>
                          ) : (
                            <span className="grid h-6 w-6 mx-auto place-items-center text-slate-300 dark:text-slate-600">
                              <Minus className="h-3.5 w-3.5" aria-label="Not featured" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </section>
  );
}
