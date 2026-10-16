import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  format,
  startOfDay,
  startOfMonth,
  startOfToday,
  subMonths,
} from "date-fns";
import { ClinicCalendarIcon } from "../../assets/icons/Icons";
import {
  useClinicAppointments,
  useClinicDoctors,
} from "../../hooks/useClinic";
import type { ClinicDoctor } from "../../types/clinic";
import DatePicker from "../../shared/ui/DatePicker";
import EmptyState from "../../shared/ui/EmptyState";
import QueryState from "../../shared/ui/QueryState";
import Select from "../../shared/ui/Select";
import { getDoctorName } from "../doctors/DoctorCard";
import DoctorDaySchedule from "./DoctorDaySchedule";
import EditScheduleModal from "./EditScheduleModal";

type ClinicScheduleSectionProps = {
  doctorId?: string;
  onDoctorChange: (doctorId: string) => void;
};

const today = startOfToday();

function ClinicScheduleSection({
  doctorId = "",
  onDoctorChange,
}: ClinicScheduleSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [editingDoctor, setEditingDoctor] = useState<ClinicDoctor | null>(
    null,
  );

  const dayFilters = useMemo(() => {
    const from = startOfDay(selectedDate);
    return {
      from: from.toISOString(),
      to: addDays(from, 1).toISOString(),
      doctorId: doctorId || undefined,
    };
  }, [selectedDate, doctorId]);

  const doctorsQuery = useClinicDoctors();
  const appointmentsQuery = useClinicAppointments(dayFilters);
  const doctors = doctorsQuery.data ?? [];
  const appointments = appointmentsQuery.data ?? [];

  const visibleDoctors = doctorId
    ? doctors.filter((doctor) => doctor.id === doctorId)
    : doctors;

  return (
    <div className="grid gap-8 md:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center gap-5 md:items-stretch">
        <DatePicker
          endMonth={addMonths(today, 3)}
          // Re-clicking the selected day would clear it; keep a day selected
          onSelect={(date) => date && setSelectedDate(date)}
          selected={selectedDate}
          startMonth={startOfMonth(subMonths(today, 1))}
        />
        <Select
          className="w-full"
          label="Doctor"
          onChange={(event) => onDoctorChange(event.target.value)}
          options={doctors.map((doctor) => ({
            value: doctor.id,
            label: getDoctorName(doctor),
          }))}
          placeholder="All doctors"
          value={doctorId}
        />
      </div>

      <div className="min-w-0 space-y-4">
        <p
          aria-live="polite"
          className="text-label-md text-on-surface-variant"
        >
          {format(selectedDate, "EEEE, d MMMM yyyy")} ·{" "}
          {appointmentsQuery.isFetching
            ? "Loading…"
            : `${appointments.length} appointment${appointments.length === 1 ? "" : "s"}`}
        </p>

        <QueryState
          error={doctorsQuery.error ?? appointmentsQuery.error}
          isPending={doctorsQuery.isPending || appointmentsQuery.isPending}
        >
          {visibleDoctors.length > 0 ? (
            <div className="space-y-6">
              {visibleDoctors.map((doctor) => (
                <DoctorDaySchedule
                  appointments={appointments.filter(
                    (apt) => apt.doctor.id === doctor.id,
                  )}
                  date={selectedDate}
                  doctor={doctor}
                  key={doctor.id}
                  onEditSchedule={setEditingDoctor}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              description="Register doctors to start coordinating their schedules."
              icon={ClinicCalendarIcon}
              title="No doctors to schedule"
            />
          )}
        </QueryState>
      </div>

      {editingDoctor && (
        <EditScheduleModal
          doctor={editingDoctor}
          onClose={() => setEditingDoctor(null)}
        />
      )}
    </div>
  );
}

export default ClinicScheduleSection;
