import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import type { CouponKind } from "./coupon";

/** A discount code for the device price (monthly charges are never discounted). */
@Entity("coupons")
export class Coupon {
  @PrimaryColumn({ type: "varchar", length: 30 })
  code: string;

  @Column({ type: "varchar", length: 10 })
  kind: CouponKind;

  /** Percent (1–100) or taka, depending on `kind`. */
  @Column({ type: "int" })
  value: number;

  /** Minimum device total the cart must reach. */
  @Column({ name: "min_total", type: "int", default: 0 })
  minTotal: number;

  @Column({ name: "max_uses", type: "int", nullable: true })
  maxUses: number | null;

  /** Orders using it (returned when an order is cancelled). */
  @Column({ type: "int", default: 0 })
  used: number;

  @Column({ name: "expires_at", type: "timestamptz", nullable: true })
  expiresAt: Date | null;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @Column({ type: "varchar", length: 120, default: "" })
  note: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
