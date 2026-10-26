import type { Doctor } from "./doctor";
import type { Patient } from "./patient";

export type Prescription = {
  id: string;
  doctor: Doctor;
  // Only present in the doctor's own prescription list
  patient?: Patient;
  medication: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  issuedAt: string; // ISO date
  validUntil: string; // ISO date
};
