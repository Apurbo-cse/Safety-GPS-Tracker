import { Transform, Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEmail, IsISO8601, IsIn, IsInt, IsOptional, IsString, Length, Matches, Max, MaxLength, Min, ValidateNested } from "class-validator";
import { IsBdMobile } from "../common/bd-mobile";
import { ORDER_STATUSES, PAYMENT_METHODS, type OrderStatus, type PaymentMethod } from "./order.entities";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);

export class CartLineDto {
  @IsString() @Matches(/^(plan|dev)-[a-z0-9-]{2,70}$/) id: string;
  @IsInt() @Min(1) @Max(50) qty: number;
}

const DIVISIONS = ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"];

/** Billing details. Leave the whole block out to bill the person named in the order. */
export class BillingDto {
  @Transform(trim) @IsString() @Length(2, 120) name: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(120) company?: string;
  @IsOptional() @Transform(trim) @IsString() @Matches(/^[A-Za-z0-9-]{0,30}$/, { message: "Tax / BIN number can only have letters, digits and dashes" }) taxId?: string;
  @Transform(trim) @IsString() @Length(6, 240) address: string;
  @IsIn(DIVISIONS) division: string;
  @IsOptional() @Transform(trim) @IsString() @Matches(/^\d{0,10}$/, { message: "Postcode must be digits" }) postcode?: string;
  @IsBdMobile() phone: string;
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value)) @IsEmail() @MaxLength(254) email: string;
}

export class CreateOrderDto {
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(20) @ValidateNested({ each: true }) @Type(() => CartLineDto)
  items: CartLineDto[];

  @IsIn(PAYMENT_METHODS as unknown as string[]) payment: PaymentMethod;

  @Transform(trim) @IsString() @Length(2, 120) name: string;
  @IsBdMobile() phone: string;
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value)) @IsEmail() @MaxLength(254) email: string;
  @Transform(trim) @IsString() @Length(6, 240) address: string;
  @IsIn(["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"]) division: string;
  @Transform(trim) @IsString() @Length(3, 60) vehicleReg: string;
  @Transform(trim) @IsString() @Length(2, 60) vehicleType: string;
  /** YYYY-MM-DD */
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "preferredDate must be YYYY-MM-DD" }) preferredDate: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(300) note?: string;
  @IsOptional() @ValidateNested() @Type(() => BillingDto) billing?: BillingDto;
  /** Discount code (case-insensitive). */
  @IsOptional() @Transform(trim) @IsString() @MaxLength(30) coupon?: string;
}

/** Price a cart (and an optional coupon) without placing an order — the checkout page's "Apply" button. */
export class QuoteDto {
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(20) @ValidateNested({ each: true }) @Type(() => CartLineDto)
  items: CartLineDto[];
  @IsOptional() @Transform(trim) @IsString() @MaxLength(30) coupon?: string;
}

export class CouponDto {
  @IsIn(["percent", "fixed"]) kind: "percent" | "fixed";
  @IsInt() @Min(1) @Max(10_000_000) value: number;
  @IsOptional() @IsInt() @Min(0) @Max(10_000_000) minTotal?: number;
  @IsOptional() @IsInt() @Min(1) @Max(1_000_000) maxUses?: number | null;
  @IsOptional() @IsISO8601() expiresAt?: string | null;
  @IsBoolean() active: boolean;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(120) note?: string;
}

export class UpdateStatusDto {
  @IsIn(ORDER_STATUSES as unknown as string[]) status: OrderStatus;
}

export class AdminOrdersQuery {
  @IsOptional() @IsIn(ORDER_STATUSES as unknown as string[]) status?: OrderStatus;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(80) q?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}
