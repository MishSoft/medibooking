import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  cancelAppointment,
  createAppointment,
  updateAppointmentStatus,
  getDoctorAppointments,
  updateAppointmentRecord,
} from "../controllers/appointment.controller";

const router = Router();

// Patient: create an appointment
router.post(
  "/appointments",
  authenticate,
  authorize("PATIENT"),
  createAppointment,
);


router.get(
  "/appointments",
  authenticate,
  authorize("DOCTOR"),
  getDoctorAppointments,
);

// Patient: cancel their own appointment
router.patch(
  "/appointments/:id/cancel",
  authenticate,
  authorize("PATIENT"),
  cancelAppointment,
);

// Doctor: complete an appointment (optionally saving notes) or mark it as no-show
router.patch(
  "/appointments/:id/status",
  authenticate,
  authorize("DOCTOR"),
  updateAppointmentStatus,
);

// Doctor: edit diagnosis and notes of a completed visit
router.patch(
  "/appointments/:id/record",
  authenticate,
  authorize("DOCTOR"),
  updateAppointmentRecord,
);

export default router;
