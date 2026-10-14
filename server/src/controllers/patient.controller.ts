import { Request, Response } from "express";
import { prisma } from "../db/prisma";

export const getPatientAppointments = async (req: Request, res: Response) => {
  try {
    const patientId = req.user?.userId;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "ავტორიზაცია სავალდებულოა",
      });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patientId,
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
      orderBy: {
        startAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching patient appointment: ", error);

    return res.status(500).json({
      success: false,
      message: (error as Error).message || "სერვერის შეცდომა",
    });
  }
};

export const getPatientPrescriptions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "ავტორიზაცია სავალდებულოა",
      });
    }

    const prescriptions = await prisma.prescription.findMany({
      where: {
        patientId: userId,
      },
      select: {
        id: true,
        medication: true,
        dosage: true,
        frequency: true,
        instructions: true,
        issuedAt: true,
        validUntil: true,
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
      orderBy: {
        issuedAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    console.error("Error fetching patient prescriptions:", error);

    return res.status(500).json({
      success: false,
      message:
        (error as Error).message || "სერვერის შეცდომა რეცეპტების წამოღებისას",
    });
  }
};
