import type { Doctor } from "./doctor";

// Mirrors AppointmentStatus enum in server/prisma/schema.prisma
export const AppointmentStatus = {
  SCHEDULED: "SCHEDULED",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export type AppointmentPatient = {
  id: string;
  firstName: string;
  lastName: string;
};

export type Appointment = {
  id: string;
  doctor: Doctor;
  // Only present in the doctor's own appointment list
  patient?: AppointmentPatient;
  startsAt: string; // ISO date-time (server field: startAt)
  status: AppointmentStatus;
  notes?: string;
};
