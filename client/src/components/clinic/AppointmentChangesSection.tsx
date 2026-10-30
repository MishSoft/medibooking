import { useMemo, useState } from "react";
import { startOfToday, subDays } from "date-fns";
import { ClockHistoryIcon } from "../../assets/icons/Icons";
import {
  useClinicAppointments,
  useClinicDoctors,
} from "../../hooks/useClinic";
import { AppointmentStatus } from "../../types/appointment";
import type {
  ClinicAppointment,
  ClinicAppointmentsFilters,
} from "../../types/clinic";
import Button from "../../shared/ui/Button";
import EmptyState from "../../shared/ui/EmptyState";
import QueryState from "../../shared/ui/QueryState";
import SegmentedControl from "../../shared/ui/SegmentedControl";
import Select from "../../shared/ui/Select";
import { getDoctorName } from "../doctors/DoctorCard";
import CancelAppointmentModal from "./CancelAppointmentModal";
import ClinicAppointmentCard from "./ClinicAppointmentCard";
import RescheduleModal from "./RescheduleModal";

type ChangeView = "cancelled" | "rescheduled" | "open";
type Period = "upcoming" | "past" | "all";

const PAGE_SIZE = 20;

const viewFilters: Record<ChangeView, (apt: ClinicAppointment) => boolean> = {
  cancelled: (apt) => apt.status === AppointmentStatus.CANCELLED,
  rescheduled: (apt) =>
    !!apt.rescheduledFrom && apt.status !== AppointmentStatus.CANCELLED,
  // Not cancelled and no outcome recorded yet
  open: (apt) =>
    apt.status === AppointmentStatus.SCHEDULED ||
    apt.status === AppointmentStatus.PENDING,
};

const emptyMessages: Record<ChangeView, string> = {
  cancelled: "No cancelled appointments for these filters.",
  rescheduled: "No rescheduled appointments for these filters.",
  open: "No open appointments for these filters.",
};

const periodOptions = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past 30 days" },
  { value: "all", label: "All time" },
];

const getPeriodRange = (period: Period) => {
  const today = startOfToday();
  if (period === "upcoming") return { from: today.toISOString() };
  if (period === "past") {
    return {
      from: subDays(today, 30).toISOString(),
      to: today.toISOString(),
    };
  }
  return {};
};

function AppointmentChangesSection() {
  const [view, setView] = useState<ChangeView>("cancelled");
  const [period, setPeriod] = useState<Period>("all");
  const [doctorId, setDoctorId] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [rescheduling, setRescheduling] = useState<ClinicAppointment | null>(
    null,
  );
  const [cancelling, setCancelling] = useState<ClinicAppointment | null>(null);

  const filters = useMemo<ClinicAppointmentsFilters>(
    () => ({ ...getPeriodRange(period), doctorId: doctorId || undefined }),
    [period, doctorId],
  );

  const { data: doctors = [] } = useClinicDoctors();
  const {
    data: appointments = [],
    isPending,
    isPlaceholderData,
    error,
  } = useClinicAppointments(filters);

  const counts = {
    cancelled: appointments.filter(viewFilters.cancelled).length,
    rescheduled: appointments.filter(viewFilters.rescheduled).length,
    open: appointments.filter(viewFilters.open).length,
  };
  const listed = appointments.filter(viewFilters[view]);
  const visible = listed.slice(0, visibleCount);

  // Any filter change starts the list from the first page again
  const withPageReset =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setVisibleCount(PAGE_SIZE);
    };

  const renderActions = (appointment: ClinicAppointment) => {
    // Past appointments are history only
    if (new Date(appointment.startsAt) <= new Date()) return undefined;

    if (appointment.status === AppointmentStatus.CANCELLED) {
      return (
        <Button onClick={() => setRescheduling(appointment)} variant="secondary">
          Rebook
        </Button>
      );
    }

    return (
      <>
        <Button onClick={() => setRescheduling(appointment)} variant="secondary">
          Reschedule
        </Button>
        <Button onClick={() => setCancelling(appointment)} variant="secondary">
          Cancel
        </Button>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SegmentedControl
          ariaLabel="Appointment changes view"
          onChange={withPageReset(setView)}
          options={[
            { value: "cancelled", label: "Cancelled", count: counts.cancelled },
            {
              value: "rescheduled",
              label: "Rescheduled",
              count: counts.rescheduled,
            },
            { value: "open", label: "Open", count: counts.open },
          ]}
          value={view}
        />
        <div className="grid w-full gap-4 sm:w-auto sm:grid-cols-2">
          <Select
            label="Period"
            onChange={(event) =>
              withPageReset(setPeriod)(event.target.value as Period)
            }
            options={periodOptions}
            value={period}
          />
          <Select
            label="Doctor"
            onChange={(event) => withPageReset(setDoctorId)(event.target.value)}
            options={doctors.map((doctor) => ({
              value: doctor.id,
              label: getDoctorName(doctor),
            }))}
            placeholder="All doctors"
            value={doctorId}
          />
        </div>
      </div>

      <QueryState error={error} isPending={isPending}>
        {listed.length > 0 ? (
          // Previous results stay visible, dimmed, while new filters load
          <div
            aria-busy={isPlaceholderData}
            className={`space-y-3 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
          >
            <p
              aria-live="polite"
              className="text-body-sm text-on-surface-variant"
            >
              Showing {visible.length} of {listed.length} appointment
              {listed.length === 1 ? "" : "s"}
            </p>
            <ul className="space-y-3">
              {visible.map((appointment) => (
                <li key={appointment.id}>
                  <ClinicAppointmentCard
                    actions={renderActions(appointment)}
                    appointment={appointment}
                  />
                </li>
              ))}
            </ul>
            {visible.length < listed.length && (
              <div className="flex justify-center">
                <Button
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  variant="secondary"
                >
                  Show more
                </Button>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            description={emptyMessages[view]}
            icon={ClockHistoryIcon}
            title="Nothing to show"
          />
        )}
      </QueryState>

      {rescheduling && (
        <RescheduleModal
          appointment={rescheduling}
          onClose={() => setRescheduling(null)}
        />
      )}
      {cancelling && (
        <CancelAppointmentModal
          appointment={cancelling}
          onClose={() => setCancelling(null)}
        />
      )}
    </div>
  );
}

export default AppointmentChangesSection;
