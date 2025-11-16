import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  roomId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index for faster queries
friendRequestSchema.index({ to: 1, status: 1 });
friendRequestSchema.index({ from: 1, to: 1 });

export default mongoose.model("FriendRequest", friendRequestSchema);
