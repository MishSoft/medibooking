import type {
  Appointment,
  AppointmentStatus,
  VisitRecordPayload,
} from "../types/appointment";
import type { Doctor } from "../types/doctor";
import type { Patient } from "../types/patient";
import type { ApiResponse } from "./auth.api";
import { apiRequest } from "./client";
import { toDoctor, type DoctorDto } from "./doctors.api";

// Shapes returned by the server (Prisma select)
export type PatientDto = {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
};

export type AppointmentDto = {
  id: string;
  startAt: string;
  status: AppointmentStatus;
  notes: string | null;
  diagnosis?: string | null;
  doctor: DoctorDto;
  // Returned by GET /api/appointments (doctor) only
  patient?: PatientDto;
};

export const toPatient = (dto: PatientDto): Patient => ({
  id: dto.id,
  firstName: dto.firstName,
  lastName: dto.lastName,
  phone: dto.phone,
  email: dto.email,
});

export const toAppointment = (dto: AppointmentDto): Appointment => ({
  id: dto.id,
  doctor: toDoctor(dto.doctor),
  patient: dto.patient && toPatient(dto.patient),
  startsAt: dto.startAt,
  status: dto.status,
  notes: dto.notes ?? undefined,
  diagnosis: dto.diagnosis ?? undefined,
});

export type CreateAppointmentPayload = {
  doctor: Doctor;
  startsAt: string;
};

export const appointmentsApi = {
  // Signed-in patient's own appointments (PATIENT only)
  list: async (): Promise<Appointment[]> => {
    const response = await apiRequest<ApiResponse<AppointmentDto[]>>(
      "api/patient/appointments",
    );
    return (response.data ?? []).map(toAppointment);
  },
  // Signed-in doctor's own appointments (DOCTOR only)
  listForDoctor: async (): Promise<Appointment[]> => {
    const response = await apiRequest<ApiResponse<AppointmentDto[]>>(
      "api/appointments",
    );
    return (response.data ?? []).map(toAppointment);
  },
  create: async ({ doctor, startsAt }: CreateAppointmentPayload) => {
    const response = await apiRequest<ApiResponse<AppointmentDto>>(
      "api/appointments",
      {
        method: "POST",
        body: { doctorId: doctor.id, startAt: startsAt },
      },
    );
    if (!response.data) throw new Error("Booking failed.");
    return toAppointment(response.data);
  },
  cancel: async (id: string) => {
    await apiRequest<ApiResponse>(`api/appointments/${id}/cancel`, {
      method: "PATCH",
    });
  },
  // Doctor: mark a scheduled visit as completed, optionally with notes/diagnosis
  complete: async (id: string, record: VisitRecordPayload) => {
    await apiRequest<ApiResponse>(`api/appointments/${id}/status`, {
      method: "PATCH",
      body: { status: "COMPLETED", ...record },
    });
  },
  // Doctor: mark a past scheduled visit as missed by the patient
  markNoShow: async (id: string) => {
    await apiRequest<ApiResponse>(`api/appointments/${id}/status`, {
      method: "PATCH",
      body: { status: "NO_SHOW" },
    });
  },
  // Doctor: edit diagnosis/notes of a completed visit
  updateRecord: async (id: string, record: VisitRecordPayload) => {
    await apiRequest<ApiResponse>(`api/appointments/${id}/record`, {
      method: "PATCH",
      body: record,
    });
  },
  // Doctor: patients with at least one completed visit
  listDoctorPatients: async (): Promise<Patient[]> => {
    const response =
      await apiRequest<ApiResponse<PatientDto[]>>("api/doctor/patients");
    return (response.data ?? []).map(toPatient);
  },
};
