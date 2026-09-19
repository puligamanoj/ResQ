import express from "express";
import { loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", loginUser);

export default router;
