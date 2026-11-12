import "reflect-metadata";
import "dotenv/config";
import { join } from "node:path";
import { DataSource } from "typeorm";
import { Category, Device, Faq, HeroSlide, Plan } from "../catalog/catalog.entities";
import { MediaFile } from "../media/media.entity";
import { Post } from "../posts/post.entity";
import { StaffRole } from "../staff/role.entity";
import { Order, OrderItem } from "../orders/order.entities";
import { User } from "../users/user.entity";

/** Used by the TypeORM CLI (migrations) and the seed script. */
export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  installExtensions: false,
  ssl: process.env.DB_SSL === "1" || process.env.DB_SSL === "true" ? true : false,
  entities: [User, Plan, Device, Faq, Category, HeroSlide, MediaFile, Post, StaffRole, Order, OrderItem],
  migrations: [join(__dirname, "migrations", "*.{js,ts}")],
});
