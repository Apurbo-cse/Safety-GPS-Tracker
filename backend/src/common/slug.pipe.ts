import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

/** Route ids are URL slugs: lower-case letters, digits and dashes. */
@Injectable()
export class SlugPipe implements PipeTransform<string, string> {
  transform(value: string) {
    if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(value)) throw new BadRequestException("Invalid id");
    return value;
  }
}
