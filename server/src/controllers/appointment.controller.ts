import { Request, Response } from "express";
import { DateTime } from "luxon";
import { prisma } from "../db/prisma";
import {
  paramsSchema,
  createAppointmentSchema,
} from "../schemas/appointment.schema";
import { CLINIC_TZ, validateSlot, getClinicNow } from "../config/booking";

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

    const validationError = validateSlot(startLocal, getClinicNow());

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
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

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const patientId = req.user?.userId;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "Authorization is required.",
      });
    }

    const params = paramsSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({
        success: false,
        message: "Wrong data",
        error: params.error.format(),
      });
    }

    const { id } = params.data;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: { id: true, patientId: true, status: true, startAt: true },
    });

    if (!appointment || appointment.patientId !== patientId) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status === "CANCELLED") {
      return res.status(409).json({
        success: false,
        message: "Appointment is already cancelled.",
      });
    }

    if (appointment.status === "COMPLETED") {
      return res.status(409).json({
        success: false,
        message: "Completed appointments cannot be cancelled.",
      });
    }

    if (appointment.startAt <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Past appointments cannot be cancelled.",
      });
    }

    const result = await prisma.appointment.updateMany({
      where: {
        id,
        patientId,
        status: { in: ["SCHEDULED", "PENDING"] },
      },
      data: { status: "CANCELLED" },
    });

    if (result.count === 0) {
      return res.status(409).json({
        success: false,
        message: "Appointment can no longer be cancelled.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "The visit has been cancelled.",
      data: { id, status: "CANCELLED" },
    });
  } catch (error: unknown) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
