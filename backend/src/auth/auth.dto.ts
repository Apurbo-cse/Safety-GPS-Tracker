import { IsEmail, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { IsBdMobile } from "../common/bd-mobile";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
/** At least 8 chars with a letter and a number; 72 is bcrypt's input limit. */
export const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;
export const PASSWORD_MSG = "Password must be 8–72 characters with at least one letter and one number";

export class RegisterDto {
  @Transform(trim) @IsString() @Length(2, 120)
  name: string;

  @IsBdMobile()
  mobile: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value)) @IsEmail() @MaxLength(254)
  email: string;

  @Matches(PASSWORD_RULE, { message: PASSWORD_MSG })
  password: string;

  @IsOptional() @Transform(trim) @IsString() @MaxLength(60)
  vehicleType?: string;
}

export class LoginDto {
  @Transform(trim) @IsString() @MinLength(1) @MaxLength(254)
  identifier: string;

  @IsString() @MinLength(1) @MaxLength(72)
  password: string;
}
