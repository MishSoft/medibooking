import express from "express";
import authRoutes from "./routes/auth.routes";
import cors from "cors"
import { setupSwagger } from "./config/swagger";

const app = express();

app.use(cors())
app.use(express.json());

app.use("/api/auth", authRoutes);

setupSwagger(app)

export default app
