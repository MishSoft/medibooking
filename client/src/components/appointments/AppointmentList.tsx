import type { ComponentType, ReactNode, SVGProps } from "react";
import type { Appointment } from "../../types/appointment";
import EmptyState from "../../shared/ui/EmptyState";
import AppointmentCard from "./AppointmentCard";

type AppointmentListProps = {
  appointments: Appointment[];
  emptyIcon: ComponentType<SVGProps<SVGSVGElement>>;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  onCancel?: (appointment: Appointment) => void;
};

function AppointmentList({
  appointments,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  onCancel,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        action={emptyAction}
        description={emptyDescription}
        icon={emptyIcon}
        title={emptyTitle}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {appointments.map((appointment) => (
        <li key={appointment.id}>
          <AppointmentCard appointment={appointment} onCancel={onCancel} />
        </li>
      ))}
    </ul>
  );
}

export default AppointmentList;
