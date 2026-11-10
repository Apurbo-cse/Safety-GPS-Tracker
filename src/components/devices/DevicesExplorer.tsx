"use client";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Cpu,
  Search,
  SearchX,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Container from "@/components/common/Container";
import DeviceCard from "./DeviceCard";
import { deviceCategories, devices } from "@/data/devices";
import { cn } from "@/utils/format";

const CAPABILITIES = [
  "All",
  "4G LTE",
  "Voice Monitoring",
  "Live Video",
  "Engine Lock Relay",
  "OBD-II Plug",
] as const;

export default function DevicesExplorer() {
  const [cat, setCat] = useState<(typeof deviceCategories)[number]>("All");
  const [capability, setCapability] = useState<string>("All");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    return devices.filter((d) => {
      const matchCat = cat === "All" || d.category === cat;
      const matchQuery =
        (d.name + d.summary + d.category).toLowerCase().includes(q.toLowerCase()) ||
        d.features.some((f) => f.toLowerCase().includes(q.toLowerCase()));

      let matchCap = true;
      if (capability === "4G LTE") matchCap = true;
      else if (capability === "Voice Monitoring")
        matchCap = d.category.includes("Voice") || d.features.some((f) => f.includes("Voice"));
      else if (capability === "Live Video")
        matchCap = d.category.includes("Video") || d.features.some((f) => f.includes("Video"));
      else if (capability === "Engine Lock Relay")
        matchCap = d.id.includes("relay") || d.features.some((f) => f.includes("Engine Lock"));
      else if (capability === "OBD-II Plug")
        matchCap = d.id.includes("obd") || d.name.toLowerCase().includes("obd");

      return matchCat && matchQuery && matchCap;
    });
  }, [cat, capability, q]);

  return (
    <Container className="py-12 sm:py-16">
      {/* Top Reassurance Trust Strip */}
      <div className="mb-10 rounded-lg border border-line bg-gradient-to-r from-soft/60 via-surface to-soft/60 p-6  ">
        <div className="flex flex-wrap items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-extrabold text-ink text-sm">BTRC Approved Telematics Hardware</p>
              <p className="text-slate-500">
                100% genuine Concox, Teltonika & SinoTrack GPS hardware with 1-Year Instant Replacement Warranty.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] md:text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="h-4 w-4" /> 64 Districts Free Doorstep Installation
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-brand-text font-bold">
              <Zap className="h-4 w-4" /> 10-Second GNSS Telemetry
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Device categories">
          {deviceCategories.map((c) => {
            const count = c === "All" ? devices.length : devices.filter((d) => d.category === c).length;
            const isSelected = cat === c;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setCat(c)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs sm:text-sm font-bold transition-all  ",
                  isSelected
                    ? "border-brand-600 bg-brand-600 text-white   scale-[1.02]"
                    : "border-line bg-surface text-body hover:border-brand-400 hover:text-ink hover:bg-softer"
                )}
              >
                <span>{c}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] md:text-xs font-bold font-mono",
                    isSelected ? "bg-white/20 text-white" : "bg-soft text-slate-400"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <label className="relative block w-full lg:w-80">
          <span className="sr-only">Search tracking hardware</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search devices, sensors, OBD..."
            className="w-full rounded-lg border border-line-strong bg-surface py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20  "
          />
        </label>
      </div>

      {/* Hardware Capability Fast Filter Pills */}
      <div className="mb-8 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-500 uppercase tracking-wider mr-1 text-[11px] md:text-xs">Filter by capability:</span>
        {CAPABILITIES.map((cap) => (
          <button
            key={cap}
            onClick={() => setCapability(cap)}
            className={cn(
              "rounded-lg px-3 py-1 font-semibold transition-all border",
              capability === cap
                ? "border-brand-600 bg-brand-500/10 text-brand-text font-bold"
                : "border-line bg-surface text-slate-500 hover:border-brand-300 hover:text-ink"
            )}
          >
            {cap}
          </button>
        ))}
      </div>

      {/* Device List or Empty State */}
      {list.length === 0 ? (
        <div className="grid place-items-center rounded-lg border border-dashed border-line-strong py-16 text-center">
          <SearchX className="h-10 w-10 text-slate-400" />
          <p className="mt-3 text-base font-bold text-ink">No devices match your search or filter</p>
          <p className="text-xs text-slate-500">Try searching for keywords like &quot;voice&quot;, &quot;video&quot;, &quot;obd&quot;, or &quot;relay&quot;.</p>
          <button
            className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white   hover:bg-brand-700"
            onClick={() => {
              setQ("");
              setCat("All");
              setCapability("All");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => (
            <DeviceCard key={d.id} device={d} />
          ))}
        </div>
      )}

      {/* Bottom Guarantee Note */}
      <div className="mt-12 rounded-lg border border-line bg-soft/40 p-5 text-xs text-body leading-relaxed flex items-start gap-3">
        <Cpu className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
        <p>
          All GPS trackers come with internal backup batteries, multi-carrier 4G IoT SIM cards, and a certified solid-state engine immobilizer relay kit. Free doorstep technician installation and covert wiring available across all 64 districts in Bangladesh.
        </p>
      </div>
    </Container>
  );
}
