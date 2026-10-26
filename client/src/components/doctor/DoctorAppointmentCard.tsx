import { format } from "date-fns";
import type { Appointment } from "../../types/appointment";
import Button from "../../shared/ui/Button";
import AppointmentStatusBadge from "../appointments/AppointmentStatusBadge";
import { getPatientName } from "./PatientVisitCard";

type DoctorAppointmentCardProps = {
  appointment: Appointment;
  onComplete?: (appointment: Appointment) => void;
};

function DoctorAppointmentCard({
  appointment,
  onComplete,
}: DoctorAppointmentCardProps) {
  const { patient, status, notes, diagnosis } = appointment;
  const startsAt = new Date(appointment.startsAt);

  return (
    <article className="flex flex-col gap-4 rounded-xl bg-surface-container p-4 shadow-elevation-2 sm:flex-row sm:items-center sm:p-5">
      <time
        className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-surface-container-high py-2"
        dateTime={appointment.startsAt}
      >
        <span className="text-label-md text-primary">
          {format(startsAt, "MMM").toUpperCase()}
        </span>
        <span className="text-headline-md">{format(startsAt, "d")}</span>
        <span className="font-code text-code-sm text-secondary">
          {format(startsAt, "HH:mm")}
        </span>
      </time>

      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-headline-sm">{getPatientName(patient)}</h3>
            <AppointmentStatusBadge status={status} />
          </div>
          <p className="text-body-sm text-on-surface-variant">
            {format(startsAt, "EEEE, d MMMM yyyy")}
          </p>
          {diagnosis && (
            <p className="text-body-sm text-on-surface">
              <span className="font-semibold">Diagnosis:</span> {diagnosis}
            </p>
          )}
          {notes && <p className="text-body-sm text-on-surface">{notes}</p>}
        </div>
      </div>

      {onComplete && (
        <Button
          className="sm:self-center"
          onClick={() => onComplete(appointment)}
          variant="secondary"
        >
          Complete
        </Button>
      )}
    </article>
  );
}

export default DoctorAppointmentCard;
