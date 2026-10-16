import { ChartBarIcon } from "../../assets/icons/Icons";
import EmptyState from "../../shared/ui/EmptyState";

// Placeholder — statistics and workload reports land in a later part
function ClinicReportsSection() {
  return (
    <EmptyState
      description="Statistical reports and workload analyses will appear here."
      icon={ChartBarIcon}
      title="No reports yet"
    />
  );
}

export default ClinicReportsSection;
