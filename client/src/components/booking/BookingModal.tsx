import { useState } from "react";
import { addMonths, endOfMonth, startOfToday } from "date-fns";
import { BadgeCheckIcon } from "../../assets/icons/Icons";
import { getMockSlots, hasWorkingHours } from "../../mocks/slots";
import type { Doctor } from "../../types/doctor";
import Button from "../../shared/ui/Button";
import DatePicker from "../../shared/ui/DatePicker";
import Modal from "../../shared/ui/Modal";
import { getDoctorName } from "../doctors/DoctorCard";
import BookingSummary from "./BookingSummary";
import TimeSlotPicker from "./TimeSlotPicker";

type BookingModalProps = {
  doctor: Doctor | null;
  onClose: () => void;
};

const BOOKING_WINDOW_MONTHS = 2;

function BookingModal({ doctor, onClose }: BookingModalProps) {
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState<Date>();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const today = startOfToday();
  const lastBookableDay = endOfMonth(addMonths(today, BOOKING_WINDOW_MONTHS));
  const slots = doctor && date ? getMockSlots(doctor.id, date) : [];

  const handleClose = () => {
    setDate(undefined);
    setSlot(undefined);
    setIsConfirmed(false);
    onClose();
  };

  const handleDateSelect = (nextDate: Date | undefined) => {
    setDate(nextDate);
    setSlot(undefined);
  };

  // Persisting the booking is wired to the API in a later part
  const handleConfirm = () => setIsConfirmed(true);

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
          <Button disabled={!slot} onClick={handleConfirm}>
            Confirm Appointment
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
              (day) => !hasWorkingHours(day),
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
            <TimeSlotPicker onSelect={setSlot} selected={slot} slots={slots} />
          ) : (
            <p className="text-body-sm text-on-surface-variant">
              Pick a date to see available time slots.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default BookingModal;
