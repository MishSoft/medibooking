// Client-only registration form schema, built on the mirrored server clinicRegisterSchema
import { z } from "zod";
import { clinicRegisterSchema } from "./auth.schema";

const mustBeChecked = (message: string) =>
  z.boolean().refine((value) => value, message);

export const clinicRegistrationFormSchema = clinicRegisterSchema
  // Not collected by this form yet
  .omit({ role: true, firstName: true, lastName: true, departments: true })
  .extend({
    address: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City / region is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    legalCertification: mustBeChecked("You must certify the facility license"),
    serviceTerms: mustBeChecked("You must accept the terms of service"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ClinicRegistrationFormInput = z.input<
  typeof clinicRegistrationFormSchema
>;
export type ClinicRegistrationFormOutput = z.output<
  typeof clinicRegistrationFormSchema
>;
