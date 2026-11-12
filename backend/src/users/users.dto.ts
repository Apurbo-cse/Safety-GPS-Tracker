import { Type, Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsIn, IsInt, IsOptional, IsString, Length, Matches, Max, MaxLength, Min, ValidateNested } from "class-validator";
import { IsBdMobile } from "../common/bd-mobile";
import { PASSWORD_MSG, PASSWORD_RULE } from "../auth/auth.dto";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
const DIVISIONS = ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"];

export class UpdateProfileDto {
  @IsOptional() @Transform(trim) @IsString() @Length(2, 120)
  name?: string;

  /** Empty string clears the number. */
  @IsOptional() @Transform(trim) @IsBdMobile({ message: "Enter a valid Bangladeshi mobile number" })
  phone?: string;

  @IsOptional() @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value)) @IsEmail() @MaxLength(254)
  email?: string;

  @IsOptional() @Transform(trim) @IsString() @MaxLength(120)
  company?: string;

  @IsOptional() @Transform(trim) @IsString() @MaxLength(240)
  address?: string;

  @IsOptional() @IsIn(DIVISIONS)
  division?: string;

  /** BIN / TIN — letters, digits and dashes. */
  @IsOptional() @Transform(trim) @IsString() @Matches(/^[A-Za-z0-9-]{0,30}$/, { message: "Tax / BIN number can only have letters, digits and dashes" })
  taxId?: string;

  @IsOptional() @Transform(trim) @IsString() @MaxLength(240)
  billingAddress?: string;

  @IsOptional() @IsIn(DIVISIONS)
  billingDivision?: string;

  @IsOptional() @Transform(trim) @IsString() @Matches(/^\d{0,10}$/, { message: "Postcode must be digits" })
  billingPostcode?: string;
}

class AlertsDto {
  @IsBoolean() ignition: boolean;
  @IsBoolean() geofence: boolean;
  @IsBoolean() speed: boolean;
  @IsBoolean() tamper: boolean;
  @IsBoolean() sos: boolean;
  @IsBoolean() documents: boolean;
  @IsBoolean() billing: boolean;
}
class ChannelsDto {
  @IsBoolean() push: boolean;
  @IsBoolean() sms: boolean;
  @IsBoolean() email: boolean;
}

/** Full settings object — the website always sends the whole thing. */
export class UpdateSettingsDto {
  @ValidateNested() @Type(() => AlertsDto) alerts: AlertsDto;
  @ValidateNested() @Type(() => ChannelsDto) channels: ChannelsDto;
  @IsInt() @Min(30) @Max(140) speedLimit: number;
  @IsIn(["en", "bn"]) language: "en" | "bn";
  @IsIn(["km", "mi"]) units: "km" | "mi";
  @IsBoolean() twoFactor: boolean;
  @IsBoolean() marketing: boolean;
}

export class ChangePasswordDto {
  @IsString() @Length(1, 72)
  current: string;

  @Matches(PASSWORD_RULE, { message: PASSWORD_MSG })
  next: string;
}
