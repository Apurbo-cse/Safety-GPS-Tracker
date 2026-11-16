import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { Env } from "../config/env";
import { EventsGateway } from "../events/events.gateway";
import { Order } from "../orders/order.entities";
import type { User } from "../users/user.entity";

interface BkashJson { statusCode?: string; statusMessage?: string; id_token?: string; expires_in?: number | string; paymentID?: string; bkashURL?: string; transactionStatus?: string; trxID?: string; amount?: string; merchantInvoiceNumber?: string }

/** bKash tokenized checkout. The amount is always read from our own order — never from the browser. */
@Injectable()
export class PaymentsService {
  private token: { value: string; expires: number } | null = null;

  constructor(
    private cfg: ConfigService<Env, true>,
    @InjectRepository(Order) private orders: Repository<Order>,
    private events: EventsGateway,
  ) {}

  private get enabled() { return !!(this.cfg.get("BKASH_USERNAME", { infer: true }) && this.cfg.get("BKASH_APP_KEY", { infer: true })); }

  private async call(path: string, body: unknown, withToken = true): Promise<BkashJson> {
    const key = this.cfg.get("BKASH_APP_KEY", { infer: true });
    const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
    if (withToken) { headers.Authorization = await this.idToken(); headers["X-APP-Key"] = key; }
    else { headers.username = this.cfg.get("BKASH_USERNAME", { infer: true }); headers.password = this.cfg.get("BKASH_PASSWORD", { infer: true }); }
    const res = await fetch(this.cfg.get("BKASH_BASE_URL", { infer: true }) + path, { method: "POST", headers, body: JSON.stringify(body), signal: AbortSignal.timeout(20_000) });
    const json = (await res.json().catch(() => ({}))) as BkashJson;
    if (!res.ok) throw new ServiceUnavailableException("bKash is not reachable right now");
    return json;
  }

  private async idToken() {
    if (this.token && this.token.expires > Date.now()) return this.token.value;
    const j = await this.call("/tokenized/checkout/token/grant", { app_key: this.cfg.get("BKASH_APP_KEY", { infer: true }), app_secret: this.cfg.get("BKASH_APP_SECRET", { infer: true }) }, false);
    if (!j.id_token) throw new ServiceUnavailableException("bKash rejected the merchant credentials");
    this.token = { value: j.id_token, expires: Date.now() + (Number(j.expires_in || 3600) - 300) * 1000 }; // refresh 5 minutes early
    return j.id_token;
  }

  /** Start a payment for one of the signed-in customer's orders; returns the bKash page to send them to. */
  async create(user: User, orderId: string) {
    if (!this.enabled) throw new ServiceUnavailableException("bKash payment is not set up yet");
    const order = await this.orders.findOne({ where: { id: orderId, userId: user.id } });
    if (!order) throw new NotFoundException("Order not found");
    if (order.payment !== "bKash") throw new BadRequestException("This order is not a bKash order");
    if (order.status === "cancelled") throw new ConflictException("This order was cancelled");
    if (order.paymentStatus === "paid") throw new ConflictException("This order is already paid");
    const amount = order.deviceTotal - order.discount;
    if (amount <= 0) throw new BadRequestException("Nothing to pay on this order");

    const j = await this.call("/tokenized/checkout/create", {
      mode: "0011", payerReference: order.contactPhone, callbackURL: `${this.cfg.get("API_PUBLIC_URL", { infer: true })}/payments/bkash/callback`,
      amount: amount.toFixed(2), currency: "BDT", intent: "sale", merchantInvoiceNumber: order.id,
    });
    if (!j.paymentID || !j.bkashURL) throw new BadRequestException(j.statusMessage || "bKash could not start the payment");
    order.paymentId = j.paymentID;
    await this.orders.save(order);
    return { bkashURL: j.bkashURL };
  }

  /** bKash sends the customer back with ?paymentID & status. We confirm with bKash ourselves instead of trusting the URL. */
  async finish(paymentID: string, status: string): Promise<{ orderId: string | null; ok: boolean }> {
    const order = paymentID ? await this.orders.findOne({ where: { paymentId: paymentID } }) : null;
    if (!order) return { orderId: null, ok: false };
    if (order.paymentStatus === "paid") return { orderId: order.id, ok: true };
    if (status !== "success") { order.paymentStatus = "failed"; await this.orders.save(order); return { orderId: order.id, ok: false }; }

    let j = await this.call("/tokenized/checkout/execute", { paymentID });
    if (j.transactionStatus !== "Completed" && j.statusCode && j.statusCode !== "0000") j = await this.call("/tokenized/checkout/payment/status", { paymentID }).catch(() => j);
    const paid = j.transactionStatus === "Completed" && Number(j.amount) === order.deviceTotal - order.discount && j.merchantInvoiceNumber === order.id;
    order.paymentStatus = paid ? "paid" : "failed";
    if (paid) order.paymentTrxId = j.trxID ?? null;
    await this.orders.save(order);
    if (paid) {
      this.events.toUser(order.userId, "order:updated", { id: order.id, status: order.status });
      this.events.toPermission("orders.view", "order:updated", { id: order.id, status: order.status });
    }
    return { orderId: order.id, ok: paid };
  }
}
