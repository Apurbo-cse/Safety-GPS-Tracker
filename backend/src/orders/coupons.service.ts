import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { COUPON_CODE, normalizeCode } from "./coupon";
import { Coupon } from "./coupon.entity";
import type { CouponDto } from "./orders.dto";

@Injectable()
export class CouponsService {
  constructor(@InjectRepository(Coupon) private coupons: Repository<Coupon>) {}

  list() { return this.coupons.find({ order: { createdAt: "DESC" } }); }

  async upsert(rawCode: string, dto: CouponDto) {
    const code = normalizeCode(rawCode);
    if (!COUPON_CODE.test(code)) throw new BadRequestException("A code is 3–30 letters, numbers or dashes");
    if (dto.kind === "percent" && dto.value > 100) throw new BadRequestException("A percentage can't be more than 100");
    const prev = await this.coupons.findOne({ where: { code } });
    // `used` belongs to the orders, so editing a coupon never resets it
    return this.coupons.save(this.coupons.create({ code, kind: dto.kind, value: dto.value, minTotal: dto.minTotal ?? 0, maxUses: dto.maxUses ?? null, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null, active: dto.active, note: dto.note ?? "", used: prev?.used ?? 0 }));
  }

  async remove(rawCode: string) {
    const res = await this.coupons.delete({ code: normalizeCode(rawCode) });
    if (!res.affected) throw new NotFoundException("Coupon not found");
  }
}
