import { useState } from "react";
import API from "../services/api";

export default function FeedbackPopup({ onClose }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }

    setLoading(true);
    try {
      await API.post(
        "/feedback/submit",
        { rating, suggestion },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Thank you for your feedback! 🎉");
      onClose();
    } catch (err) {
      console.error("Feedback error:", err);
      alert(err.response?.data?.msg || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-black border border-purple-500 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-black">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Feedback
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-3xl text-gray-400 hover:text-white transition"
            >
              ×
            </button>
          </div>

          <p className="text-gray-400 mb-6 text-sm">
            Help us improve TeaBreak! Share your experience.
          </p>

          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block mb-3 text-lg font-semibold">
              Rate your experience
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-5xl transition-transform hover:scale-110"
                >
                  {(hoveredRating || rating) >= star ? "⭐" : "☆"}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center mt-2 text-purple-300">
                {rating === 5 && "Amazing! 🔥"}
                {rating === 4 && "Great! 😊"}
                {rating === 3 && "Good! 👍"}
                {rating === 2 && "Okay 😐"}
                {rating === 1 && "Need improvements 🤔"}
              </p>
            )}
          </div>

          {/* Suggestion Box */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-300">
              Suggest Improvements (Optional)
            </label>
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              maxLength={500}
              placeholder="Tell us how we can make TeaBreak better..."
              rows="4"
              className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white resize-none placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {suggestion.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 transform hover:scale-105"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}
