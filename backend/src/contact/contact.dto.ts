import { Transform, Type } from "class-transformer";
import { IsEmail, IsIn, IsInt, IsOptional, IsString, Length, Max, MaxLength, Min } from "class-validator";
import { IsBdMobile } from "../common/bd-mobile";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);

export class ContactDto {
  @IsIn(["contact", "lead"]) kind: "contact" | "lead";
  @IsOptional() @IsIn(["sales", "support", "billing"]) department?: string;
  @Transform(trim) @IsString() @Length(2, 120) name: string;
  @IsOptional() @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value)) @IsEmail() @MaxLength(254) email?: string;
  @IsBdMobile() phone: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(40) fleet?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(150) subject?: string;
  @Transform(trim) @IsString() @Length(5, 1000) message: string;
  /** Hidden field real visitors never fill in; bots do. */
  @IsOptional() @IsString() @MaxLength(0) website?: string;
}

export class MessagesQuery {
  @IsOptional() @IsIn(["all", "new", "handled"]) status?: "all" | "new" | "handled";
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}

export class UpdateMessageDto {
  @IsIn(["new", "handled"]) status: "new" | "handled";
}
