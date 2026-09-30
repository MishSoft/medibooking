import { Router } from "express";
import {
  registerControllers,
  loginController,
} from "../controllers/auth.controllers";
import { validate } from "../middleware/validation.middleware";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), registerControllers);

router.post("/login", validate(loginSchema), loginController);

export default router;
