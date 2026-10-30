import type { DoctorWorkload } from "../../types/clinic";
import Avatar from "../../shared/ui/Avatar";
import { formatPercent } from "../../utils/clinic";
import { getDoctorName } from "../doctors/DoctorCard";

type WorkloadTableProps = {
  workload: DoctorWorkload[];
};

// Doctors ranked by utilisation; the bar is a visual aid next to the printed value
function WorkloadTable({ workload }: WorkloadTableProps) {
  const ranked = [...workload].sort((a, b) => b.utilisation - a.utilisation);

  return (
    <div className="overflow-x-auto rounded-xl bg-surface-container shadow-elevation-2">
      <table className="w-full min-w-xl text-left text-body-sm">
        <caption className="sr-only">Workload per doctor</caption>
        <thead className="text-label-md text-on-surface-variant">
          <tr>
            <th className="px-4 py-3 font-normal" scope="col">
              DOCTOR
            </th>
            <th className="px-4 py-3 text-right font-normal" scope="col">
              BOOKED
            </th>
            <th className="px-4 py-3 text-right font-normal" scope="col">
              COMPLETED
            </th>
            <th className="px-4 py-3 text-right font-normal" scope="col">
              CANCELLED
            </th>
            <th className="px-4 py-3 text-right font-normal" scope="col">
              NO-SHOW
            </th>
            <th className="px-4 py-3 text-right font-normal" scope="col">
              CAPACITY
            </th>
            <th className="w-1/4 px-4 py-3 font-normal" scope="col">
              UTILISATION
            </th>
          </tr>
        </thead>
        <tbody>
          {ranked.map(
            ({
              doctor,
              booked,
              completed,
              cancelled,
              noShow,
              capacity,
              utilisation,
            }) => (
              <tr
                className="border-t border-surface-highest transition-colors hover:bg-surface-container-high"
                key={doctor.id}
              >
                <th className="px-4 py-3 font-normal" scope="row">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={`${doctor.firstName} ${doctor.lastName}`}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-on-surface">
                        {getDoctorName(doctor)}
                      </p>
                      <p className="text-on-surface-variant">
                        {doctor.specialty}
                      </p>
                    </div>
                  </div>
                </th>
                <td className="px-4 py-3 text-right font-code text-code-sm">
                  {booked}
                </td>
                <td className="px-4 py-3 text-right font-code text-code-sm">
                  {completed}
                </td>
                <td className="px-4 py-3 text-right font-code text-code-sm">
                  {cancelled}
                </td>
                <td className="px-4 py-3 text-right font-code text-code-sm">
                  {noShow}
                </td>
                <td className="px-4 py-3 text-right font-code text-code-sm">
                  {capacity}
                </td>
                <td className="px-4 py-3">
                  <div
                    className="flex items-center gap-3"
                    title={`${booked} of ${capacity} slots booked`}
                  >
                    <div
                      aria-hidden="true"
                      className="h-2 flex-1 overflow-hidden rounded-full bg-surface-highest"
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(utilisation, 1) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-code text-code-sm text-on-surface">
                      {formatPercent(utilisation)}
                    </span>
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

export default WorkloadTable;
