import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  appointmentsApi,
  type CreateAppointmentPayload,
} from "../api/appointments.api";
import type { VisitRecordPayload } from "../types/appointment";

export const appointmentsQueryKey = ["appointments"] as const;
export const doctorAppointmentsQueryKey = [
  ...appointmentsQueryKey,
  "doctor",
] as const;
export const doctorPatientsQueryKey = ["doctor", "patients"] as const;

type VisitRecordVariables = { id: string; record: VisitRecordPayload };

export function useAppointments() {
  return useQuery({
    queryKey: appointmentsQueryKey,
    queryFn: appointmentsApi.list,
  });
}

export function useDoctorAppointments() {
  return useQuery({
    queryKey: doctorAppointmentsQueryKey,
    queryFn: appointmentsApi.listForDoctor,
  });
}

export function useDoctorPatients() {
  return useQuery({
    queryKey: doctorPatientsQueryKey,
    queryFn: appointmentsApi.listDoctorPatients,
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

export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, record }: VisitRecordVariables) =>
      appointmentsApi.complete(id, record),
    // A completed visit can add a patient to the prescribable list
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorAppointmentsQueryKey }),
        queryClient.invalidateQueries({ queryKey: doctorPatientsQueryKey }),
      ]),
  });
}

export function useMarkNoShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.markNoShow(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: doctorAppointmentsQueryKey }),
  });
}

export function useUpdateVisitRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, record }: VisitRecordVariables) =>
      appointmentsApi.updateRecord(id, record),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: doctorAppointmentsQueryKey }),
  });
}
