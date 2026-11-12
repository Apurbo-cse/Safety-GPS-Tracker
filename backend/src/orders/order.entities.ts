import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "../users/user.entity";

export const ORDER_STATUSES = ["received", "confirmed", "scheduled", "active", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export const PAYMENT_METHODS = ["bKash", "Nagad", "Rocket", "Card", "Cash on installation"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

@Index("IDX_orders_created_at", ["createdAt"])
@Entity("orders")
export class Order {
  /** Human-friendly reference, e.g. SGT-7K2QXM. */
  @PrimaryColumn({ type: "varchar", length: 16 })
  id: string;

  @Index()
  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Index()
  @Column({ type: "varchar", length: 20, default: "received" })
  status: OrderStatus;

  @Column({ type: "varchar", length: 30 })
  payment: PaymentMethod;

  @Column({ name: "device_total", type: "int" })
  deviceTotal: number;

  @Column({ name: "monthly_total", type: "int" })
  monthlyTotal: number;

  /** Taken off `deviceTotal` by the coupon (0 when none). What the customer pays now is deviceTotal − discount. */
  @Column({ type: "int", default: 0 })
  discount: number;

  @Column({ name: "coupon_code", type: "varchar", length: 30, nullable: true })
  couponCode: string | null;

  @Column({ name: "contact_name", type: "varchar", length: 120 })
  contactName: string;

  @Column({ name: "contact_phone", type: "varchar", length: 11 })
  contactPhone: string;

  @Column({ name: "contact_email", type: "varchar", length: 254 })
  contactEmail: string;

  @Column({ type: "varchar", length: 240 })
  address: string;

  @Column({ type: "varchar", length: 40 })
  division: string;

  @Column({ name: "vehicle_reg", type: "varchar", length: 60 })
  vehicleReg: string;

  @Column({ name: "vehicle_type", type: "varchar", length: 60 })
  vehicleType: string;

  @Column({ name: "preferred_date", type: "date" })
  preferredDate: string;

  /** Who the invoice is made out to. Copied from the contact details when the customer says "same as installation". */
  @Column({ name: "billing_name", type: "varchar", length: 120 })
  billingName: string;

  @Column({ name: "billing_company", type: "varchar", length: 120, default: "" })
  billingCompany: string;

  /** BIN / TIN (optional). */
  @Column({ name: "billing_tax_id", type: "varchar", length: 30, default: "" })
  billingTaxId: string;

  @Column({ name: "billing_address", type: "varchar", length: 240 })
  billingAddress: string;

  @Column({ name: "billing_division", type: "varchar", length: 40 })
  billingDivision: string;

  @Column({ name: "billing_postcode", type: "varchar", length: 10, default: "" })
  billingPostcode: string;

  @Column({ name: "billing_phone", type: "varchar", length: 11 })
  billingPhone: string;

  @Column({ name: "billing_email", type: "varchar", length: 254 })
  billingEmail: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  note: string | null;

  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}

@Entity("order_items")
export class OrderItem {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id: string;

  @Index()
  @Column({ name: "order_id", type: "varchar", length: 16 })
  orderId: string;

  @ManyToOne(() => Order, (o) => o.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order: Order;

  /** Cart id as the website uses it: "plan-<planId>" or "dev-<deviceId>". */
  @Column({ name: "item_ref", type: "varchar", length: 80 })
  itemRef: string;

  @Column({ type: "varchar", length: 10 })
  kind: "plan" | "device";

  /** Name and prices are copied from the catalogue at order time (they never change afterwards). */
  @Column({ type: "varchar", length: 120 })
  name: string;

  @Column({ name: "unit_price", type: "int" })
  unitPrice: number;

  @Column({ type: "int", default: 0 })
  monthly: number;

  /** Our cost per unit when the order was placed (admin only) — lets the dashboard show real profit. */
  @Column({ name: "unit_cost", type: "int", default: 0 })
  unitCost: number;

  @Column({ type: "int" })
  qty: number;
}
