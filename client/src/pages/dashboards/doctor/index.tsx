import type { ReactNode } from "react";
import { useSearchParams } from "react-router";
import {
  PillIcon,
  PractitionerCalendarIcon,
  RecordsFolderIcon,
} from "../../../assets/icons/Icons";
import DashboardTabs, {
  type DashboardTab,
} from "../../../components/dashboard/DashboardTabs";
import Panel from "../../../shared/ui/Panel";
import ScheduleSection from "../../../components/doctor/ScheduleSection";
import PatientHistorySection from "../../../components/doctor/PatientHistorySection";
import DiagnosesAndPrescriptionsSection from "../../../components/doctor/DiagnosesAndPrescriptionsSection";

type DoctorTabId = "schedule" | "patients" | "prescriptions";

const doctorTabs: DashboardTab<DoctorTabId>[] = [
  { id: "schedule", label: "Schedule", icon: PractitionerCalendarIcon },
  { id: "patients", label: "Patient History", icon: RecordsFolderIcon },
  { id: "prescriptions", label: "Prescriptions", icon: PillIcon },
];

const isDoctorTab = (value: string | null): value is DoctorTabId =>
  doctorTabs.some((tab) => tab.id === value);

function DoctorDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: DoctorTabId = isDoctorTab(tabParam) ? tabParam : "schedule";
  const activeTabMeta = doctorTabs.find((tab) => tab.id === activeTab)!;

  const sections: Record<DoctorTabId, ReactNode> = {
    schedule: <ScheduleSection />,
    patients: <PatientHistorySection />,
    prescriptions: <DiagnosesAndPrescriptionsSection />,
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-label-md tracking-widest text-primary">
          DOCTOR PORTAL
        </p>
        <h1 className="mt-1 text-headline-xl">Your Practice Dashboard</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Manage your schedule, review patient history, and record diagnoses
          and prescriptions.
        </p>
      </div>

      <DashboardTabs
        activeTab={activeTab}
        ariaLabel="Doctor dashboard sections"
        onChange={(id) => setSearchParams({ tab: id })}
        tabs={doctorTabs}
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

export default DoctorDashboardPage;
