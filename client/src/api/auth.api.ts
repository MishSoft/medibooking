import type { LoginInput } from "../schemas/auth.schema";
import type { ClinicRegistrationFormOutput } from "../schemas/clinicRegistration.schema";
import type { DoctorRegistrationFormOutput } from "../schemas/doctorRegistration.schema";
import type { Role } from "../types/enums";
import type { PatientRegistrationFormOutput } from "../schemas/patientRegistration.schema";
import { apiRequest } from "./client";
import type { DoctorScheduleDto } from "./doctors.api";

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

type DoctorFormOnlyFields =
  | "confirmPassword"
  | "licenseCertification"
  | "clinicalConsent";

export type DoctorRegisterPayload = Omit<
  DoctorRegistrationFormOutput,
  DoctorFormOnlyFields
>;

// Phones are entered as "599 44 88 12"; the server stores digits only
const toDigits = (value: string) => value.replace(/\s/g, "");

export function toDoctorRegisterPayload({
  confirmPassword: _confirmPassword,
  licenseCertification: _licenseCertification,
  clinicalConsent: _clinicalConsent,
  ...payload
}: DoctorRegistrationFormOutput): DoctorRegisterPayload {
  return {
    ...payload,
    phone: toDigits(payload.phone),
    emergencyPhone: toDigits(payload.emergencyPhone),
    bio: payload.bio || undefined,
  };
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

// Subset of GET /api/auth/me used by the client; managedClinic is set for
// CLINIC_ADMIN, doctorProfile for DOCTOR
export type MeResponseData = AuthUser & {
  managedClinic: { id: string; name: string } | null;
  doctorProfile: {
    id: string;
    schedule: DoctorScheduleDto | null;
  } | null;
};

export const authApi = {
  me: () => apiRequest<ApiResponse<MeResponseData>>("api/auth/me"),
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
    apiRequest<ApiResponse<LoginResponseData>>("api/auth/register/clinic", {
      method: "POST",
      body: payload,
    }),
  // Response also carries the new doctor's token; the registering clinic admin ignores it
  registerDoctor: (payload: DoctorRegisterPayload) =>
    apiRequest<ApiResponse>("api/auth/register/doctor", {
      method: "POST",
      body: payload,
    }),
};
