import { ClockHistoryIcon } from "../../assets/icons/Icons";
import { useMyDoctorSchedule } from "../../hooks/useMe";
import { formatSchedule, formatSlotMinutes } from "../../utils/schedule";

function WorkingHoursSummary() {
  const { data: schedule, isPending, error } = useMyDoctorSchedule();

  if (isPending || error) return null;

  return (
    <div className="flex flex-col gap-1 rounded-xl bg-surface-container p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="inline-flex items-center gap-2 text-body-md">
        <ClockHistoryIcon aria-hidden="true" className="h-5 w-5 text-primary" />
        {schedule ? (
          <>
            <span className="text-on-surface-variant">Working hours:</span>
            <span className="font-code text-code-sm text-on-surface">
              {formatSchedule(schedule)} · {formatSlotMinutes(schedule)}-min
              visits
            </span>
          </>
        ) : (
          <span className="text-on-surface-variant">
            No working hours set yet.
          </span>
        )}
      </p>
      <p className="text-body-sm text-on-surface-variant">
        Managed by your clinic administrator
      </p>
    </div>
  );
}

export default WorkingHoursSummary;
