import { useMemo, useState } from "react";
import { addDays, format, startOfToday, subDays } from "date-fns";
import { ChartBarIcon } from "../../assets/icons/Icons";
import { useClinicStats } from "../../hooks/useClinic";
import type { DateRange, DoctorWorkload } from "../../types/clinic";
import EmptyState from "../../shared/ui/EmptyState";
import QueryState from "../../shared/ui/QueryState";
import SegmentedControl from "../../shared/ui/SegmentedControl";
import { formatPercent } from "../../utils/clinic";
import { getDoctorName } from "../doctors/DoctorCard";
import StatTile from "./StatTile";
import WorkloadTable from "./WorkloadTable";

type ReportRange = "last7" | "last30" | "next30";

const rangeOptions: { value: ReportRange; label: string }[] = [
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
  { value: "next30", label: "Next 30 days" },
];

// Day-aligned ranges keep the query key stable within a day
const getRange = (range: ReportRange): DateRange => {
  const today = startOfToday();
  const tomorrow = addDays(today, 1);

  if (range === "next30") {
    return { from: today.toISOString(), to: addDays(today, 30).toISOString() };
  }
  const days = range === "last7" ? 7 : 30;
  return {
    from: subDays(tomorrow, days).toISOString(),
    to: tomorrow.toISOString(),
  };
};

function ClinicReportsSection() {
  const [range, setRange] = useState<ReportRange>("last30");
  const dateRange = useMemo(() => getRange(range), [range]);
  const { data: stats, isPending, isFetching, error } = useClinicStats(dateRange);

  const busiest = stats?.workload.reduce<DoctorWorkload | undefined>(
    (top, item) => (!top || item.utilisation > top.utilisation ? item : top),
    undefined,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SegmentedControl
          ariaLabel="Report period"
          onChange={setRange}
          options={rangeOptions}
          value={range}
        />
        <p
          aria-live="polite"
          className="font-code text-code-sm text-on-surface-variant"
        >
          {isFetching
            ? "Updating…"
            : `${format(new Date(dateRange.from), "d MMM")} – ${format(subDays(new Date(dateRange.to), 1), "d MMM yyyy")}`}
        </p>
      </div>

      <QueryState error={error} isPending={isPending}>
        {stats && stats.total > 0 ? (
          <div className="space-y-6">
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatTile
                hint={`${stats.completed} completed · ${stats.upcoming} upcoming`}
                label="Appointments"
                value={stats.total}
              />
              <StatTile
                hint="Booked vs. available slots"
                label="Utilisation"
                value={formatPercent(stats.utilisation)}
              />
              <StatTile
                hint={`${stats.cancelled} cancelled`}
                label="Cancellation rate"
                value={formatPercent(stats.cancellationRate)}
              />
              <StatTile
                hint="Moved to a new time"
                label="Rescheduled"
                value={stats.rescheduled}
              />
              <StatTile
                hint={busiest ? getDoctorName(busiest.doctor) : undefined}
                label="Highest load"
                value={busiest ? formatPercent(busiest.utilisation) : "—"}
              />
            </dl>

            <section aria-labelledby="workload-heading" className="space-y-3">
              <div>
                <h3 className="text-headline-sm" id="workload-heading">
                  Workload per doctor
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  Non-cancelled appointments against slots available in each
                  doctor's schedule.
                </p>
              </div>
              <WorkloadTable workload={stats.workload} />
            </section>
          </div>
        ) : (
          <EmptyState
            description="There are no appointments in this period."
            icon={ChartBarIcon}
            title="No data to report"
          />
        )}
      </QueryState>
    </div>
  );
}

export default ClinicReportsSection;
