import { useQuery } from "@tanstack/react-query";
import { prescriptionsApi } from "../api/prescriptions.api";

export const prescriptionsQueryKey = ["prescriptions"] as const;

export function usePrescriptions() {
  return useQuery({
    queryKey: prescriptionsQueryKey,
    queryFn: prescriptionsApi.list,
  });
}
