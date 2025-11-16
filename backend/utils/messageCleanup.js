import cron from "node-cron";
import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";
import User from "../models/User.js";

// Run every 10 minutes to check for inactive chats and old comments
export const startMessageCleanup = () => {
  console.log("📅 Message cleanup cron job started");

  cron.schedule("*/10 * * * *", async () => {
    try {
      console.log("🧹 Running message cleanup...");

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      // 1. Find and delete inactive chat rooms
      const inactiveRooms = await ChatRoom.find({
        lastMessageTime: { $lt: oneHourAgo },
      });

      console.log(`Found ${inactiveRooms.length} inactive rooms to delete`);

      for (const room of inactiveRooms) {
        // Delete all messages in this room
        const deletedMessages = await Message.deleteMany({
          roomId: room.roomId,
        });
        console.log(
          `  Deleted ${deletedMessages.deletedCount} messages from room ${room.roomId}`
        );

        // Delete the room itself
        await ChatRoom.deleteOne({ _id: room._id });
        console.log(`  Deleted room: ${room.roomId}`);
      }

      // 2. Find and clear old availability comments (older than 1 hour)
      const usersWithOldComments = await User.find({
        availabilityComment: { $ne: "" },
        availabilityCommentUpdatedAt: { $lt: oneHourAgo },
      });

      console.log(
        `Found ${usersWithOldComments.length} users with old comments to clear`
      );

      for (const user of usersWithOldComments) {
        await User.updateOne(
          { _id: user._id },
          {
            availabilityComment: "",
            availabilityCommentUpdatedAt: null,
          }
        );
        console.log(`  Cleared comment for user: ${user.name}`);
      }

      console.log(
        `✅ Cleanup complete. Deleted ${inactiveRooms.length} rooms and cleared ${usersWithOldComments.length} comments.`
      );
    } catch (err) {
      console.error("❌ Message cleanup error:", err);
    }
  });
};
