import { differenceInMinutes, parse, startOfToday } from "date-fns";
import type { DoctorSchedule, Weekday } from "../types/doctor";

// Week shown Monday-first (calendar weekStartsOn: 1); values are Date#getDay numbers
export const weekOrder: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export const dayLabels: Record<Weekday, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

// [1,2,3,4,5] → "Mon–Fri", [1,3,5] → "Mon, Wed, Fri", [1,2,4,5,6] → "Mon–Tue, Thu–Sat"
export const formatWorkingDays = (days: Weekday[]) => {
  const runs: Weekday[][] = [];

  for (const day of weekOrder) {
    if (!days.includes(day)) continue;
    const lastRun = runs.at(-1);
    const previous = weekOrder[weekOrder.indexOf(day) - 1];
    if (lastRun && lastRun.at(-1) === previous) lastRun.push(day);
    else runs.push([day]);
  }

  if (runs.length === 0) return "No working days";

  return runs
    .map((run) =>
      run.length >= 3
        ? `${dayLabels[run[0]]}–${dayLabels[run.at(-1)!]}`
        : run.map((day) => dayLabels[day]).join(", "),
    )
    .join(", ");
};

// "09:00–17:00"
export const formatWorkingHours = ({ startTime, endTime }: DoctorSchedule) =>
  `${startTime}–${endTime}`;

// "Mon–Fri · 09:00–17:00"
export const formatSchedule = (schedule: DoctorSchedule) =>
  `${formatWorkingDays(schedule.workingDays)} · ${formatWorkingHours(schedule)}`;

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
