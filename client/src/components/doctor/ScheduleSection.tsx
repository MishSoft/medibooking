import { useState } from "react";
import { startOfToday } from "date-fns";
import { PractitionerCalendarIcon } from "../../assets/icons/Icons";
import { useAppointments } from "../../hooks/useAppointments";
import {
  getUpcomingAppointments,
} from "../../utils/appointments";
import DatePicker from "../../shared/ui/DatePicker";
import QueryState from "../../shared/ui/QueryState";
import EmptyState from "../../shared/ui/EmptyState";
import DoctorAppointmentCard from "./DoctorAppointmentCard";

function ScheduleSection() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { data = [], isPending, error } = useAppointments();
  const upcomingAppointments = getUpcomingAppointments(data);

  const appointmentsForDate = selectedDate
    ? upcomingAppointments.filter((apt) => {
        const aptDate = new Date(apt.startsAt);
        return (
          aptDate.getFullYear() === selectedDate.getFullYear() &&
          aptDate.getMonth() === selectedDate.getMonth() &&
          aptDate.getDate() === selectedDate.getDate()
        );
      })
    : upcomingAppointments;

  const hasAppointmentsToday =
    upcomingAppointments.length > 0 && !selectedDate;

  return (
    <QueryState error={error} isPending={isPending}>
      <div className="grid gap-8 md:grid-cols-[auto_1fr]">
        <div className="flex justify-center md:block">
          <DatePicker
            endMonth={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
            onSelect={setSelectedDate}
            selected={selectedDate}
            startMonth={startOfToday()}
          />
        </div>

        <div className="space-y-4">
          {appointmentsForDate.length > 0 ? (
            <div className="space-y-3">
              {selectedDate && (
                <p className="text-label-md text-on-surface-variant">
                  {appointmentsForDate.length} appointment
                  {appointmentsForDate.length === 1 ? "" : "s"} on{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
              {appointmentsForDate.map((appointment) => (
                <DoctorAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              description={
                selectedDate
                  ? "No appointments scheduled for this date."
                  : "No upcoming appointments scheduled."
              }
              icon={PractitionerCalendarIcon}
              title="No appointments"
            />
          )}
        </div>
      </div>
    </QueryState>
  );
}

export default ScheduleSection;
