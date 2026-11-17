import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type { EntityManager } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { randomBytes } from "node:crypto";
import { ILike, In, Repository } from "typeorm";
import { Device, Plan } from "../catalog/catalog.entities";
import { divisionOf, THANAS } from "../common/districts";
import { normalizePhone } from "../common/phone";
import type { User } from "../users/user.entity";
import { Order, OrderItem, type OrderStatus } from "./order.entities";
import { checkCoupon, CouponError, normalizeCode } from "./coupon";
import { Coupon } from "./coupon.entity";
import { EventsGateway } from "../events/events.gateway";
import { NotificationsService } from "../notifications/notifications.service";
import { PushService } from "../push/push.service";
import type { AdminOrdersQuery, CreateOrderDto, QuoteDto, UpdateOrderDto } from "./orders.dto";
import { logStock, moveStock } from "../catalog/stock.service";
import { parseRef, priceCart, PricingError } from "./pricing";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 symbols, no 0/O/1/I — 256 % 32 === 0 so no modulo bias
const newOrderId = () => "SGT-" + Array.from(randomBytes(6), (b) => ALPHABET[b % 32]).join("");
const isUniqueViolation = (e: unknown) => (e as { code?: string } | null)?.code === "23505" || (e as { driverError?: { code?: string } } | null)?.driverError?.code === "23505";

/** What a customer reads in a notification for each status. */
const STATUS_WORDS: Record<OrderStatus, string> = { pending: "received", confirmed: "confirmed", scheduled: "installation scheduled", delivered: "delivered", returned: "returned", refunded: "refunded", cancelled: "cancelled" };

/** Shape the website expects (matches its Order / CartItem types). */
export const toOrderView = (o: Order, images?: Map<string, string>) => ({
  id: o.id,
  createdAt: o.createdAt.toISOString(),
  status: o.status,
  payment: o.payment,
  paymentStatus: o.paymentStatus,
  paymentTrxId: o.paymentTrxId ?? undefined,
  paymentRefundTrxId: o.paymentRefundTrxId ?? undefined,
  deviceTotal: o.deviceTotal,
  discount: o.discount,
  couponCode: o.couponCode ?? undefined,
  monthlyTotal: o.monthlyTotal,
  items: (o.items ?? []).map((i) => ({ id: i.itemRef, kind: i.kind, name: i.name, price: i.unitPrice, monthly: i.monthly || undefined, qty: i.qty, image: images?.get(i.itemRef), lineId: i.id, returned: i.returnedQty || undefined })),
  billing: { name: o.billingName, company: o.billingCompany || undefined, taxId: o.billingTaxId || undefined, address: o.billingAddress, division: o.billingDivision, district: o.billingDistrict ?? undefined, postcode: o.billingPostcode || undefined, phone: o.billingPhone, email: o.billingEmail },
  contact: {
    name: o.contactName, phone: o.contactPhone, email: o.contactEmail, address: o.address, division: o.division, district: o.district ?? undefined, thana: o.thana ?? undefined, postcode: o.postcode ?? undefined, area: o.area ?? undefined,
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
    private mail: NotificationsService,
    private push: PushService,
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
    if (dto.area !== "Outside Dhaka" && dto.district !== "Dhaka") throw new BadRequestException("DNCC and DSCC are in Dhaka district — choose Outside Dhaka for other places");
    if (dto.area !== "Outside Dhaka" && !(THANAS[dto.area] as readonly string[]).includes(dto.thana ?? "")) throw new BadRequestException(`Choose a thana in ${dto.area}`);
    const priced = await this.priceWithCoupon(dto.items, dto.coupon);

    // no billing block = bill the person who is ordering, at the installation address
    const b = dto.billing;
    const billing = b
      ? { name: b.name, company: b.company ?? "", taxId: b.taxId ?? "", address: b.address, district: b.district, postcode: b.postcode ?? "", phone: normalizePhone(b.phone)!, email: b.email }
      : { name: dto.name, company: user.company ?? "", taxId: user.taxId ?? "", address: dto.address, district: dto.district, postcode: "", phone: normalizePhone(dto.phone)!, email: dto.email };

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        // stock is taken in the same transaction as the order, so two buyers can never both get the last unit
        const orderId = newOrderId();
        return await this.orders.manager.transaction(async (m) => {
          await this.takeStock(m, priced.items, orderId, user.id);
          if (priced.couponCode) await this.takeCoupon(m, priced.couponCode);
          const repo = m.getRepository(Order);
          const order = repo.create({
            id: orderId, userId: user.id, status: "pending", payment: dto.payment,
            deviceTotal: priced.deviceTotal, monthlyTotal: priced.monthlyTotal, discount: priced.discount, couponCode: priced.couponCode,
            contactName: dto.name, contactPhone: normalizePhone(dto.phone)!, contactEmail: dto.email,
            address: dto.address, division: divisionOf(dto.district), district: dto.district, postcode: dto.postcode || null, thana: dto.area === "Outside Dhaka" ? null : dto.thana, area: dto.area, vehicleReg: dto.vehicleReg, vehicleType: dto.vehicleType,
            preferredDate: dto.preferredDate, note: dto.note || null,
            billingName: billing.name, billingCompany: billing.company, billingTaxId: billing.taxId, billingAddress: billing.address,
            billingDivision: divisionOf(billing.district), billingDistrict: billing.district, billingPostcode: billing.postcode, billingPhone: billing.phone, billingEmail: billing.email,
            items: priced.items.map((i) => Object.assign(new OrderItem(), i)),
          });
          return toOrderView(await repo.save(order));
        }).then((view) => {
          // after the order is safely stored: tell staff who can see orders, live
          void this.announceStock(priced.items);
          this.events.toPermission("orders.view", "order:created", { id: view.id, customer: dto.name, payNow: view.deviceTotal - view.discount, items: view.items.reduce((n, i) => n + i.qty, 0), createdAt: view.createdAt });
          this.mail.orderUpdate(view, view.contact.email); // the confirmation email (a no-op until SMTP is set up)
          this.push.toPermission("orders.view", { title: `New order ${view.id}`, body: `${dto.name} · ${view.items.reduce((n, i) => n + i.qty, 0)} item(s) · ৳${(view.deviceTotal - view.discount).toLocaleString("en-US")}`, url: `/admin/orders/${view.id}`, tag: `order-${view.id}` });
          return view;
        });
      } catch (e) { if (!isUniqueViolation(e)) throw e; /* id collision → try another */ }
    }
    throw new ConflictException("Could not create the order, please try again");
  }

  /** Take stock for the device lines; throws if there isn't enough. Products with no stock number are not tracked. Units already sent back are not taken again. */
  private async takeStock(m: EntityManager, items: { itemRef: string; kind: string; name: string; qty: number; returnedQty?: number }[], orderId: string, userId: string | null, reopening = false) {
    for (const i of items) {
      const ref = i.kind === "device" ? parseRef(i.itemRef)?.ref : null;
      const qty = Math.trunc(i.qty) - (i.returnedQty ?? 0);
      if (!ref || qty <= 0) continue;
      const hit = await moveStock(m, ref, -qty, { reason: reopening ? "reopen" : "order", orderId, userId, note: reopening ? "Order reopened" : "" });
      if (hit !== null) continue;
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

  /** After stock moved: tell staff the new numbers. Customers are not sent this — they only hear about their own orders. */
  private async announceStock(items: { itemRef: string; kind: string }[]) {
    try {
      const ids = [...new Set(items.filter((i) => i.kind === "device").map((i) => parseRef(i.itemRef)?.ref).filter((r): r is string => !!r))];
      if (!ids.length) return;
      const rows = await this.devices.find({ where: { id: In(ids) }, select: { id: true, stock: true } });
      const counted = rows.filter((r) => r.stock !== null); // products whose stock is not counted have nothing to announce
      if (counted.length) this.events.toAnyPermission(["products.manage", "orders.view"], "stock:changed", counted.map((r) => ({ id: r.id, stock: r.stock })));
    } catch { /* live numbers are a nicety — the order is already saved */ }
  }

  /**
   * Give stock back (order cancelled / returned / refunded). Units already sent back through "Return items" are skipped.
   * `damaged`: the goods are not fit to sell again — the history records it, but nothing goes back on the shelf.
   */
  private async returnStock(m: EntityManager, items: { itemRef: string; kind: string; qty: number; returnedQty?: number }[], orderId: string, userId: string | null, reason: "cancel" | "return" | "refund", damaged = false) {
    for (const i of items) {
      const ref = i.kind === "device" ? parseRef(i.itemRef)?.ref : null;
      const qty = Math.trunc(i.qty) - (i.returnedQty ?? 0);
      if (!ref || qty <= 0) continue;
      if (damaged) {
        const cur = await m.getRepository(Device).findOne({ where: { id: ref }, select: { id: true, stock: true } });
        if (cur && cur.stock !== null) await logStock(m, { deviceId: ref, delta: 0, stockAfter: cur.stock, reason: "return_damaged", damaged: qty, orderId, userId, note: "Returned damaged — not put back on the shelf" });
      } else await moveStock(m, ref, qty, { reason, orderId, userId });
    }
  }

  /** Move an order to a new status, keeping stock in step (cancel → stock back; reopen → stock taken again). */
  private async changeStatus(id: string, status: OrderStatus, owner?: string, opts: { damaged?: boolean; userId?: string } = {}) {
    let changed = false, stockMoved = false;
    return this.orders.manager.transaction(async (m) => {
      const repo = m.getRepository(Order);
      const order = await repo.findOne({ where: owner ? { id, userId: owner } : { id }, relations: { items: true } });
      if (!order) throw new NotFoundException("Order not found");
      if (owner && order.status !== "pending") throw new ConflictException("Only orders that haven't been confirmed yet can be cancelled — please call support");
      // cancelled, returned and refunded orders no longer hold stock or a coupon use
      const out = (st: OrderStatus) => st === "cancelled" || st === "returned" || st === "refunded";
      stockMoved = out(order.status) !== out(status);
      if (!out(order.status) && out(status)) { await this.returnStock(m, order.items, order.id, opts.userId ?? owner ?? null, status === "returned" ? "return" : status === "refunded" ? "refund" : "cancel", status === "returned" && !!opts.damaged); if (order.couponCode) await this.returnCoupon(m, order.couponCode); }
      if (out(order.status) && !out(status)) { await this.takeStock(m, order.items, order.id, opts.userId ?? null, true); if (order.couponCode) await this.takeCoupon(m, order.couponCode, true); }
      changed = order.status !== status;
      order.status = status;
      if (status === "refunded" && order.paymentStatus === "paid") order.paymentStatus = "refunded"; // a record only: the money itself is sent back by staff
      return repo.save(order);
    }).then((saved) => {
      // the customer sees the new status without refreshing, and other staff see the board change
      this.events.orderChanged(saved.userId, "order:updated", { id: saved.id, status: saved.status });
      if (stockMoved) void this.announceStock(saved.items);
      if (changed) {
        this.mail.orderUpdate(toOrderView(saved), saved.contactEmail);
        // a notification only when staff made the change — if the customer cancelled it themselves they are already looking at it
        if (!owner) this.push.toUser(saved.userId, { title: `Order ${saved.id}: ${STATUS_WORDS[saved.status]}`, body: "Tap to see your order.", url: `/order/${saved.id}`, tag: `order-${saved.id}` });
      }
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

  /** Current catalogue picture for each cart ref ("plan-x" / "dev-y"). Orders don't store pictures, so a deleted product simply has none. */
  private async imagesFor(orders: Order[]) {
    const refs = [...new Set(orders.flatMap((o) => o.items ?? []).map((i) => parseRef(i.itemRef)).filter((r): r is NonNullable<typeof r> => !!r))];
    const [plans, devices] = await Promise.all([
      this.plans.find({ where: { id: In(refs.filter((r) => r.kind === "plan").map((r) => r.ref)) }, select: { id: true, image: true } }),
      this.devices.find({ where: { id: In(refs.filter((r) => r.kind === "device").map((r) => r.ref)) }, select: { id: true, image: true, images: true } }),
    ]);
    const map = new Map<string, string>();
    for (const p of plans) if (p.image) map.set(`plan-${p.id}`, p.image);
    for (const d of devices) { const img = d.images?.[0] ?? d.image; if (img) map.set(`dev-${d.id}`, img); }
    return map;
  }

  async listMine(user: User) {
    const rows = await this.orders.find({ where: { userId: user.id }, relations: { items: true }, order: { createdAt: "DESC" }, take: 100 });
    const images = await this.imagesFor(rows);
    return rows.map((o) => toOrderView(o, images));
  }

  async cancel(user: User, id: string) {
    return toOrderView(await this.changeStatus(id, "cancelled", user.id));
  }

  async getMine(user: User, id: string) {
    const o = await this.orders.findOne({ where: { id, userId: user.id }, relations: { items: true } });
    if (!o) throw new NotFoundException("Order not found");
    return toOrderView(o, await this.imagesFor([o]));
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
    const images = await this.imagesFor(rows);
    const counts = await this.orders.createQueryBuilder("o").select("o.status", "status").addSelect("COUNT(*)::int", "n").groupBy("o.status").getRawMany<{ status: OrderStatus; n: number }>();
    return {
      page, limit, total,
      counts: Object.fromEntries(counts.map((c) => [c.status, c.n])),
      orders: rows.map((o) => this.adminView(o, withCost, images)),
    };
  }

  /** One order the way staff see it: customer, and (finance only) each line's cost and the profit. */
  private adminView(o: Order, withCost: boolean, images?: Map<string, string>) {
    const v = toOrderView(o, images);
    const finance = withCost ? { items: v.items.map((it, n) => ({ ...it, cost: o.items[n].unitCost })), profit: o.items.reduce((s, it) => s + (it.unitPrice - it.unitCost) * it.qty, 0) - o.discount } : {};
    return { ...v, ...finance, customer: { id: o.user.id, name: o.user.name, email: o.user.email } };
  }

  async adminOne(id: string, withCost = false) {
    const o = await this.orders.findOne({ where: { id }, relations: { items: true, user: true } });
    if (!o) throw new NotFoundException("Order not found");
    return this.adminView(o, withCost, await this.imagesFor([o]));
  }

  /** Change installation details of an order. The place is checked as a whole (area, district and thana must agree). */
  async adminUpdate(id: string, dto: UpdateOrderDto) {
    const o = await this.orders.findOne({ where: { id }, relations: { items: true, user: true } });
    if (!o) throw new NotFoundException("Order not found");
    if (dto.preferredDate) {
      const d = new Date(`${dto.preferredDate}T00:00:00Z`);
      if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== dto.preferredDate) throw new BadRequestException("Choose a valid installation date");
      o.preferredDate = dto.preferredDate;
    }
    const district = dto.district ?? o.district ?? "Dhaka";
    const area = dto.area ?? o.area ?? "Outside Dhaka";
    const thana = dto.area || dto.thana !== undefined ? (dto.thana ?? o.thana ?? "") : (o.thana ?? "");
    if (area !== "Outside Dhaka") {
      if (district !== "Dhaka") throw new BadRequestException("DNCC and DSCC are in Dhaka district — choose Outside Dhaka for other places");
      if (!(THANAS[area] as readonly string[]).includes(thana)) throw new BadRequestException(`Choose a thana in ${area}`);
    }
    o.district = district; o.division = divisionOf(district); o.area = area; o.thana = area === "Outside Dhaka" ? null : thana;
    if (dto.address !== undefined) o.address = dto.address;
    if (dto.postcode !== undefined) o.postcode = dto.postcode || null;
    if (dto.phone) o.contactPhone = normalizePhone(dto.phone)!;
    if (dto.vehicleReg !== undefined) o.vehicleReg = dto.vehicleReg;
    if (dto.vehicleType !== undefined) o.vehicleType = dto.vehicleType;
    if (dto.note !== undefined) o.note = dto.note || null;
    await this.orders.save(o);
    this.events.orderChanged(o.userId, "order:updated", { id: o.id, status: o.status });
    this.push.toUser(o.userId, { title: `Order ${o.id} was updated`, body: `Installation: ${o.preferredDate}`, url: `/order/${o.id}`, tag: `order-${o.id}` });
    return this.adminView(o, false, await this.imagesFor([o]));
  }

  async adminSetStatus(id: string, status: OrderStatus, opts: { damaged?: boolean; userId?: string } = {}) {
    return toOrderView(await this.changeStatus(id, status, undefined, opts));
  }

  /**
   * The customer sent some of the items back. Each line says how many units came back and whether they are damaged
   * (damaged units are recorded but don't go back on the shelf). When every device unit is back the order becomes "returned".
   */
  async returnItems(id: string, lines: { lineId: string; qty: number; damaged?: boolean }[], userId: string, note?: string) {
    const saved = await this.orders.manager.transaction(async (m) => {
      const repo = m.getRepository(Order);
      const order = await repo.findOne({ where: { id }, relations: { items: true } });
      if (!order) throw new NotFoundException("Order not found");
      if (["cancelled", "returned", "refunded"].includes(order.status)) throw new ConflictException(`This order is already ${order.status}`);
      if (order.status !== "delivered") throw new ConflictException("Only a delivered order can have items returned");
      for (const l of lines) {
        const item = order.items.find((x) => x.id === l.lineId);
        if (!item || item.kind !== "device") throw new BadRequestException("That item is not part of this order");
        const left = item.qty - item.returnedQty;
        if (l.qty < 1 || l.qty > left) throw new BadRequestException(`"${item.name}": only ${left} unit${left === 1 ? "" : "s"} can still be returned`);
        item.returnedQty += l.qty;
        const ref = parseRef(item.itemRef)?.ref;
        if (!ref) continue;
        if (l.damaged) {
          const cur = await m.getRepository(Device).findOne({ where: { id: ref }, select: { id: true, stock: true } });
          if (cur && cur.stock !== null) await logStock(m, { deviceId: ref, delta: 0, stockAfter: cur.stock, reason: "return_damaged", damaged: l.qty, orderId: id, userId, note: note ?? "Returned damaged — not put back on the shelf" });
        } else await moveStock(m, ref, l.qty, { reason: "return", orderId: id, userId, note });
      }
      await m.getRepository(OrderItem).save(order.items);
      const devices = order.items.filter((x) => x.kind === "device");
      if (devices.length === order.items.length && devices.every((x) => x.returnedQty >= x.qty)) {
        order.status = "returned";
        if (order.couponCode) await this.returnCoupon(m, order.couponCode);
        await repo.save(order);
      }
      return order;
    });
    this.events.orderChanged(saved.userId, "order:updated", { id: saved.id, status: saved.status });
    void this.announceStock(saved.items);
    return toOrderView(saved);
  }
}
