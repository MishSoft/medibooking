import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { cancelAppointment, createAppointment } from "../controllers/appointment.controller";

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

export default router;
