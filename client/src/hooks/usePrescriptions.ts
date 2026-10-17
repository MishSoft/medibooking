import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  prescriptionsApi,
  type CreatePrescriptionPayload,
  type UpdatePrescriptionPayload,
} from "../api/prescriptions.api";

export const prescriptionsQueryKey = ["prescriptions"] as const;
export const doctorPrescriptionsQueryKey = [
  ...prescriptionsQueryKey,
  "doctor",
] as const;

export function useDoctorPrescriptions() {
  return useQuery({
    queryKey: doctorPrescriptionsQueryKey,
    queryFn: prescriptionsApi.listForDoctor,
  });
}

export function usePatientPrescriptions() {
  return useQuery({
    queryKey: [...prescriptionsQueryKey, "patient"],
    queryFn: prescriptionsApi.listMine,
  });
}

export function useAddPrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePrescriptionPayload) =>
      prescriptionsApi.create(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: doctorPrescriptionsQueryKey }),
  });
}

export function useUpdatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePrescriptionPayload;
    }) => prescriptionsApi.update(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: doctorPrescriptionsQueryKey }),
  });
}
