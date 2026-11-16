import { Body, Controller, Get, HttpCode, Post, Headers } from "@nestjs/common";
import { CurrentUser, Public } from "../common/decorators";
import type { User } from "../users/user.entity";
import { SubscribeDto, UnsubscribeDto } from "./push.dto";
import { PushService } from "./push.service";

@Controller("push")
export class PushController {
  constructor(private push: PushService) {}

  /** The browser asks for this before it subscribes. `key` is null when notifications are not set up on the server. */
  @Public() @Get("key")
  key() { return { key: this.push.publicKey() }; }

  @HttpCode(200) @Post("subscribe")
  subscribe(@CurrentUser() user: User, @Body() dto: SubscribeDto, @Headers("user-agent") ua?: string) { return this.push.subscribe(user.id, dto, ua); }

  @HttpCode(200) @Post("unsubscribe")
  unsubscribe(@CurrentUser() user: User, @Body() dto: UnsubscribeDto) { return this.push.unsubscribe(user.id, dto.endpoint); }
}
