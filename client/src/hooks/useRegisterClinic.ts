import { useMutation } from "@tanstack/react-query";
import { authApi, type ClinicRegisterPayload } from "../api/auth.api";

export function useRegisterClinic() {
  return useMutation({
    mutationFn: (payload: ClinicRegisterPayload) =>
      authApi.registerClinic(payload),
  });
}
