// Temporary mock data — replaced by API queries in the API wiring part
import { addMinutes, isBefore, isWeekend, setHours, startOfDay } from "date-fns";
import type { TimeSlot } from "../types/booking";

const SLOT_MINUTES = 30;
const DAY_START_HOUR = 9;
const DAY_END_HOUR = 17;

export const hasWorkingHours = (date: Date) => !isWeekend(date);

// Deterministic pseudo-random "booked" slots so the UI stays stable between renders
export function getMockSlots(doctorId: string, date: Date): TimeSlot[] {
  if (!hasWorkingHours(date)) return [];

  const now = new Date();
  const seed = doctorId.charCodeAt(doctorId.length - 1) + date.getDate();
  const slots: TimeSlot[] = [];
  let cursor = setHours(startOfDay(date), DAY_START_HOUR);
  const end = setHours(startOfDay(date), DAY_END_HOUR);

  for (let index = 0; isBefore(cursor, end); index++) {
    slots.push({
      start: cursor,
      available: !isBefore(cursor, now) && (seed + index) % 3 !== 0,
    });
    cursor = addMinutes(cursor, SLOT_MINUTES);
  }

  return slots;
}
