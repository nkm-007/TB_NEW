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
//             buddyType: roomId.includes("-food") ? "food" : "tea",
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

//     // Location sharing
//     socket.on("share-location", ({ roomId, userId, location }) => {
//       socket.to(roomId).emit("location-update", { userId, location });
//     });

//     socket.on("stop-location", ({ roomId, userId }) => {
//       socket.to(roomId).emit("location-stopped", { userId });
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });
// };
import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";
import User from "../models/User.js";
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

        // Join user's personal room for notifications
        socket.join(`user-${decoded.id}`);
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

        // Send to both users in the room
        io.to(roomId).emit("receive-message", populatedMessage);

        // Send notification event to receiver's personal room
        const sender = await User.findById(socket.userId).select("name");
        const buddyType = roomId.includes("-food") ? "food" : "tea";

        io.to(`user-${receiverId}`).emit("new-message-notification", {
          senderName: sender.name,
          message: message,
          roomId: roomId,
          buddyType: buddyType,
        });
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

    // Friend request notification
    socket.on(
      "friend-request-sent",
      async ({ toUserId, fromUserId, buddyType }) => {
        try {
          const fromUser = await User.findById(fromUserId).select(
            "name profession interests interest"
          );

          io.to(`user-${toUserId}`).emit("friend-request-received", {
            fromUser: {
              _id: fromUser._id,
              name: fromUser.name,
              profession: fromUser.profession,
              interests: fromUser.interests,
              interest: fromUser.interest,
            },
            buddyType: buddyType,
          });
        } catch (err) {
          console.error("Error sending friend request notification:", err);
        }
      }
    );

    // Friend request accepted notification
    socket.on(
      "friend-request-accepted",
      async ({ fromUserId, acceptedByUserId, buddyType }) => {
        try {
          const acceptedByUser = await User.findById(acceptedByUserId).select(
            "name"
          );

          io.to(`user-${fromUserId}`).emit(
            "friend-request-accepted-notification",
            {
              userName: acceptedByUser.name,
              buddyType: buddyType,
            }
          );
        } catch (err) {
          console.error("Error sending request accepted notification:", err);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
