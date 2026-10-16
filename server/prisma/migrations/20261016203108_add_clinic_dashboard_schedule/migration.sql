-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "cancellationReason" VARCHAR(200),
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "rescheduledFrom" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "DoctorSchedule" (
    "doctorId" TEXT NOT NULL,
    "workingDays" INTEGER[],
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "slotMinutes" INTEGER NOT NULL,

    CONSTRAINT "DoctorSchedule_pkey" PRIMARY KEY ("doctorId")
);

-- AddForeignKey
ALTER TABLE "DoctorSchedule" ADD CONSTRAINT "DoctorSchedule_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "DoctorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
