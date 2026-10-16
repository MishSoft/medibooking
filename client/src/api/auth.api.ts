import type { LoginInput } from "../schemas/auth.schema";
import type { ClinicRegistrationFormOutput } from "../schemas/clinicRegistration.schema";
import type { Role } from "../types/enums";
import type { PatientRegistrationFormOutput } from "../schemas/patientRegistration.schema";
import { apiRequest } from "./client";

export type ApiResponse<TData = unknown> = {
  success: boolean;
  message?: string;
  data?: TData;
};

// Form-only fields that the server does not accept
type PatientFormOnlyFields =
  | "confirmPassword"
  | "healthRecordConsent"
  | "appointmentReminders";

export type PatientRegisterPayload = Omit<
  PatientRegistrationFormOutput,
  PatientFormOnlyFields
>;

export function toPatientRegisterPayload({
  confirmPassword: _confirmPassword,
  healthRecordConsent: _healthRecordConsent,
  appointmentReminders: _appointmentReminders,
  ...payload
}: PatientRegistrationFormOutput): PatientRegisterPayload {
  return payload;
}

type ClinicFormOnlyFields =
  | "confirmPassword"
  | "legalCertification"
  | "serviceTerms";

export type ClinicRegisterPayload = Omit<
  ClinicRegistrationFormOutput,
  ClinicFormOnlyFields
>;

export function toClinicRegisterPayload({
  confirmPassword: _confirmPassword,
  legalCertification: _legalCertification,
  serviceTerms: _serviceTerms,
  ...payload
}: ClinicRegistrationFormOutput): ClinicRegisterPayload {
  return payload;
}

export type LoginPayload = LoginInput;

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
};

export type LoginResponseData = {
  user: AuthUser;
  token: string;
};

export const authApi = {
  login: (payload: LoginPayload) =>
    apiRequest<ApiResponse<LoginResponseData>>("api/auth/login", {
      method: "POST",
      body: payload,
    }),
  logout: () =>
    apiRequest<ApiResponse>("api/auth/logout", {
      method: "POST",
    }),
  registerPatient: (payload: PatientRegisterPayload) =>
    apiRequest<ApiResponse<LoginResponseData>>("api/auth/register/patient", {
      method: "POST",
      body: payload,
    }),
  registerClinic: (payload: ClinicRegisterPayload) =>
    apiRequest<ApiResponse>("api/auth/register/clinic", {
      method: "POST",
      body: payload,
    }),
};
