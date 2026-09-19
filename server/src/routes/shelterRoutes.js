import express from "express";
import { getShelters, updateShelter } from "../controllers/shelterController.js";

const router = express.Router();

router.get("/", getShelters);
router.patch("/:id", updateShelter);

export default router;
