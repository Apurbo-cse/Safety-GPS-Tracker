import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, type Transporter } from "nodemailer";
import type { Env } from "../config/env";
import { orderMail, type MailOrder } from "./templates";

/**
 * Emails to customers. Switched off (and silent) until SMTP_HOST and MAIL_FROM are set.
 * Sending never blocks or breaks an order: failures are logged and forgotten.
 */
@Injectable()
export class NotificationsService {
  private log = new Logger("Mail");
  private transport: Transporter | null | undefined;

  constructor(private cfg: ConfigService<Env, true>) {}

  private get mailer() {
    if (this.transport !== undefined) return this.transport;
    const host = this.cfg.get("SMTP_HOST", { infer: true }), from = this.cfg.get("MAIL_FROM", { infer: true });
    if (!host || !from) { this.log.log("Order emails are off (set SMTP_HOST and MAIL_FROM to turn them on)"); return (this.transport = null); }
    const user = this.cfg.get("SMTP_USER", { infer: true });
    return (this.transport = createTransport({
      host, port: this.cfg.get("SMTP_PORT", { infer: true }), secure: this.cfg.get("SMTP_SECURE", { infer: true }),
      auth: user ? { user, pass: this.cfg.get("SMTP_PASS", { infer: true }) } : undefined,
      connectionTimeout: 10_000, socketTimeout: 15_000,
    }));
  }

  /** Tell the customer about an order (placed or status changed). Returns at once; the mail goes out in the background. */
  orderUpdate(order: MailOrder & { contact: MailOrder["contact"] & { email?: string } }, to: string) {
    const mailer = this.mailer;
    if (!mailer || !to) return;
    const urls = this.cfg.get("FRONTEND_ORIGINS", { infer: true });
    const mail = orderMail(order, { name: this.cfg.get("MAIL_SITE_NAME", { infer: true }), url: urls[0], phone: this.cfg.get("MAIL_SITE_PHONE", { infer: true }) || undefined });
    void mailer.sendMail({ from: this.cfg.get("MAIL_FROM", { infer: true }), to, subject: mail.subject, text: mail.text, html: mail.html })
      .then(() => this.log.log(`${order.id} (${order.status}) → ${to.replace(/^(.).*(@.*)$/, "$1***$2")}`))
      .catch((e: Error) => this.log.warn(`Could not email ${order.id}: ${e.message}`));
  }
}
