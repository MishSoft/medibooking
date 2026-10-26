import {
  ClinicBuildingIcon,
  ClockHistoryIcon,
  PractitionerCalendarIcon,
} from "../../assets/icons/Icons";
import type { Doctor } from "../../types/doctor";
import { formatSchedule } from "../../utils/schedule";
import Avatar from "../../shared/ui/Avatar";
import Button from "../../shared/ui/Button";
import Tag from "../../shared/ui/Tag";

type DoctorCardProps = {
  doctor: Doctor;
  onBook?: (doctor: Doctor) => void;
};

export const getDoctorName = (doctor: Doctor) =>
  `Dr. ${doctor.firstName} ${doctor.lastName}`;

function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  const name = getDoctorName(doctor);

  return (
    <article className="flex h-full flex-col gap-4 rounded-xl bg-surface-container p-5 shadow-elevation-2">
      <div className="flex items-start gap-4">
        <Avatar name={`${doctor.firstName} ${doctor.lastName}`} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-headline-sm">{name}</h3>
          <div className="mt-1 flex flex-wrap gap-2">
            <Tag tone="secondary">{doctor.specialty}</Tag>
            {doctor.experienceYears !== undefined && (
              <Tag>{doctor.experienceYears} yrs exp.</Tag>
            )}
          </div>
        </div>
      </div>

      {doctor.bio && (
        <p className="text-body-sm text-on-surface-variant">{doctor.bio}</p>
      )}

      <p className="mt-auto flex items-start gap-2 text-body-sm text-on-surface-variant">
        <ClinicBuildingIcon
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
        />
        <span>
          <span className="block text-on-surface">{doctor.clinic.name}</span>
          {doctor.clinic.address}
        </span>
      </p>

      {doctor.schedule !== undefined && (
        <p className="flex items-center gap-2 text-body-sm text-on-surface-variant">
          <ClockHistoryIcon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-primary"
          />
          {doctor.schedule ? (
            <span className="font-code text-code-sm text-on-surface">
              {formatSchedule(doctor.schedule)}
            </span>
          ) : (
            <span className="text-warning">No working hours set</span>
          )}
        </p>
      )}

      {onBook && (
        <Button
          aria-label={`Book appointment with ${name}`}
          className="w-full"
          onClick={() => onBook(doctor)}
        >
          <PractitionerCalendarIcon aria-hidden="true" className="h-4 w-4" />
          Book Appointment
        </Button>
      )}
    </article>
  );
}

export default DoctorCard;
