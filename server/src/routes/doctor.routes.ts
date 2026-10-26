import { Router } from "express";
import {
  getDoctors,
  getDoctorSpecialties,
  getDoctorsSlots,
} from "../controllers/doctor.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.get("/doctors/specialties", getDoctorSpecialties);
router.get("/doctors", getDoctors);
router.get(
  "/doctors/:id/slots",
  authenticate,
  authorize("PATIENT", "CLINIC_ADMIN"),
  getDoctorsSlots,
);

export default router;
