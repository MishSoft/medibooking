// Client-only sign-in form schemas, built on the mirrored server loginSchema
import { z } from "zod";
import { loginSchema } from "./auth.schema";

export const patientSignInSchema = loginSchema;
export const doctorSignInSchema = loginSchema;

export const clinicSignInSchema = loginSchema.extend({
  identifier: z.string().email("Invalid email format"),
  facilityId: z.string().min(1, "Clinic facility ID is required"),
});

export type ClinicSignInInput = z.infer<typeof clinicSignInSchema>;
