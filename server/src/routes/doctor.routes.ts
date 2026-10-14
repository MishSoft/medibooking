import { Router } from "express"
import { getDoctors, getDoctorSpecialties } from "../controllers/doctor.controller"


const router = Router()

router.get("/doctors/specialties", getDoctorSpecialties)
router.get('/doctors', getDoctors)


export default router
