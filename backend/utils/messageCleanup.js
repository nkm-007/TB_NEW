import cron from "node-cron";
import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";

// Run every 10 minutes to check for inactive chats
export const startMessageCleanup = () => {
  console.log("📅 Message cleanup cron job started");

  cron.schedule("*/10 * * * *", async () => {
    try {
      console.log("🧹 Running message cleanup...");

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      // Find chat rooms with no activity in last 1 hour
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

      console.log(
        `✅ Cleanup complete. Deleted ${inactiveRooms.length} inactive rooms.`
      );
    } catch (err) {
      console.error("❌ Message cleanup error:", err);
    }
  });
};
