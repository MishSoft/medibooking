import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";
import { Role } from "../generated/prisma";
import {
  ClinicRegisterInput,
  DoctorRegisterInput,
  LoginInput,
  PatientRegisterInput,
} from "../schemas/auth.schema";
import { Request, Response } from "express";
import { InvalidCredentialsError } from "../utils/errors";
import { buildDefaultScheduleDays } from "../config/booking";

const JWT_SECRET = process.env.JWT_SECRET;

// Compared against when no user matches, to keep login timing uniform
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("dummy-password", 10);

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is missing.");
}

const JWT_EXPIRES_IN = "7d";

export class AuthService {
  static async registerPatient(data: PatientRegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("This email is already used");
    }

    if (data.personalId) {
      const existingPersonalId = await prisma.patientProfile.findUnique({
        where: { personalId: data.personalId },
      });

      if (existingPersonalId) {
        throw new Error("This personal ID is already used");
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: Role.PATIENT,
        },
      });

      const profile = await tx.patientProfile.create({
        data: {
          userId: user.id,
          personalId: data.personalId,
          address: data.address,
          city: data.city,
          gender: data.gender,
          birthDate: data.birthDate,
          emergencyContactName: data.emergencyContactName,
          emergencyContactPhone: data.emergencyContactPhone,
        },
      });

      return { user, profile };
    });

    const token = this.generateToken(result.user.id, result.user.role);

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      },
      token,
    };
  }

  static async registerClinic(data: ClinicRegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("This email is already used");
    }

    const existingTaxId = await prisma.clinic.findUnique({
      where: { taxId: data.taxId },
    });

    if (existingTaxId) {
      throw new Error("Clinic with this tax ID already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const adminUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: Role.CLINIC_ADMIN,
        },
      });

      const clinic = await tx.clinic.create({
        data: {
          name: data.name,
          legalName: data.legalName,
          taxId: data.taxId,
          email: data.email,
          phone: data.phone,
          publicEmail: data.publicEmail,
          receptionPhone: data.receptionPhone,
          departments: data.departments,
          address: data.address,
          city: data.city,
          adminId: adminUser.id,
        },
      });

      return { adminUser, clinic };
    });

    const token = this.generateToken(
      result.adminUser.id,
      result.adminUser.role,
    );

    return {
      user: {
        id: result.adminUser.id,
        email: result.adminUser.email,
        firstName: result.adminUser.firstName,
        lastName: result.adminUser.lastName,
        role: result.adminUser.role,
      },
      clinic: result.clinic,
      token,
    };
  }

  static async registerDoctor(data: DoctorRegisterInput, adminId: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("This email is already used");
    }

    const existingLicense = await prisma.doctorProfile.findUnique({
      where: { licenseNo: data.licenseNo },
    });

    if (existingLicense) {
      throw new Error("Doctor with this license number already exists");
    }

    const clinicExists = await prisma.clinic.findUnique({
      where: { id: data.clinicId },
    });

    if (!clinicExists) {
      throw new Error("Clinic not found");
    }

    // A clinic admin may only register doctors into the clinic they manage.
    if (clinicExists.adminId !== adminId) {
      throw new Error("You can only register doctors for your own clinic");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: Role.DOCTOR,
        },
      });

      const doctorProfile = await tx.doctorProfile.create({
        data: {
          userId: user.id,
          personalId: data.personalId,
          licenseNo: data.licenseNo,
          primarySpecialty: data.primarySpecialty,
          yearsOfPractice: data.yearsOfPractice,
          emergencyPhone: data.emergencyPhone,
          city: data.city,
          clinicId: data.clinicId,
          gender: data.gender,
          birthDate: data.birthDate,
          bio: data.bio,
        },
      });

      // Automatically create a default schedule for the new doctor.
      await tx.doctorScheduleDay.createMany({
        data: buildDefaultScheduleDays().map((day) => ({
          doctorId: doctorProfile.id,
          ...day,
        })),
      });

      return { user, doctorProfile };
    });

    const token = this.generateToken(result.user.id, result.user.role);

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      },
      doctorProfile: result.doctorProfile,
      token,
    };
  }

  static async login(data: LoginInput) {
    const user = await this.findUserForLogin(data.identifier, data.role);

    // does not reveal whether the account exists
    const isPasswordValid = await bcrypt.compare(
      data.password,
      user?.password ?? DUMMY_PASSWORD_HASH,
    );

    let taxIdValid = true

    if (data.role === Role.CLINIC_ADMIN) {
      const clinic = user
        ? await prisma.clinic.findUnique({
          where: { adminId: user.id },
          select: {taxId: true}
        })
        : null

      taxIdValid = !!clinic && clinic.taxId === data.taxId?.trim()
    }

    // Same error for unknown user, wrong password and wrong sign-in portal
    if (!user || !isPasswordValid || user.role !== data.role || !taxIdValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  // Looks up only among accounts of the given role, so each sign-in form
  // can never resolve to another role's account
  private static async findUserForLogin(identifier: string, role: Role) {
    if (identifier.includes("@")) {
      return prisma.user.findFirst({
        where: { email: { equals: identifier, mode: "insensitive" }, role },
      });
    }

    switch (role) {
      case Role.PATIENT: {
        const patientProfile = await prisma.patientProfile.findUnique({
          where: { personalId: identifier },
          include: { user: true },
        });
        return patientProfile?.user ?? null;
      }
      case Role.DOCTOR: {
        // Personal ID first, then license number, so the match is deterministic
        const byPersonalId = await prisma.doctorProfile.findUnique({
          where: { personalId: identifier },
          include: { user: true },
        });
        if (byPersonalId) return byPersonalId.user;

        const byLicenseNo = await prisma.doctorProfile.findUnique({
          where: { licenseNo: identifier },
          include: { user: true },
        });
        return byLicenseNo?.user ?? null;
      }
      default:
        // Clinic admins have no personal ID; they sign in by email only
        return null;
    }
  }

  private static generateToken(userId: string, role: Role) {
    return jwt.sign({ userId, role }, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN,
      jwtid: crypto.randomUUID(),
    });
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        patientProfile: true,
        doctorProfile: {
          include: {
            clinic: {
              select: {
                id: true,
                name: true,
              },
            },
            scheduleDays: {
              select: {
                weekday: true,
                isWorking: true,
                startTime: true,
                endTime: true,
                slotMinutes: true,
              },
              orderBy: { weekday: "asc" },
            },
          },
        },
        managedClinic: true,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }

  static async logout(jti: string, exp: number): Promise<void> {
    await prisma.revokedToken.upsert({
      where: { jti },
      update: {},
      create: {
        jti,
        expiresAt: new Date(exp * 1000),
      },
    });
  }
}
