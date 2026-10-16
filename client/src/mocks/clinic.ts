// Temporary mock data — replaced by clinic admin API requests once the server ships them
import {
  addDays,
  addMinutes,
  eachDayOfInterval,
  setHours,
  startOfToday,
  subDays,
} from "date-fns";
import { AppointmentStatus } from "../types/appointment";
import type { TimeSlot } from "../types/booking";
import type {
  ClinicAppointment,
  ClinicDoctor,
  ClinicStats,
  DateRange,
  DoctorSchedule,
  PatientSummary,
} from "../types/clinic";
import { getSlotsPerDay, isWorkingDay, toTime } from "../utils/clinic";
import { mockClinics } from "./doctors";

const clinic = mockClinics[0];
const today = startOfToday();

const weekdaySchedule: DoctorSchedule = {
  workingDays: [1, 2, 3, 4, 5],
  startTime: "09:00",
  endTime: "17:00",
  slotMinutes: 30,
};

export const mockClinicDoctors: ClinicDoctor[] = [
  {
    id: "cd1",
    firstName: "Nino",
    lastName: "Beridze",
    email: "n.beridze@vakemedical.ge",
    specialty: "Cardiology",
    clinic,
    experienceYears: 12,
    bio: "Preventive cardiology and hypertension management.",
    schedule: weekdaySchedule,
  },
  {
    id: "cd2",
    firstName: "Tamar",
    lastName: "Gelashvili",
    email: "t.gelashvili@vakemedical.ge",
    specialty: "Pediatrics",
    clinic,
    experienceYears: 8,
    schedule: { ...weekdaySchedule, startTime: "10:00", endTime: "18:00" },
  },
  {
    id: "cd3",
    firstName: "Davit",
    lastName: "Khurtsidze",
    email: "d.khurtsidze@vakemedical.ge",
    specialty: "Orthopedics",
    clinic,
    experienceYears: 15,
    schedule: {
      workingDays: [1, 3, 5],
      startTime: "08:00",
      endTime: "14:00",
      slotMinutes: 30,
    },
  },
  {
    id: "cd4",
    firstName: "Mariam",
    lastName: "Abashidze",
    email: "m.abashidze@vakemedical.ge",
    specialty: "Dermatology",
    clinic,
    experienceYears: 6,
    schedule: {
      workingDays: [2, 4, 6],
      startTime: "11:00",
      endTime: "19:00",
      slotMinutes: 20,
    },
  },
  {
    id: "cd5",
    firstName: "Irakli",
    lastName: "Chkheidze",
    email: "i.chkheidze@vakemedical.ge",
    specialty: "Neurology",
    clinic,
    experienceYears: 10,
    schedule: { ...weekdaySchedule, slotMinutes: 45 },
  },
];

const mockPatients: PatientSummary[] = [
  { id: "pt1", firstName: "Luka", lastName: "Maisuradze", phone: "+995 555 120 401" },
  { id: "pt2", firstName: "Salome", lastName: "Kvaratskhelia", phone: "+995 555 230 512" },
  { id: "pt3", firstName: "Nika", lastName: "Japaridze" },
  { id: "pt4", firstName: "Elene", lastName: "Gogoladze", phone: "+995 555 450 734" },
  { id: "pt5", firstName: "Saba", lastName: "Mchedlishvili" },
  { id: "pt6", firstName: "Keti", lastName: "Tsereteli", phone: "+995 555 670 956" },
  { id: "pt7", firstName: "Giorgi", lastName: "Natsvlishvili" },
  { id: "pt8", firstName: "Ana", lastName: "Bakradze", phone: "+995 555 890 178" },
];

const cancellationReasons = [
  "Patient request",
  "Doctor unavailable",
  "Scheduling conflict",
];

// Deterministic spread of appointments 30 days back and 30 days ahead
const generateAppointments = (): ClinicAppointment[] => {
  const appointments: ClinicAppointment[] = [];
  const days = eachDayOfInterval({
    start: subDays(today, 30),
    end: addDays(today, 30),
  });

  days.forEach((day, dayIndex) => {
    mockClinicDoctors.forEach((doctor, doctorIndex) => {
      const { schedule } = doctor;
      if (!isWorkingDay(schedule, day)) return;

      const slotsPerDay = getSlotsPerDay(schedule);
      const count = 2 + ((dayIndex + doctorIndex * 3) % 4);
      const dayStart = toTime(schedule.startTime, day);

      for (let i = 0; i < count; i++) {
        const seed = dayIndex * 7 + doctorIndex * 5 + i * 3;
        const slot = (i * 3 + doctorIndex) % slotsPerDay;
        const startsAt = addMinutes(dayStart, slot * schedule.slotMinutes);
        const isPast = startsAt < new Date();
        const isCancelled = seed % 9 === 0;
        const isRescheduled = !isCancelled && seed % 11 === 0;

        const status = isCancelled
          ? AppointmentStatus.CANCELLED
          : isPast
            ? AppointmentStatus.COMPLETED
            : seed % 5 === 0
              ? AppointmentStatus.PENDING
              : AppointmentStatus.SCHEDULED;

        appointments.push({
          id: `ca-${dayIndex}-${doctorIndex}-${i}`,
          doctor,
          patient: mockPatients[seed % mockPatients.length],
          startsAt: startsAt.toISOString(),
          status,
          rescheduledFrom: isRescheduled
            ? subDays(startsAt, 1 + (seed % 3)).toISOString()
            : undefined,
          cancelledAt: isCancelled
            ? subDays(setHours(startsAt, 8), 1).toISOString()
            : undefined,
          cancellationReason: isCancelled
            ? cancellationReasons[seed % cancellationReasons.length]
            : undefined,
        });
      }
    });
  });

  return appointments;
};

export const mockClinicAppointments: ClinicAppointment[] = generateAppointments();

// Mirrors GET api/doctors/:id/slots — past and booked slots are unavailable
export const computeDoctorSlots = (doctorId: string, date: Date): TimeSlot[] => {
  const doctor = mockClinicDoctors.find((item) => item.id === doctorId);
  if (!doctor || !isWorkingDay(doctor.schedule, date)) return [];

  const { schedule } = doctor;
  const dayStart = toTime(schedule.startTime, date);
  const now = new Date();
  const taken = new Set(
    mockClinicAppointments
      .filter(
        (apt) =>
          apt.doctor.id === doctorId &&
          apt.status !== AppointmentStatus.CANCELLED,
      )
      .map((apt) => new Date(apt.startsAt).getTime()),
  );

  return Array.from({ length: getSlotsPerDay(schedule) }, (_, index) => {
    const start = addMinutes(dayStart, index * schedule.slotMinutes);
    return { start, available: start > now && !taken.has(start.getTime()) };
  });
};

const isInRange = (iso: string, { from, to }: DateRange) => {
  const date = new Date(iso);
  return date >= new Date(from) && date < new Date(to);
};

const countWorkingDays = (schedule: DoctorSchedule, { from, to }: DateRange) => {
  const end = subDays(new Date(to), 1);
  if (end < new Date(from)) return 0;
  return eachDayOfInterval({ start: new Date(from), end }).filter((day) =>
    isWorkingDay(schedule, day),
  ).length;
};

const ratio = (part: number, whole: number) => (whole > 0 ? part / whole : 0);

// Mirrors what the server's stats endpoint is expected to return
export const computeClinicStats = (range: DateRange): ClinicStats => {
  const inRange = mockClinicAppointments.filter((apt) =>
    isInRange(apt.startsAt, range),
  );
  const cancelled = inRange.filter(
    (apt) => apt.status === AppointmentStatus.CANCELLED,
  );

  const workload = mockClinicDoctors.map((doctor) => {
    const own = inRange.filter((apt) => apt.doctor.id === doctor.id);
    const ownCancelled = own.filter(
      (apt) => apt.status === AppointmentStatus.CANCELLED,
    ).length;
    const booked = own.length - ownCancelled;
    const capacity =
      countWorkingDays(doctor.schedule, range) * getSlotsPerDay(doctor.schedule);

    return {
      doctor,
      booked,
      completed: own.filter(
        (apt) => apt.status === AppointmentStatus.COMPLETED,
      ).length,
      cancelled: ownCancelled,
      capacity,
      utilisation: ratio(booked, capacity),
    };
  });

  const totalBooked = workload.reduce((sum, item) => sum + item.booked, 0);
  const totalCapacity = workload.reduce((sum, item) => sum + item.capacity, 0);

  return {
    total: inRange.length,
    completed: inRange.filter(
      (apt) => apt.status === AppointmentStatus.COMPLETED,
    ).length,
    upcoming: inRange.filter(
      (apt) =>
        apt.status === AppointmentStatus.SCHEDULED ||
        apt.status === AppointmentStatus.PENDING,
    ).length,
    cancelled: cancelled.length,
    rescheduled: inRange.filter((apt) => apt.rescheduledFrom).length,
    cancellationRate: ratio(cancelled.length, inRange.length),
    utilisation: ratio(totalBooked, totalCapacity),
    workload,
  };
};
