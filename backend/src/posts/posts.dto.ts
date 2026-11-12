import { Transform, Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsISO8601, IsOptional, IsString, Length, Matches, Max, MaxLength, Min } from "class-validator";
import { HasText } from "../common/has-text";
import { sanitizeRich } from "../common/html";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
const IMAGE_REF = /^(media:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|\/(?!.*\.\.)[A-Za-z0-9/_.-]{2,230})$/;

export class PostDto {
  @Transform(trim) @IsString() @Length(3, 150) title: string;
  /** Short summary for the list page. Left empty, it is taken from the start of the post. */
  @IsOptional() @Transform(trim) @IsString() @MaxLength(300) excerpt?: string;
  @IsOptional() @IsString() @Matches(IMAGE_REF, { message: "Cover must be an uploaded picture or a path inside /public" }) cover?: string | null;
  /** The post itself — formatted text from the editor, cleaned on the server. */
  @Transform(({ value }) => sanitizeRich(value)) @IsString() @HasText() @MaxLength(60000) content: string;
  @IsBoolean() published: boolean;
  /** Optional: publish at a chosen time (ISO 8601). Default: the moment it is first published. */
  @IsOptional() @IsISO8601() publishedAt?: string;
}

export class PostsQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(24) limit?: number;
}

export class AdminPostsQuery {
  @IsOptional() @Transform(trim) @IsString() @MaxLength(80) q?: string;
  @IsOptional() @IsIn(["all", "published", "draft"]) status?: "all" | "published" | "draft";
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}
