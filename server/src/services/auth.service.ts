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

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
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

  static async registerDoctor(data: DoctorRegisterInput) {
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
    let user = null;

    if (data.identifier.includes("@")) {
      user = await prisma.user.findUnique({
        where: { email: data.identifier },
      });
    } else {
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { licenseNo: data.identifier },
        include: { user: true },
      });
      if (doctorProfile) {
        user = doctorProfile.user;
      }
    }

    if (!user) {
      throw new Error("Wrong email/license or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Wrong email/license or password");
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

  private static generateToken(userId: string, role: Role) {
    return jwt.sign({ userId, role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
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
          },
        },
        managedClinic: true,
      },
    });

    if (!user) {
      throw new Error("მომხმარებელი ვერ მოიძებნა");
    }

    return user;
  }
}
