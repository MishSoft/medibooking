import { DateTime } from "luxon";

export const CLINIC_TZ = "Asia/Tbilisi";
export const WORK_START_HOUR = 9;
export const WORK_END_HOUR = 17;
export const SLOT_MINUTES = 30;
export const MAX_MONTHS_AHEAD = 2;

export const getClinicNow = (): DateTime => DateTime.now().setZone(CLINIC_TZ);

export const parseToClinicZone = (iso: string): DateTime =>
  DateTime.fromISO(iso, { setZone: true }).setZone(CLINIC_TZ);

export const validateSlot = (
  startLocal: DateTime,
  nowLocal: DateTime = getClinicNow()
): string | null => {
  if (startLocal <= nowLocal) {
    return "Cannot book appointments in the past.";
  }

  if (startLocal.weekday === 6 || startLocal.weekday === 7) {
    return "Appointments cannot be booked on weekends.";
  }

  const { hour, minute, second, millisecond } = startLocal;
  if (
    hour < WORK_START_HOUR ||
    hour >= WORK_END_HOUR ||
    minute % SLOT_MINUTES !== 0 ||
    second !== 0 ||
    millisecond !== 0
  ) {
    return "Appointments must be between 09:00 and 17:00 on a 30-minute grid.";
  }

  if (startLocal > nowLocal.plus({ months: MAX_MONTHS_AHEAD })) {
    return "Appointments cannot be booked more than 2 months in advance.";
  }

  return null;
};

export const generateDaySlots = (dayLocal: DateTime): DateTime[] => {
  const slots: DateTime[] = [];
  const dayStart = dayLocal.startOf("day");
  const end = dayStart.set({ hour: WORK_END_HOUR });
  let cursor = dayStart.set({ hour: WORK_START_HOUR });

  while (cursor < end) {
    slots.push(cursor);
    cursor = cursor.plus({ minutes: SLOT_MINUTES });
  }

  return slots;
};
