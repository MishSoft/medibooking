import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { z } from "zod";

const createAppointmentSchema = z.object({
  doctorId: z.string().uuid("Wrong Doctor ID type"),
  startAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Wrong date type",
  }),
});

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const patientId = req.user?.userId;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "authorization is required.",
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
    const startData = new Date(startAt);
    const now = new Date();

    if (startData <= now) {
      return res.status(400).json({
        success: false,
        message: "Cannot book appointments in the past.",
      });
    }

    const dayOofWeek = startData.getDay();

    if (dayOofWeek === 0 || dayOofWeek === 6) {
      return res.status(400).json({
        success: false,
        message: "Appointments cannot be booked on weekends.",
      });
    }

    const hours = startData.getHours();
    const minutes = startData.getMinutes();
    const seconds = startData.getSeconds();

    if (
      hours < 9 ||
      hours >= 17 ||
      (minutes !== 0 && minutes !== 30) ||
      seconds !== 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Appointments must be between 09:00 and 17:00 on a 30-minute grid.",
      });
    }

    const maxDate = new Date()
    maxDate.setMonth(maxDate.getMonth() * 2)
    if (startData > maxDate) {
      return res.status(400).json({
        success: false,
        message: "Appointments cannot be booked more than 2 months in advance.",
      });
    }


    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
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
        startAt: startData,
        status: { not: "CANCELLED" },
      },
    });

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        message: "Selected time is already busy.",
      });
    }

    const apointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        startAt: startData,
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
      data: apointment,
    });
  } catch (error) {

    if ((error as Error).message === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Selected time is already busy.",
      });
    }

    console.error("Error creating appointment:", error);
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "სერვერის შეცდომა.",
    });
  }
};
