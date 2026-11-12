import type { Device, Plan } from "../catalog/catalog.entities";
import { parseRef, priceCart, PricingError } from "./pricing";

const plan = (o: Partial<Plan>) => ({ id: "gps-1", name: "GPS Package 1", devicePrice: 4000, monthlyCharge: 400, cost: 2800, active: true, ...o }) as Plan;
const dev = (o: Partial<Device>) => ({ id: "bike", name: "Bike", price: 4000, monthly: 300, cost: 2500, stock: null, active: true, ...o }) as Device;
const plans = new Map([["gps-1", plan({})], ["old", plan({ id: "old", active: false })]]);
const devices = new Map([["bike", dev({})], ["relay", dev({ id: "relay", name: "Relay", price: null, monthly: null })]]);

describe("parseRef", () => {
  it("reads cart ids", () => { expect(parseRef("plan-gps-1")).toEqual({ kind: "plan", ref: "gps-1" }); expect(parseRef("dev-bike")).toEqual({ kind: "device", ref: "bike" }); });
  it("rejects anything else", () => expect(parseRef("sku-1")).toBeNull());
});

describe("priceCart", () => {
  it("prices from the catalogue and totals", () => {
    const r = priceCart([{ id: "plan-gps-1", qty: 2 }, { id: "dev-bike", qty: 1 }], plans, devices);
    expect(r.deviceTotal).toBe(12000);
    expect(r.monthlyTotal).toBe(1100);
    expect(r.items.map((i) => i.name)).toEqual(["GPS Package 1", "Bike"]);
  });
  it("merges duplicate lines", () => {
    const r = priceCart([{ id: "dev-bike", qty: 2 }, { id: "dev-bike", qty: 3 }], plans, devices);
    expect(r.items).toHaveLength(1);
    expect(r.items[0].qty).toBe(5);
  });
  it("rejects a merged quantity over 50", () => expect(() => priceCart([{ id: "dev-bike", qty: 30 }, { id: "dev-bike", qty: 30 }], plans, devices)).toThrow(PricingError));
  it("rejects unknown, hidden and unpriced items", () => {
    expect(() => priceCart([{ id: "plan-nope", qty: 1 }], plans, devices)).toThrow(/no longer available/);
    expect(() => priceCart([{ id: "plan-old", qty: 1 }], plans, devices)).toThrow(/no longer available/);
    expect(() => priceCart([{ id: "dev-relay", qty: 1 }], plans, devices)).toThrow(/no published price/);
    expect(() => priceCart([{ id: "sku-1", qty: 1 }], plans, devices)).toThrow(/Unknown item/);
  });
  it("rejects an empty cart", () => expect(() => priceCart([], plans, devices)).toThrow(/empty/));

  it("records our cost for each line (for profit)", () => {
    const r = priceCart([{ id: "plan-gps-1", qty: 2 }, { id: "dev-bike", qty: 1 }], plans, devices);
    expect(r.items.map((i) => i.unitCost)).toEqual([2800, 2500]);
  });
  it("treats a missing cost as 0", () => {
    const r = priceCart([{ id: "dev-bike", qty: 1 }], plans, new Map([["bike", dev({ cost: null })]]));
    expect(r.items[0].unitCost).toBe(0);
  });
  describe("stock", () => {
    const tracked = (stock: number | null) => new Map([["bike", dev({ stock })]]);
    it("accepts up to the units on hand", () => expect(priceCart([{ id: "dev-bike", qty: 3 }], plans, tracked(3)).items[0].qty).toBe(3));
    it("rejects more than the units on hand, saying how many are left", () => expect(() => priceCart([{ id: "dev-bike", qty: 4 }], plans, tracked(3))).toThrow(/Only 3 of "Bike" left/));
    it("rejects anything when out of stock", () => expect(() => priceCart([{ id: "dev-bike", qty: 1 }], plans, tracked(0))).toThrow(/out of stock/));
    it("counts merged duplicate lines against the stock", () => expect(() => priceCart([{ id: "dev-bike", qty: 2 }, { id: "dev-bike", qty: 2 }], plans, tracked(3))).toThrow(/Only 3/));
    it("does not limit products with no stock number", () => expect(priceCart([{ id: "dev-bike", qty: 50 }], plans, tracked(null)).items[0].qty).toBe(50));
  });
});
