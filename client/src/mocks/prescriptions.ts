// Temporary mock data — replaced by API requests in the API wiring part
import { addDays, startOfToday, subDays } from "date-fns";
import type { Prescription } from "../types/prescription";
import { mockDoctors } from "./doctors";

const today = startOfToday();

export const mockPrescriptions: Prescription[] = [
  {
    id: "p1",
    doctor: mockDoctors[0],
    medication: "Amlodipine",
    dosage: "5 mg",
    frequency: "Once daily",
    instructions: "Take in the morning, with or without food.",
    issuedAt: subDays(today, 10).toISOString(),
    validUntil: addDays(today, 80).toISOString(),
  },
  {
    id: "p2",
    doctor: mockDoctors[1],
    medication: "Sumatriptan",
    dosage: "50 mg",
    frequency: "As needed, max 2 per day",
    issuedAt: subDays(today, 20).toISOString(),
    validUntil: addDays(today, 40).toISOString(),
  },
  {
    id: "p3",
    doctor: mockDoctors[2],
    medication: "Hydrocortisone cream 1%",
    dosage: "Thin layer",
    frequency: "Twice daily",
    instructions: "Apply to affected area for 7 days.",
    issuedAt: subDays(today, 60).toISOString(),
    validUntil: subDays(today, 30).toISOString(),
  },
];
