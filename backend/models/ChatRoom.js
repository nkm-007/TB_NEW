// import mongoose from "mongoose";

// const chatRoomSchema = new mongoose.Schema({
//   roomId: { type: String, required: true, unique: true },
//   participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   lastMessageTime: { type: Date, default: Date.now },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("ChatRoom", chatRoomSchema);
import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastMessageTime: { type: Date, default: Date.now },
  buddyType: {
    type: String,
    enum: ["tea", "food"],
    required: true,
    default: "tea",
  }, // NEW: Track which type of buddy this chat is for
  createdAt: { type: Date, default: Date.now },
});

// Add index for buddyType
chatRoomSchema.index({ participants: 1, buddyType: 1 });

export default mongoose.model("ChatRoom", chatRoomSchema);
