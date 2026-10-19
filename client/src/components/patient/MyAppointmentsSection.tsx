import { useState } from "react";
import { format } from "date-fns";
import { PractitionerCalendarIcon } from "../../assets/icons/Icons";
import {
  useAppointments,
  useCancelAppointment,
} from "../../hooks/useAppointments";
import type { Appointment } from "../../types/appointment";
import { getUpcomingAppointments } from "../../utils/appointments";
import { notify } from "../../utils/notify";
import Button from "../../shared/ui/Button";
import FieldError from "../../shared/ui/FieldError";
import Modal from "../../shared/ui/Modal";
import QueryState from "../../shared/ui/QueryState";
import AppointmentList from "../appointments/AppointmentList";
import { getDoctorName } from "../doctors/DoctorCard";

type MyAppointmentsSectionProps = {
  onFindDoctor: () => void;
};

function MyAppointmentsSection({ onFindDoctor }: MyAppointmentsSectionProps) {
  const { data = [], isPending, error } = useAppointments();
  const cancelAppointment = useCancelAppointment();
  const [toCancel, setToCancel] = useState<Appointment | null>(null);

  const closeCancelDialog = () => {
    cancelAppointment.reset();
    setToCancel(null);
  };

  const handleConfirmCancel = () => {
    if (!toCancel) return;
    cancelAppointment.mutate(toCancel.id, {
      onSuccess: () => {
        notify.success(
          "Appointment cancelled",
          `Your visit with ${getDoctorName(toCancel.doctor)} on ${format(new Date(toCancel.startsAt), "d MMMM 'at' HH:mm")} was cancelled.`,
        );
        setToCancel(null);
      },
    });
  };

  return (
    <QueryState error={error} isPending={isPending}>
      <AppointmentList
        appointments={getUpcomingAppointments(data)}
        emptyAction={<Button onClick={onFindDoctor}>Find a Doctor</Button>}
        emptyDescription="Book a visit with one of our specialists."
        emptyIcon={PractitionerCalendarIcon}
        emptyTitle="No upcoming appointments"
        onCancel={setToCancel}
      />

      {toCancel && (
        <Modal
          footer={
            <>
              <Button onClick={closeCancelDialog} variant="secondary">
                Keep Appointment
              </Button>
              <Button
                disabled={cancelAppointment.isPending}
                onClick={handleConfirmCancel}
              >
                Cancel Appointment
              </Button>
            </>
          }
          onClose={closeCancelDialog}
          open
          title="Cancel appointment?"
        >
          <p className="text-body-md text-on-surface-variant">
            Your appointment with{" "}
            <span className="text-on-surface">
              {getDoctorName(toCancel.doctor)}
            </span>{" "}
            on {format(new Date(toCancel.startsAt), "d MMMM yyyy 'at' HH:mm")}{" "}
            will be cancelled.
          </p>
          <FieldError
            id="cancel-appointment-error"
            message={cancelAppointment.error?.message}
          />
        </Modal>
      )}
    </QueryState>
  );
}

export default MyAppointmentsSection;
