import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

export class CustomersQuery {
  @IsOptional() @Transform(({ value }) => (typeof value === "string" ? value.trim() : value)) @IsString() @MaxLength(80) q?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}

/** A product is "low" when this many or fewer remain. */
export const LOW_STOCK = 5;
const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");

@Injectable()
export class AdminService {
  constructor(@InjectDataSource() private db: DataSource) {}

  /**
   * Numbers for the admin dashboard (Bangladesh time). What is included depends on the viewer's permissions:
   * profit and stock value need "finance.view", the customer count needs "customers.view".
   */
  async stats(can: { finance: boolean; customers: boolean }) {
    const [byStatus, daily, customers, inv, low, profit] = await Promise.all([
      this.db.query<{ status: string; n: number; device: number; monthly: number }[]>(
        `SELECT status, COUNT(*)::int AS n, COALESCE(SUM(device_total),0)::int AS device, COALESCE(SUM(monthly_total),0)::int AS monthly FROM orders GROUP BY status`),
      this.db.query<{ date: string; orders: number; revenue: number }[]>(
        `SELECT to_char(d::date, 'YYYY-MM-DD') AS date,
                COUNT(o.id)::int AS orders,
                COALESCE(SUM(o.device_total) FILTER (WHERE o.status <> 'cancelled'), 0)::int AS revenue
           FROM generate_series((now() AT TIME ZONE 'Asia/Dhaka')::date - 13, (now() AT TIME ZONE 'Asia/Dhaka')::date, interval '1 day') d
           LEFT JOIN orders o ON (o.created_at AT TIME ZONE 'Asia/Dhaka')::date = d::date
          GROUP BY d ORDER BY d`),
      can.customers ? this.db.query<{ n: number; week: number }[]>(`SELECT COUNT(*)::int AS n, COUNT(*) FILTER (WHERE created_at > now() - interval '7 days')::int AS week FROM users WHERE role = 'customer'`) : Promise.resolve(null),
      this.db.query<{ tracked: number; units: number; low: number; out: number; value: number }[]>(
        `SELECT COUNT(*) FILTER (WHERE stock IS NOT NULL)::int AS tracked, COALESCE(SUM(stock),0)::int AS units,
                COUNT(*) FILTER (WHERE stock > 0 AND stock <= ${LOW_STOCK})::int AS low, COUNT(*) FILTER (WHERE stock = 0)::int AS out,
                COALESCE(SUM(stock * cost),0)::int AS value FROM devices WHERE active`),
      this.db.query<{ id: string; name: string; stock: number }[]>(`SELECT id, name, stock FROM devices WHERE stock IS NOT NULL AND stock <= ${LOW_STOCK} ORDER BY stock ASC, name ASC LIMIT 6`),
      can.finance ? this.db.query<{ profit: number }[]>(`SELECT COALESCE(SUM((oi.unit_price - oi.unit_cost) * oi.qty),0)::int AS profit FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.status <> 'cancelled'`) : Promise.resolve(null),
    ]);
    const get = (s: string) => byStatus.find((r) => r.status === s);
    const open = byStatus.filter((r) => r.status !== "cancelled");
    return {
      customers: customers ? customers[0].n : null,
      newCustomers7d: customers ? customers[0].week : null,
      orders: { total: byStatus.reduce((n, r) => n + r.n, 0), byStatus: Object.fromEntries(byStatus.map((r) => [r.status, r.n])) },
      /** Device sales from orders that haven't been cancelled. */
      revenue: open.reduce((n, r) => n + r.device, 0),
      /** Monthly subscriptions: live now (active) and signed but not yet installed. */
      monthlyActive: get("active")?.monthly ?? 0,
      monthlyPipeline: (get("received")?.monthly ?? 0) + (get("confirmed")?.monthly ?? 0) + (get("scheduled")?.monthly ?? 0),
      /** Sales minus what the devices cost us, from orders that haven't been cancelled (finance only). */
      profit: profit ? profit[0].profit : null,
      inventory: { tracked: inv[0].tracked, units: inv[0].units, lowStock: inv[0].low, outOfStock: inv[0].out, value: can.finance ? inv[0].value : null, lowItems: low, lowThreshold: LOW_STOCK },
      daily,
    };
  }

  async customers(q: CustomersQuery) {
    const page = q.page ?? 1, limit = q.limit ?? 20;
    const term = q.q ? `%${escapeLike(q.q)}%` : null;
    const where = term ? `WHERE u.name ILIKE $1 OR u.email ILIKE $1 OR u.phone ILIKE $1` : "";
    const args = term ? [term] : [];
    const [rows, total] = await Promise.all([
      this.db.query(
        `SELECT u.id, u.name, u.email, u.phone, u.role, u.division, u.created_at AS "createdAt",
                COUNT(o.id)::int AS orders,
                COALESCE(SUM(o.device_total) FILTER (WHERE o.status <> 'cancelled'), 0)::int AS spent
           FROM users u LEFT JOIN orders o ON o.user_id = u.id
           ${where}
          GROUP BY u.id ORDER BY u.created_at DESC
          LIMIT ${Number(limit)} OFFSET ${Number((page - 1) * limit)}`, args),
      this.db.query<{ n: number }[]>(`SELECT COUNT(*)::int AS n FROM users u ${where}`, args),
    ]);
    return { page, limit, total: total[0].n, customers: rows };
  }
}
