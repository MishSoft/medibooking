// Temporary mock data — replaced by API queries in the API wiring part
import type { Clinic, Doctor } from "../types/doctor";

export const mockClinics: Clinic[] = [
  { id: "c1", name: "Vake Medical Center", address: "12 Chavchavadze Ave, Tbilisi" },
  { id: "c2", name: "Saburtalo Health Hub", address: "45 Pekini Ave, Tbilisi" },
  { id: "c3", name: "Old Town Clinic", address: "8 Leselidze St, Tbilisi" },
];

export const mockDoctors: Doctor[] = [
  {
    id: "d1",
    firstName: "Nino",
    lastName: "Beridze",
    specialty: "Cardiology",
    clinic: mockClinics[0],
    experienceYears: 12,
    bio: "Preventive cardiology and hypertension management.",
  },
  {
    id: "d2",
    firstName: "Giorgi",
    lastName: "Kapanadze",
    specialty: "Neurology",
    clinic: mockClinics[1],
    experienceYears: 9,
    bio: "Headache disorders and sleep medicine.",
  },
  {
    id: "d3",
    firstName: "Ana",
    lastName: "Lomidze",
    specialty: "Dermatology",
    clinic: mockClinics[2],
    experienceYears: 7,
  },
  {
    id: "d4",
    firstName: "Levan",
    lastName: "Tsiklauri",
    specialty: "Pediatrics",
    clinic: mockClinics[0],
    experienceYears: 15,
    bio: "Child development and vaccinations.",
  },
  {
    id: "d5",
    firstName: "Mariam",
    lastName: "Gelashvili",
    specialty: "Cardiology",
    clinic: mockClinics[1],
    experienceYears: 5,
  },
];
