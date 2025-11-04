import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "../components/ProfilePopup";
import API from "../services/api";

export default function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [availableForTea, setAvailableForTea] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    // Show profile popup for new users or incomplete profiles
    if (userData?.isNewUser || !userData?.profileCompleted) {
      setShowPopup(true);
    }

    setAvailableForTea(userData?.availableForTea || false);
  }, []);

  const handleProfileComplete = (updatedUser) => {
    setShowPopup(false);
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleToggleAvailability = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.put(
        "/profile/toggle-availability",
        { availableForTea: !availableForTea },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAvailableForTea(data.availableForTea);

      const updatedUser = { ...user, availableForTea: data.availableForTea };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert(
        data.availableForTea
          ? "You're now available for tea! ☕"
          : "You're now unavailable"
      );
    } catch (err) {
      console.error("Toggle availability error:", err);
      alert("Failed to update availability");
    } finally {
      setLoading(false);
    }
  };

  const handleFindBuddy = () => {
    if (!user?.profileCompleted) {
      alert("Please complete your profile first");
      setShowPopup(true);
      return;
    }
    navigate("/find-buddy");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>

      {user && (
        <div className="mb-6 text-center">
          <p className="text-gray-400">Welcome, {user.name || user.phone}!</p>
          {user.interest && (
            <p className="text-sm text-gray-500">
              Interested in: {user.interest}
            </p>
          )}
        </div>
      )}

      {/* Availability Toggle */}
      <div className="mb-8">
        <label className="flex items-center space-x-3 cursor-pointer">
          <span className="text-lg">Available for Tea Break?</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={availableForTea}
              onChange={handleToggleAvailability}
              disabled={loading}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-700 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
            <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
          </div>
        </label>
      </div>

      {/* Find Buddy Button */}
      <button
        onClick={handleFindBuddy}
        disabled={!user?.profileCompleted}
        className="px-8 py-3 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        Find Tea Buddy ☕
      </button>

      {!user?.profileCompleted && (
        <p className="text-sm text-red-400">
          Complete your profile to find buddies
        </p>
      )}

      {/* Profile Popup */}
      {showPopup && (
        <ProfilePopup
          onClose={() => setShowPopup(false)}
          onComplete={handleProfileComplete}
        />
      )}
    </div>
  );
}
