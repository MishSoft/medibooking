import { Router } from "express";
import {
  registerPatientController,
  registerClinicController,
  registerDoctorController,
  loginController,
  getMeController,
  logoutController,
} from "../controllers/auth.controllers";
import { validate } from "../middleware/validation.middleware";
import {
  patientRegisterSchema,
  clinicRegisterSchema,
  doctorRegisterSchema,
  loginSchema,
} from "../schemas/auth.schema";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/register/patient",
  validate(patientRegisterSchema),
  registerPatientController,
);

router.post(
  "/register/clinic",
  validate(clinicRegisterSchema),
  registerClinicController,
);

router.post(
  "/register/doctor",
  validate(doctorRegisterSchema),
  registerDoctorController,
);

router.post("/login", validate(loginSchema), loginController);
router.get("/me", authenticate, getMeController);
router.post('/logout', authenticate, logoutController)

export default router;


/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: მომხმარებლის ავტორიზაცია
 *     tags: [Auth]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json
 *            schema:
 *              type: object
 *              required:
 *                - identifier
 *                - password
 *              properties:
 *                identifier:
 *                    type: string
 *                    example: patient@example.com
 *                password:
 *                    type: string
 *                    example: password123
 *        responses:
 *            200:
 *              description: წარმატებული ავტორიზაცია
 *            400:
 *              description: არასწორი მონაცემები
**/

