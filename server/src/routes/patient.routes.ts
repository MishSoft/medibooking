import { Router } from "express";
import {
  getPatientAppointments,
  getPatientPrescriptions,
} from "../controllers/patient.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// Scoped to /patient: this router is mounted on /api, so an unscoped use() would
// apply the PATIENT check to every later /api route (e.g. /api/clinics)
router.use("/patient", authenticate, authorize("PATIENT"));

router.get("/patient/appointments", getPatientAppointments);
router.get("/patient/prescriptions", getPatientPrescriptions);

export default router;
