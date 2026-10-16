import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";

export const meQueryKey = ["me"] as const;

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: async () => {
      const response = await authApi.me();
      if (!response.data) throw new Error("Could not load your profile.");
      return response.data;
    },
  });
}
