import express from "express";
import { saveProfile } from "../controllers/profileController.js";

const router = express.Router();
router.post("/save", saveProfile);
export default router;
