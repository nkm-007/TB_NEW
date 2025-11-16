import Feedback from "../models/Feedback.js";
import jwt from "jsonwebtoken";

// Submit feedback
export const submitFeedback = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rating, suggestion } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    // Check if user already submitted feedback
    const existing = await Feedback.findOne({ user: decoded.id });
    if (existing) {
      // Update existing
      existing.rating = rating;
      if (suggestion) existing.suggestion = suggestion;
      await existing.save();
      return res.json({ msg: "Feedback updated" });
    }

    // Create new
    await Feedback.create({
      user: decoded.id,
      rating,
      suggestion: suggestion || "",
    });

    res.json({ msg: "Feedback submitted. Thank you!" });
  } catch (err) {
    console.error("Submit feedback error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Get average rating
export const getAverageRating = async (req, res) => {
  try {
    const result = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ averageRating: 0, totalCount: 0 });
    }

    res.json({
      averageRating: result[0].averageRating.toFixed(1),
      totalCount: result[0].totalCount,
    });
  } catch (err) {
    console.error("Get average rating error:", err);
    res.status(500).json({ msg: err.message });
  }
};
