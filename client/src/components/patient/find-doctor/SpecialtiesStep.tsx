import { useMemo, useState } from "react";
import { SearchIcon } from "../../../assets/icons/Icons";
import { useClinicSpecialties } from "../../../hooks/useDoctors";
import Input from "../../../shared/ui/Input";
import QueryState from "../../../shared/ui/QueryState";
import SpecialtyList from "./SpecialtyList";

type SpecialtiesStepProps = {
  clinicId: string;
  onSelect: (specialty: string) => void;
};

function SpecialtiesStep({ clinicId, onSelect }: SpecialtiesStepProps) {
  const [query, setQuery] = useState("");
  const {
    data: specialties = [],
    isPending,
    error,
  } = useClinicSpecialties(clinicId);

  // A clinic's specialty list is short, so filter client-side
  const filteredSpecialties = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return specialties;
    return specialties.filter(({ specialty }) =>
      specialty.toLowerCase().includes(term),
    );
  }, [specialties, query]);

  return (
    <div className="space-y-6">
      <div role="search">
        <Input
          label="Search specialties"
          leadingElement={<SearchIcon className="h-4 w-4" />}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Specialty name"
          type="search"
          value={query}
        />
      </div>
      <QueryState error={error} isPending={isPending}>
        <p aria-live="polite" className="text-body-sm text-on-surface-variant">
          {`${filteredSpecialties.length} ${filteredSpecialties.length === 1 ? "specialty" : "specialties"} found`}
        </p>
        <SpecialtyList
          onSelect={onSelect}
          specialties={filteredSpecialties}
        />
      </QueryState>
    </div>
  );
}

export default SpecialtiesStep;
