import { differenceInMinutes, parse, startOfToday } from "date-fns";
import type { DoctorSchedule, Weekday } from "../types/clinic";

export const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Monday-first order, matching the calendar (weekStartsOn: 1)
export const weekOrder: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

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

// 0.4567 → "46%"
export const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

// "HH:mm" on the given day
export const toTime = (time: string, day: Date) => parse(time, "HH:mm", day);

export const isWorkingDay = (schedule: DoctorSchedule, date: Date) =>
  schedule.workingDays.includes(date.getDay() as Weekday);

export const getSlotsPerDay = ({
  startTime,
  endTime,
  slotMinutes,
}: DoctorSchedule) => {
  const today = startOfToday();
  const minutes = differenceInMinutes(
    toTime(endTime, today),
    toTime(startTime, today),
  );
  return Math.max(0, Math.floor(minutes / slotMinutes));
};
