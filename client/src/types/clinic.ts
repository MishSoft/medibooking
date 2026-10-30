import type { Appointment } from "./appointment";
import type { Doctor, DoctorSchedule } from "./doctor";

// Schedule types live with the doctor; re-exported for existing imports
export type { DoctorSchedule, Weekday } from "./doctor";

export type ClinicDoctor = Doctor & {
  email: string;
  schedule: DoctorSchedule;
};

export type PatientSummary = {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

export type ClinicAppointment = Appointment & {
  patient: PatientSummary;
  rescheduledFrom?: string; // ISO date-time of the original slot
  cancelledAt?: string; // ISO date-time
  cancellationReason?: string;
};

export type DateRange = {
  from: string; // ISO date-time, inclusive
  to: string; // ISO date-time, exclusive
};

export type ClinicAppointmentsFilters = Partial<DateRange> & {
  doctorId?: string;
};

export type DoctorWorkload = {
  doctor: ClinicDoctor;
  booked: number; // non-cancelled appointments in range
  completed: number;
  cancelled: number;
  noShow: number;
  capacity: number; // available slots in range
  utilisation: number; // booked / capacity, 0–1
};

export type ClinicStats = {
  total: number;
  completed: number;
  upcoming: number;
  cancelled: number;
  noShow: number;
  rescheduled: number;
  cancellationRate: number; // 0–1
  utilisation: number; // 0–1, clinic-wide
  workload: DoctorWorkload[];
};
