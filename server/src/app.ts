import express from "express";
import authRoutes from "./routes/auth.routes";
import cors from "cors"
import { setupSwagger } from "./config/swagger";
import patientRoutes from "./routes/patient.routes"
import appointmentRoutes from "./routes/apointment.routes";
import doctorRoutes from "./routes/doctor.routes"
import clinicRoutes from "./routes/api.routes"
import prescriptionRoutes from "./routes/prescription.routes";
const app = express();

app.use(cors())
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", patientRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", doctorRoutes);
app.use("/api", clinicRoutes);
app.use("/api", prescriptionRoutes)
setupSwagger(app)

export default app
