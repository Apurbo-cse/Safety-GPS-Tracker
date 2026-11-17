import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

export const STOCK_REASONS = ["initial", "purchase", "adjustment", "recount", "order", "cancel", "return", "return_damaged", "refund", "reopen"] as const;
export type StockReason = (typeof STOCK_REASONS)[number];

/** One line of a product's stock history. Never edited — every change to a product's stock adds a row. */
@Entity("stock_movements")
export class StockMovement {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id: string;

  @Index("IDX_stock_movements_device")
  @Column({ name: "device_id", type: "varchar", length: 80 })
  deviceId: string;

  /** + units in, − units out. A damaged return is 0 (it is recorded but nothing goes back on the shelf). */
  @Column({ type: "int" })
  delta: number;

  /** Stock on the shelf right after this change. */
  @Column({ name: "stock_after", type: "int" })
  stockAfter: number;

  @Column({ type: "varchar", length: 20 })
  reason: StockReason;

  /** For a damaged return: how many units came back damaged (they never reach the shelf). */
  @Column({ type: "int", default: 0 })
  damaged: number;

  @Column({ type: "varchar", length: 300, default: "" })
  note: string;

  @Column({ name: "order_id", type: "varchar", length: 16, nullable: true })
  orderId: string | null;

  @Column({ name: "user_id", type: "uuid", nullable: true })
  userId: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
