import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { Role } from "../generated/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
const JWT_EXPIRES_IN = "7d";

export class AuthService {
  static async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("This email is already used");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          fullName: data.fullName,
          role: data.role,
        },
      });

      if (data.role === Role.DOCTOR) {
        if (
          !data.licenseNo ||
          !data.clinicId ||
          data.pricePerVisit === undefined
        ) {
          throw new Error(
            "Doctor registration requires licenseNo, clinicId and pricePerVisit",
          );
        }

        await tx.doctorProfile.create({
          data: {
            userId: user.id,
            licenseNo: data.licenseNo,
            clinicId: data.clinicId,
            pricePerVisit: data.pricePerVisit,
          },
        });
      }

      return user;
    });

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    };
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Wrong email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Wrong email or password");
    }

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
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
}
