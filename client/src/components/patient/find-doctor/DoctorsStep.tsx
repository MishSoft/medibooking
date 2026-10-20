import { useState } from "react";
import { SearchIcon } from "../../../assets/icons/Icons";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useDoctors } from "../../../hooks/useDoctors";
import type { Doctor } from "../../../types/doctor";
import Input from "../../../shared/ui/Input";
import QueryState from "../../../shared/ui/QueryState";
import DoctorList from "../../doctors/DoctorList";

type DoctorsStepProps = {
  clinicId: string;
  specialty: string;
  onBook?: (doctor: Doctor) => void;
};

function DoctorsStep({ clinicId, specialty, onBook }: DoctorsStepProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);

  const {
    data: doctors = [],
    isPending,
    isFetching,
    error,
  } = useDoctors({ query: debouncedQuery, specialty, clinicId });

  return (
    <div className="space-y-6">
      <div role="search">
        <Input
          label="Search doctors"
          leadingElement={<SearchIcon className="h-4 w-4" />}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Doctor name"
          type="search"
          value={query}
        />
      </div>
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

export default DoctorsStep;
