import type { ReactNode } from "react";
import { format } from "date-fns";
import { PatientProfileIcon } from "../../assets/icons/Icons";
import type { ClinicAppointment } from "../../types/clinic";
import Tag from "../../shared/ui/Tag";
import AppointmentStatusBadge from "../appointments/AppointmentStatusBadge";
import { getDoctorName } from "../doctors/DoctorCard";

type ClinicAppointmentCardProps = {
  appointment: ClinicAppointment;
  // Hidden where the card is already grouped under its doctor
  showDoctor?: boolean;
  actions?: ReactNode;
};

function ClinicAppointmentCard({
  appointment,
  showDoctor = true,
  actions,
}: ClinicAppointmentCardProps) {
  const { patient, doctor, status, rescheduledFrom, cancellationReason } =
    appointment;
  const startsAt = new Date(appointment.startsAt);

  return (
    <article className="flex flex-col gap-4 rounded-xl bg-surface-container p-4 shadow-elevation-2 sm:flex-row sm:items-center">
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

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="inline-flex items-center gap-1.5 text-headline-sm">
            <PatientProfileIcon
              aria-hidden="true"
              className="h-4 w-4 text-primary"
            />
            {patient.firstName} {patient.lastName}
          </h3>
          <AppointmentStatusBadge status={status} />
          {rescheduledFrom && <Tag tone="warning">RESCHEDULED</Tag>}
        </div>

        {showDoctor && (
          <div className="flex flex-wrap items-center gap-2 text-body-sm text-on-surface-variant">
            <span className="text-on-surface">{getDoctorName(doctor)}</span>
            <Tag tone="secondary">{doctor.specialty}</Tag>
          </div>
        )}

        {rescheduledFrom && (
          <p className="text-body-sm text-on-surface-variant">
            Moved from{" "}
            <time dateTime={rescheduledFrom}>
              {format(new Date(rescheduledFrom), "EEE, d MMM yyyy · HH:mm")}
            </time>
          </p>
        )}
        {cancellationReason && (
          <p className="text-body-sm text-on-surface-variant">
            Reason: <span className="text-on-surface">{cancellationReason}</span>
          </p>
        )}
        {patient.phone && (
          <p className="font-code text-code-sm text-on-surface-variant">
            {patient.phone}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap gap-2 sm:self-center">{actions}</div>
      )}
    </article>
  );
}

export default ClinicAppointmentCard;
