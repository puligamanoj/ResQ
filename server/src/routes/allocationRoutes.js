import express from "express";
import {
  getAllocations,
  createAllocation,
  triggerDynamicReplanning,
} from "../controllers/allocationController.js";

const router = express.Router();

router.get("/", getAllocations);
router.post("/", createAllocation);
router.post("/replan", triggerDynamicReplanning);

export default router;
