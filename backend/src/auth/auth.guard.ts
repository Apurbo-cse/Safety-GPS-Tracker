import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { IS_PUBLIC, PERMS, ROLES, type PermRule } from "../common/decorators";
import { RolesService } from "../staff/roles.service";
import { UsersService } from "../users/users.service";
import type { Role, User } from "../users/user.entity";

export interface JwtPayload { sub: string; role: Role }

/** Global guard: every route needs a valid Bearer token unless marked @Public(); then enforces @Roles(). */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService, private users: UsersService, private reflector: Reflector, private roles: RolesService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const targets = [ctx.getHandler(), ctx.getClass()];
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, targets);

    const req = ctx.switchToHttp().getRequest<Request & { user?: User }>();
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

    if (token) {
      try {
        const payload = await this.jwt.verifyAsync<JwtPayload>(token);
        // Load the user every time so deleted accounts and role changes take effect immediately.
        const user = await this.users.findById(payload.sub);
        if (user && !user.disabled) req.user = user; // a disabled account is treated as logged out at once
      } catch {
        /* invalid or expired token → treated as anonymous below */
      }
    }

    if (isPublic) return true;
    if (!req.user) throw new UnauthorizedException("Please log in to continue");

    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES, targets);
    if (roles?.length && !roles.includes(req.user.role)) throw new ForbiddenException("You don't have access to this");

    const rule = this.reflector.getAllAndOverride<PermRule | undefined>(PERMS, targets);
    if (rule?.perms.length) {
      const have = await this.roles.permissionsFor(req.user);
      const ok = rule.mode === "any" ? rule.perms.some((p) => have.includes(p)) : rule.perms.every((p) => have.includes(p));
      if (!ok) throw new ForbiddenException("Your role doesn't allow this");
    }
    return true;
  }
}
