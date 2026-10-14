import { useState } from "react";
import { addDays, startOfToday } from "date-fns";
import Modal from "../../shared/ui/Modal";
import Input from "../../shared/ui/Input";
import Button from "../../shared/ui/Button";
import { mockDoctors } from "../../mocks/doctors";

type AddPrescriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
};

function AddPrescriptionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddPrescriptionModalProps) {
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [instructions, setInstructions] = useState("");
  const [validDays, setValidDays] = useState("90");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const today = startOfToday();
    const validUntil = addDays(today, parseInt(validDays, 10));

    await onSubmit({
      doctor: mockDoctors[0],
      medication,
      dosage,
      frequency,
      instructions: instructions || undefined,
      issuedAt: today.toISOString(),
      validUntil: validUntil.toISOString(),
    });

    setMedication("");
    setDosage("");
    setFrequency("");
    setInstructions("");
    setValidDays("90");
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Add Prescription"
      description="Record a new prescription for your patient."
      footer={
        <>
          <Button onClick={onClose} variant="secondary" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !medication.trim() ||
              !dosage.trim() ||
              !frequency.trim()
            }
          >
            {isLoading ? "Adding..." : "Add Prescription"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Medication Name"
          placeholder="e.g., Amlodipine, Ibuprofen"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          required
        />

        <Input
          label="Dosage"
          placeholder="e.g., 5 mg, 500 mg/5ml"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          required
        />

        <Input
          label="Frequency"
          placeholder="e.g., Once daily, Twice daily, As needed"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          required
        />

        <Input
          label="Instructions (Optional)"
          placeholder="e.g., Take with food, Take in the morning"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        <Input
          label="Valid for (days)"
          placeholder="90"
          type="number"
          min="1"
          max="730"
          value={validDays}
          onChange={(e) => setValidDays(e.target.value)}
        />
      </form>
    </Modal>
  );
}

export default AddPrescriptionModal;
