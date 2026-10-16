import type { DoctorSchedule, Weekday } from "../types/clinic";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Monday-first order, matching the calendar (weekStartsOn: 1)
const weekOrder: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

// [1,2,3,4,5] → "Mon–Fri", [1,3,5] → "Mon, Wed, Fri"
export const formatWorkingDays = (days: Weekday[]) => {
  const ordered = weekOrder.filter((day) => days.includes(day));
  if (ordered.length === 0) return "No working days";
  if (ordered.length === 7) return "Every day";

  const positions = ordered.map((day) => weekOrder.indexOf(day));
  const isConsecutive = positions.every(
    (position, index) => index === 0 || position === positions[index - 1] + 1,
  );

  if (isConsecutive && ordered.length > 2) {
    return `${weekdayLabels[ordered[0]]}–${weekdayLabels[ordered[ordered.length - 1]]}`;
  }
  return ordered.map((day) => weekdayLabels[day]).join(", ");
};

export const formatWorkingHours = ({ startTime, endTime }: DoctorSchedule) =>
  `${startTime}–${endTime}`;
