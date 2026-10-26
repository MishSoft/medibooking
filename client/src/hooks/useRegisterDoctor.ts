import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, type DoctorRegisterPayload } from "../api/auth.api";
import { clinicQueryKey } from "./useClinic";
import { doctorsQueryKey } from "./useDoctors";

export function useRegisterDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DoctorRegisterPayload) =>
      authApi.registerDoctor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicQueryKey });
      queryClient.invalidateQueries({ queryKey: doctorsQueryKey });
    },
  });
}
