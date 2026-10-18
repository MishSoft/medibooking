import { parse } from "date-fns";
import { mockDelay } from "../mocks/delay";
import type { TimeSlot } from "../types/booking";
import {
  computeClinicStats,
  computeDoctorSlots,
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
  DoctorWorkload,
} from "../types/clinic";
import {
  toAppointment,
  toPatient,
  type AppointmentDto,
  type PatientDto,
} from "./appointments.api";
import {
  toDoctor,
  toDoctorSchedule,
  toServerWeekdays,
  type DoctorDto,
  type DoctorScheduleDto,
} from "./doctors.api";

// Shapes returned by the server's /api/clinic endpoints (Prisma select)
export type ClinicDoctorDto = Omit<DoctorDto, "user" | "schedule"> & {
  user: DoctorDto["user"] & { email: string };
  schedule: DoctorScheduleDto | null;
};

export type ClinicAppointmentDto = AppointmentDto & {
  patient: PatientDto;
  rescheduledFrom: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
};

export type DoctorWorkloadDto = Omit<DoctorWorkload, "doctor"> & {
  doctor: ClinicDoctorDto;
};

export type ClinicStatsDto = Omit<ClinicStats, "workload"> & {
  workload: DoctorWorkloadDto[];
};

// A doctor without a schedule shows "No working days" and can be set up from
// the Schedules tab; registration and the migration normally create one
const emptySchedule: DoctorSchedule = {
  workingDays: [],
  startTime: "09:00",
  endTime: "17:00",
  slotMinutes: 30,
};

export const toClinicDoctor = (dto: ClinicDoctorDto): ClinicDoctor => ({
  ...toDoctor({ ...dto, schedule: undefined }),
  email: dto.user.email,
  schedule: dto.schedule ? toDoctorSchedule(dto.schedule) : emptySchedule,
});

export const toClinicAppointment = (
  dto: ClinicAppointmentDto,
): ClinicAppointment => ({
  ...toAppointment(dto),
  patient: toPatient(dto.patient),
  rescheduledFrom: dto.rescheduledFrom ?? undefined,
  cancelledAt: dto.cancelledAt ?? undefined,
  cancellationReason: dto.cancellationReason ?? undefined,
});

export const toClinicStats = (dto: ClinicStatsDto): ClinicStats => ({
  total: dto.total,
  completed: dto.completed,
  upcoming: dto.upcoming,
  cancelled: dto.cancelled,
  rescheduled: dto.rescheduled,
  cancellationRate: dto.cancellationRate,
  utilisation: dto.utilisation,
  workload: dto.workload.map(({ doctor, ...counts }) => ({
    ...counts,
    doctor: toClinicDoctor(doctor),
  })),
});

// Request body for PUT /api/clinic/doctors/:id/schedule (server weekdays)
export const toDoctorScheduleBody = (
  schedule: DoctorSchedule,
): DoctorScheduleDto => ({
  workingDays: toServerWeekdays(schedule.workingDays),
  startTime: schedule.startTime,
  endTime: schedule.endTime,
  slotMinutes: schedule.slotMinutes,
});

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
    const isTaken = !computeDoctorSlots(
      appointment.doctor.id,
      new Date(startsAt),
    ).some(
      (slot) =>
        slot.available && slot.start.getTime() === new Date(startsAt).getTime(),
    );
    if (isTaken) throw new Error("This slot is no longer available.");

    // Keep the very first slot when an appointment is moved more than once
    appointment.rescheduledFrom ??= appointment.startsAt;
    appointment.startsAt = startsAt;
    // Rebooking a cancelled appointment makes it active again
    appointment.status = AppointmentStatus.SCHEDULED;
    appointment.cancelledAt = undefined;
    appointment.cancellationReason = undefined;
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
  // date: "yyyy-MM-dd"; maps to the existing GET api/doctors/:id/slots
  slots: async (doctorId: string, date: string): Promise<TimeSlot[]> => {
    await mockDelay();
    return computeDoctorSlots(doctorId, parse(date, "yyyy-MM-dd", new Date()));
  },
  stats: async (range: DateRange): Promise<ClinicStats> => {
    await mockDelay();
    return computeClinicStats(range);
  },
};
