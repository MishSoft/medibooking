import { Request, Response } from "express";
import { DateTime } from "luxon";
import { z } from "zod";
import { prisma } from "../db/prisma";

const CLINIC_TZ = "Asia/Tbilisi";
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 17;
const MAX_MONTHS_AHEAD = 2;

const createAppointmentSchema = z.object({
  doctorId: z.string().uuid("Wrong Doctor ID type"),
  startAt: z.string().datetime({ offset: true, message: "Wrong date type" }),
});

const isUniqueConstraintError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "P2002";

const getUniqueTarget = (error: unknown): string => {
  if (typeof error !== "object" || error === null || !("meta" in error)) {
    return "";
  }
  const meta = error.meta;
  if (typeof meta !== "object" || meta === null || !("target" in meta)) {
    return "";
  }
  const target = meta.target;
  if (Array.isArray(target)) return target.join(",");
  return typeof target === "string" ? target : "";
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const patientId = req.user?.userId;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "Authorization is required.",
      });
    }

    const validationResult = createAppointmentSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Wrong data",
        error: validationResult.error.format(),
      });
    }

    const { doctorId, startAt } = validationResult.data;

    const startLocal = DateTime.fromISO(startAt, { setZone: true }).setZone(
      CLINIC_TZ,
    );

    if (!startLocal.isValid) {
      return res.status(400).json({
        success: false,
        message: "Wrong date type",
      });
    }

    const startDate = startLocal.toJSDate();
    const nowLocal = DateTime.now().setZone(CLINIC_TZ);

    if (startLocal <= nowLocal) {
      return res.status(400).json({
        success: false,
        message: "Cannot book appointments in the past.",
      });
    }

    if (startLocal.weekday === 6 || startLocal.weekday === 7) {
      return res.status(400).json({
        success: false,
        message: "Appointments cannot be booked on weekends.",
      });
    }

    const { hour, minute, second, millisecond } = startLocal;

    if (
      hour < WORK_START_HOUR ||
      hour >= WORK_END_HOUR ||
      (minute !== 0 && minute !== 30) ||
      second !== 0 ||
      millisecond !== 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Appointments must be between 09:00 and 17:00 on a 30-minute grid.",
      });
    }

    const maxDate = nowLocal.plus({ months: MAX_MONTHS_AHEAD });
    if (startLocal > maxDate) {
      return res.status(400).json({
        success: false,
        message: "Appointments cannot be booked more than 2 months in advance.",
      });
    }

    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      select: { id: true },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Can't find Doctor.",
      });
    }

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        startAt: startDate,
        status: "SCHEDULED",
      },
      select: { id: true },
    });

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        message: "Selected time is already busy.",
      });
    }

    const patientConflict = await prisma.appointment.findFirst({
      where: {
        patientId,
        startAt: startDate,
        status: "SCHEDULED",
      },
      select: { id: true },
    });

    if (patientConflict) {
      return res.status(409).json({
        success: false,
        message: "You already have an appointment at this time.",
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        startAt: startDate,
        status: "SCHEDULED",
      },
      select: {
        id: true,
        startAt: true,
        status: true,
        notes: true,
        createdAt: true,
        doctor: {
          select: {
            id: true,
            primarySpecialty: true,
            yearsOfPractice: true,
            bio: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            clinic: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "The visit has been successfully booked.",
      data: appointment,
    });
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      const target = getUniqueTarget(error);
      const isPatientSlot =
        target.includes("patientId") || target.includes("patient_active_slot");

      return res.status(409).json({
        success: false,
        message: isPatientSlot
          ? "You already have an appointment at this time."
          : "Selected time is already busy.",
      });
    }

    console.error("Error creating appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
