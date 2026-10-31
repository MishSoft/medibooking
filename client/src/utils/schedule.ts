import { differenceInMinutes, parse, startOfToday } from "date-fns";
import type { DoctorSchedule, ScheduleDay, Weekday } from "../types/doctor";

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

// Default week: Mon–Fri on, every day 09:00–17:00 / 30 min (matches the server)
const defaultWorkingDays: Weekday[] = [1, 2, 3, 4, 5];

export const createDefaultScheduleDay = (weekday: Weekday): ScheduleDay => ({
  weekday,
  isWorking: defaultWorkingDays.includes(weekday),
  startTime: "09:00",
  endTime: "17:00",
  slotMinutes: 30,
});

export const createDefaultSchedule = (): DoctorSchedule => ({
  days: weekOrder.map(createDefaultScheduleDay),
});

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
export const formatWorkingHours = ({ startTime, endTime }: ScheduleDay) =>
  `${startTime}–${endTime}`;

// Days sharing hours are grouped: "Mon–Fri · 09:00–17:00",
// "Mon–Thu · 09:00–17:00; Fri · 09:00–13:00"
export const formatSchedule = ({ days }: DoctorSchedule) => {
  const groups = new Map<string, Weekday[]>();

  for (const day of days) {
    if (!day.isWorking) continue;
    const hours = formatWorkingHours(day);
    groups.set(hours, [...(groups.get(hours) ?? []), day.weekday]);
  }

  if (groups.size === 0) return "No working days";

  return [...groups]
    .map(([hours, weekdays]) => `${formatWorkingDays(weekdays)} · ${hours}`)
    .join("; ");
};

const getWorkingDays = ({ days }: DoctorSchedule) =>
  days.filter((day) => day.isWorking);

// [1,2,3,4,5] of the schedule's working days, for formatWorkingDays
export const getWorkingWeekdays = (schedule: DoctorSchedule) =>
  getWorkingDays(schedule).map((day) => day.weekday);

// "09:00–17:00" when every working day shares it, otherwise per-day groups
export const formatScheduleHours = (schedule: DoctorSchedule) => {
  const hours = new Set(getWorkingDays(schedule).map(formatWorkingHours));
  return hours.size === 1 ? [...hours][0] : formatSchedule(schedule);
};

// "30" or a range like "15–30" when slot length differs between days
export const formatSlotMinutes = (schedule: DoctorSchedule) => {
  const minutes = getWorkingDays(schedule).map((day) => day.slotMinutes);
  if (minutes.length === 0) return "";
  const min = Math.min(...minutes);
  const max = Math.max(...minutes);
  return min === max ? `${min}` : `${min}–${max}`;
};

// "HH:mm" on the given day
export const toTime = (time: string, day: Date) => parse(time, "HH:mm", day);

// The date's schedule day, only when the doctor works that day
export const getWorkingDay = (
  { days }: DoctorSchedule,
  date: Date,
): ScheduleDay | undefined =>
  days.find((day) => day.weekday === date.getDay() && day.isWorking);

export const isWorkingDay = (schedule: DoctorSchedule, date: Date) =>
  getWorkingDay(schedule, date) !== undefined;

export const getSlotsPerDay = ({
  startTime,
  endTime,
  slotMinutes,
}: ScheduleDay) => {
  const today = startOfToday();
  const minutes = differenceInMinutes(
    toTime(endTime, today),
    toTime(startTime, today),
  );
  return Math.max(0, Math.floor(minutes / slotMinutes));
};
