import express from "express";
import {
  findNearbyBuddies,
  getAllAvailableUsers,
} from "../controllers/buddyController.js";

const router = express.Router();

router.get("/find-nearby", findNearbyBuddies);
router.get("/all-available", getAllAvailableUsers);

export default router;
