import { isSameDay } from "date-fns";
import { AppointmentStatus, type Appointment } from "../types/appointment";

const byStartAsc = (a: Appointment, b: Appointment) =>
  Date.parse(a.startsAt) - Date.parse(b.startsAt);

const activeStatuses: Appointment["status"][] = [
  AppointmentStatus.SCHEDULED,
  AppointmentStatus.PENDING,
];

export const isUpcoming = (appointment: Appointment, now = Date.now()) =>
  activeStatuses.includes(appointment.status) &&
  Date.parse(appointment.startsAt) >= now;

export const getUpcomingAppointments = (appointments: Appointment[]) =>
  appointments.filter((item) => isUpcoming(item)).sort(byStartAsc);

// Started but not yet completed by the doctor
export const isAwaitingCompletion = (
  appointment: Appointment,
  now = Date.now(),
) =>
  appointment.status === AppointmentStatus.SCHEDULED &&
  Date.parse(appointment.startsAt) < now;

export const getAwaitingCompletion = (appointments: Appointment[]) =>
  appointments.filter((item) => isAwaitingCompletion(item)).sort(byStartAsc);

export const getAppointmentsOn = (appointments: Appointment[], day: Date) =>
  appointments
    .filter((item) => isSameDay(new Date(item.startsAt), day))
    .sort(byStartAsc);

// Finished visits only; started-but-open visits stay on the doctor's schedule
export const getVisitHistory = (appointments: Appointment[]) =>
  appointments
    .filter(
      (item) =>
        item.status === AppointmentStatus.COMPLETED ||
        item.status === AppointmentStatus.CANCELLED,
    )
    .sort((a, b) => byStartAsc(b, a));

export const getPastAppointments = (appointments: Appointment[]) =>
  appointments
    .filter((item) => !isUpcoming(item))
    .sort((a, b) => byStartAsc(b, a));
