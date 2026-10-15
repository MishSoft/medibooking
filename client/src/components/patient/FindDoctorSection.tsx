import { useState } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useClinics, useDoctors, useSpecialties } from "../../hooks/useDoctors";
import type { Doctor } from "../../types/doctor";
import QueryState from "../../shared/ui/QueryState";
import DoctorFilters, { emptyDoctorFilters } from "../doctors/DoctorFilters";
import DoctorList from "../doctors/DoctorList";

type FindDoctorSectionProps = {
  onBook?: (doctor: Doctor) => void;
};

function FindDoctorSection({ onBook }: FindDoctorSectionProps) {
  const [filters, setFilters] = useState(emptyDoctorFilters);
  // Debounce only the free-text search; selects apply immediately
  const debouncedQuery = useDebouncedValue(filters.query);

  const { data: specialties = [] } = useSpecialties();
  const { data: clinics = [] } = useClinics();
  const {
    data: doctors = [],
    isPending,
    isFetching,
    error,
  } = useDoctors({ ...filters, query: debouncedQuery });

  return (
    <div className="space-y-6">
      <DoctorFilters
        clinics={clinics}
        onChange={setFilters}
        specialties={specialties}
        value={filters}
      />
      <QueryState error={error} isPending={isPending}>
        <p aria-live="polite" className="text-body-sm text-on-surface-variant">
          {isFetching
            ? "Searching…"
            : `${doctors.length} ${doctors.length === 1 ? "doctor" : "doctors"} found`}
        </p>
        <DoctorList doctors={doctors} onBook={onBook} />
      </QueryState>
    </div>
  );
}

export default FindDoctorSection;
