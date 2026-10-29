import { z } from "zod";
import { Gender, Role } from "../generated/prisma";

export const baseUserSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  firstName: z.string().min(2, "First name is required (min. 2 characters)."),
  lastName: z.string().min(2, "Last name is required (min. 2 characters)."),
  phone: z.string().min(6, "Phone number is required."),
});

export const patientRegisterSchema = baseUserSchema.extend({
  role: z.literal(Role.PATIENT).default(Role.PATIENT),
  personalId: z.string().optional(),
  address: z.string().min(1, "Address is required."),
  city: z.string().min(1, "City is required."),
  gender: z.nativeEnum(Gender).default(Gender.MALE),
  birthDate: z.coerce.date().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

export const clinicRegisterSchema = baseUserSchema.extend({
  role: z.literal(Role.CLINIC_ADMIN).default(Role.CLINIC_ADMIN),
  name: z.string().min(2, "Clinic name is required."),
  legalName: z.string().min(2, "Legal name is required."),
  taxId: z.string().min(1, "Tax ID is required."),
  publicEmail: z.string().email("Invalid email format."),
  receptionPhone: z.string().min(1, "Reception phone is required."),
  departments: z.array(z.string()).min(1, "Select at least one department."),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
});

export const doctorRegisterSchema = baseUserSchema.extend({
  role: z.literal(Role.DOCTOR).default(Role.DOCTOR),
  personalId: z.string().min(1, "Personal ID is required."),
  licenseNo: z.string().min(1, "License number is required."),
  primarySpecialty: z.string().min(1, "Primary specialty is required."),
  yearsOfPractice: z.number().min(0, "Years of practice cannot be negative."),
  emergencyPhone: z.string().min(1, "Emergency phone is required."),
  city: z.string().min(1, "City is required."),
  clinicId: z.string().uuid("Invalid clinic ID."),
  gender: z.nativeEnum(Gender).optional(),
  birthDate: z.coerce.date().optional(),
  bio: z.string().optional(),
});

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Enter your email or National ID Number (Personal Code)"),
  password: z.string().min(1, "Password is required."),
  personalId: z
    .string()
    .regex(/^\d{11}$/, "Personal ID must be 11 digits.")
    .optional(),
});

export type PatientRegisterInput = z.infer<typeof patientRegisterSchema>;
export type ClinicRegisterInput = z.infer<typeof clinicRegisterSchema>;
export type DoctorRegisterInput = z.infer<typeof doctorRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
