// Client-only registration form schema, built on the mirrored server doctorRegisterSchema
import { z } from "zod";
import { Gender } from "../types/enums";
import { doctorRegisterSchema } from "./auth.schema";

const mustBeChecked = (message: string) =>
  z.boolean().refine((value) => value, message);

const georgianMobile = z
  .string()
  .regex(
    /^5\d{2} ?\d{2} ?\d{2} ?\d{2}$/,
    "Enter a valid Georgian mobile number, e.g. 599 44 88 12",
  );

export const doctorRegistrationFormSchema = doctorRegisterSchema
  .omit({ role: true })
  .extend({
    firstName: z
      .string()
      .trim()
      .min(2, "First name is required (min. 2 characters)"),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name is required (min. 2 characters)"),
    gender: z.enum(Gender, "Select a gender marker"),
    birthDate: z
      .string()
      .min(1, "Date of birth is required")
      .refine((value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return false;
        const adultCutoff = new Date();
        adultCutoff.setFullYear(adultCutoff.getFullYear() - 21);
        return date <= adultCutoff;
      }, "Practitioner must be at least 21 years old"),
    personalId: z
      .string()
      .regex(/^[0-9]{11}$/, "National ID must be exactly 11 digits"),
    licenseNo: z
      .string()
      .trim()
      .min(1, "Medical license number is required")
      .regex(
        /^[A-Z0-9-]{5,30}$/i,
        "License number may contain only letters, digits and dashes (5–30)",
      ),
    primarySpecialty: z.string().min(1, "Primary specialty is required"),
    yearsOfPractice: z
      .number("Enter years of practice")
      .int("Years of practice must be a whole number")
      .min(0, "Years of practice cannot be negative")
      .max(70, "Years of practice looks too high"),
    clinicId: z.string().uuid("Select an associated facility"),
    phone: georgianMobile,
    emergencyPhone: georgianMobile,
    city: z.string().min(1, "Region / city is required"),
    bio: z
      .string()
      .trim()
      .max(1000, "Bio must be at most 1000 characters")
      .optional(),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a symbol"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    licenseCertification: mustBeChecked("You must certify your license"),
    clinicalConsent: mustBeChecked("You must consent to clinical dispatch"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type DoctorRegistrationFormInput = z.input<
  typeof doctorRegistrationFormSchema
>;
export type DoctorRegistrationFormOutput = z.output<
  typeof doctorRegistrationFormSchema
>;
