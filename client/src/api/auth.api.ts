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

export const authApi = {
  registerPatient: (payload: PatientRegisterPayload) =>
    apiRequest<ApiResponse>("api/auth/register/patient", {
      method: "POST",
      body: payload,
    }),
};
