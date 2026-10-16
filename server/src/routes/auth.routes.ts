import { Router } from "express";
import {
  registerPatientController,
  registerClinicController,
  registerDoctorController,
  loginController,
  getMeController,
  logoutController,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import {
  patientRegisterSchema,
  clinicRegisterSchema,
  doctorRegisterSchema,
  loginSchema,
} from "../schemas/auth.schema";
import {
  authenticate,
  authenticateForLogout,
  authorize,
} from "../middleware/auth.middleware";

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
  authenticate,
  authorize("CLINIC_ADMIN"),
  validate(doctorRegisterSchema),
  registerDoctorController,
);

router.post("/login", validate(loginSchema), loginController);
router.get("/me", authenticate, getMeController);
router.post("/logout", authenticateForLogout, logoutController);

export default router;


