import { DayPicker, type Matcher } from "react-day-picker";

type DatePickerProps = {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: Matcher | Matcher[];
  startMonth?: Date;
  endMonth?: Date;
  // Days to flag with a dot, e.g. days that have appointments
  marked?: Matcher | Matcher[];
};

const markedClassName =
  "relative after:pointer-events-none after:absolute after:bottom-1.5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-secondary";

// react-day-picker is used unstyled; every part is themed with design tokens
const dayPickerClassNames = {
  root: "relative w-fit text-on-surface",
  months: "flex flex-col gap-4",
  month: "space-y-3",
  month_caption: "flex h-9 items-center px-1",
  caption_label: "text-headline-sm",
  nav: "absolute top-0 right-0 flex gap-1",
  button_previous:
    "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-highest hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40",
  button_next:
    "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-highest hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40",
  chevron: "h-4 w-4 fill-current",
  month_grid: "border-collapse",
  weekdays: "flex",
  weekday: "w-10 text-label-md text-on-surface-variant",
  week: "mt-1 flex",
  day: "group h-10 w-10 p-0.5 text-center",
  day_button:
    "h-full w-full cursor-pointer rounded-lg text-body-sm transition-colors hover:bg-surface-highest focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:hover:bg-transparent group-[.is-selected]:bg-primary-container group-[.is-selected]:text-on-primary-container group-[.is-selected]:font-semibold",
  selected: "is-selected",
  today: "font-semibold text-primary",
  disabled: "text-on-surface-variant/40",
  outside: "text-on-surface-variant/40",
};

function DatePicker({
  selected,
  onSelect,
  disabled,
  startMonth,
  endMonth,
  marked,
}: DatePickerProps) {
  return (
    <DayPicker
      classNames={dayPickerClassNames}
      disabled={disabled}
      endMonth={endMonth}
      modifiers={marked ? { marked } : undefined}
      modifiersClassNames={marked ? { marked: markedClassName } : undefined}
      mode="single"
      onSelect={onSelect}
      selected={selected}
      showOutsideDays
      startMonth={startMonth}
      weekStartsOn={1}
    />
  );
}

export default DatePicker;
