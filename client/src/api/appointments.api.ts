// Mock-backed for now — swap bodies for apiRequest calls once the server exposes appointments
import { mockAppointments, mockDelay } from "../mocks/appointments";
import { AppointmentStatus, type Appointment } from "../types/appointment";
import type { Doctor } from "../types/doctor";

export type CreateAppointmentPayload = {
  doctor: Doctor;
  startsAt: string;
};

export const appointmentsApi = {
  list: async (): Promise<Appointment[]> => {
    await mockDelay();
    return [...mockAppointments];
  },
  create: async ({ doctor, startsAt }: CreateAppointmentPayload) => {
    await mockDelay();
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      doctor,
      startsAt,
      status: AppointmentStatus.SCHEDULED,
    };
    mockAppointments.push(appointment);
    return appointment;
  },
  cancel: async (id: string) => {
    await mockDelay();
    const appointment = mockAppointments.find((item) => item.id === id);
    if (!appointment) throw new Error("Appointment not found.");
    appointment.status = AppointmentStatus.CANCELLED;
    return appointment;
  },
};
