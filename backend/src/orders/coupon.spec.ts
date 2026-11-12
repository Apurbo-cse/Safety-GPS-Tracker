import { checkCoupon, CouponError, type CouponRule } from "./coupon";

const base: CouponRule = { kind: "percent", value: 10, minTotal: 0, active: true, expiresAt: null, maxUses: null, used: 0 };
const now = new Date("2026-11-12T10:00:00Z");

describe("checkCoupon", () => {
  it("takes a percentage off the device total, rounding down", () => {
    expect(checkCoupon(base, 4000, now)).toBe(400);
    expect(checkCoupon({ ...base, value: 15 }, 4999, now)).toBe(749);
  });
  it("takes a fixed amount but never more than the total", () => {
    expect(checkCoupon({ ...base, kind: "fixed", value: 500 }, 4000, now)).toBe(500);
    expect(checkCoupon({ ...base, kind: "fixed", value: 9000 }, 4000, now)).toBe(4000);
  });
  it("rejects unknown, inactive, expired and used-up codes", () => {
    expect(() => checkCoupon(null, 4000, now)).toThrow(CouponError);
    expect(() => checkCoupon({ ...base, active: false }, 4000, now)).toThrow("isn't valid");
    expect(() => checkCoupon({ ...base, expiresAt: new Date("2026-11-12T09:59:59Z") }, 4000, now)).toThrow("expired");
    expect(() => checkCoupon({ ...base, maxUses: 5, used: 5 }, 4000, now)).toThrow("fully used");
  });
  it("accepts a code on its last use and just before it expires", () => {
    expect(checkCoupon({ ...base, maxUses: 5, used: 4 }, 4000, now)).toBe(400);
    expect(checkCoupon({ ...base, expiresAt: new Date("2026-11-12T10:00:01Z") }, 4000, now)).toBe(400);
  });
  it("enforces the minimum spend", () => {
    expect(() => checkCoupon({ ...base, minTotal: 5000 }, 4000, now)).toThrow("Spend ৳5,000");
    expect(checkCoupon({ ...base, minTotal: 4000 }, 4000, now)).toBe(400);
  });
});
