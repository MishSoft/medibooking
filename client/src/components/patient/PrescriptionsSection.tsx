import { PillIcon } from "../../assets/icons/Icons";
import { usePrescriptions } from "../../hooks/usePrescriptions";
import EmptyState from "../../shared/ui/EmptyState";
import QueryState from "../../shared/ui/QueryState";
import { isPrescriptionActive } from "../prescriptions/PrescriptionCard";
import PrescriptionList from "../prescriptions/PrescriptionList";

function PrescriptionsSection() {
  const { data = [], isPending, error } = usePrescriptions();

  const sorted = [...data].sort(
    (a, b) => Date.parse(b.issuedAt) - Date.parse(a.issuedAt),
  );
  const active = sorted.filter((item) => isPrescriptionActive(item));
  const expired = sorted.filter((item) => !isPrescriptionActive(item));

  return (
    <QueryState error={error} isPending={isPending}>
      {data.length === 0 ? (
        <EmptyState
          description="Prescriptions issued by your doctors will appear here."
          icon={PillIcon}
          title="No prescriptions yet"
        />
      ) : (
        <div className="space-y-8">
          <PrescriptionList prescriptions={active} title="Active" />
          <PrescriptionList prescriptions={expired} title="Expired" />
        </div>
      )}
    </QueryState>
  );
}

export default PrescriptionsSection;
