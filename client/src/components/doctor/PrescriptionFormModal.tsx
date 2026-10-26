import { useState } from "react";
import { addDays, endOfDay, format, parseISO } from "date-fns";
import { useDoctorPatients } from "../../hooks/useAppointments";
import {
  useAddPrescription,
  useUpdatePrescription,
} from "../../hooks/usePrescriptions";
import type { Prescription } from "../../types/prescription";
import Button from "../../shared/ui/Button";
import FieldError from "../../shared/ui/FieldError";
import Input from "../../shared/ui/Input";
import Modal from "../../shared/ui/Modal";
import Select from "../../shared/ui/Select";
import Textarea from "../../shared/ui/Textarea";
import { notify } from "../../utils/notify";
import { getPatientName } from "./PatientVisitCard";

type PrescriptionFormModalProps = {
  // Omitted when adding a new prescription
  prescription?: Prescription;
  onClose: () => void;
};

const DEFAULT_VALID_DAYS = 90;
const toDateInput = (date: Date) => format(date, "yyyy-MM-dd");

// Mounted only while open, so fields start fresh for each prescription
function PrescriptionFormModal({
  prescription,
  onClose,
}: PrescriptionFormModalProps) {
  const isEditing = !!prescription;
  const [patientId, setPatientId] = useState("");
  const [medication, setMedication] = useState(prescription?.medication ?? "");
  const [dosage, setDosage] = useState(prescription?.dosage ?? "");
  const [frequency, setFrequency] = useState(prescription?.frequency ?? "");
  const [instructions, setInstructions] = useState(
    prescription?.instructions ?? "",
  );
  const [validUntil, setValidUntil] = useState(
    toDateInput(
      prescription
        ? new Date(prescription.validUntil)
        : addDays(new Date(), DEFAULT_VALID_DAYS),
    ),
  );

  const patients = useDoctorPatients();
  const addPrescription = useAddPrescription();
  const updatePrescription = useUpdatePrescription();
  const mutation = isEditing ? updatePrescription : addPrescription;

  const patientOptions = (patients.data ?? []).map((patient) => ({
    value: patient.id,
    label: getPatientName(patient),
  }));
  const hasNoPatients = !isEditing && patients.isSuccess && !patientOptions.length;

  const isValid =
    (isEditing || !!patientId) &&
    !!medication.trim() &&
    !!dosage.trim() &&
    !!frequency.trim() &&
    !!validUntil;

  const handleSubmit = () => {
    const fields = {
      medication: medication.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      // Valid through the end of the chosen day
      validUntil: endOfDay(parseISO(validUntil)).toISOString(),
    };

    if (prescription) {
      updatePrescription.mutate(
        // Empty string clears the instructions on the server
        { id: prescription.id, payload: { ...fields, instructions } },
        {
          onSuccess: () => {
            notify.success("Prescription updated");
            onClose();
          },
        },
      );
    } else {
      addPrescription.mutate(
        { patientId, ...fields, instructions: instructions || undefined },
        {
          onSuccess: () => {
            notify.success("Prescription added");
            onClose();
          },
        },
      );
    }
  };

  return (
    <Modal
      description={
        prescription
          ? `${getPatientName(prescription.patient)} · issued ${format(new Date(prescription.issuedAt), "d MMM yyyy")}`
          : "Prescribe medication to a patient you have treated."
      }
      footer={
        <>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            disabled={!isValid || mutation.isPending}
            onClick={handleSubmit}
          >
            {mutation.isPending
              ? "Saving…"
              : isEditing
                ? "Save Changes"
                : "Add Prescription"}
          </Button>
        </>
      }
      onClose={onClose}
      open
      title={isEditing ? "Edit prescription" : "Add prescription"}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (isValid && !mutation.isPending) handleSubmit();
        }}
      >
        {!isEditing && (
          <div>
            <Select
              disabled={patients.isPending || hasNoPatients}
              label="Patient"
              onChange={(event) => setPatientId(event.target.value)}
              options={patientOptions}
              placeholder={
                patients.isPending ? "Loading patients…" : "Select a patient"
              }
              required
              value={patientId}
            />
            {hasNoPatients && (
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Complete a visit first — you can only prescribe to patients
                you have treated.
              </p>
            )}
            <FieldError
              id="prescription-patients-error"
              message={patients.error?.message}
            />
          </div>
        )}

        <Input
          label="Medication"
          onChange={(event) => setMedication(event.target.value)}
          placeholder="e.g. Amlodipine"
          required
          value={medication}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Dosage"
            onChange={(event) => setDosage(event.target.value)}
            placeholder="e.g. 5 mg"
            required
            value={dosage}
          />
          <Input
            label="Frequency"
            onChange={(event) => setFrequency(event.target.value)}
            placeholder="e.g. Once daily"
            required
            value={frequency}
          />
        </div>
        <Textarea
          label="Instructions (optional)"
          maxLength={1000}
          onChange={(event) => setInstructions(event.target.value)}
          placeholder="e.g. Take in the morning, with or without food."
          value={instructions}
        />
        <Input
          label="Valid until"
          min={toDateInput(new Date())}
          onChange={(event) => setValidUntil(event.target.value)}
          required
          type="date"
          value={validUntil}
        />

        <FieldError id="prescription-error" message={mutation.error?.message} />
      </form>
    </Modal>
  );
}

export default PrescriptionFormModal;
