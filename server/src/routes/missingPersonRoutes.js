import express from "express";
import {
  getMissingPersons,
  createMissingPerson,
} from "../controllers/missingPersonController.js";

const router = express.Router();

router.get("/", getMissingPersons);
router.post("/", createMissingPerson);

export default router;
