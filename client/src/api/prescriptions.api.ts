import { mockDelay } from "../mocks/delay";
import { mockPrescriptions } from "../mocks/prescriptions";
import type { Prescription } from "../types/prescription";
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
};

export const toPrescription = (dto: PrescriptionDto): Prescription => ({
  id: dto.id,
  doctor: toDoctor(dto.doctor),
  medication: dto.medication,
  dosage: dto.dosage,
  frequency: dto.frequency,
  instructions: dto.instructions ?? undefined,
  issuedAt: dto.issuedAt,
  validUntil: dto.validUntil,
});

export type CreatePrescriptionPayload = Omit<Prescription, "id">;

export const prescriptionsApi = {
  // Signed-in patient's own prescriptions
  listMine: async (): Promise<Prescription[]> => {
    const response = await apiRequest<ApiResponse<PrescriptionDto[]>>(
      "api/patient/prescriptions",
    );
    return (response.data ?? []).map(toPrescription);
  },
  // Mock-backed (doctor dashboard) — no server endpoint yet
  list: async (): Promise<Prescription[]> => {
    await mockDelay();
    return [...mockPrescriptions];
  },
  create: async (payload: CreatePrescriptionPayload): Promise<Prescription> => {
    await mockDelay();
    const prescription: Prescription = {
      id: crypto.randomUUID(),
      ...payload,
    };
    mockPrescriptions.push(prescription);
    return prescription;
  },
};
