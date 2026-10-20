import { BadgeCheckIcon } from "../../../assets/icons/Icons";
import type { ClinicSpecialty } from "../../../types/doctor";
import Tag from "../../../shared/ui/Tag";

type SpecialtyCardProps = {
  specialty: ClinicSpecialty;
  onSelect: (specialty: string) => void;
};

function SpecialtyCard({ specialty, onSelect }: SpecialtyCardProps) {
  return (
    <button
      aria-label={`View ${specialty.specialty} doctors`}
      className="flex h-full cursor-pointer w-full items-start gap-4 rounded-xl bg-surface-container p-5 text-left shadow-elevation-2 transition-shadow hover:shadow-elevation-3 focus-visible:outline-2 focus-visible:outline-primary"
      onClick={() => onSelect(specialty.specialty)}
      type="button"
    >
      <BadgeCheckIcon
        aria-hidden="true"
        className="mt-0.5 h-6 w-6 shrink-0 text-primary"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-headline-sm">
          {specialty.specialty}
        </span>
        <span className="mt-3 block">
          <Tag tone="secondary">
            {specialty.doctorCount}{" "}
            {specialty.doctorCount === 1 ? "doctor" : "doctors"}
          </Tag>
        </span>
      </span>
    </button>
  );
}

export default SpecialtyCard;
