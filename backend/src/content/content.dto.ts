import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, Length, Matches, MaxLength } from "class-validator";
import { HasText } from "../common/has-text";
import { sanitizeRich } from "../common/html";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
/** A social profile: empty (not shown) or a full https:// link. */
const url = () => [IsOptional(), Transform(trim), IsString(), MaxLength(200), Matches(/^$|^https:\/\/\S+$/, { message: "Use a full link starting with https://" })] as const;
const apply = (...d: PropertyDecorator[]) => (t: object, k: string | symbol) => d.forEach((f) => f(t, k));

export class SiteDto {
  @Transform(trim) @IsString() @Length(2, 80) name: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(160) tagline?: string;
  @Transform(trim) @IsString() @Matches(/^[0-9+\-\s()]{5,24}$/, { message: "Phone can only have digits, spaces, + - and ( )" }) phone: string;
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value)) @IsEmail() @MaxLength(254) email: string;
  @Transform(trim) @IsString() @Length(5, 240) address: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(120) hours?: string;
  @apply(...url()) facebook?: string;
  @apply(...url()) youtube?: string;
  @apply(...url()) linkedin?: string;
  @apply(...url()) instagram?: string;
}

export class PageDto {
  @Transform(trim) @IsString() @Length(2, 120) title: string;
  /** Formatted text from the editor — cleaned on the server. */
  @Transform(({ value }) => sanitizeRich(value)) @IsString() @HasText() @MaxLength(60000) content: string;
  @IsBoolean() published: boolean;
  @IsOptional() @IsInt() sort?: number;
}

