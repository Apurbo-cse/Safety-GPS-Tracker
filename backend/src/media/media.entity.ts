import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

/** An uploaded picture, stored in PostgreSQL so it survives redeploys on any host. Never edited, only added or deleted. */
@Entity("media")
export class MediaFile {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id: string;

  @Column({ type: "varchar", length: 20 })
  mime: string;

  @Column({ type: "int" })
  size: number;

  /** Content hash — uploading the same picture twice reuses one row. */
  @Index({ unique: true })
  @Column({ type: "varchar", length: 64 })
  sha256: string;

  @Column({ type: "bytea", select: false })
  data: Buffer;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
