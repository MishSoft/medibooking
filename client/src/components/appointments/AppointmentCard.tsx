import { format } from "date-fns";
import { ClinicBuildingIcon } from "../../assets/icons/Icons";
import type { Appointment } from "../../types/appointment";
import Avatar from "../../shared/ui/Avatar";
import Button from "../../shared/ui/Button";
import Tag from "../../shared/ui/Tag";
import { getDoctorName } from "../doctors/DoctorCard";
import AppointmentStatusBadge from "./AppointmentStatusBadge";

type AppointmentCardProps = {
  appointment: Appointment;
  onCancel?: (appointment: Appointment) => void;
};

function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  const { doctor, status, notes } = appointment;
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
        <Avatar name={`${doctor.firstName} ${doctor.lastName}`} size="sm" />
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-headline-sm">{getDoctorName(doctor)}</h3>
            <AppointmentStatusBadge status={status} />
          </div>
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
          <p className="text-body-sm text-on-surface-variant">
            {format(startsAt, "EEEE, d MMMM yyyy")}
          </p>
          {notes && <p className="text-body-sm text-on-surface">{notes}</p>}
        </div>
      </div>

      {onCancel && (
        <Button
          className="sm:self-center"
          onClick={() => onCancel(appointment)}
          variant="secondary"
        >
          Cancel
        </Button>
      )}
    </article>
  );
}

export default AppointmentCard;
