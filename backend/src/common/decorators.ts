import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import type { Role, User } from "../users/user.entity";
import type { Permission } from "./permissions";

export const IS_PUBLIC = "isPublic";
/** Skip authentication for this route. */
export const Public = () => SetMetadata(IS_PUBLIC, true);

export const PERMS = "permissions";
export interface PermRule { mode: "all" | "any"; perms: Permission[] }
/** The signed-in staff member must hold ALL of these permissions. */
export const Permissions = (...perms: Permission[]) => SetMetadata(PERMS, { mode: "all", perms } satisfies PermRule);
/** The signed-in staff member must hold AT LEAST ONE of these permissions. */
export const AnyPermission = (...perms: Permission[]) => SetMetadata(PERMS, { mode: "any", perms } satisfies PermRule);

export const ROLES = "roles";
/** Restrict a route to the given roles (checked after authentication). */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES, roles);

/** The authenticated user (loaded fresh from the database for every request). */
export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): User => ctx.switchToHttp().getRequest().user);
