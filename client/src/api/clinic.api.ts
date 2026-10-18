import type { TimeSlot } from "../types/booking";
import type { ApiResponse } from "./auth.api";
import { apiRequest } from "./client";
import type {
  ClinicAppointment,
  ClinicAppointmentsFilters,
  ClinicDoctor,
  ClinicStats,
  DateRange,
  DoctorSchedule,
  DoctorWorkload,
} from "../types/clinic";
import {
  toAppointment,
  toPatient,
  type AppointmentDto,
  type PatientDto,
} from "./appointments.api";
import {
  doctorsApi,
  toDoctor,
  toDoctorSchedule,
  toServerWeekdays,
  type DoctorDto,
  type DoctorScheduleDto,
} from "./doctors.api";

// Shapes returned by the server's /api/clinic endpoints (Prisma select)
export type ClinicDoctorDto = Omit<DoctorDto, "user" | "schedule"> & {
  user: DoctorDto["user"] & { email: string };
  schedule: DoctorScheduleDto | null;
};

export type ClinicAppointmentDto = AppointmentDto & {
  patient: PatientDto;
  rescheduledFrom: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
};

export type DoctorWorkloadDto = Omit<DoctorWorkload, "doctor"> & {
  doctor: ClinicDoctorDto;
};

export type ClinicStatsDto = Omit<ClinicStats, "workload"> & {
  workload: DoctorWorkloadDto[];
};

// A doctor without a schedule shows "No working days" and can be set up from
// the Schedules tab; registration and the migration normally create one
const emptySchedule: DoctorSchedule = {
  workingDays: [],
  startTime: "09:00",
  endTime: "17:00",
  slotMinutes: 30,
};

export const toClinicDoctor = (dto: ClinicDoctorDto): ClinicDoctor => ({
  ...toDoctor({ ...dto, schedule: undefined }),
  email: dto.user.email,
  schedule: dto.schedule ? toDoctorSchedule(dto.schedule) : emptySchedule,
});

export const toClinicAppointment = (
  dto: ClinicAppointmentDto,
): ClinicAppointment => ({
  ...toAppointment(dto),
  patient: toPatient(dto.patient),
  rescheduledFrom: dto.rescheduledFrom ?? undefined,
  cancelledAt: dto.cancelledAt ?? undefined,
  cancellationReason: dto.cancellationReason ?? undefined,
});

export const toClinicStats = (dto: ClinicStatsDto): ClinicStats => ({
  total: dto.total,
  completed: dto.completed,
  upcoming: dto.upcoming,
  cancelled: dto.cancelled,
  rescheduled: dto.rescheduled,
  cancellationRate: dto.cancellationRate,
  utilisation: dto.utilisation,
  workload: dto.workload.map(({ doctor, ...counts }) => ({
    ...counts,
    doctor: toClinicDoctor(doctor),
  })),
});

// Request body for PUT /api/clinic/doctors/:id/schedule (server weekdays)
export const toDoctorScheduleBody = (
  schedule: DoctorSchedule,
): DoctorScheduleDto => ({
  workingDays: toServerWeekdays(schedule.workingDays),
  startTime: schedule.startTime,
  endTime: schedule.endTime,
  slotMinutes: schedule.slotMinutes,
});

export type RescheduleAppointmentPayload = {
  id: string;
  startsAt: string; // ISO date-time
};

export type CancelAppointmentPayload = {
  id: string;
  reason?: string;
};

export type UpdateDoctorSchedulePayload = {
  doctorId: string;
  schedule: DoctorSchedule;
};

// Skips empty values; from/to are ISO date-times, so they need encoding
const toQueryString = (params: Record<string, string | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

// Clinic admin endpoints (CLINIC_ADMIN only, scoped to the admin's clinic)
export const clinicApi = {
  doctors: async (): Promise<ClinicDoctor[]> => {
    const response = await apiRequest<ApiResponse<ClinicDoctorDto[]>>(
      "api/clinic/doctors",
    );
    return (response.data ?? []).map(toClinicDoctor);
  },
  // Sorted by start time on the server
  appointments: async (
    filters: ClinicAppointmentsFilters = {},
  ): Promise<ClinicAppointment[]> => {
    const response = await apiRequest<ApiResponse<ClinicAppointmentDto[]>>(
      `api/clinic/appointments${toQueryString(filters)}`,
    );
    return (response.data ?? []).map(toClinicAppointment);
  },
  // Also rebooks cancelled appointments; 409 when the slot is no longer free
  reschedule: async ({
    id,
    startsAt,
  }: RescheduleAppointmentPayload): Promise<ClinicAppointment> => {
    const response = await apiRequest<ApiResponse<ClinicAppointmentDto>>(
      `api/clinic/appointments/${id}/reschedule`,
      { method: "PATCH", body: { startAt: startsAt } },
    );
    if (!response.data) throw new Error("Rescheduling failed.");
    return toClinicAppointment(response.data);
  },
  cancel: async ({
    id,
    reason,
  }: CancelAppointmentPayload): Promise<ClinicAppointment> => {
    const response = await apiRequest<ApiResponse<ClinicAppointmentDto>>(
      `api/clinic/appointments/${id}/cancel`,
      { method: "PATCH", body: { reason } },
    );
    if (!response.data) throw new Error("Cancellation failed.");
    return toClinicAppointment(response.data);
  },
  updateSchedule: async ({
    doctorId,
    schedule,
  }: UpdateDoctorSchedulePayload): Promise<ClinicDoctor> => {
    const response = await apiRequest<ApiResponse<ClinicDoctorDto>>(
      `api/clinic/doctors/${doctorId}/schedule`,
      { method: "PUT", body: toDoctorScheduleBody(schedule) },
    );
    if (!response.data) throw new Error("Could not update the schedule.");
    return toClinicDoctor(response.data);
  },
  // date: "yyyy-MM-dd"; same endpoint as patient booking, open to clinic admins
  slots: (doctorId: string, date: string): Promise<TimeSlot[]> =>
    doctorsApi.slots(doctorId, date),
  stats: async (range: DateRange): Promise<ClinicStats> => {
    const response = await apiRequest<ApiResponse<ClinicStatsDto>>(
      `api/clinic/stats${toQueryString(range)}`,
    );
    if (!response.data) throw new Error("Could not load clinic stats.");
    return toClinicStats(response.data);
  },
};
