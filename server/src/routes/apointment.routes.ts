import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { createAppointment } from "../controllers/appointment.controller";

const router = Router();

router.post(
  "/appointments",
  authenticate,
  authorize("PATIENT"),
  createAppointment,
);

export default router;
