import { mockDelay } from "../mocks/delay";
import {
  computeClinicStats,
  mockClinicAppointments,
  mockClinicDoctors,
} from "../mocks/clinic";
import { AppointmentStatus } from "../types/appointment";
import type {
  ClinicAppointment,
  ClinicAppointmentsFilters,
  ClinicDoctor,
  ClinicStats,
  DateRange,
  DoctorSchedule,
} from "../types/clinic";

export type RescheduleAppointmentPayload = {
  id: string;
  startsAt: string; // ISO date-time
};

export type CancelAppointmentPayload = {
  id: string;
  reason?: string;
};

export type UpdateDoctorSchedulePayload = {
  doctorId: string;
  schedule: DoctorSchedule;
};

const findAppointment = (id: string) => {
  const appointment = mockClinicAppointments.find((apt) => apt.id === id);
  if (!appointment) throw new Error("Appointment not found.");
  return appointment;
};

// Mock-backed (clinic dashboard) — no server endpoints yet.
// Expected endpoints: GET api/clinic/doctors, GET api/clinic/appointments,
// PATCH api/clinic/appointments/:id/{reschedule,cancel},
// PUT api/clinic/doctors/:id/schedule, GET api/clinic/stats
export const clinicApi = {
  doctors: async (): Promise<ClinicDoctor[]> => {
    await mockDelay();
    return [...mockClinicDoctors];
  },
  appointments: async ({
    from,
    to,
    doctorId,
  }: ClinicAppointmentsFilters = {}): Promise<ClinicAppointment[]> => {
    await mockDelay();
    return mockClinicAppointments
      .filter(
        (apt) =>
          (!from || new Date(apt.startsAt) >= new Date(from)) &&
          (!to || new Date(apt.startsAt) < new Date(to)) &&
          (!doctorId || apt.doctor.id === doctorId),
      )
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  },
  reschedule: async ({
    id,
    startsAt,
  }: RescheduleAppointmentPayload): Promise<ClinicAppointment> => {
    await mockDelay();
    const appointment = findAppointment(id);
    // Keep the very first slot when an appointment is moved more than once
    appointment.rescheduledFrom ??= appointment.startsAt;
    appointment.startsAt = startsAt;
    appointment.status = AppointmentStatus.SCHEDULED;
    return { ...appointment };
  },
  cancel: async ({
    id,
    reason,
  }: CancelAppointmentPayload): Promise<ClinicAppointment> => {
    await mockDelay();
    const appointment = findAppointment(id);
    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancelledAt = new Date().toISOString();
    appointment.cancellationReason = reason;
    return { ...appointment };
  },
  updateSchedule: async ({
    doctorId,
    schedule,
  }: UpdateDoctorSchedulePayload): Promise<ClinicDoctor> => {
    await mockDelay();
    const doctor = mockClinicDoctors.find((item) => item.id === doctorId);
    if (!doctor) throw new Error("Doctor not found.");
    doctor.schedule = schedule;
    return { ...doctor };
  },
  stats: async (range: DateRange): Promise<ClinicStats> => {
    await mockDelay();
    return computeClinicStats(range);
  },
};
