"use client";
import { useState } from "react";
import Container from "@/components/common/Container";
import DeviceCard from "./DeviceCard";
import { deviceCategories, devices } from "@/data/devices";
import { cn } from "@/utils/format";

export default function DevicesExplorer() {
  const [cat, setCat] = useState<(typeof deviceCategories)[number]>("All");
  const list = devices.filter((d) => cat === "All" || d.category === cat);
  return (
    <Container className="py-12">
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Device categories">
        {deviceCategories.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
            className={cn("rounded-full border px-3.5 py-1.5 text-sm font-medium", cat === c ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-surface text-body-strong hover:border-brand-400")}>{c}</button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((d) => <DeviceCard key={d.id} device={d} />)}</div>
      <p className="mt-8 rounded-lg bg-softer p-4 text-sm text-body">Device prices come from the published package price list. Product images are illustrations; specifications and hardware models beyond what packages state are confirmed on request.</p>
    </Container>
  );
}
