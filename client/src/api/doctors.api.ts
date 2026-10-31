import type { TimeSlot } from "../types/booking";
import type {
  Clinic,
  ClinicSpecialty,
  Doctor,
  DoctorFiltersValue,
  DoctorSchedule,
  Weekday,
} from "../types/doctor";
import { createDefaultScheduleDay, weekOrder } from "../utils/schedule";
import type { ApiResponse } from "./auth.api";
import { apiRequest } from "./client";

// Shapes returned by the server (Prisma select)
export type ClinicDto = {
  id: string;
  name: string;
  address: string | null;
  // Only on GET /api/clinics
  doctorCount?: number;
};

export type DoctorDto = {
  id: string;
  primarySpecialty: string;
  yearsOfPractice?: number;
  bio?: string | null;
  user: { firstName: string; lastName: string };
  clinic: ClinicDto;
  // Only on GET /api/doctors; [] = no schedule configured
  scheduleDays?: ScheduleDayDto[];
};

export type ScheduleDayDto = {
  weekday: number; // 1 = Monday … 7 = Sunday (ISO / Luxon)
  isWorking: boolean;
  startTime: string;
  endTime: string;
  slotMinutes: number;
};

export type TimeSlotDto = {
  start: string; // ISO UTC
  available: boolean;
};

// Server weekdays are 1 = Mon … 7 = Sun; client uses Date#getDay (0 = Sun)
export const fromServerWeekday = (day: number): Weekday => (day % 7) as Weekday;

export const toServerWeekday = (day: Weekday): number => (day === 0 ? 7 : day);

// Always 7 days, Monday first; a weekday missing on the server gets the default
export const toDoctorSchedule = (dtos: ScheduleDayDto[]): DoctorSchedule => ({
  days: weekOrder.map((weekday) => {
    const dto = dtos.find((day) => fromServerWeekday(day.weekday) === weekday);

    return dto
      ? {
          weekday,
          isWorking: dto.isWorking,
          startTime: dto.startTime,
          endTime: dto.endTime,
          slotMinutes: dto.slotMinutes,
        }
      : createDefaultScheduleDay(weekday);
  }),
});

export const toClinic = (dto: ClinicDto): Clinic => ({
  id: dto.id,
  name: dto.name,
  address: dto.address ?? "",
  doctorCount: dto.doctorCount,
});

export const toDoctor = (dto: DoctorDto): Doctor => ({
  id: dto.id,
  firstName: dto.user.firstName,
  lastName: dto.user.lastName,
  specialty: dto.primarySpecialty,
  experienceYears: dto.yearsOfPractice,
  bio: dto.bio ?? undefined,
  clinic: toClinic(dto.clinic),
  // Keep "not sent" (undefined) distinct from "no schedule" (null)
  schedule:
    dto.scheduleDays === undefined
      ? undefined
      : dto.scheduleDays.length > 0
        ? toDoctorSchedule(dto.scheduleDays)
        : null,
});

const toQueryString = (filters: DoctorFiltersValue) => {
  const params = new URLSearchParams();
  const search = filters.query.trim();

  if (search) params.set("search", search);
  if (filters.specialty) params.set("specialty", filters.specialty);
  if (filters.clinicId) params.set("clinicId", filters.clinicId);

  const query = params.toString();
  return query ? `?${query}` : "";
};

export const doctorsApi = {
  list: async (filters: DoctorFiltersValue): Promise<Doctor[]> => {
    const response = await apiRequest<ApiResponse<DoctorDto[]>>(
      `api/doctors${toQueryString(filters)}`,
    );
    return (response.data ?? []).map(toDoctor);
  },
  // date: "yyyy-MM-dd", interpreted by the server in clinic time
  slots: async (doctorId: string, date: string): Promise<TimeSlot[]> => {
    const response = await apiRequest<ApiResponse<TimeSlotDto[]>>(
      `api/doctors/${doctorId}/slots?date=${date}`,
    );
    return (response.data ?? []).map((slot) => ({
      start: new Date(slot.start),
      available: slot.available,
    }));
  },
  clinics: async (): Promise<Clinic[]> => {
    const response = await apiRequest<ApiResponse<ClinicDto[]>>("api/clinics");
    return (response.data ?? []).map(toClinic);
  },
  clinicSpecialties: async (clinicId: string): Promise<ClinicSpecialty[]> => {
    const response = await apiRequest<ApiResponse<ClinicSpecialty[]>>(
      `api/clinics/${clinicId}/specialties`,
    );
    return response.data ?? [];
  },
};
