import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { doctorsApi } from "../api/doctors.api";
import type { DoctorFiltersValue } from "../types/doctor";

export const doctorsQueryKey = ["doctors"] as const;

export function useDoctors(filters: DoctorFiltersValue) {
  return useQuery({
    queryKey: [...doctorsQueryKey, "list", filters],
    queryFn: () => doctorsApi.list(filters),
    // Keep the current list visible while the next filter result loads
    placeholderData: keepPreviousData,
  });
}

export function useSpecialties() {
  return useQuery({
    queryKey: [...doctorsQueryKey, "specialties"],
    queryFn: doctorsApi.specialties,
  });
}

export const doctorSlotsQueryKey = (doctorId: string, date: string) =>
  [...doctorsQueryKey, doctorId, "slots", date] as const;

export function useDoctorSlots(doctorId: string | undefined, date?: Date) {
  const day = date ? format(date, "yyyy-MM-dd") : "";

  return useQuery({
    queryKey: doctorSlotsQueryKey(doctorId ?? "", day),
    queryFn: () => doctorsApi.slots(doctorId!, day),
    enabled: !!doctorId && !!date,
    // Availability changes as other patients book — keep it fresh
    staleTime: 30 * 1000,
  });
}

export function useClinics() {
  return useQuery({
    queryKey: ["clinics"],
    queryFn: doctorsApi.clinics,
  });
}

export function useClinicSpecialties(clinicId: string | undefined) {
  return useQuery({
    queryKey: ["clinics", clinicId, "specialties"],
    queryFn: () => doctorsApi.clinicSpecialties(clinicId!),
    enabled: !!clinicId,
  });
}
