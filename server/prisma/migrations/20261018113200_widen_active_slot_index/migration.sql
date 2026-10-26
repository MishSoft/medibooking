DROP INDEX IF EXISTS "Appointment_doctor_active_slot_key";
DROP INDEX IF EXISTS "Appointment_patient_active_slot_key";

CREATE UNIQUE INDEX "Appointment_doctor_active_slot_key"
ON "Appointment" ("doctorId", "startAt")
WHERE "status" IN ('SCHEDULED', 'PENDING');

CREATE UNIQUE INDEX "Appointment_patient_active_slot_key"
ON "Appointment" ("patientId", "startAt")
WHERE "status" IN ('SCHEDULED', 'PENDING');
