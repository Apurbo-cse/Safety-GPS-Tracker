import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "../users/user.entity";

/** One browser (or phone) that agreed to get notifications. A person can have several. */
@Entity("push_subscriptions")
export class PushSubscriptionRow {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id: string;

  @Index()
  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  /** The push service's address for this browser (it is its own secret, so it is never shown to anyone). */
  @Column({ type: "text", unique: true })
  endpoint: string;

  @Column({ type: "varchar", length: 200 })
  p256dh: string;

  @Column({ type: "varchar", length: 100 })
  auth: string;

  @Column({ name: "user_agent", type: "varchar", length: 200, default: "" })
  userAgent: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
