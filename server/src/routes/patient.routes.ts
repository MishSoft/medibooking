import { Router } from "express";
import {
  getPatientAppointments,
  getPatientPrescriptions,
} from "../controllers/patient.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate, authorize("PATIENT"));

router.get("/patient/appointments", getPatientAppointments);
router.get("/patient/prescriptions", getPatientPrescriptions);

export default router;
