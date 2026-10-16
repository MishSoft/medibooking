import { Router } from "express";
import {
  getClinics,
  getClinicDoctors,
  updateClinicDoctorSchedule,
  getClinicAppointments,
  rescheduleClinicAppointment,
  cancelClinicAppointment,
} from "../controllers/clinic.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// Public clinics endpoint
router.get("/clinics", getClinics);

// Clinic admin: get doctors belonging to their clinic
router.get(
  "/clinic/doctors",
  authenticate,
  authorize("CLINIC_ADMIN"),
  getClinicDoctors,
);

// Clinic admin: update a doctor's schedule
router.put(
  "/clinic/doctors/:id/schedule",
  authenticate,
  authorize("CLINIC_ADMIN"),
  updateClinicDoctorSchedule,
);

// Clinic admin: get appointments belonging to their clinic
router.get(
  "/clinic/appointments",
  authenticate,
  authorize("CLINIC_ADMIN"),
  getClinicAppointments,
);

router.patch(
  "/clinic/appointments/:id/reschedule",
  authenticate,
  authorize("CLINIC_ADMIN"),
  rescheduleClinicAppointment,
);


router.patch(
  "/clinic/appointments/:id/cancel",
  authenticate,
  authorize("CLINIC_ADMIN"),
  cancelClinicAppointment,
);

export default router;
