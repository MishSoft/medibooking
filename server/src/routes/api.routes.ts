import { Router } from "express"
import { getClinics } from "../controllers/clinic.controller"


const router = Router()

router.get("/clinics", getClinics)

export default router
