import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";

/** A news / blog post written in the admin panel's rich-text editor. */
@Entity("posts")
export class Post {
  @PrimaryColumn({ type: "varchar", length: 80 })
  id: string;

  @Column({ type: "varchar", length: 150 })
  title: string;

  /** Short summary for the list page (plain text). */
  @Column({ type: "varchar", length: 300, default: "" })
  excerpt: string;

  /** "media:<uuid>" upload or a /public path. */
  @Column({ type: "varchar", length: 240, nullable: true })
  cover: string | null;

  /** Sanitised HTML. */
  @Column({ type: "text" })
  content: string;

  @Index()
  @Column({ type: "boolean", default: false })
  published: boolean;

  /** Shown on the website only once published and this moment has passed. */
  @Index()
  @Column({ name: "published_at", type: "timestamptz", nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
