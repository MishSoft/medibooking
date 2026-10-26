import { useState } from "react";
import { format } from "date-fns";
import type { Appointment, VisitRecordPayload } from "../../types/appointment";
import Button from "../../shared/ui/Button";
import FieldError from "../../shared/ui/FieldError";
import Modal from "../../shared/ui/Modal";
import Textarea from "../../shared/ui/Textarea";
import { getPatientName } from "./PatientVisitCard";

type VisitRecordModalProps = {
  appointment: Appointment;
  title: string;
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  errorMessage?: string;
  onSubmit: (record: VisitRecordPayload) => void;
  onClose: () => void;
};

// Mounted only while open, so fields start from the visit's current record
function VisitRecordModal({
  appointment,
  title,
  submitLabel,
  pendingLabel,
  isPending,
  errorMessage,
  onSubmit,
  onClose,
}: VisitRecordModalProps) {
  const [diagnosis, setDiagnosis] = useState(appointment.diagnosis ?? "");
  const [notes, setNotes] = useState(appointment.notes ?? "");

  return (
    <Modal
      description={`${getPatientName(appointment.patient)} · ${format(new Date(appointment.startsAt), "EEE, d MMM yyyy · HH:mm")}`}
      footer={
        <>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={() => onSubmit({ diagnosis, notes })}
          >
            {isPending ? pendingLabel : submitLabel}
          </Button>
        </>
      }
      onClose={onClose}
      open
      title={title}
    >
      <div className="space-y-4">
        <Textarea
          label="Diagnosis"
          maxLength={1000}
          onChange={(event) => setDiagnosis(event.target.value)}
          placeholder="e.g. Essential hypertension, stage 1"
          value={diagnosis}
        />
        <Textarea
          label="Visit notes"
          maxLength={2000}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="e.g. Follow-up in 3 months. Continue current treatment."
          value={notes}
        />
        <FieldError id="visit-record-error" message={errorMessage} />
      </div>
    </Modal>
  );
}

export default VisitRecordModal;
