import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  PlusIcon,
  PractitionerSignInIcon,
  SearchIcon,
} from "../../assets/icons/Icons";
import { useClinicDoctors } from "../../hooks/useClinic";
import type { ClinicDoctor } from "../../types/clinic";
import Button from "../../shared/ui/Button";
import EmptyState from "../../shared/ui/EmptyState";
import Input from "../../shared/ui/Input";
import QueryState from "../../shared/ui/QueryState";
import Select from "../../shared/ui/Select";
import ClinicDoctorCard from "./ClinicDoctorCard";

type ClinicDoctorsSectionProps = {
  onViewSchedule?: (doctor: ClinicDoctor) => void;
};

const matchesQuery = (doctor: ClinicDoctor, query: string) =>
  [doctor.firstName, doctor.lastName, doctor.specialty, doctor.email]
    .join(" ")
    .toLowerCase()
    .includes(query);

function ClinicDoctorsSection({ onViewSchedule }: ClinicDoctorsSectionProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const { data: doctors = [], isPending, error } = useClinicDoctors();

  const specialties = useMemo(
    () => [...new Set(doctors.map((doctor) => doctor.specialty))].sort(),
    [doctors],
  );

  // The clinic roster is small, so filtering stays on the client
  const search = query.trim().toLowerCase();
  const filteredDoctors = doctors.filter(
    (doctor) =>
      (!search || matchesQuery(doctor, search)) &&
      (!specialty || doctor.specialty === specialty),
  );
  const hasActiveFilters = Boolean(search || specialty);

  const registerButton = (
    <Button onClick={() => navigate("/register-doctor")}>
      <PlusIcon aria-hidden="true" className="h-4 w-4" />
      Register Doctor
    </Button>
  );

  return (
    <div className="space-y-6">
      <div
        className="grid gap-4 md:grid-cols-[2fr_1fr_auto_auto] md:items-end"
        role="search"
      >
        <Input
          label="Search doctors"
          leadingElement={<SearchIcon className="h-4 w-4" />}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, specialty or email"
          type="search"
          value={query}
        />
        <Select
          label="Specialty"
          onChange={(event) => setSpecialty(event.target.value)}
          options={specialties.map((item) => ({ value: item, label: item }))}
          placeholder="All specialties"
          value={specialty}
        />
        <Button
          disabled={!hasActiveFilters}
          onClick={() => {
            setQuery("");
            setSpecialty("");
          }}
          variant="secondary"
        >
          Reset
        </Button>
        {registerButton}
      </div>

      <QueryState error={error} isPending={isPending}>
        {filteredDoctors.length > 0 ? (
          <>
            <p
              aria-live="polite"
              className="text-body-sm text-on-surface-variant"
            >
              {filteredDoctors.length}{" "}
              {filteredDoctors.length === 1 ? "doctor" : "doctors"}
              {hasActiveFilters && ` of ${doctors.length}`}
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <li key={doctor.id}>
                  <ClinicDoctorCard
                    doctor={doctor}
                    onViewSchedule={onViewSchedule}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState
            action={hasActiveFilters ? undefined : registerButton}
            description={
              hasActiveFilters
                ? "No doctors match your search. Try different filters."
                : "Register your first doctor to start coordinating schedules."
            }
            icon={PractitionerSignInIcon}
            title={hasActiveFilters ? "No matching doctors" : "No doctors yet"}
          />
        )}
      </QueryState>
    </div>
  );
}

export default ClinicDoctorsSection;
