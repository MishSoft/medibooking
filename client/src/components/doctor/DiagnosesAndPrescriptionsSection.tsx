import { useState } from "react";
import { usePrescriptions, useAddPrescription } from "../../hooks/usePrescriptions";
import { PillIcon } from "../../assets/icons/Icons";
import Button from "../../shared/ui/Button";
import QueryState from "../../shared/ui/QueryState";
import EmptyState from "../../shared/ui/EmptyState";
import FieldError from "../../shared/ui/FieldError";
import PrescriptionCard from "./PrescriptionCard";
import AddPrescriptionModal from "./AddPrescriptionModal";

function DiagnosesAndPrescriptionsSection() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { data = [], isPending, error } = usePrescriptions();
  const addPrescription = useAddPrescription();

  const handleAddPrescription = async (formData: any) => {
    await addPrescription.mutateAsync(formData);
    setShowAddModal(false);
  };

  return (
    <QueryState error={error} isPending={isPending}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-body-md text-on-surface-variant">
            {data.length} prescription{data.length === 1 ? "" : "s"}
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            Add Prescription
          </Button>
        </div>

        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            action={
              <Button onClick={() => setShowAddModal(true)}>
                Add First Prescription
              </Button>
            }
            description="Start by adding a new prescription for your patient."
            icon={PillIcon}
            title="No prescriptions yet"
          />
        )}

        <FieldError
          id="add-prescription-error"
          message={addPrescription.error?.message}
        />
      </div>

      <AddPrescriptionModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          addPrescription.reset();
        }}
        onSubmit={handleAddPrescription}
        isLoading={addPrescription.isPending}
      />
    </QueryState>
  );
}

export default DiagnosesAndPrescriptionsSection;
