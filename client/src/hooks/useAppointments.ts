import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  appointmentsApi,
  type CreateAppointmentPayload,
} from "../api/appointments.api";

export const appointmentsQueryKey = ["appointments"] as const;

export function useAppointments() {
  return useQuery({
    queryKey: appointmentsQueryKey,
    queryFn: appointmentsApi.list,
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) =>
      appointmentsApi.create(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: appointmentsQueryKey }),
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.cancel(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: appointmentsQueryKey }),
  });
}
