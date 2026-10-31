import { useState, type FormEvent } from "react";
import { useUpdateDoctorSchedule } from "../../hooks/useClinic";
import type {
  ClinicDoctor,
  DoctorSchedule,
  ScheduleDay,
  Weekday,
} from "../../types/clinic";
import Button from "../../shared/ui/Button";
import Input from "../../shared/ui/Input";
import Modal from "../../shared/ui/Modal";
import Select from "../../shared/ui/Select";
import { notify } from "../../utils/notify";
import { dayLabels, toTime } from "../../utils/schedule";
import { getDoctorName } from "../doctors/DoctorCard";

type EditScheduleModalProps = {
  doctor: ClinicDoctor;
  onClose: () => void;
};

type ScheduleError = {
  message: string;
  weekday?: Weekday; // the day to switch to so the problem is visible
};

const slotOptions = [15, 20, 30, 45, 60].map((minutes) => ({
  value: String(minutes),
  label: `${minutes} minutes`,
}));

const validateDay = ({ startTime, endTime, slotMinutes }: ScheduleDay) => {
  if (!startTime || !endTime) return "Set both start and end time.";

  const today = new Date();
  const minutes =
    (toTime(endTime, today).getTime() - toTime(startTime, today).getTime()) /
    60000;
  if (minutes <= 0) return "End time must be after start time.";
  if (minutes < slotMinutes) return "Working hours must fit at least one slot.";
  return "";
};

// Days turned off keep their hours and are saved too, so every day is checked
const validateSchedule = ({ days }: DoctorSchedule): ScheduleError | null => {
  if (!days.some((day) => day.isWorking)) {
    return { message: "Select at least one working day." };
  }

  for (const day of days) {
    const message = validateDay(day);
    if (message) {
      return { message: `${dayLabels[day.weekday]}: ${message}`, weekday: day.weekday };
    }
  }

  return null;
};

// Mounted only while editing, so the form starts from the doctor's current schedule
function EditScheduleModal({ doctor, onClose }: EditScheduleModalProps) {
  const [schedule, setSchedule] = useState<DoctorSchedule>(doctor.schedule);
  // Start on the first working day, or Monday when none is on
  const [selectedWeekday, setSelectedWeekday] = useState<Weekday>(
    () =>
      (doctor.schedule.days.find((day) => day.isWorking) ??
        doctor.schedule.days[0]).weekday,
  );
  const [error, setError] = useState("");
  const updateSchedule = useUpdateDoctorSchedule();

  const selectedDay = schedule.days.find(
    (day) => day.weekday === selectedWeekday,
  )!;

  // Edits apply to the selected day only; other days keep their own values
  const updateSelectedDay = (changes: Partial<ScheduleDay>) =>
    setSchedule((current) => ({
      days: current.days.map((day) =>
        day.weekday === selectedWeekday ? { ...day, ...changes } : day,
      ),
    }));

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    const validationError = validateSchedule(schedule);
    setError(validationError?.message ?? "");
    if (validationError) {
      if (validationError.weekday !== undefined) {
        setSelectedWeekday(validationError.weekday);
      }
      return;
    }

    try {
      await updateSchedule.mutateAsync({ doctorId: doctor.id, schedule });
      notify.success(`Schedule updated for ${getDoctorName(doctor)}`);
      onClose();
    } catch (mutationError) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Could not update the schedule.",
      );
    }
  };

  const isSaving = updateSchedule.isPending;

  return (
    <Modal
      description="Working hours and slot length for each day of the week."
      footer={
        <>
          <Button disabled={isSaving} onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button disabled={isSaving} onClick={() => handleSubmit()}>
            {isSaving ? "Saving..." : "Save Schedule"}
          </Button>
        </>
      }
      onClose={onClose}
      open
      title={`Schedule · ${getDoctorName(doctor)}`}
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <fieldset>
          <legend className="mb-1.5 text-label-md text-on-surface">
            Day
          </legend>
          <div className="flex flex-wrap gap-2">
            {schedule.days.map((day) => {
              const isSelected = day.weekday === selectedWeekday;

              return (
                <button
                  aria-label={`${dayLabels[day.weekday]}, ${day.isWorking ? "working" : "day off"}`}
                  aria-pressed={isSelected}
                  className={`relative min-h-11 min-w-14 cursor-pointer rounded-lg px-3 py-2 text-label-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isSelected
                      ? "bg-primary-container text-on-primary-container shadow-elevation-1"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-highest hover:text-on-surface"
                  } ${day.isWorking ? "" : "line-through opacity-70"}`}
                  key={day.weekday}
                  onClick={() => setSelectedWeekday(day.weekday)}
                  type="button"
                >
                  {dayLabels[day.weekday]}
                  {day.isWorking && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-4 rounded-xl bg-surface-container p-4">
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-label-lg text-on-surface">
              {dayLabels[selectedDay.weekday]} · Working day
            </span>
            <button
              aria-checked={selectedDay.isWorking}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                selectedDay.isWorking ? "bg-primary" : "bg-surface-highest"
              }`}
              onClick={() =>
                updateSelectedDay({ isWorking: !selectedDay.isWorking })
              }
              role="switch"
              type="button"
            >
              <span
                aria-hidden="true"
                className={`inline-block h-5 w-5 rounded-full bg-surface-lowest shadow-elevation-1 transition-transform ${
                  selectedDay.isWorking ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>

          {/* Hours stay saved while the day is off, so turning it back on restores them */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              disabled={!selectedDay.isWorking}
              label="Start time"
              onChange={(event) =>
                updateSelectedDay({ startTime: event.target.value })
              }
              required
              type="time"
              value={selectedDay.startTime}
            />
            <Input
              disabled={!selectedDay.isWorking}
              label="End time"
              onChange={(event) =>
                updateSelectedDay({ endTime: event.target.value })
              }
              required
              type="time"
              value={selectedDay.endTime}
            />
            <Select
              disabled={!selectedDay.isWorking}
              label="Slot length"
              onChange={(event) =>
                updateSelectedDay({ slotMinutes: Number(event.target.value) })
              }
              options={slotOptions}
              value={String(selectedDay.slotMinutes)}
            />
          </div>
        </div>

        {error && (
          <p className="text-body-sm text-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}

export default EditScheduleModal;
