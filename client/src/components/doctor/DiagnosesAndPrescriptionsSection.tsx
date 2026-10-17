import { useState } from "react";
import { PillIcon } from "../../assets/icons/Icons";
import { useDoctorPrescriptions } from "../../hooks/usePrescriptions";
import type { Prescription } from "../../types/prescription";
import Button from "../../shared/ui/Button";
import EmptyState from "../../shared/ui/EmptyState";
import QueryState from "../../shared/ui/QueryState";
import PrescriptionCard from "./PrescriptionCard";
import PrescriptionFormModal from "./PrescriptionFormModal";

// "new" opens the form for a new prescription; a Prescription opens it for editing
type FormTarget = "new" | Prescription | null;

function DiagnosesAndPrescriptionsSection() {
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const { data = [], isPending, error } = useDoctorPrescriptions();

  return (
    <QueryState error={error} isPending={isPending}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-body-md text-on-surface-variant">
            {data.length} prescription{data.length === 1 ? "" : "s"} issued
          </p>
          <Button onClick={() => setFormTarget("new")}>Add Prescription</Button>
        </div>

        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                onEdit={setFormTarget}
                prescription={prescription}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            action={
              <Button onClick={() => setFormTarget("new")}>
                Add First Prescription
              </Button>
            }
            description="Prescriptions you issue to your patients will appear here."
            icon={PillIcon}
            title="No prescriptions yet"
          />
        )}
      </div>

      {formTarget && (
        <PrescriptionFormModal
          onClose={() => setFormTarget(null)}
          prescription={formTarget === "new" ? undefined : formTarget}
        />
      )}
    </QueryState>
  );
}

export default DiagnosesAndPrescriptionsSection;
