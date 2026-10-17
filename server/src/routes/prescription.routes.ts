
import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  getDoctorPrescriptions,
  createPrescription,
  updatePrescription,
  getDoctorPatients,
} from "../controllers/prescription.controller";

const router = Router();

// Doctor: get their own prescriptions
router.get(
  "/prescriptions",
  authenticate,
  authorize("DOCTOR"),
  getDoctorPrescriptions,
);

// Doctor: get patients they have seen
router.get(
  "/doctor/patients",
  authenticate,
  authorize("DOCTOR"),
  getDoctorPatients,
);

// Doctor: create a prescription
router.post(
  "/prescriptions",
  authenticate,
  authorize("DOCTOR"),
  createPrescription,
);

// Doctor: update their own prescription
router.patch(
  "/prescriptions/:id",
  authenticate,
  authorize("DOCTOR"),
  updatePrescription,
);

export default router;

