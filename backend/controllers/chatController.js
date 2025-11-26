// import ChatRoom from "../models/ChatRoom.js";
// import Message from "../models/Message.js";
// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// // Get all chat rooms for current user
// export const getMyChatRooms = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const currentUserId = decoded.id;

//     // Find all chat rooms where user is a participant
//     const chatRooms = await ChatRoom.find({
//       participants: currentUserId,
//     })
//       .sort({ lastMessageTime: -1 })
//       .populate("participants", "name profession professionDetails interest");

//     // Get unread count and last message for each room
//     const chatRoomsWithDetails = await Promise.all(
//       chatRooms.map(async (room) => {
//         // Get other user (not current user)
//         const otherUser = room.participants.find(
//           (p) => p._id.toString() !== currentUserId
//         );

//         // Get unread message count
//         const unreadCount = await Message.countDocuments({
//           roomId: room.roomId,
//           receiver: currentUserId,
//           read: false,
//         });

//         // Get last message
//         const lastMsg = await Message.findOne({ roomId: room.roomId })
//           .sort({ timestamp: -1 })
//           .select("message");

//         return {
//           roomId: room.roomId,
//           buddyType: room.buddyType,
//           otherUser: {
//             _id: otherUser._id,
//             name: otherUser.name,
//             profession: otherUser.profession,
//             professionDetails: otherUser.professionDetails,
//             interest: otherUser.interest,
//           },
//           unreadCount,
//           lastMessage: lastMsg?.message || "",
//           lastMessageTime: room.lastMessageTime,
//         };
//       })
//     );

//     res.json({ chatRooms: chatRoomsWithDetails });
//   } catch (err) {
//     console.error("Get chat rooms error:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Mark messages as read
// export const markMessagesAsRead = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { roomId } = req.body;

//     await Message.updateMany(
//       {
//         roomId,
//         receiver: decoded.id,
//         read: false,
//       },
//       { read: true }
//     );

//     res.json({ msg: "Messages marked as read" });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Get all chat rooms for current user with FULL user details from DB
export const getMyChatRooms = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decoded.id;

    // Find all chat rooms where user is a participant
    const chatRooms = await ChatRoom.find({
      participants: currentUserId,
    }).sort({ lastMessageTime: -1 });

    // Get unread count and last message for each room WITH FULL USER DETAILS
    const chatRoomsWithDetails = await Promise.all(
      chatRooms.map(async (room) => {
        // Get OTHER user's ID (not current user)
        const otherUserId = room.participants.find(
          (p) => p.toString() !== currentUserId
        );

        // FETCH FULL USER DETAILS FROM DATABASE
        const otherUser = await User.findById(otherUserId).select(
          "name profession professionDetails interests interest foodPreference foodMode cuisine availabilityComment"
        );

        // If user not found, skip this room
        if (!otherUser) {
          console.warn(`User ${otherUserId} not found for room ${room.roomId}`);
          return null;
        }

        // Get unread message count
        const unreadCount = await Message.countDocuments({
          roomId: room.roomId,
          receiver: currentUserId,
          read: false,
        });

        // Get last message
        const lastMsg = await Message.findOne({ roomId: room.roomId })
          .sort({ timestamp: -1 })
          .select("message");

        return {
          roomId: room.roomId,
          buddyType: room.buddyType,
          otherUser: {
            _id: otherUser._id,
            name: otherUser.name,
            profession: otherUser.profession,
            professionDetails: otherUser.professionDetails,
            interests: otherUser.interests,
            interest: otherUser.interest,
            foodPreference: otherUser.foodPreference,
            foodMode: otherUser.foodMode,
            cuisine: otherUser.cuisine,
            availabilityComment: otherUser.availabilityComment,
          },
          unreadCount,
          lastMessage: lastMsg?.message || "",
          lastMessageTime: room.lastMessageTime,
        };
      })
    );

    // Filter out null rooms (where user was not found)
    const validChatRooms = chatRoomsWithDetails.filter((room) => room !== null);

    res.json({ chatRooms: validChatRooms });
  } catch (err) {
    console.error("Get chat rooms error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { roomId } = req.body;

    await Message.updateMany(
      {
        roomId,
        receiver: decoded.id,
        read: false,
      },
      { read: true }
    );

    res.json({ msg: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
