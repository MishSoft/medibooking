import { z } from "zod";
import { Gender, Role } from "../generated/prisma";

export const baseUserSchema = z.object({
  email: z.string().email("არასწორი ელ.ფოსტის ფორმატი"),
  password: z.string().min(6, "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო"),
  firstName: z.string().min(2, "სახელი სავალდებულოა (მინ. 2 სიმბოლო)"),
  lastName: z.string().min(2, "გვარი სავალდებულოა (მინ. 2 სიმბოლო)"),
  phone: z.string().min(6, "ტელეფონის ნომერი სავალდებულოა"),
});

export const patientRegisterSchema = baseUserSchema.extend({
  role: z.literal(Role.PATIENT).default(Role.PATIENT),
  personalId: z.string().optional(),
  address: z.string().min(1, "მისამართი სავალდებულოა"),
  city: z.string().min(1, "ქალაქი სავალდებულოა"),
  gender: z.nativeEnum(Gender).default(Gender.MALE),
  birthDate: z.coerce.date().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

export const clinicRegisterSchema = baseUserSchema.extend({
  role: z.literal(Role.CLINIC_ADMIN).default(Role.CLINIC_ADMIN),
  name: z.string().min(2, "კლინიკის სახელი სავალდებულოა"),
  legalName: z.string().min(2, "იურიდიული სახელი სავალდებულოა"),
  taxId: z.string().min(1, "საიდენტიფიკაციო კოდი სავალდებულოა"),
  publicEmail: z.string().email("არასწორი ელ.ფოსტის ფორმატი"),
  receptionPhone: z.string().min(1, "მისაღების ნომერი სავალდებულოა"),
  departments: z.array(z.string()).min(1, "აირჩიეთ მინიმუმ ერთი დეპარტამენტი"),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
});

export const doctorRegisterSchema = baseUserSchema.extend({
  role: z.literal(Role.DOCTOR).default(Role.DOCTOR),
  personalId: z.string().min(1, "პირადი ნომერი სავალდებულოა"),
  licenseNo: z.string().min(1, "ლიცენზიის ნომერი სავალდებულოა"),
  primarySpecialty: z.string().min(1, "ძირითადი სპეციალობა სავალდებულოა"),
  yearsOfPractice: z.number().min(0, "გამოცდილება არ უნდა იყოს უარყოფითი"),
  emergencyPhone: z.string().min(1, "გადაუდებელი ნომერი სავალდებულოა"),
  city: z.string().min(1, "ქალაქი სავალდებულოა"),
  clinicId: z.string().uuid("არასწორი კლინიკის ID"),
  gender: z.nativeEnum(Gender).optional(),
  birthDate: z.coerce.date().optional(),
  bio: z.string().optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "შეიყვანეთ ელ.ფოსტა ან ლიცენზიის ნომერი"),
  password: z.string().min(1, "პაროლი სავალდებულოა"),
});

export type PatientRegisterInput = z.infer<typeof patientRegisterSchema>;
export type ClinicRegisterInput = z.infer<typeof clinicRegisterSchema>;
export type DoctorRegisterInput = z.infer<typeof doctorRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
