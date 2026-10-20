import { useMemo, useState } from "react";
import { SearchIcon } from "../../../assets/icons/Icons";
import { useClinics } from "../../../hooks/useDoctors";
import type { Clinic } from "../../../types/doctor";
import Input from "../../../shared/ui/Input";
import QueryState from "../../../shared/ui/QueryState";
import ClinicList from "./ClinicList";

type ClinicsStepProps = {
  onSelect: (clinic: Clinic) => void;
};

function ClinicsStep({ onSelect }: ClinicsStepProps) {
  const [query, setQuery] = useState("");
  const { data: clinics = [], isPending, error } = useClinics();

  // The clinics list is small and fully loaded, so filter client-side
  const filteredClinics = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return clinics;
    return clinics.filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(term) ||
        clinic.address.toLowerCase().includes(term),
    );
  }, [clinics, query]);

  return (
    <div className="space-y-6">
      <div role="search">
        <Input
          label="Search clinics"
          leadingElement={<SearchIcon className="h-4 w-4" />}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Clinic name or address"
          type="search"
          value={query}
        />
      </div>
      <QueryState error={error} isPending={isPending}>
        <p aria-live="polite" className="text-body-sm text-on-surface-variant">
          {`${filteredClinics.length} ${filteredClinics.length === 1 ? "clinic" : "clinics"} found`}
        </p>
        <ClinicList clinics={filteredClinics} onSelect={onSelect} />
      </QueryState>
    </div>
  );
}

export default ClinicsStep;
