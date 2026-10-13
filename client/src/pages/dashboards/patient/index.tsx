import { useSearchParams } from "react-router";
import {
  ClockHistoryIcon,
  PillIcon,
  PractitionerCalendarIcon,
  SearchIcon,
} from "../../../assets/icons/Icons";
import DashboardTabs, {
  type DashboardTab,
} from "../../../components/dashboard/DashboardTabs";
import EmptyState from "../../../shared/ui/EmptyState";
import Panel from "../../../shared/ui/Panel";

type PatientTabId = "doctors" | "appointments" | "history" | "prescriptions";

const patientTabs: DashboardTab<PatientTabId>[] = [
  { id: "doctors", label: "Find a Doctor", icon: SearchIcon },
  { id: "appointments", label: "My Appointments", icon: PractitionerCalendarIcon },
  { id: "history", label: "History", icon: ClockHistoryIcon },
  { id: "prescriptions", label: "Prescriptions", icon: PillIcon },
];

const isPatientTab = (value: string | null): value is PatientTabId =>
  patientTabs.some((tab) => tab.id === value);

function PatientDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: PatientTabId = isPatientTab(tabParam) ? tabParam : "doctors";
  const activeTabMeta = patientTabs.find((tab) => tab.id === activeTab)!;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-label-md tracking-[0.1em] text-primary">
          PATIENT PORTAL
        </p>
        <h1 className="mt-1 text-headline-xl">Your Health Dashboard</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Find specialists, book appointments and keep track of your
          prescriptions.
        </p>
      </div>

      <DashboardTabs
        activeTab={activeTab}
        ariaLabel="Patient dashboard sections"
        onChange={(id) => setSearchParams({ tab: id })}
        tabs={patientTabs}
      />

      <Panel
        aria-labelledby={`tab-${activeTab}`}
        id={`panel-${activeTab}`}
        role="tabpanel"
        title={activeTabMeta.label}
      >
        {/* Section content is added in the following parts */}
        <EmptyState
          description="This section is coming soon."
          icon={activeTabMeta.icon}
          title={activeTabMeta.label}
        />
      </Panel>
    </div>
  );
}

export default PatientDashboardPage;
