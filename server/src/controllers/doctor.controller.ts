import { Request, Response } from "express";
import { Prisma, prisma } from "../db/prisma";
import {
  doctorSlotsParamsSchema,
  doctorSlotsQuerySchema,
} from "../schemas/doctor.schema";
import {
  CLINIC_TZ,
  generateDaySlots,
  validateSlot,
  getClinicNow,
} from "../config/booking";
import { DateTime } from "luxon";
export const getDoctorSpecialties = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctorProfile.findMany({
      select: {
        primarySpecialty: true,
      },
      distinct: ["primarySpecialty"],
    });

    const specialties = doctors
      .map((doc) => doc.primarySpecialty)
      .sort((a, b) => a.localeCompare(b));

    return res.status(200).json({
      success: true,
      data: specialties,
    });
  } catch (error) {
    console.error("Error fetching specialties:", error);

    return res.status(500).json({
      success: false,
      message: (error as Error).message || "სერვერის შეცდომა.",
    });
  }
};

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const { search, specialty, clinicId } = req.query;

    const where: Prisma.DoctorProfileWhereInput = {};

    if (specialty) {
      where.primarySpecialty = String(specialty);
    }

    if (clinicId) {
      where.clinicId = String(clinicId);
    }

    if (search) {
      const searchTerm = String(search);

      where.OR = [
        {
          user: {
            firstName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            lastName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          primarySpecialty: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    const doctors = await prisma.doctorProfile.findMany({
      where,
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
    });

    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);

    return res.status(500).json({
      success: false,
      message: (error as Error).message || "სერვერის შეცდომა.",
    });
  }
};

export const getDoctorsSlots = async (req: Request, res: Response) => {
  try {
    const params = doctorSlotsParamsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({
        success: false,
        message: "Wrong data",
        error: params.error.format(),
      });
    }

    const query = doctorSlotsQuerySchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({
        success: false,
        message: "Wrong data",
        error: query.error.format(),
      });
    }

    const { id } = params.data;
    const { date } = query.data;

    const foundDoc = await prisma.doctorProfile.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!foundDoc) {
      return res.status(404).json({
        success: false,
        message: "Can't find Doctor.",
      });
    }

    const dayLocal = DateTime.fromISO(date, {
      zone: CLINIC_TZ,
    });

    if (!dayLocal.isValid || dayLocal.toISODate() !== date) {
      return res.status(400).json({
        success: false,
        message: "Wrong date type.",
      });
    }

    const nowLocal = getClinicNow();
    const dayStart = dayLocal.startOf("day").toUTC().toJSDate();
    const dayEnd = dayLocal.plus({ days: 1 }).startOf("day").toUTC().toJSDate();

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        status: "SCHEDULED",
        startAt: {
          gte: dayStart,
          lt: dayEnd,
        },
      },
      select: {
        startAt: true,
      },
    });

    const bookedTimes = new Set(
      appointments.map((appointment) => appointment.startAt.getTime()),
    );

    const slots = generateDaySlots(dayLocal).map((slot) => {
      const validationError = validateSlot(slot, nowLocal);
      const slotTime = slot.toUTC().toMillis();

      return {
        start: slot.toUTC().toISO(),
        available: validationError === null && !bookedTimes.has(slotTime),
      };
    });

    return res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error("Error fetching doctor slots:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
