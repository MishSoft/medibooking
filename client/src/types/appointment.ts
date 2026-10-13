import type { Doctor } from "./doctor";

// No Appointment model on the server yet — align with Prisma once it exists
export const AppointmentStatus = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export type Appointment = {
  id: string;
  doctor: Doctor;
  startsAt: string; // ISO date-time
  status: AppointmentStatus;
  notes?: string;
};
