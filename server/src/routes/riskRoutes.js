import express from "express";
import calculateRiskAreas from "../services/riskEngine.js";

const router = express.Router();

router.get("/risk-areas", (req, res) => {
  const riskAreas = calculateRiskAreas();
  res.json(riskAreas);
});

router.get("/", (req, res) => {
  const riskAreas = calculateRiskAreas();
  res.json(riskAreas);
});

export default router;
