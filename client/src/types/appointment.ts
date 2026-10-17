import type { Doctor } from "./doctor";
import type { Patient } from "./patient";

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
  // Only present in the doctor's own appointment list
  patient?: Patient;
  startsAt: string; // ISO date-time (server field: startAt)
  status: AppointmentStatus;
  notes?: string;
  diagnosis?: string;
};

// Empty string clears a field when editing a completed visit
export type VisitRecordPayload = {
  diagnosis?: string;
  notes?: string;
};
