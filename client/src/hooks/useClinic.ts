import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { format } from "date-fns";
import {
  clinicApi,
  type CancelAppointmentPayload,
  type RescheduleAppointmentPayload,
  type UpdateDoctorSchedulePayload,
} from "../api/clinic.api";
import type { ClinicAppointmentsFilters, DateRange } from "../types/clinic";

export const clinicQueryKey = ["clinic"] as const;

export function useClinicDoctors() {
  return useQuery({
    queryKey: [...clinicQueryKey, "doctors"],
    queryFn: clinicApi.doctors,
  });
}

export function useClinicAppointments(filters: ClinicAppointmentsFilters = {}) {
  return useQuery({
    queryKey: [...clinicQueryKey, "appointments", filters],
    queryFn: () => clinicApi.appointments(filters),
    // Keep the current list visible while the next filter result loads
    placeholderData: keepPreviousData,
  });
}

export function useClinicDoctorSlots(doctorId: string, date?: Date) {
  const day = date ? format(date, "yyyy-MM-dd") : "";

  return useQuery({
    queryKey: [...clinicQueryKey, "slots", doctorId, day],
    queryFn: () => clinicApi.slots(doctorId, day),
    enabled: !!date,
    // Availability changes as patients book — keep it fresh
    staleTime: 30 * 1000,
  });
}

export function useClinicStats(range: DateRange) {
  return useQuery({
    queryKey: [...clinicQueryKey, "stats", range],
    queryFn: () => clinicApi.stats(range),
    placeholderData: keepPreviousData,
  });
}

// Appointment and schedule changes affect lists, calendars and stats alike
function useClinicMutation<TPayload, TResult>(
  mutationFn: (payload: TPayload) => Promise<TResult>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: clinicQueryKey }),
  });
}

export const useRescheduleAppointment = () =>
  useClinicMutation((payload: RescheduleAppointmentPayload) =>
    clinicApi.reschedule(payload),
  );

export const useCancelClinicAppointment = () =>
  useClinicMutation((payload: CancelAppointmentPayload) =>
    clinicApi.cancel(payload),
  );

export const useUpdateDoctorSchedule = () =>
  useClinicMutation((payload: UpdateDoctorSchedulePayload) =>
    clinicApi.updateSchedule(payload),
  );
