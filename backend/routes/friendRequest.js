import express from "express";
import {
  sendFriendRequest,
  getPendingRequests,
  acceptFriendRequest,
  declineFriendRequest,
  checkFriendStatus,
} from "../controllers/friendRequestController.js";

const router = express.Router();

router.post("/send", sendFriendRequest);
router.get("/pending", getPendingRequests);
router.post("/accept", acceptFriendRequest);
router.post("/decline", declineFriendRequest);
router.get("/status", checkFriendStatus);

export default router;
