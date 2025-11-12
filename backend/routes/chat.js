import express from "express";
import {
  getMyChatRooms,
  markMessagesAsRead,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/my-chats", getMyChatRooms);
router.post("/mark-read", markMessagesAsRead);

export default router;
