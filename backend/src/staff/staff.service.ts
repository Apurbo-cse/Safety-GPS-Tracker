import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { normalizePhone } from "../common/phone";
import { isPermission, OWNER_ROLE, PERMISSIONS } from "../common/permissions";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import type { AddStaffDto, RoleDto, UpdateStaffDto } from "./staff.dto";
import { StaffRole } from "./role.entity";
import { RolesService } from "./roles.service";

const view = (u: User) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, roleId: u.staffRoleId ?? OWNER_ROLE, disabled: u.disabled, createdAt: u.createdAt });

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(StaffRole) private roles: Repository<StaffRole>,
    private usersSvc: UsersService,
    private cache: RolesService,
  ) {}

  /* ------------------------------------------------------------- staff */
  async list() {
    const rows = await this.users.find({ where: { role: "admin" }, order: { createdAt: "ASC" } });
    return rows.map(view);
  }

  private async roleOrThrow(id: string) {
    const r = await this.roles.findOne({ where: { id } });
    if (!r && id !== OWNER_ROLE) throw new BadRequestException("That role doesn't exist");
    return r;
  }

  /** How many enabled owners there are (staff with no role set count as owners). */
  private async enabledOwners(excludeId?: string) {
    const qb = this.users.createQueryBuilder("u").where("u.role = 'admin' AND u.disabled = false AND (u.staff_role_id IS NULL OR u.staff_role_id = :o)", { o: OWNER_ROLE });
    if (excludeId) qb.andWhere("u.id <> :id", { id: excludeId });
    return qb.getCount();
  }

  async add(dto: AddStaffDto) {
    await this.roleOrThrow(dto.roleId);
    const existing = await this.users.findOne({ where: { email: dto.email } });
    if (existing) {
      if (existing.role === "admin") throw new ConflictException("That person is already on the staff");
      existing.role = "admin"; existing.staffRoleId = dto.roleId; existing.disabled = false;
      return view(await this.users.save(existing));
    }
    if (!dto.name || !dto.mobile || !dto.password) throw new BadRequestException("For a new person, give a name, mobile number and password");
    const u = await this.usersSvc.create({ name: dto.name, email: dto.email, phone: normalizePhone(dto.mobile)!, password: dto.password, role: "admin" });
    u.staffRoleId = dto.roleId;
    return view(await this.users.save(u));
  }

  async update(actor: User, id: string, dto: UpdateStaffDto) {
    const u = await this.users.findOne({ where: { id, role: "admin" } });
    if (!u) throw new NotFoundException("Staff member not found");
    if (u.id === actor.id) throw new BadRequestException("You can't change your own role or disable yourself — ask another owner");
    const wasOwner = (u.staffRoleId ?? OWNER_ROLE) === OWNER_ROLE && !u.disabled;
    if (dto.roleId !== undefined) { await this.roleOrThrow(dto.roleId); u.staffRoleId = dto.roleId; }
    if (dto.disabled !== undefined) u.disabled = dto.disabled;
    const stillOwner = (u.staffRoleId ?? OWNER_ROLE) === OWNER_ROLE && !u.disabled;
    if (wasOwner && !stillOwner && (await this.enabledOwners(u.id)) === 0) throw new BadRequestException("There must always be at least one active owner");
    return view(await this.users.save(u));
  }

  /** Removes staff access; the person stays a customer. */
  async remove(actor: User, id: string) {
    const u = await this.users.findOne({ where: { id, role: "admin" } });
    if (!u) throw new NotFoundException("Staff member not found");
    if (u.id === actor.id) throw new BadRequestException("You can't remove yourself");
    if ((u.staffRoleId ?? OWNER_ROLE) === OWNER_ROLE && !u.disabled && (await this.enabledOwners(u.id)) === 0) throw new BadRequestException("There must always be at least one active owner");
    u.role = "customer"; u.staffRoleId = null; u.disabled = false;
    await this.users.save(u);
  }

  /** Staff-only password reset (e.g. someone forgot theirs). */
  async setPassword(id: string, password: string) {
    const u = await this.users.findOne({ where: { id, role: "admin" } });
    if (!u) throw new NotFoundException("Staff member not found");
    u.passwordHash = await bcrypt.hash(password, 12);
    await this.users.save(u);
  }

  /* ------------------------------------------------------------- roles */
  async listRoles() {
    const [roles, staff] = await Promise.all([this.roles.find({ order: { system: "DESC", name: "ASC" } }), this.users.find({ where: { role: "admin" } })]);
    return {
      permissions: Object.entries(PERMISSIONS).map(([id, label]) => ({ id, label })),
      roles: roles.map((r) => ({ id: r.id, name: r.name, description: r.description, permissions: r.permissions.filter(isPermission), system: r.system, staff: staff.filter((s) => (s.staffRoleId ?? OWNER_ROLE) === r.id).length })),
    };
  }

  async upsertRole(id: string, dto: RoleDto) {
    if (id === OWNER_ROLE) throw new BadRequestException("The Owner role can't be changed");
    const unknown = dto.permissions.filter((p) => !isPermission(p));
    if (unknown.length) throw new BadRequestException(`Unknown permission: ${unknown[0]}`);
    const existing = await this.roles.findOne({ where: { id } });
    const saved = await this.roles.save(this.roles.create({ id, name: dto.name, description: dto.description ?? "", permissions: [...new Set(dto.permissions)], system: existing?.system ?? false }));
    this.cache.invalidate();
    return saved;
  }

  async removeRole(id: string) {
    const r = await this.roles.findOne({ where: { id } });
    if (!r) throw new NotFoundException("Role not found");
    if (r.system || id === OWNER_ROLE) throw new BadRequestException("Built-in roles can't be deleted");
    const used = await this.users.count({ where: { role: "admin", staffRoleId: id } });
    if (used) throw new ConflictException(`${used} staff member${used === 1 ? " has" : "s have"} this role — give them another role first`);
    await this.roles.delete({ id });
    this.cache.invalidate();
  }
}
