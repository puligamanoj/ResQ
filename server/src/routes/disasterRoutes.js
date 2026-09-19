import express from "express";
import { getDisasterInfo, createDisaster } from "../controllers/disasterController.js";

const router = express.Router();

router.get("/info", getDisasterInfo);
router.get("/", getDisasterInfo);
router.post("/", createDisaster);

export default router;
