import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ALL_PERMISSIONS, isPermission, OWNER_ROLE, type Permission } from "../common/permissions";
import type { User } from "../users/user.entity";
import { StaffRole } from "./role.entity";

const TTL_MS = 30_000;

/** Looks up what a staff member may do. Role rows are cached for 30 s (cleared at once when a role is edited on this server). */
@Injectable()
export class RolesService {
  private cache = new Map<string, { at: number; perms: Permission[] }>();
  constructor(@InjectRepository(StaffRole) private repo: Repository<StaffRole>) {}

  invalidate() { this.cache.clear(); }

  /** Permissions of a user: none for customers, everything for owners, otherwise the role's list. */
  async permissionsFor(user: Pick<User, "role" | "staffRoleId">): Promise<Permission[]> {
    if (user.role !== "admin") return [];
    const roleId = user.staffRoleId ?? OWNER_ROLE;
    if (roleId === OWNER_ROLE) return ALL_PERMISSIONS;
    const hit = this.cache.get(roleId);
    if (hit && Date.now() - hit.at < TTL_MS) return hit.perms;
    const row = await this.repo.findOne({ where: { id: roleId } });
    const perms = (row?.permissions ?? []).filter(isPermission);
    this.cache.set(roleId, { at: Date.now(), perms });
    return perms;
  }
}
