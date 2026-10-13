import { AppointmentStatus, type Appointment } from "../types/appointment";

const byStartAsc = (a: Appointment, b: Appointment) =>
  Date.parse(a.startsAt) - Date.parse(b.startsAt);

export const isUpcoming = (appointment: Appointment, now = Date.now()) =>
  appointment.status === AppointmentStatus.SCHEDULED &&
  Date.parse(appointment.startsAt) >= now;

export const getUpcomingAppointments = (appointments: Appointment[]) =>
  appointments.filter((item) => isUpcoming(item)).sort(byStartAsc);

export const getPastAppointments = (appointments: Appointment[]) =>
  appointments
    .filter((item) => !isUpcoming(item))
    .sort((a, b) => byStartAsc(b, a));
