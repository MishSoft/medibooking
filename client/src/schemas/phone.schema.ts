// Shared Georgian mobile number rules for registration forms (without +995 prefix)
import { z } from "zod";

export const MOBILE_NUMBER_LENGTH = 9;

export const mobileNumberSchema = z
  .string()
  .trim()
  .min(1, "Mobile number is required")
  .regex(/^\d+$/, "Mobile number may contain digits only")
  .startsWith("5", "Mobile number must start with 5")
  .length(MOBILE_NUMBER_LENGTH, "Mobile number must be exactly 9 digits");
