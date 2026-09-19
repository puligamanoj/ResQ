import express from "express";
import { getResources, updateResourceStatus } from "../controllers/resourceController.js";

const router = express.Router();

router.get("/", getResources);
router.patch("/:id", updateResourceStatus);

export default router;
