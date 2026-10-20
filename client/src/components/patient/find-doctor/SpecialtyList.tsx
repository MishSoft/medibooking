import { SearchIcon } from "../../../assets/icons/Icons";
import type { ClinicSpecialty } from "../../../types/doctor";
import EmptyState from "../../../shared/ui/EmptyState";
import SpecialtyCard from "./SpecialtyCard";

type SpecialtyListProps = {
  specialties: ClinicSpecialty[];
  onSelect: (specialty: string) => void;
};

function SpecialtyList({ specialties, onSelect }: SpecialtyListProps) {
  if (specialties.length === 0) {
    return (
      <EmptyState
        description="Try a different specialty name."
        icon={SearchIcon}
        title="No specialties found"
      />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {specialties.map((specialty) => (
        <li key={specialty.specialty}>
          <SpecialtyCard onSelect={onSelect} specialty={specialty} />
        </li>
      ))}
    </ul>
  );
}

export default SpecialtyList;
