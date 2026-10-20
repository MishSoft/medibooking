import { ClinicBuildingIcon } from "../../../assets/icons/Icons";
import type { Clinic } from "../../../types/doctor";

type ClinicCardProps = {
  clinic: Clinic;
  onSelect: (clinic: Clinic) => void;
};

function ClinicCard({ clinic, onSelect }: ClinicCardProps) {
  return (
    <button
      aria-label={`View specialties at ${clinic.name}`}
      className="flex h-full w-full items-start gap-4 rounded-xl bg-surface-container p-5 text-left shadow-elevation-2 transition-shadow hover:shadow-elevation-3 focus-visible:outline-2 focus-visible:outline-primary"
      onClick={() => onSelect(clinic)}
      type="button"
    >
      <ClinicBuildingIcon
        aria-hidden="true"
        className="mt-0.5 h-6 w-6 shrink-0 text-primary"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-headline-sm">{clinic.name}</span>
        <span className="mt-1 block text-body-sm text-on-surface-variant">
          {clinic.address}
        </span>
      </span>
    </button>
  );
}

export default ClinicCard;
