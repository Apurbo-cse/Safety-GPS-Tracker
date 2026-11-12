import type { Device } from "@/types";

/** Show "Only N left" at or below this many units (the admin dashboard uses the same number for "low stock"). */
export const LOW_STOCK = 5;

export type StockState = "untracked" | "ok" | "low" | "out";

/** `stock` missing means the shop doesn't track it — always available. */
export function stockState(d: Pick<Device, "stock">): StockState {
  if (d.stock == null) return "untracked";
  return d.stock <= 0 ? "out" : d.stock <= LOW_STOCK ? "low" : "ok";
}

/** How many more units can go in the cart given what is already there (50 per order line at most). */
export const room = (d: Pick<Device, "stock">, inCart = 0) => Math.max(0, Math.min(50, d.stock ?? 50) - inCart);

export const stockLabel = (d: Pick<Device, "stock">): string | null => {
  const s = stockState(d);
  return s === "out" ? "Out of stock" : s === "low" ? `Only ${d.stock} left` : s === "ok" ? "In stock" : null;
};
