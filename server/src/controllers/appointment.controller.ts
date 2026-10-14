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
      return res.status(401).json({
        success: false,
        mesaage: "Wrong data",
        error: validationResult.error.format(),
      });
    }

    const { doctorId, startAt } = validationResult.data;
    const startData = new Date(startAt);

    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(401).json({
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
      return res.status(400).json({
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
        createdAt: true,
        doctor: {
          select: {
            id: true,
            primarySpecialty: true,
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
    console.error("Error creating appointment:", error);
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "სერვერის შეცდომა.",
    });
  }
};
