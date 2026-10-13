import { useState } from "react";
import { mockClinics, mockDoctors } from "../../mocks/doctors";
import type { Doctor, DoctorFiltersValue } from "../../types/doctor";
import DoctorFilters, { emptyDoctorFilters } from "../doctors/DoctorFilters";
import DoctorList from "../doctors/DoctorList";

type FindDoctorSectionProps = {
  onBook?: (doctor: Doctor) => void;
};

const filterDoctors = (doctors: Doctor[], filters: DoctorFiltersValue) => {
  const query = filters.query.trim().toLowerCase();

  return doctors.filter((doctor) => {
    const matchesQuery =
      !query ||
      `${doctor.firstName} ${doctor.lastName} ${doctor.specialty}`
        .toLowerCase()
        .includes(query);
    const matchesSpecialty =
      !filters.specialty || doctor.specialty === filters.specialty;
    const matchesClinic =
      !filters.clinicId || doctor.clinic.id === filters.clinicId;

    return matchesQuery && matchesSpecialty && matchesClinic;
  });
};

function FindDoctorSection({ onBook }: FindDoctorSectionProps) {
  const [filters, setFilters] = useState(emptyDoctorFilters);

  const specialties = [...new Set(mockDoctors.map((d) => d.specialty))].sort();
  const doctors = filterDoctors(mockDoctors, filters);

  return (
    <div className="space-y-6">
      <DoctorFilters
        clinics={mockClinics}
        onChange={setFilters}
        specialties={specialties}
        value={filters}
      />
      <p aria-live="polite" className="text-body-sm text-on-surface-variant">
        {doctors.length} {doctors.length === 1 ? "doctor" : "doctors"} found
      </p>
      <DoctorList doctors={doctors} onBook={onBook} />
    </div>
  );
}

export default FindDoctorSection;
