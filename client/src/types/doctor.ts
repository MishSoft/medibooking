export type Clinic = {
  id: string;
  name: string;
  address: string;
  // Only returned by the clinics list
  doctorCount?: number;
};

export type ClinicSpecialty = {
  specialty: string;
  doctorCount: number;
};

// 0 = Sunday … 6 = Saturday (Date#getDay). The server uses 1 = Monday … 7 =
// Sunday; api/doctors.api.ts converts between the two.
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// A day turned off keeps its hours, so turning it back on restores them
export type ScheduleDay = {
  weekday: Weekday;
  isWorking: boolean;
  startTime: string; // "HH:mm", clinic time
  endTime: string; // "HH:mm", clinic time
  slotMinutes: number;
};

export type DoctorSchedule = {
  days: ScheduleDay[]; // always 7, Monday first (weekOrder)
};

export type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  clinic: Clinic;
  experienceYears?: number;
  bio?: string;
  // Only returned by the doctors list; null = no working hours configured
  schedule?: DoctorSchedule | null;
};

export type DoctorFiltersValue = {
  query: string;
  specialty: string;
  clinicId: string;
};
