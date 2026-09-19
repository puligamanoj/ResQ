import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import disasterRoutes from "./routes/disasterRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import allocationRoutes from "./routes/allocationRoutes.js";
import shelterRoutes from "./routes/shelterRoutes.js";
import missingPersonRoutes from "./routes/missingPersonRoutes.js";
import roadRoutes from "./routes/roadRoutes.js";
import riskRoutes from "./routes/riskRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", service: "ResQ PS-2 Backend Intelligence Server", timestamp: new Date() });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/disasters", disasterRoutes);
app.use("/api/disaster", disasterRoutes);
app.use("/api/emergencies", emergencyRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/replan", allocationRoutes);
app.use("/api/shelters", shelterRoutes);
app.use("/api/missing-persons", missingPersonRoutes);
app.use("/api/roads", roadRoutes);
app.use("/api/risk-areas", riskRoutes);
app.use("/api/alerts", alertRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
