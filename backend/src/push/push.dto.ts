import { Type } from "class-transformer";
import { IsObject, IsString, IsUrl, MaxLength, ValidateNested } from "class-validator";

class KeysDto {
  @IsString() @MaxLength(200) p256dh: string;
  @IsString() @MaxLength(100) auth: string;
}

export class SubscribeDto {
  @IsUrl({ protocols: ["https", "http"], require_tld: false }) @MaxLength(1000) endpoint: string;
  @IsObject() @ValidateNested() @Type(() => KeysDto) keys: KeysDto;
}

export class UnsubscribeDto {
  @IsString() @MaxLength(1000) endpoint: string;
}
