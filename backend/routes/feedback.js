import express from "express";
import {
  submitFeedback,
  getAverageRating,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/submit", submitFeedback);
router.get("/average", getAverageRating);

export default router;
