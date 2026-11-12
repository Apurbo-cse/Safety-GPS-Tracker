import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Public } from "../common/decorators";
import { LoginDto, RegisterDto } from "./auth.dto";
import { AuthService } from "./auth.service";

/** Brute-force protection: 10 attempts per minute per IP on credential endpoints. */
const STRICT = { default: { limit: 10, ttl: 60_000 } };

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public() @Throttle(STRICT) @Post("register")
  register(@Body() dto: RegisterDto) { return this.auth.register(dto); }

  @Public() @Throttle(STRICT) @HttpCode(200) @Post("login")
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }
}
