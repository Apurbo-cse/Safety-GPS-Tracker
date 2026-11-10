import { z } from "zod";

/** Bangladeshi mobile: 01XXXXXXXXX, optionally with +88 / 88 prefix and dashes */
export const phoneRegex = /^(?:\+?88)?-?01[3-9][\d-]{8,9}$/;

export const emailSchema = z.string().min(1, "Enter your email").email("Enter a valid email");
export const mobileSchema = z.string().regex(phoneRegex, "Enter a valid Bangladeshi mobile number");
export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Za-z]/, "Include a letter")
  .regex(/\d/, "Include a number");
