import { format } from "date-fns";
import {
  ClinicBuildingIcon,
  PractitionerCalendarIcon,
} from "../../assets/icons/Icons";
import type { Doctor } from "../../types/doctor";
import Avatar from "../../shared/ui/Avatar";
import Tag from "../../shared/ui/Tag";
import { getDoctorName } from "../doctors/DoctorCard";

type BookingSummaryProps = {
  doctor: Doctor;
  start?: Date;
};

function BookingSummary({ doctor, start }: BookingSummaryProps) {
  return (
    <div className="space-y-4 rounded-xl bg-surface-container p-4 shadow-elevation-1">
      <div className="flex items-center gap-3">
        <Avatar name={`${doctor.firstName} ${doctor.lastName}`} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-headline-sm">{getDoctorName(doctor)}</p>
          <Tag tone="secondary">{doctor.specialty}</Tag>
        </div>
      </div>

      <p className="flex items-start gap-2 text-body-sm text-on-surface-variant">
        <ClinicBuildingIcon
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
        />
        <span>
          <span className="block text-on-surface">{doctor.clinic.name}</span>
          {doctor.clinic.address}
        </span>
      </p>

      <p className="flex items-center gap-2 text-body-sm">
        <PractitionerCalendarIcon
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-primary"
        />
        {start ? (
          <span className="text-on-surface">
            {format(start, "EEEE, d MMMM yyyy")}
            <span className="ml-2 font-code text-code-sm text-secondary">
              {format(start, "HH:mm")}
            </span>
          </span>
        ) : (
          <span className="text-on-surface-variant">
            Select a date and time
          </span>
        )}
      </p>
    </div>
  );
}

export default BookingSummary;
