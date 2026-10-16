import { PractitionerSignInIcon } from "../../assets/icons/Icons";
import EmptyState from "../../shared/ui/EmptyState";

// Placeholder — doctor list and registration land in a later part
function ClinicDoctorsSection() {
  return (
    <EmptyState
      description="Your clinic's doctors will appear here."
      icon={PractitionerSignInIcon}
      title="No doctors yet"
    />
  );
}

export default ClinicDoctorsSection;
