import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { ZodError } from "zod";

export const registerControllers = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const result = await AuthService.register(validatedData);

    res.status(201).json({
      success: true,
      message: "Register success",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await AuthService.login(validatedData);

    res.status(200).json({
      success: true,
      message: "ავტორიზაცია წარმატებით გაიარა",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "ავტორიზაციისას დაფიქსირდა შეცდომა",
    });
  }
};
