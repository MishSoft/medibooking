import { useState } from "react";
import { addMonths, format, startOfToday } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../api/client";
import {
  clinicQueryKey,
  useClinicDoctors,
  useClinicDoctorSlots,
  useRescheduleAppointment,
} from "../../hooks/useClinic";
import type { ClinicAppointment } from "../../types/clinic";
import Button from "../../shared/ui/Button";
import DatePicker from "../../shared/ui/DatePicker";
import Modal from "../../shared/ui/Modal";
import QueryState from "../../shared/ui/QueryState";
import { isWorkingDay } from "../../utils/schedule";
import TimeSlotPicker from "../booking/TimeSlotPicker";
import { getDoctorName } from "../doctors/DoctorCard";

type RescheduleModalProps = {
  appointment: ClinicAppointment;
  onClose: () => void;
};

const RESCHEDULE_WINDOW_MONTHS = 2;

// Mounted only while rescheduling, so state starts fresh for each appointment
function RescheduleModal({ appointment, onClose }: RescheduleModalProps) {
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState<Date>();

  const queryClient = useQueryClient();
  const reschedule = useRescheduleAppointment();
  const { data: doctors = [] } = useClinicDoctors();
  const {
    data: slots = [],
    isPending: isSlotsPending,
    error: slotsError,
  } = useClinicDoctorSlots(appointment.doctor.id, date);

  const schedule = doctors.find(
    (doctor) => doctor.id === appointment.doctor.id,
  )?.schedule;
  const today = startOfToday();
  const lastDay = addMonths(today, RESCHEDULE_WINDOW_MONTHS);
  const { patient } = appointment;

  const handleDateSelect = (nextDate: Date | undefined) => {
    setDate(nextDate);
    setSlot(undefined);
    reschedule.reset();
  };

  const handleConfirm = () => {
    if (!slot) return;
    reschedule.mutate(
      { id: appointment.id, startsAt: slot.toISOString() },
      {
        onSuccess: onClose,
        onError: (error) => {
          // Someone else took the slot meanwhile — show fresh availability
          if (error instanceof ApiError && error.status === 409) {
            setSlot(undefined);
            void queryClient.invalidateQueries({
              queryKey: [...clinicQueryKey, "slots"],
            });
          }
        },
      },
    );
  };

  return (
    <Modal
      description={`${patient.firstName} ${patient.lastName} with ${getDoctorName(appointment.doctor)} · currently ${format(new Date(appointment.startsAt), "EEE, d MMM yyyy · HH:mm")}`}
      footer={
        <>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            disabled={!slot || reschedule.isPending}
            onClick={handleConfirm}
          >
            {reschedule.isPending ? "Saving…" : "Confirm New Time"}
          </Button>
        </>
      }
      onClose={onClose}
      open
      title="Reschedule Appointment"
    >
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex justify-center md:block">
          <DatePicker
            disabled={[
              { before: today },
              { after: lastDay },
              (day: Date) => !!schedule && !isWorkingDay(schedule, day),
            ]}
            endMonth={lastDay}
            onSelect={handleDateSelect}
            selected={date}
            startMonth={today}
          />
        </div>

        <div className="space-y-4">
          {slot && (
            <p className="text-body-md">
              New time:{" "}
              <span className="font-code text-code-sm text-secondary">
                {format(slot, "EEE, d MMM yyyy · HH:mm")}
              </span>
            </p>
          )}
          {date ? (
            <QueryState error={slotsError} isPending={isSlotsPending}>
              <TimeSlotPicker
                onSelect={(start) => {
                  setSlot(start);
                  reschedule.reset();
                }}
                selected={slot}
                slots={slots}
              />
            </QueryState>
          ) : (
            <p className="text-body-sm text-on-surface-variant">
              Pick one of the doctor's working days to see available slots.
            </p>
          )}
          {reschedule.error && (
            <p className="text-body-sm text-error" role="alert">
              {reschedule.error.message}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default RescheduleModal;
