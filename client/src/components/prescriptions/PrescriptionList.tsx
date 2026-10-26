import type { Prescription } from "../../types/prescription";
import PrescriptionCard from "./PrescriptionCard";

type PrescriptionListProps = {
  title: string;
  prescriptions: Prescription[];
};

function PrescriptionList({ title, prescriptions }: PrescriptionListProps) {
  if (prescriptions.length === 0) return null;

  return (
    <section className="space-y-3">
      <h3 className="text-label-lg text-on-surface-variant">
        {title} ({prescriptions.length})
      </h3>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {prescriptions.map((prescription) => (
          <li key={prescription.id}>
            <PrescriptionCard prescription={prescription} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PrescriptionList;
