import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { paramsSchema } from "../schemas/appointment.schema";
import { z } from "zod";
import { DateTime } from "luxon";
import {
  CLINIC_TZ,
  getClinicNow,
  validateScheduledSlot,
} from "../config/booking";

export const getClinics = async (_req: Request, res: Response) => {
  try {
    const clinics = await prisma.clinic.findMany({
      select: {
        id: true,
        name: true,
        address: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: clinics,
    });
  } catch (error) {
    console.error("Error fetching clinics:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const scheduleSchema = z
  .object({
    workingDays: z.array(z.number().int().min(1).max(7)).min(1),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    slotMinutes: z.union([
      z.literal(15),
      z.literal(20),
      z.literal(30),
      z.literal(45),
      z.literal(60),
    ]),
  })
  .superRefine((schedule, ctx) => {
    if (new Set(schedule.workingDays).size !== schedule.workingDays.length) {
      ctx.addIssue({
        code: "custom",
        path: ["workingDays"],
        message: "Working days must not contain duplicates.",
      });
    }

    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const start = toMinutes(schedule.startTime);
    const end = toMinutes(schedule.endTime);

    if (end <= start) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be later than start time.",
      });
    } else if (end - start < schedule.slotMinutes) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "At least one appointment slot must fit in the schedule.",
      });
    }
  });

const clinicDoctorSelect = {
  id: true,
  primarySpecialty: true,
  yearsOfPractice: true,
  bio: true,
  user: {
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  clinic: {
    select: {
      id: true,
      name: true,
      address: true,
    },
  },
  schedule: {
    select: {
      workingDays: true,
      startTime: true,
      endTime: true,
      slotMinutes: true,
    },
  },
} as const;

export const getClinicDoctors = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authorization is required.",
      });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { adminId: userId },
      select: { id: true },
    });

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found for this administrator.",
      });
    }

    const doctors = await prisma.doctorProfile.findMany({
      where: { clinicId: clinic.id },
      select: clinicDoctorSelect,
      orderBy: {
        user: { lastName: "asc" },
      },
    });

    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching clinic doctors:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const updateClinicDoctorSchedule = async (
  req: Request,
  res: Response,
) => {
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
        message: "Invalid doctor ID.",
      });
    }

    const validation = scheduleSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule.",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { adminId: userId },
      select: { id: true },
    });

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found for this administrator.",
      });
    }

    const { id: doctorId } = params.data;

    const doctor = await prisma.doctorProfile.findFirst({
      where: {
        id: doctorId,
        clinicId: clinic.id,
      },
      select: { id: true },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found in your clinic.",
      });
    }

    const schedule = await prisma.doctorSchedule.upsert({
      where: { doctorId },
      create: {
        doctorId,
        ...validation.data,
      },
      update: validation.data,
    });

    const updatedDoctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      select: clinicDoctorSelect,
    });

    return res.status(200).json({
      success: true,
      message: "Doctor schedule updated successfully.",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating clinic doctor schedule:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getClinicAppointments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authorization is required.",
      });
    }

    // Validate query parameters.
    const querySchema = z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      doctorId: z.string().uuid().optional(),
    });

    const parsedQuery = querySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters.",
        error: parsedQuery.error.format(),
      });
    }

    const { from, to, doctorId } = parsedQuery.data;

    const fromDate = from ? DateTime.fromISO(from, { setZone: true }) : null;

    const toDate = to ? DateTime.fromISO(to, { setZone: true }) : null;

    if ((fromDate && !fromDate.isValid) || (toDate && !toDate.isValid)) {
      return res.status(400).json({
        success: false,
        message: "from and to must be valid ISO date strings.",
      });
    }

    if (fromDate && toDate && fromDate.toMillis() >= toDate.toMillis()) {
      return res.status(400).json({
        success: false,
        message: "from must be earlier than to.",
      });
    }

    // Resolve the clinic from the authenticated admin.
    const clinic = await prisma.clinic.findUnique({
      where: { adminId: userId },
      select: { id: true },
    });

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found.",
      });
    }

    // If a doctor filter is supplied, ensure the doctor belongs
    // to this admin's clinic.
    if (doctorId) {
      const doctor = await prisma.doctorProfile.findFirst({
        where: {
          id: doctorId,
          clinicId: clinic.id,
        },
        select: { id: true },
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found in this clinic.",
        });
      }
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctor: {
          clinicId: clinic.id,
        },
        ...(doctorId ? { doctorId } : {}),
        ...(fromDate || toDate
          ? {
              startAt: {
                ...(fromDate ? { gte: fromDate.toUTC().toJSDate() } : {}),
                ...(toDate ? { lt: toDate.toUTC().toJSDate() } : {}),
              },
            }
          : {}),
      },
      select: {
        id: true,
        startAt: true,
        status: true,
        notes: true,
        rescheduledFrom: true,
        cancelledAt: true,
        cancellationReason: true,
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
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: {
        startAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching clinic appointments:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const rescheduleClinicAppointment = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authorization is required.",
      });
    }

    // Validate appointment ID.
    const params = paramsSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
        error: params.error.format(),
      });
    }

    // Validate request body.
    const bodySchema = z.object({
      startAt: z.string().datetime({ offset: true }),
    });

    const body = bodySchema.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({
        success: false,
        message: "A valid ISO 8601 startAt date is required.",
        error: body.error.format(),
      });
    }

    const { id } = params.data;
    const { startAt } = body.data;

    const newStartLocal = DateTime.fromISO(startAt, {
      setZone: true,
    }).setZone(CLINIC_TZ);

    if (!newStartLocal.isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date.",
      });
    }

    const newStartDate = newStartLocal.toUTC().toJSDate();

    // Resolve the admin's clinic.
    const clinic = await prisma.clinic.findUnique({
      where: { adminId: userId },
      select: { id: true },
    });

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found.",
      });
    }

    // Only retrieve appointments belonging to this clinic.
    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        doctor: {
          clinicId: clinic.id,
        },
      },
      select: {
        id: true,
        patientId: true,
        doctorId: true,
        startAt: true,
        status: true,
        rescheduledFrom: true,
        doctor: {
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
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found in this clinic.",
      });
    }

    if (appointment.status === "COMPLETED") {
      return res.status(409).json({
        success: false,
        message: "Completed appointments cannot be rescheduled.",
      });
    }

    if (!appointment.doctor.schedule) {
      return res.status(409).json({
        success: false,
        message: "The doctor has no configured schedule.",
      });
    }

    // Validate the new time against the doctor's schedule.
    const validationError = validateScheduledSlot(
      newStartLocal,
      appointment.doctor.schedule,
      getClinicNow(),
    );

    if (validationError) {
      return res.status(409).json({
        success: false,
        message: validationError,
      });
    }

    // Check whether another active appointment occupies this time.
    const doctorConflict = await prisma.appointment.findFirst({
      where: {
        doctorId: appointment.doctorId,
        startAt: newStartDate,
        status: { not: "CANCELLED" },
        id: { not: appointment.id },
      },
      select: { id: true },
    });

    if (doctorConflict) {
      return res.status(409).json({
        success: false,
        message: "Selected time is already busy.",
      });
    }

    // Prevent the patient from having another active appointment
    // at the same exact time.
    const patientConflict = await prisma.appointment.findFirst({
      where: {
        patientId: appointment.patientId,
        startAt: newStartDate,
        status: { not: "CANCELLED" },
        id: { not: appointment.id },
      },
      select: { id: true },
    });

    if (patientConflict) {
      return res.status(409).json({
        success: false,
        message: "The patient already has an appointment at this time.",
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointment.id,
      },
      data: {
        startAt: newStartDate,
        status: "SCHEDULED",

        // Preserve the original time on subsequent reschedules.
        rescheduledFrom: appointment.rescheduledFrom ?? appointment.startAt,

        // Clear cancellation details when rebooking.
        cancelledAt: null,
        cancellationReason: null,
      },
      select: {
        id: true,
        startAt: true,
        status: true,
        notes: true,
        rescheduledFrom: true,
        cancelledAt: true,
        cancellationReason: true,
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
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully.",
      data: updatedAppointment,
    });
  } catch (error: unknown) {
    // Handle unique constraint conflicts.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "Selected time is already busy.",
      });
    }

    console.error("Error rescheduling clinic appointment:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const cancelClinicAppointment = async (req: Request, res: Response) => {
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

    const bodySchema = z.object({
      reason: z.string().trim().max(200).optional(),
    });

    const body = bodySchema.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid cancellation reason. Maximum length is 200 characters.",
        error: body.error.format(),
      });
    }

    const { id } = params.data;
    const reason = body.data.reason || null;

    // Find the clinic belonging to the authenticated admin.
    const clinic = await prisma.clinic.findUnique({
      where: { adminId: userId },
      select: { id: true },
    });

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found.",
      });
    }

    // Only allow cancellation of appointments in this clinic.
    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        doctor: {
          clinicId: clinic.id,
        },
      },
      select: {
        id: true,
        status: true,
        startAt: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found in this clinic.",
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
      return res.status(409).json({
        success: false,
        message: "Past appointments cannot be cancelled.",
      });
    }

    // Conditional update avoids overwriting a status that changed
    // after the appointment was read.
    const result = await prisma.appointment.updateMany({
      where: {
        id: appointment.id,
        doctor: {
          clinicId: clinic.id,
        },
        status: {
          in: ["SCHEDULED", "PENDING"],
        },
      },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });

    if (result.count === 0) {
      return res.status(409).json({
        success: false,
        message: "Appointment can no longer be cancelled.",
      });
    }

    const updatedAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id },
      select: {
        id: true,
        startAt: true,
        status: true,
        cancelledAt: true,
        cancellationReason: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Error cancelling clinic appointment:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



export const getClinicStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { adminId: userId },
      select: { id: true },
    });

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found.",
      });
    }

    const appointmentWhere = {
      doctor: {
        clinicId: clinic.id,
      },
    };

    const [
      doctorsCount,
      appointmentsCount,
      pendingCount,
      scheduledCount,
      completedCount,
      cancelledCount,
    ] = await Promise.all([
      prisma.doctorProfile.count({
        where: { clinicId: clinic.id },
      }),
      prisma.appointment.count({
        where: appointmentWhere,
      }),
      prisma.appointment.count({
        where: {
          ...appointmentWhere,
          status: "PENDING",
        },
      }),
      prisma.appointment.count({
        where: {
          ...appointmentWhere,
          status: "SCHEDULED",
        },
      }),
      prisma.appointment.count({
        where: {
          ...appointmentWhere,
          status: "COMPLETED",
        },
      }),
      prisma.appointment.count({
        where: {
          ...appointmentWhere,
          status: "CANCELLED",
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        doctorsCount,
        appointmentsCount,
        appointmentsByStatus: {
          pending: pendingCount,
          scheduled: scheduledCount,
          completed: completedCount,
          cancelled: cancelledCount,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching clinic stats:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
