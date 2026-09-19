import express from "express";
import {
  getEmergencies,
  getEmergencyById,
  createEmergency,
} from "../controllers/emergencyController.js";

const router = express.Router();

router.get("/", getEmergencies);
router.get("/:id", getEmergencyById);
router.post("/", createEmergency);

export default router;
