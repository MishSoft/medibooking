import { Router } from "express";
import {
  registerPatientController,
  registerClinicController,
  registerDoctorController,
  loginController,
  getMeController,
} from "../controllers/auth.controllers";
import { validate } from "../middleware/validation.middleware";
import {
  patientRegisterSchema,
  clinicRegisterSchema,
  doctorRegisterSchema,
  loginSchema,
} from "../schemas/auth.schema";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/register/patient",
  validate(patientRegisterSchema),
  registerPatientController,
);

router.post(
  "/register/clinic",
  validate(clinicRegisterSchema),
  registerClinicController,
);

router.post(
  "/register/doctor",
  validate(doctorRegisterSchema),
  registerDoctorController,
);

router.post("/login", validate(loginSchema), loginController);
router.get("/me", authenticate, getMeController);

export default router;
