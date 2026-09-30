import express from "express";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);

export default app;
