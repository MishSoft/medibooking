import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  getDoctorPrescriptions,
  createPrescription,
} from "../controllers/prescription.controller";

const router = Router();

router.get(
  "/prescriptions",
  authenticate,
  authorize("DOCTOR"),
  getDoctorPrescriptions,
);

router.post(
  "/prescriptions",
  authenticate,
  authorize("DOCTOR"),
  createPrescription,
);

export default router;
