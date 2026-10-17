import { format } from "date-fns";
import type { Appointment } from "../../types/appointment";
import type { Patient } from "../../types/patient";
import AppointmentStatusBadge from "../appointments/AppointmentStatusBadge";

export const getPatientName = (patient?: Patient) =>
  patient ? `${patient.firstName} ${patient.lastName}` : "Unknown patient";

type PatientVisitCardProps = {
  appointment: Appointment;
};

function PatientVisitCard({ appointment }: PatientVisitCardProps) {
  const { patient, status, notes } = appointment;
  const startsAt = new Date(appointment.startsAt);

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface-container p-4 shadow-elevation-1 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <time className="font-code text-code-sm text-secondary">
            {format(startsAt, "MMM d, yyyy · HH:mm")}
          </time>
          <AppointmentStatusBadge status={status} />
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-headline-sm">{getPatientName(patient)}</h3>
        {notes && (
          <p className="text-body-sm text-on-surface">
            <span className="font-semibold">Notes:</span> {notes}
          </p>
        )}
      </div>
    </article>
  );
}

export default PatientVisitCard;
