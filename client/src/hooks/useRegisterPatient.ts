import { useMutation } from "@tanstack/react-query";
import { authApi, type PatientRegisterPayload } from "../api/auth.api";

export function useRegisterPatient() {
  return useMutation({
    mutationFn: (payload: PatientRegisterPayload) =>
      authApi.registerPatient(payload),
  });
}
