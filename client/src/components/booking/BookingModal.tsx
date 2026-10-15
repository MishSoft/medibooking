import { useState } from "react";
import { addMonths, isWeekend, startOfToday } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../api/client";
import { BadgeCheckIcon } from "../../assets/icons/Icons";
import { useBookAppointment } from "../../hooks/useAppointments";
import { doctorsQueryKey, useDoctorSlots } from "../../hooks/useDoctors";
import type { Doctor } from "../../types/doctor";
import Button from "../../shared/ui/Button";
import DatePicker from "../../shared/ui/DatePicker";
import FieldError from "../../shared/ui/FieldError";
import Modal from "../../shared/ui/Modal";
import QueryState from "../../shared/ui/QueryState";
import { getDoctorName } from "../doctors/DoctorCard";
import BookingSummary from "./BookingSummary";
import TimeSlotPicker from "./TimeSlotPicker";

type BookingModalProps = {
  doctor: Doctor | null;
  onClose: () => void;
};

// Matches MAX_MONTHS_AHEAD in server/src/config/booking.ts
const BOOKING_WINDOW_MONTHS = 2;

function BookingModal({ doctor, onClose }: BookingModalProps) {
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState<Date>();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const queryClient = useQueryClient();
  const bookAppointment = useBookAppointment();
  const {
    data: slots = [],
    isPending: isSlotsPending,
    error: slotsError,
  } = useDoctorSlots(doctor?.id, date);

  const today = startOfToday();
  const lastBookableDay = addMonths(today, BOOKING_WINDOW_MONTHS);

  const refreshSlots = () =>
    queryClient.invalidateQueries({
      queryKey: [...doctorsQueryKey, doctor?.id, "slots"],
    });

  const handleClose = () => {
    setDate(undefined);
    setSlot(undefined);
    setIsConfirmed(false);
    bookAppointment.reset();
    onClose();
  };

  const handleDateSelect = (nextDate: Date | undefined) => {
    setDate(nextDate);
    setSlot(undefined);
    bookAppointment.reset();
  };

  const handleSlotSelect = (start: Date) => {
    setSlot(start);
    bookAppointment.reset();
  };

  const handleConfirm = () => {
    if (!doctor || !slot) return;
    bookAppointment.mutate(
      { doctor, startsAt: slot.toISOString() },
      {
        onSuccess: () => {
          setIsConfirmed(true);
          void refreshSlots();
        },
        onError: (error) => {
          // Someone else took the slot meanwhile — show fresh availability
          if (error instanceof ApiError && error.status === 409) {
            setSlot(undefined);
            void refreshSlots();
          }
        },
      },
    );
  };

  if (!doctor) return null;

  if (isConfirmed && slot) {
    return (
      <Modal
        footer={<Button onClick={handleClose}>Done</Button>}
        onClose={handleClose}
        open
        title="Appointment booked"
      >
        <div className="space-y-4">
          <p className="flex items-center gap-2 text-body-md text-success">
            <BadgeCheckIcon aria-hidden="true" className="h-5 w-5" />
            Your appointment has been confirmed.
          </p>
          <BookingSummary doctor={doctor} start={slot} />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      description="Choose a date and an available time slot."
      footer={
        <>
          <Button onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button
            disabled={!slot || bookAppointment.isPending}
            onClick={handleConfirm}
          >
            {bookAppointment.isPending ? "Booking…" : "Confirm Appointment"}
          </Button>
        </>
      }
      onClose={handleClose}
      open
      title={`Book with ${getDoctorName(doctor)}`}
    >
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex justify-center md:block">
          <DatePicker
            disabled={[
              { before: today },
              { after: lastBookableDay },
              isWeekend,
            ]}
            endMonth={lastBookableDay}
            onSelect={handleDateSelect}
            selected={date}
            startMonth={today}
          />
        </div>

        <div className="space-y-4">
          <BookingSummary doctor={doctor} start={slot} />
          {date ? (
            <QueryState error={slotsError} isPending={isSlotsPending}>
              <TimeSlotPicker
                onSelect={handleSlotSelect}
                selected={slot}
                slots={slots}
              />
            </QueryState>
          ) : (
            <p className="text-body-sm text-on-surface-variant">
              Pick a date to see available time slots.
            </p>
          )}
          <FieldError
            id="booking-error"
            message={bookAppointment.error?.message}
          />
        </div>
      </div>
    </Modal>
  );
}

export default BookingModal;
