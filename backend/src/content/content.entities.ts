import { Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

/** Small settings blobs edited in the admin panel (key "site" = company details used across the website). */
@Entity("site_content")
export class SiteContent {
  @PrimaryColumn({ type: "varchar", length: 40 })
  key: string;

  @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
  data: Record<string, unknown>;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}

/** A text page (Privacy, Terms, Refund policy…) written in the rich-text editor. */
@Entity("pages")
export class Page {
  @PrimaryColumn({ type: "varchar", length: 60 })
  id: string;

  @Column({ type: "varchar", length: 120 })
  title: string;

  /** Sanitised HTML. `{{name}}`, `{{phone}}`, `{{email}}` and `{{address}}` are filled in with the company details when shown. */
  @Column({ type: "text" })
  content: string;

  @Column({ type: "boolean", default: true })
  published: boolean;

  @Column({ type: "int", default: 0 })
  sort: number;

  /** Shown as "Last updated". */
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
