import type { ReactNode } from "react";
import { useSearchParams } from "react-router";
import {
  ChartBarIcon,
  ClinicCalendarIcon,
  ClockHistoryIcon,
  PractitionerSignInIcon,
} from "../../../assets/icons/Icons";
import DashboardTabs, {
  type DashboardTab,
} from "../../../components/dashboard/DashboardTabs";
import Panel from "../../../shared/ui/Panel";
import ClinicDoctorsSection from "../../../components/clinic/ClinicDoctorsSection";
import ClinicScheduleSection from "../../../components/clinic/ClinicScheduleSection";
import AppointmentChangesSection from "../../../components/clinic/AppointmentChangesSection";
import ClinicReportsSection from "../../../components/clinic/ClinicReportsSection";

type ClinicTabId = "doctors" | "schedules" | "changes" | "reports";

const clinicTabs: DashboardTab<ClinicTabId>[] = [
  { id: "doctors", label: "Doctors", icon: PractitionerSignInIcon },
  { id: "schedules", label: "Schedules", icon: ClinicCalendarIcon },
  {
    id: "changes",
    label: "Cancellations & Reschedules",
    icon: ClockHistoryIcon,
  },
  { id: "reports", label: "Reports", icon: ChartBarIcon },
];

const isClinicTab = (value: string | null): value is ClinicTabId =>
  clinicTabs.some((tab) => tab.id === value);

function ClinicDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: ClinicTabId = isClinicTab(tabParam) ? tabParam : "doctors";
  const activeTabMeta = clinicTabs.find((tab) => tab.id === activeTab)!;

  const sections: Record<ClinicTabId, ReactNode> = {
    doctors: (
      <ClinicDoctorsSection
        onViewSchedule={(doctor) =>
          setSearchParams({ tab: "schedules", doctor: doctor.id })
        }
      />
    ),
    schedules: (
      <ClinicScheduleSection
        doctorId={searchParams.get("doctor") ?? undefined}
        onDoctorChange={(doctorId) =>
          setSearchParams(
            doctorId ? { tab: "schedules", doctor: doctorId } : { tab: "schedules" },
          )
        }
      />
    ),
    changes: <AppointmentChangesSection />,
    reports: <ClinicReportsSection />,
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-label-md tracking-widest text-primary">
          CLINIC ADMINISTRATION
        </p>
        <h1 className="mt-1 text-headline-xl">Clinic Dashboard</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Register doctors, coordinate schedules, manage appointment changes
          and review clinic workload.
        </p>
      </div>

      <DashboardTabs
        activeTab={activeTab}
        ariaLabel="Clinic dashboard sections"
        onChange={(id) => setSearchParams({ tab: id })}
        tabs={clinicTabs}
      />

      <Panel
        aria-labelledby={`tab-${activeTab}`}
        id={`panel-${activeTab}`}
        role="tabpanel"
        title={activeTabMeta.label}
      >
        {sections[activeTab]}
      </Panel>
    </div>
  );
}

export default ClinicDashboardPage;
