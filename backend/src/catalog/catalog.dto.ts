import { Transform, Type } from "class-transformer";
import { sanitizeRich } from "../common/html";
import { HasText } from "../common/has-text";
import { VEHICLE_TYPES } from "../common/vehicles";
import { ArrayMaxSize, IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Length, Matches, Max, MaxLength, Min, ValidateNested } from "class-validator";

const MONEY = 10_000_000;
/** An uploaded picture (media:<uuid>) or a file in the website's /public folder. */
const IMAGE_REF = /^(media:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|\/(?!.*\.\.)[A-Za-z0-9/_.-]{2,230})$/;

export class PlanDto {
  @IsString() @Length(2, 120) name: string;
  @IsInt() @Min(0) @Max(MONEY) devicePrice: number;
  @IsInt() @Min(0) @Max(MONEY) monthlyCharge: number;
  @IsArray() @ArrayMaxSize(100) @IsString({ each: true }) @MaxLength(120, { each: true }) features: string[];
  @IsOptional() @IsString() @MaxLength(80) highlight?: string | null;
  @IsOptional() @IsString() @Matches(/^\/(?!.*\.\.)[A-Za-z0-9/_.-]{2,230}$/, { message: "Image must be a path inside /public, e.g. /img/products/my-product.png" }) image?: string | null;
  @IsOptional() @IsString() @MaxLength(120) siteTitle?: string | null;
  @IsOptional() @IsInt() @Min(0) sourceNo?: number;
  @IsOptional() @IsArray() @ArrayMaxSize(VEHICLE_TYPES.length) @IsIn(VEHICLE_TYPES, { each: true }) vehicles?: string[];
  /** Formatted description (HTML from the editor — cleaned on the server). */
  @IsOptional() @Transform(({ value }) => sanitizeRich(value)) @IsString() @MaxLength(60000) description?: string;
  /** Our cost (admin only). */
  @IsOptional() @IsInt() @Min(0) @Max(MONEY) cost?: number | null;
  @IsOptional() @IsInt() sort?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

class SpecDto {
  @IsString() @MaxLength(80) label: string;
  @IsString() @MaxLength(200) value: string;
}

export class DeviceDto {
  @IsString() @Length(2, 120) name: string;
  @IsString() @MaxLength(80) category: string;
  @IsString() @MaxLength(80) subcategory: string;
  @IsIn(["tracker", "voice", "video", "relay", "sos"]) visual: string;
  @IsOptional() @IsString() @Matches(IMAGE_REF, { message: "Image must be an uploaded picture or a path inside /public" }) image?: string | null;
  /** Gallery, main picture first (max 10). */
  @IsOptional() @IsArray() @ArrayMaxSize(10) @IsString({ each: true }) @Matches(IMAGE_REF, { each: true, message: "Each image must be an uploaded picture or a path inside /public" }) images?: string[];
  @IsOptional() @IsString() @MaxLength(120) siteTitle?: string | null;
  @IsString() @MaxLength(1000) summary: string;
  @IsArray() @ArrayMaxSize(30) @ValidateNested({ each: true }) @Type(() => SpecDto) specs: SpecDto[];
  @IsArray() @ArrayMaxSize(50) @IsString({ each: true }) @MaxLength(120, { each: true }) features: string[];
  /** Omit or null = "price on request". */
  @IsOptional() @IsInt() @Min(0) @Max(MONEY) price?: number | null;
  @IsOptional() @IsInt() @Min(0) @Max(MONEY) monthly?: number | null;
  @IsOptional() @IsString() @MaxLength(60) planId?: string | null;
  @IsOptional() @IsString() @MaxLength(240) priceNote?: string;
  /** Formatted description (HTML from the editor — cleaned on the server). */
  @IsOptional() @Transform(({ value }) => sanitizeRich(value)) @IsString() @MaxLength(60000) description?: string;
  /** What one unit costs us (admin only). */
  @IsOptional() @IsInt() @Min(0) @Max(MONEY) cost?: number | null;
  /** Units on hand; leave out / null = not tracked. */
  @IsOptional() @IsInt() @Min(0) @Max(1_000_000) stock?: number | null;
  @IsOptional() @IsInt() sort?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class FaqDto {
  @IsString() @MaxLength(60) category: string;
  @IsString() @Length(3, 500) q: string;
  /** The answer — formatted text (HTML from the editor, cleaned on the server). */
  @Transform(({ value }) => sanitizeRich(value)) @IsString() @HasText() @MaxLength(60000) a: string;
  @IsOptional() @IsString() @MaxLength(60) tag?: string;
  @IsOptional() @IsInt() sort?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class CategoryDto {
  @IsString() @Length(2, 80) name: string;
  /** Set for a sub-category (the id of its category). Can't be changed after creation. */
  @IsOptional() @IsString() @Matches(/^[a-z0-9][a-z0-9-]{1,79}$/) parentId?: string | null;
  @IsOptional() @IsInt() sort?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

class TelematicsDto {
  @IsString() @MaxLength(60) vehicle: string;
  @IsString() @MaxLength(40) plate: string;
  @IsString() @MaxLength(60) place: string;
  @IsString() @MaxLength(20) speed: string;
  @IsIn(["ON", "OFF", "LOCKED"]) ignition: "ON" | "OFF" | "LOCKED";
  @IsString() @MaxLength(30) status: string;
  /** SVG path inside a 320×180 box. Letters, digits, spaces, commas, dots and minus only. */
  @IsString() @Matches(/^[MmLlHhVvCcSsQqTtAaZz0-9\s,.\-]{4,200}$/, { message: "route must be an SVG path" }) route: string;
  @IsString() @MaxLength(60) sensor: string;
  @IsString() @MaxLength(40) fuel: string;
}

export class HeroSlideDto {
  @IsString() @Length(2, 30) tab: string;
  @IsString() @Length(2, 80) badge: string;
  @IsIn(["shield", "bike", "truck"]) badgeIcon: string;
  @IsString() @Length(2, 120) titleMain: string;
  @IsString() @Length(2, 120) titleHighlight: string;
  @IsString() @Length(2, 300) text: string;
  /** Only files that live in the website's /public folder. */
  @IsString() @Matches(/^\/(?!.*\.\.)[A-Za-z0-9/_.-]{2,230}$/, { message: "bgImage must be a path inside /public, e.g. /img/hero-car.jpg" }) bgImage: string;
  @IsIn(["brand", "sky", "emerald"]) accent: string;
  @IsString() @Length(2, 40) ctaLabel: string;
  /** A site page ("/products") or a full https:// link. */
  @IsString() @Matches(/^(\/(?![/\\])[^\s\\]*|https:\/\/[^\s\\]+)$/, { message: "Link must be a page on this site (/products) or a full https:// link" }) @MaxLength(200) ctaHref: string;
  @ValidateNested() @Type(() => TelematicsDto) telematics: TelematicsDto;
  @IsOptional() @IsInt() sort?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

const trimStr = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
const flag = ({ value }: { value: unknown }) => value === "1" || value === "true" || value === true;

/** Public shop listing. Everything is filtered, sorted and paged on the server. */
export class ProductsQuery {
  @IsOptional() @Transform(trimStr) @IsString() @MaxLength(80) category?: string;
  @IsOptional() @Transform(trimStr) @IsString() @MaxLength(80) sub?: string;
  @IsOptional() @Transform(trimStr) @IsString() @MaxLength(80) q?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) @Max(MONEY) maxPrice?: number;
  @IsOptional() @Transform(flag) @IsBoolean() priced?: boolean;
  @IsOptional() @Transform(flag) @IsBoolean() call?: boolean;
  @IsOptional() @IsIn(["default", "price-asc", "price-desc", "name"]) sort?: "default" | "price-asc" | "price-desc" | "name";
  /** Comma-separated product ids (used for the wishlist view). */
  @IsOptional() @Transform(({ value }) => (typeof value === "string" ? value.split(",").map((x) => x.trim()).filter(Boolean) : value)) @IsArray() @ArrayMaxSize(100) @Matches(/^[a-z0-9][a-z0-9-]{1,79}$/, { each: true }) ids?: string[];
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(48) limit?: number;
}

/** Admin product list (includes hidden products). */
export class AdminProductsQuery {
  @IsOptional() @Transform(trimStr) @IsString() @MaxLength(80) q?: string;
  @IsOptional() @Transform(trimStr) @IsString() @MaxLength(80) category?: string;
  @IsOptional() @IsIn(["all", "visible", "hidden"]) status?: "all" | "visible" | "hidden";
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}
