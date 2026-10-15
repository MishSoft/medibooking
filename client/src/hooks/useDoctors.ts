import { keepPreviousData, useQuery } from "@tanstack/react-query";
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

export function useClinics() {
  return useQuery({
    queryKey: ["clinics"],
    queryFn: doctorsApi.clinics,
  });
}
