import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

export const MESSAGE_STATUSES = ["new", "handled"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

/** A message sent from the website's Contact page or the "Talk to our team" pop-up. */
@Entity("contact_messages")
export class ContactMessage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /** "contact" = full form on /contact, "lead" = quick call-back request. */
  @Column({ type: "varchar", length: 10, default: "contact" })
  kind: "contact" | "lead";

  @Column({ type: "varchar", length: 20, default: "sales" })
  department: string;

  @Column({ type: "varchar", length: 120 })
  name: string;

  @Column({ type: "varchar", length: 254, default: "" })
  email: string;

  @Column({ type: "varchar", length: 11 })
  phone: string;

  @Column({ type: "varchar", length: 40, default: "" })
  fleet: string;

  @Column({ type: "varchar", length: 150, default: "" })
  subject: string;

  @Column({ type: "text" })
  message: string;

  @Index("IDX_contact_messages_status")
  @Column({ type: "varchar", length: 10, default: "new" })
  status: MessageStatus;

  @Index("IDX_contact_messages_created_at")
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Column({ name: "handled_at", type: "timestamptz", nullable: true })
  handledAt: Date | null;
}
