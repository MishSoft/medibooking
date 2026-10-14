import { format } from "date-fns";
import { ClinicBuildingIcon } from "../../assets/icons/Icons";
import type { Appointment } from "../../types/appointment";
import Tag from "../../shared/ui/Tag";
import AppointmentStatusBadge from "../appointments/AppointmentStatusBadge";

type PatientVisitCardProps = {
  appointment: Appointment;
};

function PatientVisitCard({ appointment }: PatientVisitCardProps) {
  const { doctor, status, notes } = appointment;
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
        <div className="flex flex-wrap items-center gap-2 text-body-sm text-on-surface-variant">
          <Tag tone="secondary">{doctor.specialty}</Tag>
          <span className="inline-flex items-center gap-1.5">
            <ClinicBuildingIcon
              aria-hidden="true"
              className="h-4 w-4 text-primary"
            />
            {doctor.clinic.name}
          </span>
        </div>
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
