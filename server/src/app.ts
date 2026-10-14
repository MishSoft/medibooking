import express from "express";
import authRoutes from "./routes/auth.routes";
import cors from "cors"
import { setupSwagger } from "./config/swagger";
import patientRoutes from "./routes/patient.routes"
import appointmentRoutes from "./routes/apointment.routes";

const app = express();

app.use(cors())
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", patientRoutes);
app.use("/api", appointmentRoutes);

setupSwagger(app)

export default app
