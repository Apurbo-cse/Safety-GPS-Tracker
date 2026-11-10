import VehicleArt, { type VehicleKind } from "./VehicleArt";

const lineup: { k: VehicleKind; c?: string }[] = [
  { k: "car" }, { k: "van", c: "#e8ebf0" }, { k: "truck" }, { k: "bus", c: "#f05a22" }, { k: "pickup", c: "#2f3a4d" }, { k: "cng" }, { k: "bike" },
];

/** A row of vehicles on a road, used as a decorative image band. */
export default function FleetStrip({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-950 via-navy-800 to-[#4a2312] px-4 pb-6 pt-8 ${className}`} aria-hidden>
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="relative flex items-end justify-between gap-1 sm:gap-3">
        {lineup.map((v, i) => (
          <div key={i} className={`drive-bob flex-1 ${i % 2 ? "[animation-delay:-1.2s]" : ""}`}><VehicleArt kind={v.k} color={v.c} className="h-auto w-full" /></div>
        ))}
      </div>
      <div className="relative mt-1 h-2 rounded-full bg-black/60"><div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t-2 border-dashed border-white/40" /></div>
    </div>
  );
}
