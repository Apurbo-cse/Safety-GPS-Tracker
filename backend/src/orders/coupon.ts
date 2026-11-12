/** Discount-code rules. Kept free of framework code so they can be unit-tested. */
export type CouponKind = "percent" | "fixed";

export interface CouponRule {
  kind: CouponKind;
  value: number;
  minTotal: number;
  active: boolean;
  expiresAt: Date | null;
  maxUses: number | null;
  used: number;
}

/** Thrown when a code can't be used; the service turns it into HTTP 400 with this message. */
export class CouponError extends Error {}

/** Codes are letters, digits and dashes, 3–30 characters, stored upper-case. */
export const COUPON_CODE = /^[A-Z0-9-]{3,30}$/;
export const normalizeCode = (s: string) => s.trim().toUpperCase();

/** The discount (in ৳, never more than the device total) this code gives on `deviceTotal`; throws a CouponError when it can't be used. Monthly charges are never discounted. */
export function checkCoupon(c: CouponRule | null | undefined, deviceTotal: number, now = new Date()): number {
  if (!c || !c.active) throw new CouponError("That coupon code isn't valid");
  if (c.expiresAt && c.expiresAt.getTime() <= now.getTime()) throw new CouponError("This coupon has expired");
  if (c.maxUses !== null && c.used >= c.maxUses) throw new CouponError("This coupon has been fully used");
  if (deviceTotal < c.minTotal) throw new CouponError(`Spend ৳${c.minTotal.toLocaleString("en-US")} or more on devices to use this coupon`);
  const raw = c.kind === "percent" ? Math.floor((deviceTotal * c.value) / 100) : c.value;
  return Math.max(0, Math.min(deviceTotal, raw));
}
