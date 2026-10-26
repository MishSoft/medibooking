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



export interface ScheduleConfig {
  workingDays: number[];
  startTime: string;
  endTime: string;
  slotMinutes: number;
}

export const generateScheduleSlots = (
  dayLocal: DateTime,
  schedule: ScheduleConfig,
): DateTime[] => {
  const dayStart = dayLocal.startOf("day");

  // Luxon weekday: Monday = 1, Sunday = 7
  if (!schedule.workingDays.includes(dayStart.weekday)) {
    return [];
  }

  const parseTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);

    return { hour, minute };
  };

  const start = parseTime(schedule.startTime);
  const end = parseTime(schedule.endTime);

  let cursor = dayStart.set({
    hour: start.hour,
    minute: start.minute,
    second: 0,
    millisecond: 0,
  });

  const endTime = dayStart.set({
    hour: end.hour,
    minute: end.minute,
    second: 0,
    millisecond: 0,
  });

  const slots: DateTime[] = [];

  while (cursor.plus({ minutes: schedule.slotMinutes }) <= endTime) {
    slots.push(cursor);
    cursor = cursor.plus({ minutes: schedule.slotMinutes });
  }

  return slots;
};



export const validateScheduledSlot = (
  startLocal: DateTime,
  schedule: ScheduleConfig,
  nowLocal: DateTime = getClinicNow(),
): string | null => {
  if (!startLocal.isValid) {
    return "Invalid appointment date.";
  }

  if (startLocal <= nowLocal) {
    return "Appointments cannot be booked in the past.";
  }

  if (startLocal > nowLocal.plus({ months: MAX_MONTHS_AHEAD })) {
    return "Appointments cannot be booked more than 2 months in advance.";
  }

  if (!schedule.workingDays.includes(startLocal.weekday)) {
    return "The doctor does not work on this day.";
  }

  const [startHour, startMinute] = schedule.startTime.split(":").map(Number);

  const [endHour, endMinute] = schedule.endTime.split(":").map(Number);

  const scheduleStartMinutes = startHour * 60 + startMinute;
  const scheduleEndMinutes = endHour * 60 + endMinute;
  const appointmentMinutes = startLocal.hour * 60 + startLocal.minute;

  if (
    startLocal.second !== 0 ||
    startLocal.millisecond !== 0 ||
    appointmentMinutes < scheduleStartMinutes ||
    appointmentMinutes + schedule.slotMinutes > scheduleEndMinutes ||
    (appointmentMinutes - scheduleStartMinutes) % schedule.slotMinutes !== 0
  ) {
    return "The selected time does not match the doctor's schedule.";
  }

  return null;
};
