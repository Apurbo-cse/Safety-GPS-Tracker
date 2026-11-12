import { ArrayMaxSize, IsArray, IsBoolean, IsEmail, IsOptional, IsString, Length, Matches, MaxLength } from "class-validator";
import { Transform } from "class-transformer";
import { IsBdMobile } from "../common/bd-mobile";
import { PASSWORD_MSG, PASSWORD_RULE } from "../auth/auth.dto";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
const ROLE_ID = /^[a-z0-9][a-z0-9-]{1,39}$/;

/** Create a staff account, or promote an existing customer by giving only their email. */
export class AddStaffDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value)) @IsEmail() @MaxLength(254) email: string;
  @IsString() @Matches(ROLE_ID) roleId: string;
  @IsOptional() @Transform(trim) @IsString() @Length(2, 120) name?: string;
  @IsOptional() @IsBdMobile() mobile?: string;
  @IsOptional() @Matches(PASSWORD_RULE, { message: PASSWORD_MSG }) password?: string;
}

export class UpdateStaffDto {
  @IsOptional() @IsString() @Matches(ROLE_ID) roleId?: string;
  @IsOptional() @IsBoolean() disabled?: boolean;
}

export class RoleDto {
  @Transform(trim) @IsString() @Length(2, 60) name: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(200) description?: string;
  @IsArray() @ArrayMaxSize(20) @IsString({ each: true }) permissions: string[];
}
