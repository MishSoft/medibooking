// Client-only registration form schema, built on the mirrored server patientRegisterSchema
import { z } from "zod";
import { Gender } from "../types/enums";
import { patientRegisterSchema } from "./auth.schema";

export const patientRegistrationFormSchema = patientRegisterSchema
  .omit({ role: true })
  .extend({
    gender: z.enum(Gender, "Select a gender"),
    birthDate: z.string().min(1, "Date of birth is required"),
    personalId: z
      .string()
      .regex(/^[0-9]{11}$/, "National ID must be exactly 11 digits"),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a symbol"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    healthRecordConsent: z
      .boolean()
      .refine((value) => value, "You must consent to continue"),
    appointmentReminders: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PatientRegistrationFormInput = z.input<
  typeof patientRegistrationFormSchema
>;
export type PatientRegistrationFormOutput = z.output<
  typeof patientRegistrationFormSchema
>;
