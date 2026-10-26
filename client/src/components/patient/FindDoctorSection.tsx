import { useSearchParams } from "react-router";
import { useClinics } from "../../hooks/useDoctors";
import type { Doctor } from "../../types/doctor";
import Breadcrumbs, { type BreadcrumbItem } from "../../shared/ui/Breadcrumbs";
import ClinicsStep from "./find-doctor/ClinicsStep";
import DoctorsStep from "./find-doctor/DoctorsStep";
import SpecialtiesStep from "./find-doctor/SpecialtiesStep";

type FindDoctorSectionProps = {
  onBook?: (doctor: Doctor) => void;
};

// Drill-down: clinics → clinic specialties → doctors. The current step lives
// in the URL (?clinic=&specialty=) so back/forward, reloads and links work.
function FindDoctorSection({ onBook }: FindDoctorSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const clinicId = searchParams.get("clinic") ?? "";
  const specialty = clinicId ? (searchParams.get("specialty") ?? "") : "";

  // Already cached by the clinics step; used for the breadcrumb label
  const { data: clinics = [] } = useClinics();
  const clinicName =
    clinics.find((clinic) => clinic.id === clinicId)?.name ?? "Clinic";

  const navigate = (next: { clinic?: string; specialty?: string }) => {
    setSearchParams((params) => {
      const updated = new URLSearchParams(params);
      updated.delete("clinic");
      updated.delete("specialty");
      if (next.clinic) updated.set("clinic", next.clinic);
      if (next.clinic && next.specialty)
        updated.set("specialty", next.specialty);
      return updated;
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Clinics", onClick: () => navigate({}) },
  ];
  if (clinicId) {
    breadcrumbs.push({
      label: clinicName,
      onClick: () => navigate({ clinic: clinicId }),
    });
  }
  if (specialty) {
    breadcrumbs.push({ label: specialty });
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} />
      {!clinicId ? (
        <ClinicsStep onSelect={(clinic) => navigate({ clinic: clinic.id })} />
      ) : !specialty ? (
        <SpecialtiesStep
          clinicId={clinicId}
          key={clinicId}
          onSelect={(selected) =>
            navigate({ clinic: clinicId, specialty: selected })
          }
        />
      ) : (
        <DoctorsStep
          clinicId={clinicId}
          key={`${clinicId}-${specialty}`}
          onBook={onBook}
          specialty={specialty}
        />
      )}
    </div>
  );
}

export default FindDoctorSection;
