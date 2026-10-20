import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { paramsSchema } from "../schemas/appointment.schema";
import { z } from "zod";
import { DateTime } from "luxon";
import {
  CLINIC_TZ,
  getClinicNow,
  generateScheduleSlots,
  validateScheduledSlot,
} from "../config/booking";

export const getClinics = async (_req: Request, res: Response) => {
  try {
    const clinics = await prisma.clinic.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        _count: { select: { doctors: true } },
      },
    });

    const data = clinics.map(({ _count, ...clinic }) => ({
      ...clinic,
      doctorCount: _count.doctors,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getClinicSpecialties = async (req: Request, res: Response) => {
  try {
    const clinicId = String(req.params.clinicId);

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { id: true },
    });

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found.",
      });
    }

    const groups = await prisma.doctorProfile.groupBy({
      by: ["primarySpecialty"],
      where: { clinicId },
      _count: { _all: true },
    });

    const data = groups
      .map((group) => ({
        specialty: group.primarySpecialty,
        doctorCount: group._count._all,
      }))
      .sort((a, b) => a.specialty.localeCompare(b.specialty));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching clinic specialties:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const scheduleSchema = z
  .object({
    workingDays: z
      .array(z.number().int().min(1).max(7), {
        message: "Working days must be numbers from 1 (Monday) to 7 (Sunday).",
      })
      .min(1, "Select at least one working day."),
    startTime: z.string().regex(TIME_RE, "Start time must use HH:mm."),
    endTime: z.string().regex(TIME_RE, "End time must use HH:mm."),
    slotMinutes: z.union(
      [
        z.literal(15),
        z.literal(20),
        z.literal(30),
        z.literal(45),
        z.literal(60),
      ],
      { message: "Slot length must be 15, 20, 30, 45 or 60 minutes." },
    ),
  })
  .superRefine((schedule, ctx) => {
    if (new Set(schedule.workingDays).size !== schedule.workingDays.length) {
      ctx.addIssue({
        code: "custom",
        path: ["workingDays"],
        message: "Working days must not contain duplicates.",
      });
    }

    // Avoid secondary time comparisons when either time has an invalid format.
    if (!TIME_RE.test(schedule.startTime) || !TIME_RE.test(schedule.endTime)) {
      return;
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

const clinicAppointmentSelect = {
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
      orderBy: { user: { lastName: "asc" } },
    });

    return res.status(200).json({ success: true, data: doctors });
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
        message: validation.error.issues[0]?.message ?? "Invalid schedule.",
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
      where: { id: doctorId, clinicId: clinic.id },
      select: { id: true },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found in your clinic.",
      });
    }

    await prisma.doctorSchedule.upsert({
      where: { doctorId },
      create: { doctorId, ...validation.data },
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

    if (doctorId) {
      const doctor = await prisma.doctorProfile.findFirst({
        where: { id: doctorId, clinicId: clinic.id },
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
        doctor: { clinicId: clinic.id },
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
      select: clinicAppointmentSelect,
      orderBy: { startAt: "asc" },
    });

    return res.status(200).json({ success: true, data: appointments });
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

    const params = paramsSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
        error: params.error.format(),
      });
    }

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

    const appointment = await prisma.appointment.findFirst({
      where: { id, doctor: { clinicId: clinic.id } },
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
      where: { id: appointment.id },
      data: {
        startAt: newStartDate,
        status: "SCHEDULED",
        rescheduledFrom: appointment.rescheduledFrom ?? appointment.startAt,
        cancelledAt: null,
        cancellationReason: null,
      },
      select: clinicAppointmentSelect,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully.",
      data: updatedAppointment,
    });
  } catch (error: unknown) {
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

    const appointment = await prisma.appointment.findFirst({
      where: { id, doctor: { clinicId: clinic.id } },
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

    const result = await prisma.appointment.updateMany({
      where: {
        id: appointment.id,
        doctor: { clinicId: clinic.id },
        status: { in: ["SCHEDULED", "PENDING"] },
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
      select: clinicAppointmentSelect,
    });

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found after cancellation.",
      });
    }

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

    const querySchema = z.object({
      from: z.string().datetime({ offset: true }),
      to: z.string().datetime({ offset: true }),
    });

    const parsedQuery = querySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      return res.status(400).json({
        success: false,
        message:
          "Both from and to must be valid ISO 8601 date-times with an offset.",
      });
    }

    const fromDate = DateTime.fromISO(parsedQuery.data.from, {
      setZone: true,
    });
    const toDate = DateTime.fromISO(parsedQuery.data.to, {
      setZone: true,
    });

    if (!fromDate.isValid || !toDate.isValid) {
      return res.status(400).json({
        success: false,
        message: "from and to must be valid ISO 8601 date-times.",
      });
    }

    if (fromDate.toMillis() >= toDate.toMillis()) {
      return res.status(400).json({
        success: false,
        message: "from must be earlier than to.",
      });
    }

    const rangeMilliseconds = toDate.toMillis() - fromDate.toMillis();

    if (rangeMilliseconds > 366 * 24 * 60 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "The requested date range cannot exceed 366 days.",
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

    const from = fromDate.toUTC().toJSDate();
    const to = toDate.toUTC().toJSDate();

    const appointmentWhere = {
      doctor: { clinicId: clinic.id },
      startAt: { gte: from, lt: to },
    };

    const now = getClinicNow().toUTC().toJSDate();

    // All four independent queries run concurrently.
    const [doctors, groupedAppointments, rescheduled, upcoming] =
      await Promise.all([
        prisma.doctorProfile.findMany({
          where: { clinicId: clinic.id },
          select: clinicDoctorSelect,
          orderBy: { user: { lastName: "asc" } },
        }),
        prisma.appointment.groupBy({
          by: ["doctorId", "status"],
          where: appointmentWhere,
          _count: { _all: true },
        }),
        prisma.appointment.count({
          where: {
            ...appointmentWhere,
            rescheduledFrom: { not: null },
          },
        }),
        prisma.appointment.count({
          where: {
            ...appointmentWhere,
            status: { in: ["SCHEDULED", "PENDING"] },
            startAt: { ...appointmentWhere.startAt, gt: now },
          },
        }),
      ]);

    type DoctorCounts = {
      booked: number;
      completed: number;
      cancelled: number;
    };

    const countsByDoctor = new Map<string, DoctorCounts>();

    for (const doctor of doctors) {
      countsByDoctor.set(doctor.id, {
        booked: 0,
        completed: 0,
        cancelled: 0,
      });
    }

    let total = 0;
    let completed = 0;
    let cancelled = 0;
    let pending = 0;
    let scheduled = 0;

    for (const row of groupedAppointments) {
      const count = row._count._all;
      total += count;

      if (row.status === "COMPLETED") completed += count;
      else if (row.status === "CANCELLED") cancelled += count;
      else if (row.status === "PENDING") pending += count;
      else if (row.status === "SCHEDULED") scheduled += count;

      const doctorCounts = countsByDoctor.get(row.doctorId);
      if (!doctorCounts) continue;

      if (row.status === "CANCELLED") {
        doctorCounts.cancelled += count;
      } else {
        doctorCounts.booked += count;
      }

      if (row.status === "COMPLETED") {
        doctorCounts.completed += count;
      }
    }

    const fromLocal = fromDate.setZone(CLINIC_TZ);
    const toLocal = toDate.setZone(CLINIC_TZ);
    const firstDay = fromLocal.startOf("day");

    const workload = doctors.map((doctor) => {
      const counts = countsByDoctor.get(doctor.id)!;
      let capacity = 0;

      if (doctor.schedule) {
        let day = firstDay;

        while (day.toMillis() < toLocal.toMillis()) {
          capacity += generateScheduleSlots(day, doctor.schedule).length;
          day = day.plus({ days: 1 });
        }
      }

      return {
        doctor,
        booked: counts.booked,
        completed: counts.completed,
        cancelled: counts.cancelled,
        capacity,
        utilisation: capacity > 0 ? counts.booked / capacity : 0,
      };
    });

    const totalBooked = workload.reduce((sum, item) => sum + item.booked, 0);
    const totalCapacity = workload.reduce(
      (sum, item) => sum + item.capacity,
      0,
    );

    return res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        upcoming,
        cancelled,
        rescheduled,
        cancellationRate: total > 0 ? cancelled / total : 0,
        utilisation: totalCapacity > 0 ? totalBooked / totalCapacity : 0,
        workload,
        doctorsCount: doctors.length,
        appointmentsCount: total,
        appointmentsByStatus: {
          pending,
          scheduled,
          completed,
          cancelled,
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
