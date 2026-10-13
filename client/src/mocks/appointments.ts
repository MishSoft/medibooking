// Temporary in-memory store — replaced by API requests in the API wiring part
import { addDays, setHours, startOfToday, subDays } from "date-fns";
import { AppointmentStatus, type Appointment } from "../types/appointment";
import { mockDoctors } from "./doctors";

const at = (date: Date, hour: number) => setHours(date, hour).toISOString();
const today = startOfToday();

export const mockAppointments: Appointment[] = [
  {
    id: "a1",
    doctor: mockDoctors[0],
    startsAt: at(addDays(today, 3), 10),
    status: AppointmentStatus.SCHEDULED,
  },
  {
    id: "a2",
    doctor: mockDoctors[3],
    startsAt: at(addDays(today, 9), 14),
    status: AppointmentStatus.SCHEDULED,
  },
  {
    id: "a3",
    doctor: mockDoctors[1],
    startsAt: at(subDays(today, 20), 11),
    status: AppointmentStatus.COMPLETED,
    notes: "Follow-up in 3 months. MRI results normal.",
  },
  {
    id: "a4",
    doctor: mockDoctors[2],
    startsAt: at(subDays(today, 45), 9),
    status: AppointmentStatus.CANCELLED,
  },
];

export const mockDelay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));
