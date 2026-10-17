import { Request, Response } from "express";
import { DateTime } from "luxon";
import { prisma } from "../db/prisma";
import {
  paramsSchema,
  createAppointmentSchema,
} from "../schemas/appointment.schema";
import {
  CLINIC_TZ,
  getClinicNow,
  validateScheduledSlot,
} from "../config/booking";

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

// Create appointment
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
        message: "Wrong data.",
        error: validationResult.error.format(),
      });
    }

    const { doctorId, startAt } = validationResult.data;

    const startLocal = DateTime.fromISO(startAt, {
      setZone: true,
    }).setZone(CLINIC_TZ);

    if (!startLocal.isValid) {
      return res.status(400).json({
        success: false,
        message: "Wrong date type.",
      });
    }

    const startDate = startLocal.toJSDate();

    // Find doctor and their schedule.
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        schedule: {
          select: {
            workingDays: true,
            startTime: true,
            endTime: true,
            slotMinutes: true,
          },
        },
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    if (!doctor.schedule) {
      return res.status(409).json({
        success: false,
        message: "The doctor has no configured schedule.",
      });
    }

    // Validate the requested time against the doctor's schedule.
    const validationError = validateScheduledSlot(
      startLocal,
      doctor.schedule,
      getClinicNow(),
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    // Check whether the doctor already has an active appointment.
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        startAt: startDate,
        status: { not: "CANCELLED" },
      },
      select: { id: true },
    });

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        message: "Selected time is already busy.",
      });
    }

    // Check whether the patient already has an active appointment
    // at exactly the same time.
    const patientConflict = await prisma.appointment.findFirst({
      where: {
        patientId,
        startAt: startDate,
        status: { not: "CANCELLED" },
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

// Cancel appointment (patient)
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
        message: "Wrong data.",
        error: params.error.format(),
      });
    }

    const { id } = params.data;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: {
        id: true,
        patientId: true,
        status: true,
        startAt: true,
      },
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
      data: {
        status: "CANCELLED",
      },
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
      data: {
        id,
        status: "CANCELLED",
      },
    });
  } catch (error: unknown) {
    console.error("Error cancelling appointment:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Get appointments for the authenticated doctor

export const getDoctorAppointments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authorization is required.",
      });
    }

    // Resolve the doctor's profile from the authenticated user.
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!doctor) {
      return res.status(403).json({
        success: false,
        message: "Doctor profile not found.",
      });
    }

    // GET filters belong in query parameters, not the request body.
    const statusParam = req.query.status;

    const allowedStatuses = [
      "SCHEDULED",
      "COMPLETED",
      "CANCELLED",
      "PENDING",
    ] as const;

    if (
      statusParam !== undefined &&
      (typeof statusParam !== "string" ||
        !allowedStatuses.includes(
          statusParam as (typeof allowedStatuses)[number],
        ))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status.",
      });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        ...(typeof statusParam === "string"
          ? {
              status: statusParam as (typeof allowedStatuses)[number],
            }
          : {}),
      },
      select: {
        id: true,
        patientId: true,
        doctorId: true,
        startAt: true,
        status: true,
        notes: true,
        diagnosis: true,
        rescheduledFrom: true,
        cancelledAt: true,
        cancellationReason: true,
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
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
      orderBy: { startAt: "asc" },
    });

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error: unknown) {
    console.error("Error fetching doctor appointments:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Complete appointment (doctor)
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authorization is required.",
      });
    }

    const params = paramsSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({
        success: false,
        message: "Wrong data.",
        error: params.error.format(),
      });
    }

    const { id } = params.data;
    const { status, notes, diagnosis } = req.body;

    if (
      status !== "COMPLETED" ||
      (notes !== undefined && typeof notes !== "string") ||
      (diagnosis !== undefined && typeof diagnosis !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status, notes, or diagnosis.",
      });
    }

    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!doctor) {
      return res.status(403).json({
        success: false,
        message: "Only doctors can update appointments.",
      });
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        doctorId: doctor.id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status !== "SCHEDULED") {
      return res.status(409).json({
        success: false,
        message: "Only scheduled appointments can be completed.",
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        status: "COMPLETED",
        ...(notes !== undefined ? { notes: notes.trim() || null } : {}),
        ...(diagnosis !== undefined
          ? { diagnosis: diagnosis.trim() || null }
          : {}),
      },
      select: {
        id: true,
        status: true,
        notes: true,
        diagnosis: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment completed successfully.",
      data: updatedAppointment,
    });
  } catch (error: unknown) {
    console.error("Error updating appointment status:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export const updateAppointmentRecord = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authorization is required.",
      });
    }

    const params = paramsSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
        error: params.error.format(),
      });
    }

    const { id } = params.data;
    const body: unknown = req.body;

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be an object.",
      });
    }

    const record = body as Record<string, unknown>;
    const allowedFields = ["diagnosis", "notes"];

    if (
      Object.keys(record).length === 0 ||
      Object.keys(record).some((key) => !allowedFields.includes(key))
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide diagnosis or notes. No other fields are allowed.",
      });
    }

    for (const field of allowedFields) {
      if (
        field in record &&
        record[field] !== null &&
        typeof record[field] !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a string or null.`,
        });
      }
    }

    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!doctor) {
      return res.status(403).json({
        success: false,
        message: "Only doctors can edit visit records.",
      });
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        doctorId: doctor.id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status !== "COMPLETED") {
      return res.status(409).json({
        success: false,
        message: "Only completed appointments can be edited.",
      });
    }

    const data = {
      ...(Object.prototype.hasOwnProperty.call(record, "diagnosis")
        ? {
            diagnosis:
              typeof record.diagnosis === "string"
                ? record.diagnosis.trim() || null
                : null,
          }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(record, "notes")
        ? {
            notes:
              typeof record.notes === "string"
                ? record.notes.trim() || null
                : null,
          }
        : {}),
    };

    // Update only if the appointment is still completed
    // and belongs to this doctor.
    const result = await prisma.appointment.updateMany({
      where: {
        id: appointment.id,
        doctorId: doctor.id,
        status: "COMPLETED",
      },
      data,
    });

    if (result.count === 0) {
      return res.status(409).json({
        success: false,
        message: "The visit can no longer be edited.",
      });
    }

    const updatedAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id },
      select: {
        id: true,
        status: true,
        diagnosis: true,
        notes: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Visit record updated successfully.",
      data: updatedAppointment,
    });
  } catch (error: unknown) {
    console.error("Error updating appointment record:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
