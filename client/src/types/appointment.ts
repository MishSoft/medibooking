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

export type Appointment = {
  id: string;
  doctor: Doctor;
  startsAt: string; // ISO date-time (server field: startAt)
  status: AppointmentStatus;
  notes?: string;
};
