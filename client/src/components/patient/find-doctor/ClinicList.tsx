import { SearchIcon } from "../../../assets/icons/Icons";
import type { Clinic } from "../../../types/doctor";
import EmptyState from "../../../shared/ui/EmptyState";
import ClinicCard from "./ClinicCard";

type ClinicListProps = {
  clinics: Clinic[];
  onSelect: (clinic: Clinic) => void;
};

function ClinicList({ clinics, onSelect }: ClinicListProps) {
  if (clinics.length === 0) {
    return (
      <EmptyState
        description="Try a different clinic name or address."
        icon={SearchIcon}
        title="No clinics found"
      />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {clinics.map((clinic) => (
        <li key={clinic.id}>
          <ClinicCard clinic={clinic} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}

export default ClinicList;
