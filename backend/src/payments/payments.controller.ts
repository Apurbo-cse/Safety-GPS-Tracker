import { Body, Controller, Get, HttpCode, Post, Query, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Throttle } from "@nestjs/throttler";
import { IsString, Matches } from "class-validator";
import type { Response } from "express";
import { CurrentUser, Public } from "../common/decorators";
import type { Env } from "../config/env";
import type { User } from "../users/user.entity";
import { PaymentsService } from "./payments.service";

class StartDto { @IsString() @Matches(/^SGT-[A-Z0-9]{6}$/) orderId: string; }

@Controller("payments/bkash")
export class PaymentsController {
  constructor(private payments: PaymentsService, private cfg: ConfigService<Env, true>) {}

  @Throttle({ default: { limit: 20, ttl: 3_600_000 } }) @HttpCode(200) @Post("create")
  create(@CurrentUser() user: User, @Body() dto: StartDto) { return this.payments.create(user, dto.orderId); }

  /** bKash sends the customer's browser here. The page they land on is our website's orders page. */
  @Public() @Get("callback")
  async callback(@Query("paymentID") paymentID: string, @Query("status") status: string, @Res() res: Response) {
    const site = this.cfg.get("FRONTEND_ORIGINS", { infer: true })[0];
    let to = `${site}/orders?pay=failed`;
    try {
      const r = await this.payments.finish(String(paymentID ?? "").slice(0, 64), String(status ?? ""));
      to = `${site}/orders?pay=${r.ok ? "success" : "failed"}${r.orderId ? `&order=${encodeURIComponent(r.orderId)}` : ""}`;
    } catch { /* keep the failed redirect */ }
    res.redirect(302, to);
  }
}
