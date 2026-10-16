import { ClockHistoryIcon } from "../../assets/icons/Icons";
import EmptyState from "../../shared/ui/EmptyState";

// Placeholder — cancelled/rescheduled appointments land in a later part
function AppointmentChangesSection() {
  return (
    <EmptyState
      description="Cancelled and rescheduled appointments will appear here."
      icon={ClockHistoryIcon}
      title="No appointment changes"
    />
  );
}

export default AppointmentChangesSection;
