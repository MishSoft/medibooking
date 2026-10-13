import { format } from "date-fns";
import { PillIcon } from "../../assets/icons/Icons";
import type { Prescription } from "../../types/prescription";
import Tag from "../../shared/ui/Tag";
import { getDoctorName } from "../doctors/DoctorCard";

type PrescriptionCardProps = {
  prescription: Prescription;
};

export const isPrescriptionActive = (
  prescription: Prescription,
  now = Date.now(),
) => Date.parse(prescription.validUntil) >= now;

function PrescriptionCard({ prescription }: PrescriptionCardProps) {
  const { medication, dosage, frequency, instructions, doctor } = prescription;
  const isActive = isPrescriptionActive(prescription);

  return (
    <article
      className={`flex h-full flex-col gap-4 rounded-xl bg-surface-container p-5 shadow-elevation-2 ${isActive ? "" : "opacity-70"}`}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
          <PillIcon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-headline-sm">{medication}</h3>
            <Tag tone={isActive ? "success" : "neutral"}>
              {isActive ? "ACTIVE" : "EXPIRED"}
            </Tag>
          </div>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            {dosage} · {frequency}
          </p>
        </div>
      </div>

      {instructions && (
        <p className="text-body-sm text-on-surface">{instructions}</p>
      )}

      <dl className="mt-auto grid grid-cols-2 gap-3 rounded-lg bg-surface-container-low p-3">
        <div className="col-span-2">
          <dt className="text-label-md text-on-surface-variant">Prescribed by</dt>
          <dd className="text-body-sm">
            {getDoctorName(doctor)}
            <span className="text-on-surface-variant"> · {doctor.specialty}</span>
          </dd>
        </div>
        <div>
          <dt className="text-label-md text-on-surface-variant">Issued</dt>
          <dd className="font-code text-code-sm text-secondary">
            {format(new Date(prescription.issuedAt), "dd.MM.yyyy")}
          </dd>
        </div>
        <div>
          <dt className="text-label-md text-on-surface-variant">Valid until</dt>
          <dd className="font-code text-code-sm text-secondary">
            {format(new Date(prescription.validUntil), "dd.MM.yyyy")}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export default PrescriptionCard;
