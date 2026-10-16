import { useState } from "react";
import { RecordsFolderIcon, SearchIcon } from "../../assets/icons/Icons";
import { useDoctorAppointments } from "../../hooks/useAppointments";
import { getPastAppointments } from "../../utils/appointments";
import Input from "../../shared/ui/Input";
import QueryState from "../../shared/ui/QueryState";
import EmptyState from "../../shared/ui/EmptyState";
import PatientVisitCard from "./PatientVisitCard";

function PatientHistorySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data = [], isPending, error } = useDoctorAppointments();

  const pastAppointments = getPastAppointments(data);

  const filteredAppointments = pastAppointments.filter((apt) => {
    const searchLower = searchQuery.toLowerCase();
    // Filter by clinic name or specialty
    return (
      apt.doctor.clinic.name.toLowerCase().includes(searchLower) ||
      apt.doctor.specialty.toLowerCase().includes(searchLower)
    );
  });

  return (
    <QueryState error={error} isPending={isPending}>
      <div className="space-y-4">
        <Input
          label="Search patient history"
          leadingElement={<SearchIcon aria-hidden="true" className="h-4 w-4" />}
          placeholder="Search by clinic or specialty..."
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {filteredAppointments.length > 0 ? (
          <div className="space-y-3">
            <p className="text-label-md text-on-surface-variant">
              {filteredAppointments.length} past visit
              {filteredAppointments.length === 1 ? "" : "s"}
            </p>
            {filteredAppointments.map((appointment) => (
              <PatientVisitCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            description="No past appointments found."
            icon={RecordsFolderIcon}
            title="No visit history"
          />
        )}
      </div>
    </QueryState>
  );
}

export default PatientHistorySection;
