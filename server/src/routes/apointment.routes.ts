import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  cancelAppointment,
  createAppointment,
  updateAppointmentStatus,
  getDoctorAppointments,
} from "../controllers/appointment.controller";

const router = Router();

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

router.patch(
  "/appointments/:id/cancel",
  authenticate,
  authorize("PATIENT"),
  cancelAppointment,
);

router.patch(
  "/appointments/:id/status",
  authenticate,
  authorize("DOCTOR"),
  updateAppointmentStatus,
);

export default router;
