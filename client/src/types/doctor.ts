export type Clinic = {
  id: string;
  name: string;
  address: string;
};

export type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  clinic: Clinic;
  experienceYears?: number;
  bio?: string;
};

export type DoctorFiltersValue = {
  query: string;
  specialty: string;
  clinicId: string;
};
