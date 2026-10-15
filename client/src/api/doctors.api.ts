import type { TimeSlot } from "../types/booking";
import type { Clinic, Doctor, DoctorFiltersValue } from "../types/doctor";
import type { ApiResponse } from "./auth.api";
import { apiRequest } from "./client";

// Shapes returned by the server (Prisma select)
export type ClinicDto = {
  id: string;
  name: string;
  address: string | null;
};

export type DoctorDto = {
  id: string;
  primarySpecialty: string;
  yearsOfPractice?: number;
  bio?: string | null;
  user: { firstName: string; lastName: string };
  clinic: ClinicDto;
};

export type TimeSlotDto = {
  start: string; // ISO UTC
  available: boolean;
};

export const toClinic =(dto: ClinicDto): Clinic => ({
  id: dto.id,
  name: dto.name,
  address: dto.address ?? "",
});

export const toDoctor = (dto: DoctorDto): Doctor => ({
  id: dto.id,
  firstName: dto.user.firstName,
  lastName: dto.user.lastName,
  specialty: dto.primarySpecialty,
  experienceYears: dto.yearsOfPractice,
  bio: dto.bio ?? undefined,
  clinic: toClinic(dto.clinic),
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
  specialties: async (): Promise<string[]> => {
    const response = await apiRequest<ApiResponse<string[]>>(
      "api/doctors/specialties",
    );
    return response.data ?? [];
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
};
