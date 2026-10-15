import type { Appointment, AppointmentStatus } from "../types/appointment";
import type { Doctor } from "../types/doctor";
import type { ApiResponse } from "./auth.api";
import { apiRequest } from "./client";
import { toDoctor, type DoctorDto } from "./doctors.api";

// Shape returned by the server (Prisma select)
export type AppointmentDto = {
  id: string;
  startAt: string;
  status: AppointmentStatus;
  notes: string | null;
  doctor: DoctorDto;
};

export const toAppointment = (dto: AppointmentDto): Appointment => ({
  id: dto.id,
  doctor: toDoctor(dto.doctor),
  startsAt: dto.startAt,
  status: dto.status,
  notes: dto.notes ?? undefined,
});

export type CreateAppointmentPayload = {
  doctor: Doctor;
  startsAt: string;
};

export const appointmentsApi = {
  list: async (): Promise<Appointment[]> => {
    const response = await apiRequest<ApiResponse<AppointmentDto[]>>(
      "api/patient/appointments",
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
};
