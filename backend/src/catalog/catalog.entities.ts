import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

abstract class Base {
  @Column({ type: "int", default: 0 })
  sort: number;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}

@Entity("plans")
export class Plan extends Base {
  @PrimaryColumn({ type: "varchar", length: 60 })
  id: string;

  @Column({ type: "varchar", length: 120 })
  name: string;

  @Column({ name: "device_price", type: "int" })
  devicePrice: number;

  @Column({ name: "monthly_charge", type: "int" })
  monthlyCharge: number;

  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  features: string[];

  @Column({ type: "varchar", length: 80, nullable: true })
  highlight: string | null;

  @Column({ type: "varchar", length: 240, nullable: true })
  image: string | null;

  @Column({ name: "site_title", type: "varchar", length: 120, nullable: true })
  siteTitle: string | null;

  @Column({ name: "source_no", type: "int", default: 0 })
  sourceNo: number;

  /** Formatted description (sanitised HTML). */
  @Column({ type: "text", default: "" })
  description: string;

  /** What the device costs us — admin only, never sent to the website. */
  @Column({ type: "int", nullable: true })
  cost: number | null;
}

@Entity("devices")
export class Device extends Base {
  @PrimaryColumn({ type: "varchar", length: 60 })
  id: string;

  @Column({ type: "varchar", length: 120 })
  name: string;

  @Column({ type: "varchar", length: 80 })
  category: string;

  @Column({ type: "varchar", length: 80 })
  subcategory: string;

  @Column({ type: "varchar", length: 20 })
  visual: string;

  @Column({ type: "varchar", length: 240, nullable: true })
  image: string | null;

  @Column({ name: "site_title", type: "varchar", length: 120, nullable: true })
  siteTitle: string | null;

  /** Gallery, main picture first. Entries are "/img/…" files or "media:<uuid>" uploads. `image` mirrors images[0]. */
  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  images: string[];

  @Column({ type: "text" })
  summary: string;

  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  specs: { label: string; value: string }[];

  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  features: string[];

  /** null = price not published (quote request). */
  @Column({ type: "int", nullable: true })
  price: number | null;

  @Column({ type: "int", nullable: true })
  monthly: number | null;

  @Column({ name: "plan_id", type: "varchar", length: 60, nullable: true })
  planId: string | null;

  @Column({ name: "price_note", type: "varchar", length: 240, default: "" })
  priceNote: string;

  /** Formatted description (sanitised HTML), shown on the product page. */
  @Column({ type: "text", default: "" })
  description: string;

  /** What one unit costs us — admin only, never sent to the website. */
  @Column({ type: "int", nullable: true })
  cost: number | null;

  /** Units on hand. null = not tracked (always available). Orders reduce it; cancelling gives it back. */
  @Column({ type: "int", nullable: true })
  stock: number | null;
}

@Entity("faqs")
export class Faq extends Base {
  @PrimaryColumn({ type: "varchar", length: 80 })
  id: string;

  @Column({ type: "varchar", length: 60 })
  category: string;

  @Column({ type: "text" })
  q: string;

  @Column({ type: "text" })
  a: string;

  @Column({ type: "varchar", length: 60, default: "" })
  tag: string;
}

/**
 * Two-level product taxonomy. A row with parent_id = null is a category; otherwise it is a sub-category of that parent.
 * Products keep the category / sub-category *names* (see Device), so renaming here renames them on the products too.
 */
@Entity("categories")
export class Category extends Base {
  /** URL-style key, e.g. "gps-tracking-devices" or "gps-tracking-devices-car-trackers". Never changes. */
  @PrimaryColumn({ type: "varchar", length: 80 })
  id: string;

  @Column({ type: "varchar", length: 80 })
  name: string;

  @Column({ name: "parent_id", type: "varchar", length: 80, nullable: true })
  parentId: string | null;
}

export interface Telematics { vehicle: string; plate: string; place: string; speed: string; ignition: "ON" | "OFF" | "LOCKED"; status: string; route: string; sensor: string; fuel: string }

/** One slide of the home-page hero carousel. */
@Entity("hero_slides")
export class HeroSlide extends Base {
  @PrimaryColumn({ type: "varchar", length: 60 })
  id: string;

  /** Short label under the progress bar. */
  @Column({ type: "varchar", length: 30 })
  tab: string;

  @Column({ type: "varchar", length: 80 })
  badge: string;

  /** shield | bike | truck */
  @Column({ name: "badge_icon", type: "varchar", length: 20, default: "shield" })
  badgeIcon: string;

  @Column({ name: "title_main", type: "varchar", length: 120 })
  titleMain: string;

  @Column({ name: "title_highlight", type: "varchar", length: 120 })
  titleHighlight: string;

  @Column({ type: "varchar", length: 300 })
  text: string;

  /** A file in the website's /public folder, e.g. /img/hero-car.jpg */
  @Column({ name: "bg_image", type: "varchar", length: 240 })
  bgImage: string;

  /** brand | sky | emerald */
  @Column({ type: "varchar", length: 20, default: "brand" })
  accent: string;

  @Column({ name: "cta_label", type: "varchar", length: 40 })
  ctaLabel: string;

  @Column({ name: "cta_href", type: "varchar", length: 200 })
  ctaHref: string;

  /** The little live-tracking card shown beside the headline (sample data). */
  @Column({ type: "jsonb" })
  telematics: Telematics;
}
