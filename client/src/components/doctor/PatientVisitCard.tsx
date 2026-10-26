import { format } from "date-fns";
import { AppointmentStatus, type Appointment } from "../../types/appointment";
import type { Patient } from "../../types/patient";
import Button from "../../shared/ui/Button";
import AppointmentStatusBadge from "../appointments/AppointmentStatusBadge";

export const getPatientName = (patient?: Patient) =>
  patient ? `${patient.firstName} ${patient.lastName}` : "Unknown patient";

type PatientVisitCardProps = {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
};

function PatientVisitCard({ appointment, onEdit }: PatientVisitCardProps) {
  const { patient, status, notes, diagnosis } = appointment;
  const startsAt = new Date(appointment.startsAt);
  const isCompleted = status === AppointmentStatus.COMPLETED;

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface-container p-4 shadow-elevation-1 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <time
            className="font-code text-code-sm text-secondary"
            dateTime={appointment.startsAt}
          >
            {format(startsAt, "MMM d, yyyy · HH:mm")}
          </time>
          <AppointmentStatusBadge status={status} />
        </div>
        {onEdit && isCompleted && (
          <Button onClick={() => onEdit(appointment)} variant="secondary">
            Edit Record
          </Button>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-headline-sm">{getPatientName(patient)}</h3>
          {patient?.phone && (
            <span className="font-code text-code-sm text-on-surface-variant">
              {patient.phone}
            </span>
          )}
        </div>
        {diagnosis && (
          <p className="text-body-sm text-on-surface">
            <span className="font-semibold">Diagnosis:</span> {diagnosis}
          </p>
        )}
        {notes && (
          <p className="text-body-sm text-on-surface">
            <span className="font-semibold">Notes:</span> {notes}
          </p>
        )}
        {isCompleted && !diagnosis && !notes && (
          <p className="text-body-sm text-on-surface-variant">
            No diagnosis or notes recorded.
          </p>
        )}
      </div>
    </article>
  );
}

export default PatientVisitCard;
