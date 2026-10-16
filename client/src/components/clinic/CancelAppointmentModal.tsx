import { useState } from "react";
import { format } from "date-fns";
import { useCancelClinicAppointment } from "../../hooks/useClinic";
import type { ClinicAppointment } from "../../types/clinic";
import Button from "../../shared/ui/Button";
import Input from "../../shared/ui/Input";
import Modal from "../../shared/ui/Modal";
import Select from "../../shared/ui/Select";
import { getDoctorName } from "../doctors/DoctorCard";

type CancelAppointmentModalProps = {
  appointment: ClinicAppointment;
  onClose: () => void;
};

const OTHER_REASON = "Other";

const reasonOptions = [
  "Patient request",
  "Doctor unavailable",
  "Scheduling conflict",
  OTHER_REASON,
].map((reason) => ({ value: reason, label: reason }));

// Mounted only while cancelling, so state starts fresh for each appointment
function CancelAppointmentModal({
  appointment,
  onClose,
}: CancelAppointmentModalProps) {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const cancelAppointment = useCancelClinicAppointment();

  const finalReason =
    reason === OTHER_REASON ? otherReason.trim() : reason;
  const { patient } = appointment;

  const handleConfirm = () =>
    cancelAppointment.mutate(
      { id: appointment.id, reason: finalReason || undefined },
      { onSuccess: onClose },
    );

  return (
    <Modal
      description={`${patient.firstName} ${patient.lastName} with ${getDoctorName(appointment.doctor)} · ${format(new Date(appointment.startsAt), "EEE, d MMM yyyy · HH:mm")}`}
      footer={
        <>
          <Button onClick={onClose} variant="secondary">
            Keep Appointment
          </Button>
          <Button
            disabled={!finalReason || cancelAppointment.isPending}
            onClick={handleConfirm}
            variant="accent"
          >
            {cancelAppointment.isPending ? "Cancelling…" : "Cancel Appointment"}
          </Button>
        </>
      }
      onClose={onClose}
      open
      title="Cancel Appointment"
    >
      <div className="space-y-4">
        <p className="text-body-md text-on-surface-variant">
          The time slot will be released for other patients.
        </p>
        <Select
          label="Reason"
          onChange={(event) => setReason(event.target.value)}
          options={reasonOptions}
          placeholder="Select a reason"
          required
          value={reason}
        />
        {reason === OTHER_REASON && (
          <Input
            label="Describe the reason"
            maxLength={200}
            onChange={(event) => setOtherReason(event.target.value)}
            required
            value={otherReason}
          />
        )}
        {cancelAppointment.error && (
          <p className="text-body-sm text-error" role="alert">
            {cancelAppointment.error.message}
          </p>
        )}
      </div>
    </Modal>
  );
}

export default CancelAppointmentModal;
