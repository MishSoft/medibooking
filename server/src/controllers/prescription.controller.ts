import { Request, Response } from "express";
import { prisma } from "../db/prisma";


export const getDoctorPrescriptions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authorization is required.",
      });
    }

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

    const prescriptions = await prisma.prescription.findMany({
      where: { doctorId: doctor.id },
      select: {
        id: true,
        patientId: true,
        doctorId: true,
        medication: true,
        dosage: true,
        frequency: true,
        instructions: true,
        issuedAt: true,
        validUntil: true,
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
      orderBy: { issuedAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (error: unknown) {
    console.error("Error fetching doctor prescriptions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve prescriptions.",
    });
  }
};


export const createPrescription = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      patientId,
      medication,
      dosage,
      frequency,
      instructions,
      issuedAt,
      validUntil,
    } = req.body;

    if (
      typeof patientId !== "string" ||
      !patientId.trim() ||
      typeof medication !== "string" ||
      !medication.trim() ||
      typeof dosage !== "string" ||
      !dosage.trim() ||
      typeof frequency !== "string" ||
      !frequency.trim() ||
      typeof validUntil !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "patientId, medication, dosage, frequency, and validUntil are required",
      });
    }

    if (
      instructions !== undefined &&
      instructions !== null &&
      typeof instructions !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "instructions must be a string",
      });
    }

    const parsedValidUntil = new Date(validUntil);
    const parsedIssuedAt =
      issuedAt === undefined ? new Date() : new Date(issuedAt);

    if (
      Number.isNaN(parsedValidUntil.getTime()) ||
      Number.isNaN(parsedIssuedAt.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "issuedAt and validUntil must be valid dates",
      });
    }

    if (parsedValidUntil <= parsedIssuedAt) {
      return res.status(400).json({
        success: false,
        message: "validUntil must be later than issuedAt",
      });
    }

    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!doctor) {
      return res.status(403).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const patient = await prisma.user.findUnique({
      where: { id: patientId },
      select: { id: true, role: true },
    });

    if (!patient || patient.role !== "PATIENT") {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const completedAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,
        patientId: patient.id,
        status: "COMPLETED",
      },
      select: {
        id: true,
      },
    });

    if (!completedAppointment) {
      return res.status(403).json({
        success: false,
        message:
          "You can only prescribe medication to patients you have treated.",
      });
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        doctorId: doctor.id,
        medication: medication.trim(),
        dosage: dosage.trim(),
        frequency: frequency.trim(),
        instructions: instructions?.trim() || null,
        issuedAt: parsedIssuedAt,
        validUntil: parsedValidUntil,
      },
      select: {
        id: true,
        patientId: true,
        doctorId: true,
        medication: true,
        dosage: true,
        frequency: true,
        instructions: true,
        issuedAt: true,
        validUntil: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully.",
      data: prescription,
    });
  } catch (error) {
    console.error("createPrescription error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create prescription",
    });
  }
};



export const getDoctorPatients = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authorization is required.",
      });
    }

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

    // Return unique patients the doctor has actually seen.
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "COMPLETED",
      },
      select: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
      },
      distinct: ["patientId"],
    });

    const patients = appointments.map(({ patient }) => patient);

    return res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error: unknown) {
    console.error("Error fetching doctor patients:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve doctor patients.",
    });
  }
};
