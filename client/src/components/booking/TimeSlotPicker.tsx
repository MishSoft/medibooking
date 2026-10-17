import { format, isEqual } from "date-fns";
import { ClockHistoryIcon } from "../../assets/icons/Icons";
import type { TimeSlot } from "../../types/booking";
import EmptyState from "../../shared/ui/EmptyState";

type TimeSlotPickerProps = {
  slots: TimeSlot[];
  selected?: Date;
  onSelect: (start: Date) => void;
};

function TimeSlotPicker({ slots, selected, onSelect }: TimeSlotPickerProps) {
  // No slots at all = the doctor doesn't work that day
  if (slots.length === 0) {
    return (
      <EmptyState
        description="The doctor doesn't see patients on this day. Please pick another day."
        icon={ClockHistoryIcon}
        title="Not working this day"
      />
    );
  }

  // Slots exist but none are free = taken or already past
  if (!slots.some((slot) => slot.available)) {
    return (
      <EmptyState
        description="All time slots for this day are booked or have already passed. Please pick another day."
        icon={ClockHistoryIcon}
        title="Fully booked"
      />
    );
  }

  return (
    <div
      aria-label="Available time slots"
      className="grid grid-cols-3 gap-2 sm:grid-cols-4"
      role="radiogroup"
    >
      {slots.map(({ start, available }) => {
        const isSelected = !!selected && isEqual(selected, start);

        return (
          <button
            aria-checked={isSelected}
            className={`min-h-11 cursor-pointer rounded-lg px-2 py-2 font-code text-code-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 ${
              isSelected
                ? "bg-primary-container text-on-primary-container shadow-elevation-1"
                : "bg-surface-container text-on-surface hover:bg-surface-highest"
            }`}
            disabled={!available}
            key={start.toISOString()}
            onClick={() => onSelect(start)}
            role="radio"
            type="button"
          >
            {format(start, "HH:mm")}
          </button>
        );
      })}
    </div>
  );
}

export default TimeSlotPicker;
