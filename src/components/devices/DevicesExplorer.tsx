"use client";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  Cpu,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";
import Container from "@/components/common/Container";
import DeviceCard from "./DeviceCard";
import { deviceCategories, devices } from "@/data/devices";

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

  const hasActiveFilters = cat !== "All" || capability !== "All" || q.trim() !== "";

  const handleReset = () => {
    setCat("All");
    setCapability("All");
    setQ("");
  };

  return (
    <Container className="py-12 sm:py-16">
      {/* Select Option & Search Controls */}
      <div className="mb-8 rounded-md border border-line bg-surface p-4  sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-center">
          {/* Category Select Option */}
          <div className="relative sm:col-span-1 lg:col-span-4">
            <label htmlFor="device-category-select" className="sr-only">
              Select category
            </label>
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <select
              id="device-category-select"
              value={cat}
              onChange={(e) => setCat(e.target.value as (typeof deviceCategories)[number])}
              className="w-full appearance-none rounded-md border border-line-strong bg-soft/50 py-2.5 pl-10 pr-9 text-xs font-semibold text-ink transition-colors hover:border-brand-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:text-sm"
            >
              {deviceCategories.map((c) => {
                const count =
                  c === "All"
                    ? devices.length
                    : devices.filter((d) => d.category === c).length;
                return (
                  <option key={c} value={c} className="bg-surface text-ink">
                    {c === "All" ? `All Categories (${count})` : `${c} (${count})`}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Capability Select Option */}
          <div className="relative sm:col-span-1 lg:col-span-4">
            <label htmlFor="device-capability-select" className="sr-only">
              Select capability
            </label>
            <select
              id="device-capability-select"
              value={capability}
              onChange={(e) => setCapability(e.target.value)}
              className="w-full appearance-none rounded-md border border-line-strong bg-soft/50 py-2.5 pl-4 pr-9 text-xs font-semibold text-ink transition-colors hover:border-brand-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:text-sm"
            >
              {CAPABILITIES.map((cap) => (
                <option key={cap} value={cap} className="bg-surface text-ink">
                  {cap === "All" ? "All Hardware Capabilities" : `Capability: ${cap}`}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-4">
            <label htmlFor="device-search-input" className="sr-only">
              Search tracking hardware
            </label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="device-search-input"
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search devices, sensors, OBD..."
              className="w-full rounded-md border border-line-strong bg-soft/50 py-2.5 pl-10 pr-4 text-xs font-medium text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:text-sm"
            />
          </div>
        </div>

        {/* Filter Summary & Reset Action */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-3 text-xs text-body">
          <div>
            Showing <strong className="text-ink">{list.length}</strong> of{" "}
            {devices.length} hardware models
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 font-bold text-brand-text transition-colors hover:text-brand-700 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Device List or Empty State */}
      {list.length === 0 ? (
        <div className="grid place-items-center rounded-md border border-dashed border-line-strong py-16 text-center">
          <SearchX className="h-10 w-10 text-slate-400" />
          <p className="mt-3 text-base font-bold text-ink">
            No devices match your search or filter
          </p>
          <p className="text-xs text-slate-500">
            Try choosing &quot;All Categories&quot; or searching for keywords like &quot;voice&quot;, &quot;video&quot;, &quot;obd&quot;, or &quot;relay&quot;.
          </p>
          <button
            className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
            onClick={handleReset}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((d) => (
            <DeviceCard key={d.id} device={d} />
          ))}
        </div>
      )}

      {/* Bottom Guarantee Note */}
      <div className="mt-12 flex items-start gap-3 rounded-md border border-line bg-soft/40 p-5 text-xs leading-relaxed text-body">
        <Cpu className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
        <p>
          All GPS trackers come with internal backup batteries, multi-carrier 4G IoT SIM cards, and a certified solid-state engine immobilizer relay kit. Free doorstep technician installation and covert wiring available across all 64 districts in Bangladesh.
        </p>
      </div>
    </Container>
  );
}
