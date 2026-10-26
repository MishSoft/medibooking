import { SearchIcon } from "../../assets/icons/Icons";
import type { Clinic, DoctorFiltersValue } from "../../types/doctor";
import Button from "../../shared/ui/Button";
import Input from "../../shared/ui/Input";
import Select from "../../shared/ui/Select";

type DoctorFiltersProps = {
  value: DoctorFiltersValue;
  onChange: (value: DoctorFiltersValue) => void;
  specialties: string[];
  clinics: Clinic[];
};

export const emptyDoctorFilters: DoctorFiltersValue = {
  query: "",
  specialty: "",
  clinicId: "",
};

function DoctorFilters({
  value,
  onChange,
  specialties,
  clinics,
}: DoctorFiltersProps) {
  const hasActiveFilters = Object.values(value).some(Boolean);

  return (
    <div
      className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end"
      role="search"
    >
      <Input
        label="Search doctors"
        leadingElement={<SearchIcon className="h-4 w-4" />}
        onChange={(event) => onChange({ ...value, query: event.target.value })}
        placeholder="Doctor name or specialty"
        type="search"
        value={value.query}
      />
      <Select
        label="Specialty"
        onChange={(event) =>
          onChange({ ...value, specialty: event.target.value })
        }
        options={specialties.map((specialty) => ({
          value: specialty,
          label: specialty,
        }))}
        placeholder="All specialties"
        value={value.specialty}
      />
      <Select
        label="Clinic"
        onChange={(event) =>
          onChange({ ...value, clinicId: event.target.value })
        }
        options={clinics.map((clinic) => ({
          value: clinic.id,
          label: clinic.name,
        }))}
        placeholder="All clinics"
        value={value.clinicId}
      />
      <Button
        disabled={!hasActiveFilters}
        onClick={() => onChange(emptyDoctorFilters)}
        variant="secondary"
      >
        Reset
      </Button>
    </div>
  );
}

export default DoctorFilters;
