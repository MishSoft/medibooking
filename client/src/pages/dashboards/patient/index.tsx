import { useState } from "react";
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
import BookingModal from "../../../components/booking/BookingModal";
import AppointmentHistorySection from "../../../components/patient/AppointmentHistorySection";
import FindDoctorSection from "../../../components/patient/FindDoctorSection";
import MyAppointmentsSection from "../../../components/patient/MyAppointmentsSection";
import type { Doctor } from "../../../types/doctor";
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
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const tabParam = searchParams.get("tab");
  const activeTab: PatientTabId = isPatientTab(tabParam) ? tabParam : "doctors";
  const activeTabMeta = patientTabs.find((tab) => tab.id === activeTab)!;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-label-md tracking-widest text-primary">
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
        {activeTab === "doctors" ? (
          <FindDoctorSection onBook={setBookingDoctor} />
        ) : activeTab === "appointments" ? (
          <MyAppointmentsSection
            onFindDoctor={() => setSearchParams({ tab: "doctors" })}
          />
        ) : activeTab === "history" ? (
          <AppointmentHistorySection />
        ) : (
          <EmptyState
            description="This section is coming soon."
            icon={activeTabMeta.icon}
            title={activeTabMeta.label}
          />
        )}
      </Panel>

      <BookingModal
        doctor={bookingDoctor}
        onClose={() => setBookingDoctor(null)}
      />
    </div>
  );
}

export default PatientDashboardPage;
