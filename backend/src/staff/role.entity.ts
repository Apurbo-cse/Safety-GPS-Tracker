import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("staff_roles")
export class StaffRole {
  @PrimaryColumn({ type: "varchar", length: 40 })
  id: string;

  @Column({ type: "varchar", length: 60 })
  name: string;

  @Column({ type: "varchar", length: 200, default: "" })
  description: string;

  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  permissions: string[];

  /** Built-in roles can't be deleted. */
  @Column({ type: "boolean", default: false })
  system: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
