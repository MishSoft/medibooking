-- Replace the full (doctorId, startAt) unique constraint with partial unique
-- indexes that only cover SCHEDULED appointments, so a cancelled slot can be
-- booked again. Written to be safe both on a fresh database (after the
-- baseline migration) and on an existing database created with `db push`.

-- DropIndex (exists only on databases created with `db push`)
DROP INDEX IF EXISTS "Appointment_doctorId_startAt_key";

-- CreateIndex (lookup indexes declared in schema.prisma)
CREATE INDEX IF NOT EXISTS "Appointment_doctorId_startAt_idx" ON "Appointment"("doctorId", "startAt");
CREATE INDEX IF NOT EXISTS "Appointment_patientId_idx" ON "Appointment"("patientId");

-- A doctor can have only one active appointment per slot
CREATE UNIQUE INDEX "Appointment_doctor_active_slot_key"
  ON "Appointment" ("doctorId", "startAt")
  WHERE "status" = 'SCHEDULED';

-- A patient can't hold two active appointments at the same time
CREATE UNIQUE INDEX "Appointment_patient_active_slot_key"
  ON "Appointment" ("patientId", "startAt")
  WHERE "status" = 'SCHEDULED';
