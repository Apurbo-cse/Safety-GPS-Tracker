import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { defaultSettings, type UserSettings } from "./settings";

export type Role = "customer" | "admin";

@Entity("users")
export class User {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id: string;

  /** Stored lower-case. */
  @Column({ type: "varchar", length: 254, unique: true })
  email: string;

  /** Normalised Bangladeshi mobile (01XXXXXXXXX) or null. */
  @Column({ type: "varchar", length: 11, unique: true, nullable: true })
  phone: string | null;

  @Column({ type: "varchar", length: 120 })
  name: string;

  /** bcrypt hash — never selected unless asked for explicitly. */
  @Column({ name: "password_hash", type: "varchar", length: 100, select: false })
  passwordHash: string;

  @Column({ type: "varchar", length: 20, default: "customer" })
  role: Role;

  /** For staff (role "admin"): which StaffRole they have. null = owner (the original admin accounts). */
  @Column({ name: "staff_role_id", type: "varchar", length: 40, nullable: true })
  staffRoleId: string | null;

  /** A disabled account can't log in and its token stops working immediately. */
  @Column({ type: "boolean", default: false })
  disabled: boolean;

  @Column({ name: "vehicle_type", type: "varchar", length: 60, nullable: true })
  vehicleType: string | null;

  @Column({ type: "varchar", length: 120, default: "" })
  company: string;

  @Column({ type: "varchar", length: 240, default: "" })
  address: string;

  @Column({ type: "varchar", length: 40, default: "Dhaka" })
  division: string;

  /** Saved billing details, prefilled at checkout. Empty billing address = same as the address above. */
  @Column({ name: "tax_id", type: "varchar", length: 30, default: "" })
  taxId: string;

  @Column({ name: "billing_address", type: "varchar", length: 240, default: "" })
  billingAddress: string;

  @Column({ name: "billing_division", type: "varchar", length: 40, default: "Dhaka" })
  billingDivision: string;

  @Column({ name: "billing_postcode", type: "varchar", length: 10, default: "" })
  billingPostcode: string;

  @Column({ type: "jsonb", default: () => `'${JSON.stringify(defaultSettings)}'::jsonb` })
  settings: UserSettings;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
