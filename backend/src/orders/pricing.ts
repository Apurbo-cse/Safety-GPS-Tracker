import type { Device, Plan } from "../catalog/catalog.entities";

/** Thrown for a cart the shop can't accept; the service turns it into HTTP 400. Kept framework-free so it's unit-testable. */
export class PricingError extends Error {}

export interface CartLine { id: string; qty: number }
export interface PricedLine { itemRef: string; kind: "plan" | "device"; name: string; unitPrice: number; monthly: number; unitCost: number; qty: number }

/** Cart ids look like "plan-gps-1" or "dev-bike-premium". Kind and prices are NEVER taken from the client. */
export function parseRef(id: string): { kind: "plan" | "device"; ref: string } | null {
  if (id.startsWith("plan-")) return { kind: "plan", ref: id.slice(5) };
  if (id.startsWith("dev-")) return { kind: "device", ref: id.slice(4) };
  return null;
}

/** Price a cart from the catalogue. Merges duplicate lines; rejects unknown, hidden or unpriced items. */
export function priceCart(lines: CartLine[], plans: Map<string, Plan>, devices: Map<string, Device>) {
  const merged = new Map<string, number>();
  for (const l of lines) merged.set(l.id, (merged.get(l.id) ?? 0) + l.qty);

  const items: PricedLine[] = [];
  for (const [id, qty] of merged) {
    if (qty < 1 || qty > 50) throw new PricingError(`Quantity for ${id} must be between 1 and 50`);
    const p = parseRef(id);
    if (!p) throw new PricingError(`Unknown item "${id}"`);
    if (p.kind === "plan") {
      const plan = plans.get(p.ref);
      if (!plan || !plan.active) throw new PricingError(`"${id}" is no longer available`);
      items.push({ itemRef: id, kind: "plan", name: plan.name, unitPrice: plan.devicePrice, monthly: plan.monthlyCharge, unitCost: plan.cost ?? 0, qty });
    } else {
      const dev = devices.get(p.ref);
      if (!dev || !dev.active) throw new PricingError(`"${id}" is no longer available`);
      if (dev.price === null) throw new PricingError(`"${dev.name}" has no published price — please request a quote instead`);
      // quick friendly check; the database update that actually takes the stock is the race-proof guard
      if (dev.stock !== null && dev.stock !== undefined && qty > dev.stock) throw new PricingError(dev.stock <= 0 ? `"${dev.name}" is out of stock` : `Only ${dev.stock} of "${dev.name}" left in stock`);
      items.push({ itemRef: id, kind: "device", name: dev.name, unitPrice: dev.price, monthly: dev.monthly ?? 0, unitCost: dev.cost ?? 0, qty });
    }
  }
  if (!items.length) throw new PricingError("Your cart is empty");
  const deviceTotal = items.reduce((n, i) => n + i.unitPrice * i.qty, 0);
  const monthlyTotal = items.reduce((n, i) => n + i.monthly * i.qty, 0);
  return { items, deviceTotal, monthlyTotal };
}
