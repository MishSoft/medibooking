import type { DoctorSchedule, Weekday } from "../types/doctor";

// Week shown Monday-first; values are Date#getDay numbers
const WEEK_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];
const DAY_LABELS: Record<Weekday, string> = {
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

  for (const day of WEEK_ORDER) {
    if (!days.includes(day)) continue;
    const lastRun = runs.at(-1);
    const previous = WEEK_ORDER[WEEK_ORDER.indexOf(day) - 1];
    if (lastRun && lastRun.at(-1) === previous) lastRun.push(day);
    else runs.push([day]);
  }

  return runs
    .map((run) =>
      run.length >= 3
        ? `${DAY_LABELS[run[0]]}–${DAY_LABELS[run.at(-1)!]}`
        : run.map((day) => DAY_LABELS[day]).join(", "),
    )
    .join(", ");
};

// "Mon–Fri · 09:00–17:00"
export const formatSchedule = (schedule: DoctorSchedule) =>
  `${formatWorkingDays(schedule.workingDays)} · ${schedule.startTime}–${schedule.endTime}`;
