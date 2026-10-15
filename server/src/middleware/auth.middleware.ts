import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma";
import { prisma } from "../db/prisma";

export interface JwtPayload {
  userId: string;
  role: Role;
  jti?: string;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const authenticateToken = (allowRevoked: boolean) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }

    if (!allowRevoked && decoded.jti) {
      try {
        const revokedToken = await prisma.revokedToken.findUnique({
          where: { jti: decoded.jti },
          select: { jti: true },
        });

        if (revokedToken) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized: Token revoked",
          });
        }
      } catch {
        return res.status(500).json({
          success: false,
          message: "Authentication verification failed",
        });
      }
    }

    req.user = decoded;
    return next();
  };
};

export const authenticate = authenticateToken(false);


export const authenticateForLogout = authenticateToken(true);

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied",
      });
    }

    return next();
  };
};
