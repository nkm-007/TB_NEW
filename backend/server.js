// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/auth.js";
// import profileRoutes from "./routes/profile.js";
// import buddyRoutes from "./routes/buddy.js";
// import chatRoutes from "./routes/chat.js";
// import friendRequestRoutes from "./routes/friendRequest.js";
// import { setupSocket } from "./utils/socketHandler.js";
// import { startMessageCleanup } from "./utils/messageCleanup.js";

// dotenv.config();

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:3000", // Your frontend URL
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // Connect to database
// connectDB();

// // Clean old data on startup
// async function cleanupOnStartup() {
//   try {
//     console.log("🧹 Running startup cleanup...");

//     const { default: ChatRoom } = await import("./models/ChatRoom.js");
//     const { default: Message } = await import("./models/Message.js");
//     const { default: User } = await import("./models/User.js");

//     const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

//     // Delete old chat rooms
//     const oldRooms = await ChatRoom.find({
//       lastMessageTime: { $lt: oneHourAgo },
//     });

//     for (const room of oldRooms) {
//       await Message.deleteMany({ roomId: room.roomId });
//       await ChatRoom.deleteOne({ _id: room._id });
//     }

//     // Clear old availability comments
//     const usersWithOldComments = await User.find({
//       availabilityComment: { $ne: "" },
//       availabilityCommentUpdatedAt: { $lt: oneHourAgo },
//     });

//     for (const user of usersWithOldComments) {
//       await User.updateOne(
//         { _id: user._id },
//         { availabilityComment: "", availabilityCommentUpdatedAt: null }
//       );
//     }

//     console.log(
//       `✅ Startup cleanup: Deleted ${oldRooms.length} old rooms, cleared ${usersWithOldComments.length} old comments`
//     );
//   } catch (err) {
//     console.error("❌ Startup cleanup error:", err);
//   }
// }

// // Run cleanup after DB connection
// setTimeout(cleanupOnStartup, 3000);

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/buddy", buddyRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/friend-request", friendRequestRoutes);

// // Health check
// app.get("/", (req, res) => {
//   res.json({ status: "TeaBuddy API is running" });
// });

// // Setup Socket.io
// setupSocket(io);

// // Start message cleanup cron job
// startMessageCleanup();

// const PORT = process.env.PORT || 5000;
// httpServer.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📡 Socket.io ready for connections`);
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import buddyRoutes from "./routes/buddy.js";
import chatRoutes from "./routes/chat.js";
import friendRequestRoutes from "./routes/friendRequest.js";
import feedbackRoutes from "./routes/feedback.js";
import { setupSocket } from "./utils/socketHandler.js";
import { startMessageCleanup } from "./utils/messageCleanup.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Connect to database
connectDB();

// Clean old data on startup
async function cleanupOnStartup() {
  try {
    console.log("🧹 Running startup cleanup...");

    const { default: ChatRoom } = await import("./models/ChatRoom.js");
    const { default: Message } = await import("./models/Message.js");
    const { default: User } = await import("./models/User.js");

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Delete old chat rooms
    const oldRooms = await ChatRoom.find({
      lastMessageTime: { $lt: oneHourAgo },
    });

    for (const room of oldRooms) {
      await Message.deleteMany({ roomId: room.roomId });
      await ChatRoom.deleteOne({ _id: room._id });
    }

    // Clear old availability comments
    const usersWithOldComments = await User.find({
      availabilityComment: { $ne: "" },
      availabilityCommentUpdatedAt: { $lt: oneHourAgo },
    });

    for (const user of usersWithOldComments) {
      await User.updateOne(
        { _id: user._id },
        { availabilityComment: "", availabilityCommentUpdatedAt: null }
      );
    }

    console.log(
      `✅ Startup cleanup: Deleted ${oldRooms.length} old rooms, cleared ${usersWithOldComments.length} old comments`
    );
  } catch (err) {
    console.error("❌ Startup cleanup error:", err);
  }
}

// Run cleanup after DB connection
setTimeout(cleanupOnStartup, 3000);

// Middleware
app.use(cors());
app.use(express.json());

// Make io available to routes
app.set("io", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/buddy", buddyRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/friend-request", friendRequestRoutes);
app.use("/api/feedback", feedbackRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "TeaBuddy API is running" });
});

// Setup Socket.io
setupSocket(io);

// Start message cleanup cron job
startMessageCleanup();

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
});
