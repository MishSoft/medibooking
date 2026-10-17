import { useState } from "react";
import { RecordsFolderIcon, SearchIcon } from "../../assets/icons/Icons";
import {
  useDoctorAppointments,
  useUpdateVisitRecord,
} from "../../hooks/useAppointments";
import type { Appointment } from "../../types/appointment";
import { getVisitHistory } from "../../utils/appointments";
import EmptyState from "../../shared/ui/EmptyState";
import Input from "../../shared/ui/Input";
import QueryState from "../../shared/ui/QueryState";
import PatientVisitCard, { getPatientName } from "./PatientVisitCard";
import VisitRecordModal from "./VisitRecordModal";

function PatientHistorySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [toEdit, setToEdit] = useState<Appointment | null>(null);
  const { data = [], isPending, error } = useDoctorAppointments();
  const updateVisitRecord = useUpdateVisitRecord();

  const history = getVisitHistory(data);
  const searchLower = searchQuery.trim().toLowerCase();
  const filteredHistory = history.filter((appointment) =>
    getPatientName(appointment.patient).toLowerCase().includes(searchLower),
  );

  const closeEditDialog = () => {
    updateVisitRecord.reset();
    setToEdit(null);
  };

  return (
    <QueryState error={error} isPending={isPending}>
      <div className="space-y-4">
        <Input
          label="Search patient history"
          leadingElement={<SearchIcon aria-hidden="true" className="h-4 w-4" />}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by patient name..."
          type="search"
          value={searchQuery}
        />

        {filteredHistory.length > 0 ? (
          <div className="space-y-3">
            <p className="text-label-md text-on-surface-variant">
              {filteredHistory.length} past visit
              {filteredHistory.length === 1 ? "" : "s"}
            </p>
            {filteredHistory.map((appointment) => (
              <PatientVisitCard
                appointment={appointment}
                key={appointment.id}
                onEdit={setToEdit}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            description={
              history.length > 0
                ? "Try a different patient name."
                : "Completed and cancelled visits will appear here."
            }
            icon={RecordsFolderIcon}
            title={
              history.length > 0 ? "No matching visits" : "No visit history"
            }
          />
        )}
      </div>

      {toEdit && (
        <VisitRecordModal
          appointment={toEdit}
          errorMessage={updateVisitRecord.error?.message}
          isPending={updateVisitRecord.isPending}
          onClose={closeEditDialog}
          onSubmit={(record) =>
            updateVisitRecord.mutate(
              { id: toEdit.id, record },
              { onSuccess: () => setToEdit(null) },
            )
          }
          pendingLabel="Saving…"
          submitLabel="Save Changes"
          title="Edit visit record"
        />
      )}
    </QueryState>
  );
}

export default PatientHistorySection;
