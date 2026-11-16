import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { normalizePhone } from "../common/phone";
import { toPublic, UsersService } from "../users/users.service";
import { EventsGateway } from "../events/events.gateway";
import { RolesService } from "../staff/roles.service";
import type { User } from "../users/user.entity";
import type { LoginDto, RegisterDto } from "./auth.dto";
import type { JwtPayload } from "./auth.guard";

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService, private roles: RolesService, private events: EventsGateway) {}

  private async session(user: User) {
    const payload: JwtPayload = { sub: user.id, role: user.role };
    return { accessToken: await this.jwt.signAsync(payload), user: { ...toPublic(user), permissions: await this.roles.permissionsFor(user) } };
  }

  async register(dto: RegisterDto) {
    const user = await this.users.create({ name: dto.name, email: dto.email, phone: normalizePhone(dto.mobile)!, password: dto.password, vehicleType: dto.vehicleType });
    this.events.toPermission("customers.view", "user:created", { id: user.id, name: user.name, createdAt: user.createdAt }); // staff see new sign-ups live
    return this.session(user);
  }

  async login(dto: LoginDto) {
    return this.session(await this.users.verifyLogin(dto.identifier, dto.password));
  }
}
