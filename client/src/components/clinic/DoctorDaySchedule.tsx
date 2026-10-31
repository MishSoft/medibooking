import { AppointmentStatus } from "../../types/appointment";
import type { ClinicAppointment, ClinicDoctor } from "../../types/clinic";
import Avatar from "../../shared/ui/Avatar";
import Button from "../../shared/ui/Button";
import Tag from "../../shared/ui/Tag";
import {
  formatWorkingHours,
  getSlotsPerDay,
  getWorkingDay,
} from "../../utils/schedule";
import { getDoctorName } from "../doctors/DoctorCard";
import ClinicAppointmentCard from "./ClinicAppointmentCard";

type DoctorDayScheduleProps = {
  doctor: ClinicDoctor;
  date: Date;
  appointments: ClinicAppointment[];
  onEditSchedule: (doctor: ClinicDoctor) => void;
};

// One doctor's working hours, load and appointments for a single day
function DoctorDaySchedule({
  doctor,
  date,
  appointments,
  onEditSchedule,
}: DoctorDayScheduleProps) {
  // The selected date's own hours; undefined on a day off
  const workingDay = getWorkingDay(doctor.schedule, date);
  const isWorking = workingDay !== undefined;
  const capacity = workingDay ? getSlotsPerDay(workingDay) : 0;
  const booked = appointments.filter(
    (apt) => apt.status !== AppointmentStatus.CANCELLED,
  ).length;

  return (
    <section
      aria-label={getDoctorName(doctor)}
      className="space-y-3"
    >
      <header className="flex flex-wrap items-center gap-3">
        <Avatar name={`${doctor.firstName} ${doctor.lastName}`} size="sm" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-headline-sm">{getDoctorName(doctor)}</h3>
          <p className="text-body-sm text-on-surface-variant">
            {doctor.specialty}
          </p>
        </div>
        {workingDay ? (
          <>
            <Tag tone="info">
              <span className="font-code">
                {formatWorkingHours(workingDay)}
              </span>
            </Tag>
            <Tag tone={booked >= capacity ? "warning" : "neutral"}>
              {booked} / {capacity} SLOTS
            </Tag>
          </>
        ) : (
          <Tag>DAY OFF</Tag>
        )}
        <Button onClick={() => onEditSchedule(doctor)} variant="secondary">
          Edit Schedule
        </Button>
      </header>

      {appointments.length > 0 ? (
        <ul className="space-y-3">
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <ClinicAppointmentCard
                appointment={appointment}
                showDoctor={false}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl bg-surface-container px-4 py-3 text-body-sm text-on-surface-variant">
          {isWorking
            ? "No appointments booked for this day."
            : "Not working on this day."}
        </p>
      )}
    </section>
  );
}

export default DoctorDaySchedule;
