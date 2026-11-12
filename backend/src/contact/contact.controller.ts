import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Public } from "../common/decorators";
import { ContactDto } from "./contact.dto";
import { ContactService } from "./contact.service";

@Controller("contact")
export class ContactController {
  constructor(private contact: ContactService) {}

  /** Open to anyone, so it is limited to 5 messages per hour per IP. */
  @Public() @Throttle({ default: { limit: 5, ttl: 3_600_000 } }) @HttpCode(201) @Post()
  send(@Body() dto: ContactDto) { return this.contact.create(dto); }
}
