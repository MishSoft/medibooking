import type { Prescription } from "../types/prescription";
import { toPatient, type PatientDto } from "./appointments.api";
import type { ApiResponse } from "./auth.api";
import { apiRequest } from "./client";
import { toDoctor, type DoctorDto } from "./doctors.api";

// Shape returned by the server (Prisma select)
export type PrescriptionDto = {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  instructions: string | null;
  issuedAt: string;
  validUntil: string;
  doctor: DoctorDto;
  // Returned by GET /api/prescriptions (doctor) only
  patient?: PatientDto;
};

export const toPrescription = (dto: PrescriptionDto): Prescription => ({
  id: dto.id,
  doctor: toDoctor(dto.doctor),
  patient: dto.patient && toPatient(dto.patient),
  medication: dto.medication,
  dosage: dto.dosage,
  frequency: dto.frequency,
  instructions: dto.instructions ?? undefined,
  issuedAt: dto.issuedAt,
  validUntil: dto.validUntil,
});

// The doctor is taken from the session; issuedAt defaults to now on the server
export type CreatePrescriptionPayload = {
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  validUntil: string; // ISO date
};

// Empty string clears the instructions
export type UpdatePrescriptionPayload = Partial<
  Omit<CreatePrescriptionPayload, "patientId">
>;

// Create/update responses omit doctor and patient, so callers refetch the list
export const prescriptionsApi = {
  // Signed-in patient's own prescriptions
  listMine: async (): Promise<Prescription[]> => {
    const response = await apiRequest<ApiResponse<PrescriptionDto[]>>(
      "api/patient/prescriptions",
    );
    return (response.data ?? []).map(toPrescription);
  },
  // Signed-in doctor's issued prescriptions
  listForDoctor: async (): Promise<Prescription[]> => {
    const response =
      await apiRequest<ApiResponse<PrescriptionDto[]>>("api/prescriptions");
    return (response.data ?? []).map(toPrescription);
  },
  create: async (payload: CreatePrescriptionPayload) => {
    await apiRequest<ApiResponse>("api/prescriptions", {
      method: "POST",
      body: payload,
    });
  },
  update: async (id: string, payload: UpdatePrescriptionPayload) => {
    await apiRequest<ApiResponse>(`api/prescriptions/${id}`, {
      method: "PATCH",
      body: payload,
    });
  },
};
