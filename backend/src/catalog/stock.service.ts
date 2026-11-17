import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import type { DataSource, EntityManager } from "typeorm";
import { StockMovement, type StockReason } from "./stock.entity";
import type { StockDto } from "./catalog.dto";

export interface StockEntry { deviceId: string; delta: number; stockAfter: number; reason: StockReason; damaged?: number; note?: string; orderId?: string | null; userId?: string | null }

/** Add a line to the stock history. Always called inside the same transaction that changed the stock. */
export const logStock = (m: EntityManager, e: StockEntry) =>
  m.getRepository(StockMovement).insert({ deviceId: e.deviceId, delta: e.delta, stockAfter: e.stockAfter, reason: e.reason, damaged: e.damaged ?? 0, note: (e.note ?? "").slice(0, 300), orderId: e.orderId ?? null, userId: e.userId ?? null });

/**
 * Change a product's stock by `delta` in one atomic UPDATE (so two people adding stock at once never overwrite each other),
 * and write the history row. Returns the new stock, or null if the product doesn't count stock (or there isn't enough to remove).
 */
export async function moveStock(m: EntityManager, deviceId: string, delta: number, entry: Omit<StockEntry, "deviceId" | "delta" | "stockAfter">): Promise<number | null> {
  const res = await m.query(`UPDATE devices SET stock = stock + $1 WHERE id = $2 AND stock IS NOT NULL AND stock + $1 >= 0 RETURNING stock`, [delta, deviceId]);
  const rows: { stock: number }[] = Array.isArray(res[0]) ? res[0] : res;
  if (!rows.length) return null;
  await logStock(m, { ...entry, deviceId, delta, stockAfter: rows[0].stock });
  return rows[0].stock;
}

@Injectable()
export class StockService {
  constructor(@InjectDataSource() private db: DataSource) {}

  /** Staff change one product's stock: add (new units arrived), remove (lost / damaged), or set (a recount). */
  async change(deviceId: string, dto: StockDto, userId: string) {
    return this.db.transaction(async (m) => {
      const row = await m.query(`SELECT stock FROM devices WHERE id = $1 FOR UPDATE`, [deviceId]);
      if (!row.length) throw new NotFoundException("Product not found");
      const current: number | null = row[0].stock;
      const note = dto.note?.trim() ?? "";
      if (dto.mode === "set") {
        const before = current ?? 0;
        await m.query(`UPDATE devices SET stock = $1 WHERE id = $2`, [dto.qty, deviceId]);
        await logStock(m, { deviceId, delta: dto.qty - before, stockAfter: dto.qty, reason: current === null ? "initial" : "recount", note, userId });
        return { stock: dto.qty };
      }
      if (current === null) throw new ConflictException("This product doesn't count stock yet — use “Set count” first");
      if (dto.qty < 1) throw new BadRequestException("Enter a number above 0");
      const delta = dto.mode === "add" ? dto.qty : -dto.qty;
      const after = await moveStock(m, deviceId, delta, { reason: dto.mode === "add" ? "purchase" : "adjustment", note, userId });
      if (after === null) throw new ConflictException(`Only ${current} in stock — you can't remove ${dto.qty}`);
      return { stock: after };
    });
  }

  async history(deviceId: string, limit = 100) {
    const rows = await this.db.query(
      `SELECT m.id, m.delta, m.stock_after AS "stockAfter", m.reason, m.damaged, m.note, m.order_id AS "orderId", m.created_at AS "createdAt", u.name AS "by"
         FROM stock_movements m LEFT JOIN users u ON u.id = m.user_id WHERE m.device_id = $1 ORDER BY m.created_at DESC, m.id LIMIT $2`, [deviceId, Math.min(limit, 500)]);
    return rows as { id: string; delta: number; stockAfter: number; reason: StockReason; damaged: number; note: string; orderId: string | null; createdAt: string; by: string | null }[];
  }
}
