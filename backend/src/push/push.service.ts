import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import * as webpush from "web-push";
import type { Env } from "../config/env";
import type { Permission } from "../common/permissions";
import { RolesService } from "../staff/roles.service";
import { User } from "../users/user.entity";
import { PushSubscriptionRow } from "./push.entity";

export interface PushMessage { title: string; body: string; /** where a tap on the notification goes */ url: string; /** same tag = the newer one replaces the older */ tag?: string }

/**
 * Browser notifications (Web Push). Off until the VAPID keys are in .env. Like the emails, a failure here never touches an order:
 * dead subscriptions (the person turned notifications off or uninstalled) are removed, anything else is logged.
 */
@Injectable()
export class PushService implements OnModuleInit {
  private log = new Logger("Push");
  private ready = false;

  constructor(
    private cfg: ConfigService<Env, true>,
    @InjectRepository(PushSubscriptionRow) private subs: Repository<PushSubscriptionRow>,
    @InjectRepository(User) private users: Repository<User>,
    private roles: RolesService,
  ) {}

  onModuleInit() {
    const pub = this.cfg.get("VAPID_PUBLIC_KEY", { infer: true }), priv = this.cfg.get("VAPID_PRIVATE_KEY", { infer: true });
    if (!pub || !priv) { this.log.log("Push notifications are off (set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to turn them on)"); return; }
    webpush.setVapidDetails(this.cfg.get("VAPID_SUBJECT", { infer: true }) || "mailto:admin@localhost", pub, priv);
    this.ready = true;
  }

  /** The public key the browser needs to subscribe; null when push is off. */
  publicKey() { return this.ready ? this.cfg.get("VAPID_PUBLIC_KEY", { infer: true }) : null; }

  async subscribe(userId: string, sub: { endpoint: string; keys: { p256dh: string; auth: string } }, userAgent = "") {
    // the same browser may re-subscribe (or another person may log in on it): the endpoint belongs to whoever subscribed last
    await this.subs.upsert({ userId, endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth, userAgent: userAgent.slice(0, 200) }, ["endpoint"]);
    return { ok: true };
  }

  async unsubscribe(userId: string, endpoint: string) {
    await this.subs.delete({ userId, endpoint });
    return { ok: true };
  }

  /** Send to every browser one person has registered. Returns at once (fire and forget). */
  toUser(userId: string, msg: PushMessage) { if (this.ready) void this.deliver({ userId }, msg); }

  /** Send to every staff member who holds `permission` (owners hold all of them). */
  toPermission(permission: Permission, msg: PushMessage) {
    if (!this.ready) return;
    void (async () => {
      const staff = await this.users.find({ where: { role: "admin", disabled: false }, select: { id: true, role: true, staffRoleId: true } });
      const ids: string[] = [];
      for (const u of staff) if ((await this.roles.permissionsFor(u)).includes(permission)) ids.push(u.id);
      if (ids.length) await this.deliver({ userId: In(ids) }, msg);
    })().catch((e: Error) => this.log.warn(`Could not look up staff to notify: ${e.message}`));
  }

  private async deliver(where: { userId: string | ReturnType<typeof In<string>> }, msg: PushMessage) {
    try {
      const rows = await this.subs.find({ where });
      const body = JSON.stringify(msg);
      await Promise.all(rows.map(async (r) => {
        try { await webpush.sendNotification({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }, body, { TTL: 60 * 60 * 24 }); }
        catch (e) {
          const code = (e as { statusCode?: number }).statusCode;
          if (code === 404 || code === 410) await this.subs.delete({ id: r.id }); // the browser is gone
          else this.log.warn(`Push failed (${code ?? "network"}): ${(e as Error).message}`);
        }
      }));
    } catch (e) { this.log.warn(`Push delivery error: ${(e as Error).message}`); }
  }
}
