import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { normalizePhone } from "../common/phone";
import { withDefaults, type UserSettings } from "./settings";
import { User } from "./user.entity";
import type { ChangePasswordDto, UpdateProfileDto } from "./users.dto";

const BCRYPT_COST = 12;
/** Compared against when the account doesn't exist, so login time doesn't reveal which emails are registered. */
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", BCRYPT_COST);
const isUniqueViolation = (e: unknown) => (e as { code?: string } | null)?.code === "23505" || (e as { driverError?: { code?: string } } | null)?.driverError?.code === "23505";
const CONFLICT = "An account with this email or mobile number already exists";

export interface PublicUser {
  id: string; name: string; email: string; phone: string | null; role: User["role"]; staffRoleId: string | null;
  vehicleType: string | null; company: string; address: string; division: string; taxId: string; billingAddress: string; billingDivision: string; billingPostcode: string; settings: UserSettings; createdAt: Date;
}
export const toPublic = (u: User): PublicUser => ({
  id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, staffRoleId: u.role === "admin" ? (u.staffRoleId ?? "owner") : null, vehicleType: u.vehicleType,
  company: u.company, address: u.address, division: u.division, taxId: u.taxId, billingAddress: u.billingAddress, billingDivision: u.billingDivision, billingPostcode: u.billingPostcode, settings: withDefaults(u.settings), createdAt: u.createdAt,
});

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findById(id: string) { return this.repo.findOne({ where: { id } }); }

  async create(input: { name: string; email: string; phone: string; password: string; vehicleType?: string; role?: User["role"] }) {
    const exists = await this.repo.exists({ where: [{ email: input.email }, { phone: input.phone }] });
    if (exists) throw new ConflictException(CONFLICT);
    const user = this.repo.create({
      name: input.name, email: input.email, phone: input.phone, vehicleType: input.vehicleType || null,
      passwordHash: await bcrypt.hash(input.password, BCRYPT_COST), role: input.role ?? "customer",
    });
    try { return await this.repo.save(user); } catch (e) { if (isUniqueViolation(e)) throw new ConflictException(CONFLICT); throw e; }
  }

  /** Verify credentials by email or mobile number. Always the same error for "no such user" and "wrong password". */
  async verifyLogin(identifier: string, password: string): Promise<User> {
    const id = identifier.trim();
    const phone = normalizePhone(id);
    const qb = this.repo.createQueryBuilder("u").addSelect("u.passwordHash");
    if (id.includes("@")) qb.where("u.email = :e", { e: id.toLowerCase() });
    else if (phone) qb.where("u.phone = :p", { p: phone });
    else qb.where("1 = 0");
    const user = await qb.getOne();
    const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok) throw new UnauthorizedException("Incorrect email/mobile number or password");
    if (user.disabled) throw new ForbiddenException("This account has been disabled. Please contact support.");
    return user;
  }

  async updateProfile(user: User, dto: UpdateProfileDto) {
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.phone !== undefined) user.phone = dto.phone === "" ? null : normalizePhone(dto.phone);
    if (dto.company !== undefined) user.company = dto.company;
    if (dto.address !== undefined) user.address = dto.address;
    if (dto.division !== undefined) user.division = dto.division;
    if (dto.taxId !== undefined) user.taxId = dto.taxId;
    if (dto.billingAddress !== undefined) user.billingAddress = dto.billingAddress;
    if (dto.billingDivision !== undefined) user.billingDivision = dto.billingDivision;
    if (dto.billingPostcode !== undefined) user.billingPostcode = dto.billingPostcode;
    try { return await this.repo.save(user); } catch (e) { if (isUniqueViolation(e)) throw new ConflictException("That email or mobile number is already used by another account"); throw e; }
  }

  async updateSettings(user: User, settings: UserSettings) {
    user.settings = withDefaults(settings);
    return this.repo.save(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.repo.createQueryBuilder("u").addSelect("u.passwordHash").where("u.id = :id", { id: userId }).getOne();
    if (!user || !(await bcrypt.compare(dto.current, user.passwordHash))) throw new UnauthorizedException("Your current password is incorrect");
    user.passwordHash = await bcrypt.hash(dto.next, BCRYPT_COST);
    await this.repo.save(user);
  }

  async remove(user: User) { await this.repo.delete({ id: user.id }); }
}
