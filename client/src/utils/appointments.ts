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

export const getPastAppointments = (appointments: Appointment[]) =>
  appointments
    .filter((item) => !isUpcoming(item))
    .sort((a, b) => byStartAsc(b, a));
