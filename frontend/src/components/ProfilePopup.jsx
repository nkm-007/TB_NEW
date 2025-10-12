import { useState } from "react";
import API from "../services/api";

export default function ProfilePopup({ onClose }) {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [interest, setInterest] = useState("");

  const professions = [
    "Businessman",
    "Student",
    "Corporate",
    "Freelancer",
    "Teacher",
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
  ];

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/profile/save",
        { name, profession, interest },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile saved successfully!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.msg || "Error saving profile");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-xl w-96 border border-gray-700">
        <h2 className="text-2xl mb-4">Complete Your Profile</h2>
        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 bg-black border border-gray-600 rounded"
        />
        <select
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="w-full mb-3 p-2 bg-black border border-gray-600 rounded"
        >
          <option value="">Select Profession</option>
          {professions.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="w-full mb-3 p-2 bg-black border border-gray-600 rounded"
        >
          <option value="">Select Interest</option>
          {interests.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-white text-black rounded hover:bg-gray-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
