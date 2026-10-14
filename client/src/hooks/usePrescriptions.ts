import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  prescriptionsApi,
  type CreatePrescriptionPayload,
} from "../api/prescriptions.api";

export const prescriptionsQueryKey = ["prescriptions"] as const;

export function usePrescriptions() {
  return useQuery({
    queryKey: prescriptionsQueryKey,
    queryFn: prescriptionsApi.list,
  });
}

export function useAddPrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePrescriptionPayload) =>
      prescriptionsApi.create(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: prescriptionsQueryKey }),
  });
}
