
import { Request, Response } from "express";
import { prisma } from "../db/prisma";

export const getDoctorPrescriptions = async (
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

export const createPrescription = async (
  req: Request,
  res: Response,
) => {
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
  } catch (error: unknown) {
    console.error("createPrescription error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create prescription",
    });
  }
};

/**
 * Update an existing prescription owned by the authenticated doctor.
 * Only editable prescription fields are accepted.
 */
export const updatePrescription = async (
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

    const prescriptionId = req.params.id;

    if (!prescriptionId) {
      return res.status(400).json({
        success: false,
        message: "Prescription ID is required.",
      });
    }


    if (typeof prescriptionId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Prescription ID არასწორია",
      });
    }

    const body: unknown = req.body;

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a JSON object.",
      });
    }

    const input = body as Record<string, unknown>;

    const allowedFields = new Set([
      "medication",
      "dosage",
      "frequency",
      "instructions",
      "validUntil",
    ]);

    const unknownFields = Object.keys(input).filter(
      (key) => !allowedFields.has(key),
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Request contains unsupported fields.",
        fields: unknownFields,
      });
    }

    if (Object.keys(input).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided.",
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

    // Restrict access to prescriptions created by this doctor.
    const existingPrescription = await prisma.prescription.findFirst({
      where: {
        id: prescriptionId,
        doctorId: doctor.id,
      },
      select: {
        id: true,
        issuedAt: true,
      },
    });

    if (!existingPrescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    const data: {
      medication?: string;
      dosage?: string;
      frequency?: string;
      instructions?: string | null;
      validUntil?: Date;
    } = {};

    for (const field of [
      "medication",
      "dosage",
      "frequency",
    ] as const) {
      if (Object.prototype.hasOwnProperty.call(input, field)) {
        const value = input[field];

        if (typeof value !== "string" || !value.trim()) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a non-empty string.`,
          });
        }

        data[field] = value.trim();
      }
    }

    if (Object.prototype.hasOwnProperty.call(input, "instructions")) {
      const value = input.instructions;

      if (value !== null && typeof value !== "string") {
        return res.status(400).json({
          success: false,
          message: "instructions must be a string or null.",
        });
      }

      // Explicit null or an empty string clears the instructions.
      data.instructions =
        typeof value === "string" ? value.trim() || null : null;
    }

    if (Object.prototype.hasOwnProperty.call(input, "validUntil")) {
      const value = input.validUntil;

      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          success: false,
          message: "validUntil must be a valid date string.",
        });
      }

      const parsedValidUntil = new Date(value);

      if (Number.isNaN(parsedValidUntil.getTime())) {
        return res.status(400).json({
          success: false,
          message: "validUntil must be a valid date.",
        });
      }

      if (parsedValidUntil <= existingPrescription.issuedAt) {
        return res.status(400).json({
          success: false,
          message: "validUntil must be later than issuedAt.",
        });
      }

      data.validUntil = parsedValidUntil;
    }

    const updatedPrescription = await prisma.prescription.update({
      where: {
        id: existingPrescription.id,
      },
      data,
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

    return res.status(200).json({
      success: true,
      message: "Prescription updated successfully.",
      data: updatedPrescription,
    });
  } catch (error: unknown) {
    console.error("updatePrescription error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update prescription.",
    });
  }
};

export const getDoctorPatients = async (
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

