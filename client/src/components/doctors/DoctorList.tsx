import { SearchIcon } from "../../assets/icons/Icons";
import type { Doctor } from "../../types/doctor";
import EmptyState from "../../shared/ui/EmptyState";
import DoctorCard from "./DoctorCard";

type DoctorListProps = {
  doctors: Doctor[];
  onBook?: (doctor: Doctor) => void;
};

function DoctorList({ doctors, onBook }: DoctorListProps) {
  if (doctors.length === 0) {
    return (
      <EmptyState
        description="Try a different name, specialty or clinic."
        icon={SearchIcon}
        title="No doctors found"
      />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {doctors.map((doctor) => (
        <li key={doctor.id}>
          <DoctorCard doctor={doctor} onBook={onBook} />
        </li>
      ))}
    </ul>
  );
}

export default DoctorList;
