import express from "express";
import authRoutes from "./routes/auth.routes";
import { setupSwagger } from "./config/swagger";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

setupSwagger(app)

export default app
