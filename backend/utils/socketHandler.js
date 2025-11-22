// import Message from "../models/Message.js";
// import ChatRoom from "../models/ChatRoom.js";
// import jwt from "jsonwebtoken";

// export const setupSocket = (io) => {
//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     // Authenticate socket connection
//     socket.on("authenticate", async (token) => {
//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         socket.userId = decoded.id;
//         console.log("User authenticated:", decoded.id);
//       } catch (err) {
//         console.error("Socket auth error:", err);
//         socket.disconnect();
//       }
//     });

//     // Join a chat room
//     socket.on("join-room", async ({ roomId }) => {
//       socket.join(roomId);
//       console.log(`User ${socket.userId} joined room ${roomId}`);

//       // Load previous messages
//       try {
//         const messages = await Message.find({ roomId })
//           .sort({ timestamp: 1 })
//           .limit(50)
//           .populate("sender", "name")
//           .populate("receiver", "name");

//         socket.emit("previous-messages", messages);
//       } catch (err) {
//         console.error("Error loading messages:", err);
//       }
//     });

//     // Send message
//     socket.on("send-message", async ({ roomId, receiverId, message }) => {
//       try {
//         const newMessage = await Message.create({
//           roomId,
//           sender: socket.userId,
//           receiver: receiverId,
//           message,
//         });

//         // Update chat room last message time
//         await ChatRoom.findOneAndUpdate(
//           { roomId },
//           {
//             lastMessageTime: Date.now(),
//             $addToSet: { participants: [socket.userId, receiverId] },
//           },
//           { upsert: true }
//         );

//         const populatedMessage = await Message.findById(newMessage._id)
//           .populate("sender", "name")
//           .populate("receiver", "name");

//         // Send to both users
//         io.to(roomId).emit("receive-message", populatedMessage);
//       } catch (err) {
//         console.error("Error sending message:", err);
//       }
//     });

//     // Typing indicator
//     socket.on("typing", ({ roomId }) => {
//       socket.to(roomId).emit("user-typing", { userId: socket.userId });
//     });

//     socket.on("stop-typing", ({ roomId }) => {
//       socket.to(roomId).emit("user-stop-typing", { userId: socket.userId });
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });
// };
import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";
import jwt from "jsonwebtoken";

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Authenticate socket connection
    socket.on("authenticate", async (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        console.log("User authenticated:", decoded.id);
      } catch (err) {
        console.error("Socket auth error:", err);
        socket.disconnect();
      }
    });

    // Join a chat room
    socket.on("join-room", async ({ roomId }) => {
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room ${roomId}`);

      // Load previous messages
      try {
        const messages = await Message.find({ roomId })
          .sort({ timestamp: 1 })
          .limit(50)
          .populate("sender", "name")
          .populate("receiver", "name");

        socket.emit("previous-messages", messages);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    });

    // Send message
    socket.on("send-message", async ({ roomId, receiverId, message }) => {
      try {
        const newMessage = await Message.create({
          roomId,
          sender: socket.userId,
          receiver: receiverId,
          message,
        });

        // Update chat room last message time
        await ChatRoom.findOneAndUpdate(
          { roomId },
          {
            lastMessageTime: Date.now(),
            buddyType: roomId.includes("-food") ? "food" : "tea",
            $addToSet: { participants: [socket.userId, receiverId] },
          },
          { upsert: true }
        );

        const populatedMessage = await Message.findById(newMessage._id)
          .populate("sender", "name")
          .populate("receiver", "name");

        // Send to both users
        io.to(roomId).emit("receive-message", populatedMessage);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    // Typing indicator
    socket.on("typing", ({ roomId }) => {
      socket.to(roomId).emit("user-typing", { userId: socket.userId });
    });

    socket.on("stop-typing", ({ roomId }) => {
      socket.to(roomId).emit("user-stop-typing", { userId: socket.userId });
    });

    // Location sharing
    socket.on("share-location", ({ roomId, userId, location }) => {
      socket.to(roomId).emit("location-update", { userId, location });
    });

    socket.on("stop-location", ({ roomId, userId }) => {
      socket.to(roomId).emit("location-stopped", { userId });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
