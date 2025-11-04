import cron from "node-cron";
import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";

// Run every 15 minutes
export const startMessageCleanup = () => {
  cron.schedule("*/15 * * * *", async () => {
    try {
      console.log("Running message cleanup...");

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      // Find chat rooms with no activity in last 1 hour
      const inactiveRooms = await ChatRoom.find({
        lastMessageTime: { $lt: oneHourAgo },
      });

      for (const room of inactiveRooms) {
        // Delete all messages in this room
        await Message.deleteMany({ roomId: room.roomId });
        // Delete the room itself
        await ChatRoom.deleteOne({ _id: room._id });

        console.log(`Deleted inactive room: ${room.roomId}`);
      }

      console.log(`Cleanup complete. Deleted ${inactiveRooms.length} rooms.`);
    } catch (err) {
      console.error("Message cleanup error:", err);
    }
  });
};
