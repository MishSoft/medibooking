import { ClockHistoryIcon } from "../../assets/icons/Icons";
import { useAppointments } from "../../hooks/useAppointments";
import { getPastAppointments } from "../../utils/appointments";
import QueryState from "../../shared/ui/QueryState";
import AppointmentList from "../appointments/AppointmentList";

function AppointmentHistorySection() {
  const { data = [], isPending, error } = useAppointments();

  return (
    <QueryState error={error} isPending={isPending}>
      <AppointmentList
        appointments={getPastAppointments(data)}
        emptyDescription="Completed and cancelled visits will appear here."
        emptyIcon={ClockHistoryIcon}
        emptyTitle="No past appointments"
      />
    </QueryState>
  );
}

export default AppointmentHistorySection;
