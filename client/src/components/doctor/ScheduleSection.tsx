import { useState } from "react";
import { format } from "date-fns";
import { PractitionerCalendarIcon } from "../../assets/icons/Icons";
import {
  useCompleteAppointment,
  useDoctorAppointments,
} from "../../hooks/useAppointments";
import type { Appointment } from "../../types/appointment";
import {
  getAppointmentsOn,
  getAwaitingCompletion,
  getUpcomingAppointments,
  isAwaitingCompletion,
} from "../../utils/appointments";
import Button from "../../shared/ui/Button";
import DatePicker from "../../shared/ui/DatePicker";
import EmptyState from "../../shared/ui/EmptyState";
import QueryState from "../../shared/ui/QueryState";
import { notify } from "../../utils/notify";
import DoctorAppointmentCard from "./DoctorAppointmentCard";
import { getPatientName } from "./PatientVisitCard";
import VisitRecordModal from "./VisitRecordModal";
import WorkingHoursSummary from "./WorkingHoursSummary";

type AppointmentGroupProps = {
  title: string;
  appointments: Appointment[];
  onComplete: (appointment: Appointment) => void;
};

function AppointmentGroup({
  title,
  appointments,
  onComplete,
}: AppointmentGroupProps) {
  if (appointments.length === 0) return null;

  return (
    <section className="space-y-3">
      <h3 className="text-label-md tracking-widest text-on-surface-variant">
        {title.toUpperCase()} · {appointments.length}
      </h3>
      {appointments.map((appointment) => (
        <DoctorAppointmentCard
          appointment={appointment}
          key={appointment.id}
          onComplete={
            isAwaitingCompletion(appointment) ? onComplete : undefined
          }
        />
      ))}
    </section>
  );
}

function ScheduleSection() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [toComplete, setToComplete] = useState<Appointment | null>(null);
  const { data = [], isPending, error } = useDoctorAppointments();
  const completeAppointment = useCompleteAppointment();

  const awaitingCompletion = getAwaitingCompletion(data);
  const upcoming = getUpcomingAppointments(data);
  const dayAppointments = selectedDate
    ? getAppointmentsOn(data, selectedDate)
    : [];
  const bookedDays = [...awaitingCompletion, ...upcoming].map(
    (appointment) => new Date(appointment.startsAt),
  );
  const hasOverview = awaitingCompletion.length > 0 || upcoming.length > 0;

  const closeCompleteDialog = () => {
    completeAppointment.reset();
    setToComplete(null);
  };

  return (
    <QueryState error={error} isPending={isPending}>
      <div className="space-y-6">
        <WorkingHoursSummary />

        <div className="grid gap-8 md:grid-cols-[auto_1fr]">
          <div className="flex justify-center md:block">
            <DatePicker
              marked={bookedDays}
              onSelect={setSelectedDate}
              selected={selectedDate}
            />
          </div>

          <div className="min-w-0 space-y-6">
            {selectedDate ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-headline-sm">
                    {format(selectedDate, "EEEE, d MMMM yyyy")}
                  </p>
                  <Button
                    onClick={() => setSelectedDate(undefined)}
                    variant="secondary"
                  >
                    Show all upcoming
                  </Button>
                </div>
                {dayAppointments.length > 0 ? (
                  <AppointmentGroup
                    appointments={dayAppointments}
                    onComplete={setToComplete}
                    title="Appointments"
                  />
                ) : (
                  <EmptyState
                    description="Pick another day or go back to all upcoming visits."
                    icon={PractitionerCalendarIcon}
                    title="No appointments on this day"
                  />
                )}
              </>
            ) : hasOverview ? (
              <>
                <AppointmentGroup
                  appointments={awaitingCompletion}
                  onComplete={setToComplete}
                  title="Awaiting completion"
                />
                <AppointmentGroup
                  appointments={upcoming}
                  onComplete={setToComplete}
                  title="Upcoming"
                />
              </>
            ) : (
              <EmptyState
                description="New bookings from patients will appear here."
                icon={PractitionerCalendarIcon}
                title="No upcoming appointments"
              />
            )}
          </div>
        </div>
      </div>

      {toComplete && (
        <VisitRecordModal
          appointment={toComplete}
          errorMessage={completeAppointment.error?.message}
          isPending={completeAppointment.isPending}
          onClose={closeCompleteDialog}
          onSubmit={(record) =>
            completeAppointment.mutate(
              { id: toComplete.id, record },
              {
                onSuccess: () => {
                  notify.success(
                    "Visit completed",
                    `Record saved for ${getPatientName(toComplete.patient)}.`,
                  );
                  setToComplete(null);
                },
              },
            )
          }
          pendingLabel="Completing…"
          submitLabel="Complete Visit"
          title="Complete visit"
        />
      )}
    </QueryState>
  );
}

export default ScheduleSection;
