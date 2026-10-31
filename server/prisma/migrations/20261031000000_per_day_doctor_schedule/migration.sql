-- CreateTable
CREATE TABLE "DoctorScheduleDay" (
    "doctorId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "isWorking" BOOLEAN NOT NULL DEFAULT false,
    "startTime" TEXT NOT NULL DEFAULT '09:00',
    "endTime" TEXT NOT NULL DEFAULT '17:00',
    "slotMinutes" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "DoctorScheduleDay_pkey" PRIMARY KEY ("doctorId","weekday"),
    -- Prisma can't express this check in the schema.
    CONSTRAINT "DoctorScheduleDay_weekday_check" CHECK ("weekday" BETWEEN 1 AND 7)
);

-- AddForeignKey
ALTER TABLE "DoctorScheduleDay" ADD CONSTRAINT "DoctorScheduleDay_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "DoctorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Copy each existing schedule into 7 day rows. Former working days keep the
-- shared hours; the other days are off with the 09:00–17:00 / 30 min default.
INSERT INTO "DoctorScheduleDay" ("doctorId", "weekday", "isWorking", "startTime", "endTime", "slotMinutes")
SELECT
    s."doctorId",
    d.weekday,
    d.weekday = ANY(s."workingDays"),
    CASE WHEN d.weekday = ANY(s."workingDays") THEN s."startTime" ELSE '09:00' END,
    CASE WHEN d.weekday = ANY(s."workingDays") THEN s."endTime" ELSE '17:00' END,
    CASE WHEN d.weekday = ANY(s."workingDays") THEN s."slotMinutes" ELSE 30 END
FROM "DoctorSchedule" s
CROSS JOIN generate_series(1, 7) AS d(weekday);

-- DropTable
DROP TABLE "DoctorSchedule";
