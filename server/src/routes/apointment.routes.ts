import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  cancelAppointment,
  createAppointment,
  updateAppointmentStatus,
} from "../controllers/appointment.controller";

const router = Router();

router.post(
  "/appointments",
  authenticate,
  authorize("PATIENT"),
  createAppointment,
);


router.patch(
  "/appointments/:id/cancel",
  authenticate,
  authorize("PATIENT"),
  cancelAppointment
)

router.patch(
  "/appointment/:id/status",
  authenticate,
  authorize("DOCTOR"),
  updateAppointmentStatus,
);

export default router;
