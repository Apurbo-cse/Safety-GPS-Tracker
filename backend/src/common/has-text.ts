import { registerDecorator, type ValidationOptions } from "class-validator";
import { plainText } from "./html";

/** Rich text must contain some visible text or a picture — not just empty tags. */
export function HasText(options?: ValidationOptions) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      name: "hasText",
      target: object.constructor,
      propertyName,
      options: { message: "Write some text first", ...options },
      validator: { validate: (v: unknown) => typeof v === "string" && (plainText(v).length >= 2 || /<img\b/i.test(v)) },
    });
}
