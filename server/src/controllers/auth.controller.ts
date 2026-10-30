import { Request, Response } from "express";
import { ZodError } from "zod";
import {
  ClinicRegisterInput,
  clinicRegisterSchema,
  DoctorRegisterInput,
  doctorRegisterSchema,
  LoginInput,
  loginSchema,
  PatientRegisterInput,
  patientRegisterSchema,
} from "../schemas/auth.schema";
import { AuthService } from "../services/auth.service";
import { InvalidCredentialsError } from "../utils/errors";

const formatZodErrors = (error: ZodError) => {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};

export const registerPatientController = async (
  req: Request<{}, {}, PatientRegisterInput>,
  res: Response,
) => {
  try {
    const validatedData = patientRegisterSchema.parse(req.body);
    const result = await AuthService.registerPatient(validatedData);

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully.",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatZodErrors(error),
      });
    }

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const registerClinicController = async (
  req: Request<{}, {}, ClinicRegisterInput>,
  res: Response,
) => {
  try {
    const validatedData = clinicRegisterSchema.parse(req.body);
    const result = await AuthService.registerClinic(validatedData);

    return res.status(201).json({
      success: true,
      message: "Clinic registered successfully.",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatZodErrors(error),
      });
    }

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const registerDoctorController = async (
  req: Request<{}, {}, DoctorRegisterInput>,
  res: Response,
) => {
  try {
    const validatedData = doctorRegisterSchema.parse(req.body);
    // authenticate + authorize("CLINIC_ADMIN") guarantee req.user
    const result = await AuthService.registerDoctor(
      validatedData,
      req.user!.userId,
    );

    return res.status(201).json({
      success: true,
      message: "Doctor registered successfully.",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatZodErrors(error),
      });
    }

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const loginController = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthService.login(validatedData);

    return res.status(200).json({
      success: true,
      message: "Signed in successfully.",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatZodErrors(error),
      });
    }

    if (error instanceof InvalidCredentialsError) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Sign-in failed.",
    });
  }
};

export const getMeController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request.",
      });
    }

    const user = await AuthService.getMe(userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to retrieve profile.",
    });
  }
};



export const logoutController = async (req: Request, res: Response) => {
  try {
    const { jti, exp } = req.user ?? {};

    if (!jti || !exp) {
      return res.status(400).json({
        success: false,
        message: "Token is missing required claims",
      });
    }

    await AuthService.logout(jti, exp);

    return res.status(200).json({
      success: true,
      message: "Successfully logged out.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Logout failed",
    });
  }
};

