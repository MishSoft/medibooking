import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { toDoctorSchedule } from "../api/doctors.api";

export const meQueryKey = ["me"] as const;

const fetchMe = async () => {
  const response = await authApi.me();
  if (!response.data) throw new Error("Could not load your profile.");
  return response.data;
};

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: fetchMe,
  });
}

// Signed-in doctor's working hours (read-only; managed by the clinic admin).
// null = no schedule configured.
export function useMyDoctorSchedule() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: fetchMe,
    select: (me) => {
      const schedule = me.doctorProfile?.schedule;
      return schedule ? toDoctorSchedule(schedule) : null;
    },
  });
}
