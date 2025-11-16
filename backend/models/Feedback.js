import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  suggestion: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

// Index for faster queries
feedbackSchema.index({ user: 1 });

export default mongoose.model("Feedback", feedbackSchema);
