import { registerDecorator, type ValidationOptions } from "class-validator";
import { normalizePhone } from "./phone";

/** Valid Bangladeshi mobile number (+88 / 88 prefix and dashes allowed). */
export function IsBdMobile(options?: ValidationOptions) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      name: "isBdMobile",
      target: object.constructor,
      propertyName,
      options: { message: "Enter a valid Bangladeshi mobile number", ...options },
      validator: { validate: (v: unknown) => typeof v === "string" && normalizePhone(v) !== null },
    });
}
