/** Kinds of vehicle a package can be recommended for (the website's "Find my plan" quiz uses these). */
export const VEHICLE_TYPES = ["car", "bike", "truck", "equip"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

/** Which vehicles each package of the original price list was made for — used to fill existing and seeded packages. */
export const DEFAULT_PLAN_VEHICLES: Record<string, VehicleType[]> = {
  "premium-voice": ["car"], "standard-gps": ["car"], "gps-1": ["car"], "voice-gps-2": ["car"],
  "gps-2": ["bike"], "voice-gps": ["truck"], "gps-3": ["equip"],
};
