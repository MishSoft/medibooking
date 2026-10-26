
INSERT INTO "DoctorSchedule" (
    "doctorId",
    "workingDays",
    "startTime",
    "endTime",
    "slotMinutes"
)
SELECT
    d."id",
    ARRAY[1, 2, 3, 4, 5],
    '09:00',
    '17:00',
    30
FROM "DoctorProfile" AS d
WHERE NOT EXISTS (
    SELECT 1
    FROM "DoctorSchedule" AS s
    WHERE s."doctorId" = d."id"
)
ON CONFLICT ("doctorId") DO NOTHING;
