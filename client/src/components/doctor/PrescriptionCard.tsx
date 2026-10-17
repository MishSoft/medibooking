import { format, isPast } from "date-fns";
import type { Prescription } from "../../types/prescription";
import Button from "../../shared/ui/Button";
import Tag from "../../shared/ui/Tag";
import { getPatientName } from "./PatientVisitCard";

type PrescriptionCardProps = {
  prescription: Prescription;
  onEdit: (prescription: Prescription) => void;
};

function PrescriptionCard({ prescription, onEdit }: PrescriptionCardProps) {
  const {
    patient,
    medication,
    dosage,
    frequency,
    instructions,
    issuedAt,
    validUntil,
  } = prescription;
  const isExpired = isPast(new Date(validUntil));

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface-container p-4 shadow-elevation-2 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-headline-sm">{medication}</h3>
            <Tag tone={isExpired ? "error" : "success"}>
              {isExpired ? "Expired" : "Active"}
            </Tag>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            For <span className="text-on-surface">{getPatientName(patient)}</span>
          </p>
        </div>
        <Button onClick={() => onEdit(prescription)} variant="secondary">
          Edit
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-body-sm text-on-surface">
          {dosage} · {frequency}
        </p>
        {instructions && (
          <p className="text-body-sm text-on-surface-variant">{instructions}</p>
        )}
        <p className="flex flex-wrap gap-x-4 gap-y-1 font-code text-code-sm text-on-surface-variant">
          <span>Issued {format(new Date(issuedAt), "d MMM yyyy")}</span>
          <span>Valid until {format(new Date(validUntil), "d MMM yyyy")}</span>
        </p>
      </div>
    </article>
  );
}

export default PrescriptionCard;
