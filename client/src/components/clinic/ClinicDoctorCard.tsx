import {
  ClockHistoryIcon,
  EmailIcon,
  PractitionerCalendarIcon,
} from "../../assets/icons/Icons";
import type { ClinicDoctor } from "../../types/clinic";
import Avatar from "../../shared/ui/Avatar";
import Button from "../../shared/ui/Button";
import Tag from "../../shared/ui/Tag";
import {
  formatScheduleHours,
  formatSlotMinutes,
  formatWorkingDays,
  getWorkingWeekdays,
} from "../../utils/schedule";
import { getDoctorName } from "../doctors/DoctorCard";

type ClinicDoctorCardProps = {
  doctor: ClinicDoctor;
  onViewSchedule?: (doctor: ClinicDoctor) => void;
};

function ClinicDoctorCard({ doctor, onViewSchedule }: ClinicDoctorCardProps) {
  const name = getDoctorName(doctor);
  const { schedule } = doctor;

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

      <dl className="space-y-2 text-body-sm text-on-surface-variant">
        <div className="flex items-center gap-2">
          <dt>
            <EmailIcon aria-hidden="true" className="h-4 w-4 text-primary" />
            <span className="sr-only">Email</span>
          </dt>
          <dd className="min-w-0 truncate">
            <a
              className="text-on-surface hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
              href={`mailto:${doctor.email}`}
            >
              {doctor.email}
            </a>
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt>
            <PractitionerCalendarIcon
              aria-hidden="true"
              className="h-4 w-4 text-primary"
            />
            <span className="sr-only">Working days</span>
          </dt>
          <dd>{formatWorkingDays(getWorkingWeekdays(schedule))}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt>
            <ClockHistoryIcon
              aria-hidden="true"
              className="h-4 w-4 text-primary"
            />
            <span className="sr-only">Working hours</span>
          </dt>
          <dd>
            <span className="font-code text-code-sm text-secondary">
              {formatScheduleHours(schedule)}
            </span>{" "}
            · {formatSlotMinutes(schedule)} min slots
          </dd>
        </div>
      </dl>

      {onViewSchedule && (
        <Button
          aria-label={`View schedule of ${name}`}
          className="mt-auto w-full"
          onClick={() => onViewSchedule(doctor)}
          variant="secondary"
        >
          <PractitionerCalendarIcon aria-hidden="true" className="h-4 w-4" />
          View Schedule
        </Button>
      )}
    </article>
  );
}

export default ClinicDoctorCard;
