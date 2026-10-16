import { ClinicCalendarIcon } from "../../assets/icons/Icons";
import EmptyState from "../../shared/ui/EmptyState";

// Placeholder — schedule calendar lands in a later part
function ClinicScheduleSection() {
  return (
    <EmptyState
      description="Doctors' schedules will appear here."
      icon={ClinicCalendarIcon}
      title="No schedules yet"
    />
  );
}

export default ClinicScheduleSection;
