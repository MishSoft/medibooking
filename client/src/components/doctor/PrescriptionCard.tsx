import { format, isPast } from "date-fns";
import type { Prescription } from "../../types/prescription";
import Tag from "../../shared/ui/Tag";

type PrescriptionCardProps = {
  prescription: Prescription;
};

function PrescriptionCard({ prescription }: PrescriptionCardProps) {
  const { medication, dosage, frequency, instructions, issuedAt, validUntil } =
    prescription;
  const isExpired = isPast(new Date(validUntil));
  const validUntilDate = new Date(validUntil);
  const issuedAtDate = new Date(issuedAt);

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface-container p-4 shadow-elevation-2 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-headline-sm">{medication}</h3>
          <p className="text-body-sm text-on-surface-variant">{dosage}</p>
        </div>
        <Tag tone={isExpired ? "error" : "success"}>
          {isExpired ? "Expired" : "Active"}
        </Tag>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-body-sm text-on-surface-variant">
          <span>
            <strong>Frequency:</strong> {frequency}
          </span>
        </div>

        {instructions && (
          <div className="text-body-sm text-on-surface">
            <strong>Instructions:</strong> {instructions}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-body-sm text-on-surface-variant">
          <span>
            Issued: {format(issuedAtDate, "MMM d, yyyy")}
          </span>
          <span>
            Valid until: {format(validUntilDate, "MMM d, yyyy")}
          </span>
        </div>
      </div>
    </article>
  );
}

export default PrescriptionCard;
