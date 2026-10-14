import { Request, Response } from "express";
import { Prisma, prisma } from "../db/prisma";

export const getDoctorSpecialties = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctorProfile.findMany({
      select: {
        primarySpecialty: true,
      },
      distinct: ["primarySpecialty"],
    });

    const specialties = doctors.map((doc) => doc.primarySpecialty);

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
    const { search, specialty, clinicId } = req.body;

    const where: Prisma.DoctorProfileWhereInput = {};

    if (specialty) {
      where.primarySpecialty = String(specialty);
    }

    if (clinicId) {
      where.primarySpecialty = String(clinicId);
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
      ];
    }

    const doctors = await prisma.doctorProfile.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
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
