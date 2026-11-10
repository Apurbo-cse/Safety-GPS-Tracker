import type { VehicleKind } from "./VehicleArt";

export const SOLUTION_KIND: Record<string, { kind: VehicleKind; color?: string }> = {
  "private-cars": { kind: "car" },
  logistics: { kind: "truck" },
  construction: { kind: "excavator" },
  "public-transport": { kind: "bus" },
  motorcycles: { kind: "bike", color: "#f05a22" },
  "ships-cargo": { kind: "ship", color: "#f05a22" },
  cng: { kind: "cng" },
  "business-fleet": { kind: "van", color: "#e8ebf0" },
};
