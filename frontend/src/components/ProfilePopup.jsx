import { useState, useEffect } from "react";
import API from "../services/api";

export default function ProfilePopup({ onClose, onComplete }) {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);

  const professions = [
    "Businessman",
    "Student",
    "Corporate Employee",
    "Freelancer",
    "Teacher",
    "Doctor",
    "Engineer",
    "Artist",
    "Other",
  ];

  const interests = [
    "Movies",
    "Sports",
    "Music",
    "Technology",
    "Travel",
    "Gaming",
    "Books",
    "Food",
    "Fitness",
    "Business",
  ];

  const handleSubmit = async () => {
    if (!name || !profession || !interest) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post(
        "/profile/save",
        { name, profession, interest },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile saved successfully!");

      // Update user in localStorage
      const updatedUser = { ...data.user, isNewUser: false };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      onComplete(updatedUser);
    } catch (err) {
      console.error("Profile save error:", err);
      alert(err.response?.data?.msg || "Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-96 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl mb-4 font-semibold">Complete Your Profile</h2>

        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-3 bg-black border border-gray-600 rounded focus:outline-none focus:border-white"
        />

        <select
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="w-full mb-3 p-3 bg-black border border-gray-600 rounded focus:outline-none focus:border-white"
        >
          <option value="">Select Profession</option>
          {professions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="w-full mb-4 p-3 bg-black border border-gray-600 rounded focus:outline-none focus:border-white"
        >
          <option value="">Select Interest to Talk About</option>
          {interests.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full p-3 bg-white text-black rounded font-semibold hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
