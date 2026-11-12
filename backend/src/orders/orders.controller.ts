import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { CurrentUser } from "../common/decorators";
import type { User } from "../users/user.entity";
import { CreateOrderDto, QuoteDto } from "./orders.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Get()
  mine(@CurrentUser() user: User) { return this.orders.listMine(user); }

  /** Limited to 20 orders per hour per IP. */
  @Throttle({ default: { limit: 20, ttl: 3_600_000 } }) @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) { return this.orders.create(user, dto); }

  /** Price the cart and check a coupon before checkout (nothing is saved). */
  @HttpCode(200) @Post("quote")
  quote(@Body() dto: QuoteDto) { return this.orders.quote(dto); }

  @Get(":id")
  one(@CurrentUser() user: User, @Param("id") id: string) { return this.orders.getMine(user, id); }

  @HttpCode(200) @Post(":id/cancel")
  cancel(@CurrentUser() user: User, @Param("id") id: string) { return this.orders.cancel(user, id); }
}
