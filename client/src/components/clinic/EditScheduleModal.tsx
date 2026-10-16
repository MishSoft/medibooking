import { useState, type FormEvent } from "react";
import { useUpdateDoctorSchedule } from "../../hooks/useClinic";
import type { ClinicDoctor, DoctorSchedule, Weekday } from "../../types/clinic";
import Button from "../../shared/ui/Button";
import Input from "../../shared/ui/Input";
import Modal from "../../shared/ui/Modal";
import Select from "../../shared/ui/Select";
import { toTime, weekdayLabels, weekOrder } from "../../utils/clinic";
import { getDoctorName } from "../doctors/DoctorCard";

type EditScheduleModalProps = {
  doctor: ClinicDoctor;
  onClose: () => void;
};

const slotOptions = [15, 20, 30, 45, 60].map((minutes) => ({
  value: String(minutes),
  label: `${minutes} minutes`,
}));

const validateSchedule = ({
  workingDays,
  startTime,
  endTime,
  slotMinutes,
}: DoctorSchedule) => {
  if (workingDays.length === 0) return "Select at least one working day.";
  if (!startTime || !endTime) return "Set both start and end time.";

  const today = new Date();
  const minutes =
    (toTime(endTime, today).getTime() - toTime(startTime, today).getTime()) /
    60000;
  if (minutes <= 0) return "End time must be after start time.";
  if (minutes < slotMinutes) return "Working hours must fit at least one slot.";
  return "";
};

// Mounted only while editing, so the form starts from the doctor's current schedule
function EditScheduleModal({ doctor, onClose }: EditScheduleModalProps) {
  const [schedule, setSchedule] = useState<DoctorSchedule>(doctor.schedule);
  const [error, setError] = useState("");
  const updateSchedule = useUpdateDoctorSchedule();

  const toggleDay = (day: Weekday) =>
    setSchedule((current) => ({
      ...current,
      workingDays: current.workingDays.includes(day)
        ? current.workingDays.filter((item) => item !== day)
        : [...current.workingDays, day],
    }));

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    const validationError = validateSchedule(schedule);
    setError(validationError);
    if (validationError) return;

    try {
      await updateSchedule.mutateAsync({ doctorId: doctor.id, schedule });
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
      description="Weekly working days and hours used for booking slots."
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
            Working days
          </legend>
          <div className="flex flex-wrap gap-2">
            {weekOrder.map((day) => {
              const isActive = schedule.workingDays.includes(day);

              return (
                <button
                  aria-pressed={isActive}
                  className={`min-h-11 min-w-14 cursor-pointer rounded-lg px-3 py-2 text-label-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isActive
                      ? "bg-primary-container text-on-primary-container shadow-elevation-1"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-highest hover:text-on-surface"
                  }`}
                  key={day}
                  onClick={() => toggleDay(day)}
                  type="button"
                >
                  {weekdayLabels[day]}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Start time"
            onChange={(event) =>
              setSchedule({ ...schedule, startTime: event.target.value })
            }
            required
            type="time"
            value={schedule.startTime}
          />
          <Input
            label="End time"
            onChange={(event) =>
              setSchedule({ ...schedule, endTime: event.target.value })
            }
            required
            type="time"
            value={schedule.endTime}
          />
          <Select
            label="Slot length"
            onChange={(event) =>
              setSchedule({
                ...schedule,
                slotMinutes: Number(event.target.value),
              })
            }
            options={slotOptions}
            value={String(schedule.slotMinutes)}
          />
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
