import {
  AppointmentStatus,
  type AppointmentStatus as AppointmentStatusType,
} from "../../types/appointment";
import Tag from "../../shared/ui/Tag";

type AppointmentStatusBadgeProps = {
  status: AppointmentStatusType;
};

const statusMeta = {
  [AppointmentStatus.SCHEDULED]: { label: "Scheduled", tone: "info" },
  [AppointmentStatus.PENDING]: { label: "Pending", tone: "warning" },
  [AppointmentStatus.COMPLETED]: { label: "Completed", tone: "success" },
  [AppointmentStatus.CANCELLED]: { label: "Cancelled", tone: "error" },
} as const;

function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const { label, tone } = statusMeta[status];

  return <Tag tone={tone}>{label.toUpperCase()}</Tag>;
}

export default AppointmentStatusBadge;
