import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type { EntityManager } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { randomBytes } from "node:crypto";
import { ILike, In, Repository } from "typeorm";
import { Device, Plan } from "../catalog/catalog.entities";
import { normalizePhone } from "../common/phone";
import type { User } from "../users/user.entity";
import { Order, OrderItem, type OrderStatus } from "./order.entities";
import { checkCoupon, CouponError, normalizeCode } from "./coupon";
import { Coupon } from "./coupon.entity";
import { EventsGateway } from "../events/events.gateway";
import type { AdminOrdersQuery, CreateOrderDto, QuoteDto } from "./orders.dto";
import { parseRef, priceCart, PricingError } from "./pricing";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 symbols, no 0/O/1/I — 256 % 32 === 0 so no modulo bias
const newOrderId = () => "SGT-" + Array.from(randomBytes(6), (b) => ALPHABET[b % 32]).join("");
const isUniqueViolation = (e: unknown) => (e as { code?: string } | null)?.code === "23505" || (e as { driverError?: { code?: string } } | null)?.driverError?.code === "23505";

/** Shape the website expects (matches its Order / CartItem types). */
export const toOrderView = (o: Order) => ({
  id: o.id,
  createdAt: o.createdAt.toISOString(),
  status: o.status,
  payment: o.payment,
  deviceTotal: o.deviceTotal,
  discount: o.discount,
  couponCode: o.couponCode ?? undefined,
  monthlyTotal: o.monthlyTotal,
  items: (o.items ?? []).map((i) => ({ id: i.itemRef, kind: i.kind, name: i.name, price: i.unitPrice, monthly: i.monthly || undefined, qty: i.qty })),
  billing: { name: o.billingName, company: o.billingCompany || undefined, taxId: o.billingTaxId || undefined, address: o.billingAddress, division: o.billingDivision, postcode: o.billingPostcode || undefined, phone: o.billingPhone, email: o.billingEmail },
  contact: {
    name: o.contactName, phone: o.contactPhone, email: o.contactEmail, address: o.address, division: o.division,
    vehicleReg: o.vehicleReg, vehicleType: o.vehicleType, preferredDate: o.preferredDate, note: o.note ?? undefined,
  },
});

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(Plan) private plans: Repository<Plan>,
    @InjectRepository(Device) private devices: Repository<Device>,
    @InjectRepository(Coupon) private coupons: Repository<Coupon>,
    private events: EventsGateway,
  ) {}

  /** Price a cart from the catalogue and apply a coupon if one is given. Used by both the quote and the order, so they always agree. */
  private async priceWithCoupon(items: { id: string; qty: number }[], couponInput?: string) {
    const refs = [...new Set(items.map((i) => parseRef(i.id)).filter((r): r is NonNullable<typeof r> => !!r))];
    const [plans, devices] = await Promise.all([
      this.plans.find({ where: { id: In(refs.filter((r) => r.kind === "plan").map((r) => r.ref)) } }),
      this.devices.find({ where: { id: In(refs.filter((r) => r.kind === "device").map((r) => r.ref)) } }),
    ]);
    try {
      const priced = priceCart(items, new Map(plans.map((p) => [p.id, p])), new Map(devices.map((d) => [d.id, d])));
      let discount = 0; let couponCode: string | null = null;
      if (couponInput?.trim()) {
        const coupon = await this.coupons.findOne({ where: { code: normalizeCode(couponInput) } });
        discount = checkCoupon(coupon, priced.deviceTotal);
        couponCode = coupon!.code;
      }
      return { ...priced, discount, couponCode };
    } catch (e) {
      if (e instanceof PricingError || e instanceof CouponError) throw new BadRequestException(e.message);
      throw e;
    }
  }

  /** What the cart costs right now, and what the coupon takes off — nothing is reserved or changed. */
  async quote(dto: QuoteDto) {
    const p = await this.priceWithCoupon(dto.items, dto.coupon);
    return { deviceTotal: p.deviceTotal, monthlyTotal: p.monthlyTotal, discount: p.discount, couponCode: p.couponCode ?? undefined, payNow: p.deviceTotal - p.discount };
  }

  async create(user: User, dto: CreateOrderDto) {
    this.checkDate(dto.preferredDate);
    const priced = await this.priceWithCoupon(dto.items, dto.coupon);

    // no billing block = bill the person who is ordering, at the installation address
    const b = dto.billing;
    const billing = b
      ? { name: b.name, company: b.company ?? "", taxId: b.taxId ?? "", address: b.address, division: b.division, postcode: b.postcode ?? "", phone: normalizePhone(b.phone)!, email: b.email }
      : { name: dto.name, company: user.company ?? "", taxId: user.taxId ?? "", address: dto.address, division: dto.division, postcode: "", phone: normalizePhone(dto.phone)!, email: dto.email };

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        // stock is taken in the same transaction as the order, so two buyers can never both get the last unit
        return await this.orders.manager.transaction(async (m) => {
          await this.takeStock(m, priced.items);
          if (priced.couponCode) await this.takeCoupon(m, priced.couponCode);
          const repo = m.getRepository(Order);
          const order = repo.create({
            id: newOrderId(), userId: user.id, status: "received", payment: dto.payment,
            deviceTotal: priced.deviceTotal, monthlyTotal: priced.monthlyTotal, discount: priced.discount, couponCode: priced.couponCode,
            contactName: dto.name, contactPhone: normalizePhone(dto.phone)!, contactEmail: dto.email,
            address: dto.address, division: dto.division, vehicleReg: dto.vehicleReg, vehicleType: dto.vehicleType,
            preferredDate: dto.preferredDate, note: dto.note || null,
            billingName: billing.name, billingCompany: billing.company, billingTaxId: billing.taxId, billingAddress: billing.address,
            billingDivision: billing.division, billingPostcode: billing.postcode, billingPhone: billing.phone, billingEmail: billing.email,
            items: priced.items.map((i) => Object.assign(new OrderItem(), i)),
          });
          return toOrderView(await repo.save(order));
        }).then((view) => {
          // after the order is safely stored: tell staff who can see orders, live
          this.events.toPermission("orders.view", "order:created", { id: view.id, customer: dto.name, payNow: view.deviceTotal - view.discount, items: view.items.reduce((n, i) => n + i.qty, 0), createdAt: view.createdAt });
          return view;
        });
      } catch (e) { if (!isUniqueViolation(e)) throw e; /* id collision → try another */ }
    }
    throw new ConflictException("Could not create the order, please try again");
  }

  /** Take stock for the device lines; throws if there isn't enough. Products with no stock number are not tracked. */
  private async takeStock(m: EntityManager, items: { itemRef: string; kind: string; name: string; qty: number }[], reopening = false) {
    for (const i of items) {
      const ref = i.kind === "device" ? parseRef(i.itemRef)?.ref : null;
      if (!ref) continue;
      const res = await m.createQueryBuilder().update(Device).set({ stock: () => `"stock" - ${Math.trunc(i.qty)}` })
        .where("id = :id AND stock IS NOT NULL AND stock >= :q", { id: ref, q: i.qty }).execute();
      if (res.affected) continue;
      const row = await m.getRepository(Device).findOne({ where: { id: ref }, select: { id: true, stock: true } });
      if (!row || row.stock === null) continue; // untracked (or product since deleted)
      throw new ConflictException(row.stock <= 0 ? `"${i.name}" is out of stock${reopening ? " — can't reopen this order" : ""}` : `Only ${row.stock} of "${i.name}" left${reopening ? " — can't reopen this order" : ""}`);
    }
  }

  /** Count one more use of the coupon — atomic, so a code limited to N uses can never be used N+1 times. `reopening` skips the checks (the order already had its discount). */
  private async takeCoupon(m: EntityManager, code: string, reopening = false) {
    const res = reopening
      ? await m.query(`UPDATE coupons SET used = used + 1 WHERE code = $1`, [code])
      : await m.query(`UPDATE coupons SET used = used + 1 WHERE code = $1 AND active AND (max_uses IS NULL OR used < max_uses) AND (expires_at IS NULL OR expires_at > now()) RETURNING code`, [code]);
    const hit = Array.isArray(res) ? (Array.isArray(res[0]) ? res[0].length : res.length) : 0;
    if (!reopening && !hit) throw new ConflictException("This coupon was just used up or has expired — please remove it and try again");
  }

  private async returnCoupon(m: EntityManager, code: string) {
    await m.query(`UPDATE coupons SET used = GREATEST(used - 1, 0) WHERE code = $1`, [code]);
  }

  /** Give stock back (order cancelled). */
  private async returnStock(m: EntityManager, items: { itemRef: string; kind: string; qty: number }[]) {
    for (const i of items) {
      const ref = i.kind === "device" ? parseRef(i.itemRef)?.ref : null;
      if (!ref) continue;
      await m.createQueryBuilder().update(Device).set({ stock: () => `"stock" + ${Math.trunc(i.qty)}` }).where("id = :id AND stock IS NOT NULL", { id: ref }).execute();
    }
  }

  /** Move an order to a new status, keeping stock in step (cancel → stock back; reopen → stock taken again). */
  private async changeStatus(id: string, status: OrderStatus, owner?: string) {
    return this.orders.manager.transaction(async (m) => {
      const repo = m.getRepository(Order);
      const order = await repo.findOne({ where: owner ? { id, userId: owner } : { id }, relations: { items: true } });
      if (!order) throw new NotFoundException("Order not found");
      if (owner && order.status !== "received") throw new ConflictException("Only orders that haven't been confirmed yet can be cancelled — please call support");
      if (order.status !== "cancelled" && status === "cancelled") { await this.returnStock(m, order.items); if (order.couponCode) await this.returnCoupon(m, order.couponCode); }
      if (order.status === "cancelled" && status !== "cancelled") { await this.takeStock(m, order.items, true); if (order.couponCode) await this.takeCoupon(m, order.couponCode, true); }
      order.status = status;
      return repo.save(order);
    }).then((saved) => {
      // the customer sees the new status without refreshing, and other staff see the board change
      this.events.toUser(saved.userId, "order:updated", { id: saved.id, status: saved.status });
      this.events.toPermission("orders.view", "order:updated", { id: saved.id, status: saved.status });
      return saved;
    });
  }

  private checkDate(date: string) {
    const d = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== date) throw new BadRequestException("Choose a valid installation date");
    const day = 86_400_000;
    const today = Math.floor(Date.now() / day) * day;
    if (d.getTime() < today - day) throw new BadRequestException("The installation date can't be in the past");
    if (d.getTime() > today + 365 * day) throw new BadRequestException("Choose a date within the next year");
  }

  async listMine(user: User) {
    const rows = await this.orders.find({ where: { userId: user.id }, relations: { items: true }, order: { createdAt: "DESC" }, take: 100 });
    return rows.map(toOrderView);
  }

  async cancel(user: User, id: string) {
    return toOrderView(await this.changeStatus(id, "cancelled", user.id));
  }

  async getMine(user: User, id: string) {
    const o = await this.orders.findOne({ where: { id, userId: user.id }, relations: { items: true } });
    if (!o) throw new NotFoundException("Order not found");
    return toOrderView(o);
  }

  /* ------------------------------------------------------------- admin */
  /** `withCost`: only for staff who may see finance — adds each line's cost and the order's profit. */
  async adminList(q: AdminOrdersQuery, withCost = false) {
    const page = q.page ?? 1, limit = q.limit ?? 20;
    const base = q.status ? { status: q.status } : {};
    const term = q.q?.trim();
    const where = term
      ? [
          { ...base, id: ILike(`%${term.replace(/[%_\\]/g, "\\$&")}%`) },
          { ...base, contactName: ILike(`%${term.replace(/[%_\\]/g, "\\$&")}%`) },
          { ...base, contactPhone: ILike(`%${term.replace(/[%_\\]/g, "\\$&")}%`) },
        ]
      : base;
    const [rows, total] = await this.orders.findAndCount({ where, relations: { items: true, user: true }, order: { createdAt: "DESC" }, skip: (page - 1) * limit, take: limit });
    const counts = await this.orders.createQueryBuilder("o").select("o.status", "status").addSelect("COUNT(*)::int", "n").groupBy("o.status").getRawMany<{ status: OrderStatus; n: number }>();
    return {
      page, limit, total,
      counts: Object.fromEntries(counts.map((c) => [c.status, c.n])),
      orders: rows.map((o) => {
        const v = toOrderView(o);
        const finance = withCost ? { items: v.items.map((it, n) => ({ ...it, cost: o.items[n].unitCost })), profit: o.items.reduce((s, it) => s + (it.unitPrice - it.unitCost) * it.qty, 0) - o.discount } : {};
        return { ...v, ...finance, customer: { id: o.user.id, name: o.user.name, email: o.user.email } };
      }),
    };
  }

  async adminSetStatus(id: string, status: OrderStatus) {
    return toOrderView(await this.changeStatus(id, status));
  }
}
