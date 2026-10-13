import type { Doctor } from "./doctor";

// No Prescription model on the server yet — align with Prisma once it exists
export type Prescription = {
  id: string;
  doctor: Doctor;
  medication: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  issuedAt: string; // ISO date
  validUntil: string; // ISO date
};
