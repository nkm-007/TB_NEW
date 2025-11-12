import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function FindBuddy() {
  const [interest, setInterest] = useState("");
  const [tempComment, setTempComment] = useState(""); // Temporary comment, not saved
  const [location, setLocation] = useState(null);
  const [finding, setFinding] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.interest) {
      setInterest(user.interest);
    }
  }, []);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleFindBuddies = async () => {
    if (!interest) {
      alert("Please select an interest");
      return;
    }

    setFinding(true);
    try {
      // Get current location
      const loc = await getLocation();
      setLocation(loc);

      const token = localStorage.getItem("token");

      // Update location AND temporary comment on backend
      // Comment is sent but only for this search session
      await API.put(
        "/profile/update-location",
        {
          longitude: loc.longitude,
          latitude: loc.latitude,
          availabilityComment: tempComment, // Send temporary comment
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Find nearby buddies
      const { data } = await API.get("/buddy/find-nearby", {
        params: { longitude: loc.longitude, latitude: loc.latitude },
        headers: { Authorization: `Bearer ${token}` },
      });

      setMatchedUsers(data.matchedInterest || []);
      setOtherUsers(data.otherInterests || []);

      if (data.totalFound === 0) {
        alert("No buddies found nearby. Try again later!");
      }
    } catch (err) {
      console.error("Find buddies error:", err);
      if (err.message?.includes("denied")) {
        alert("Location permission denied. Please enable location access.");
      } else {
        alert(err.response?.data?.msg || "Failed to find buddies");
      }
    } finally {
      setFinding(false);
    }
  };

  const handleSelectBuddy = (buddy) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const roomId = [user.id, buddy._id].sort().join("-");
    navigate(`/chat/${roomId}`, { state: { buddy } });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Find Tea Buddy ☕</h1>

        {/* Interest Selection */}
        <div className="mb-4">
          <label className="block mb-2 text-lg">
            What do you want to talk about?
          </label>
          <select
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
          >
            <option value="">Select Interest</option>
            {interests.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {/* Temporary Comment Box - Only for this search */}
        <div className="mb-6">
          <label className="block mb-2 text-sm text-gray-400">
            Optional: Add context for this search (e.g., "Just watched Dune 2!"
            or "Want to discuss IPL")
          </label>
          <textarea
            value={tempComment}
            onChange={(e) => setTempComment(e.target.value)}
            maxLength={150}
            placeholder="What specifically do you want to discuss? (optional)"
            rows="3"
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white resize-none"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              {tempComment.length}/150 characters
            </p>
            <p className="text-xs text-yellow-500">
              ℹ️ This comment is temporary and only visible during this search
            </p>
          </div>
        </div>

        {/* Find Button */}
        <button
          onClick={handleFindBuddies}
          disabled={finding || !interest}
          className="w-full p-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          {finding ? "Finding Buddies..." : "Find Buddies Within 1KM"}
        </button>

        {/* Results */}
        {(matchedUsers.length > 0 || otherUsers.length > 0) && (
          <div>
            {/* Matched Interest Users */}
            {matchedUsers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-green-400">
                  ✓ Same Interest ({matchedUsers.length})
                </h2>
                <div className="space-y-3">
                  {matchedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="bg-gray-900 p-4 rounded-lg border border-green-500 hover:bg-gray-800 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{user.name}</p>
                          <p className="text-sm text-gray-400">
                            {user.profession}
                          </p>
                          <p className="text-sm text-green-400">
                            💬 {user.interest}
                          </p>
                          {user.availabilityComment && (
                            <div className="mt-2 p-2 bg-gray-800 rounded border-l-2 border-green-500">
                              <p className="text-sm text-gray-300 italic">
                                "{user.availabilityComment}"
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleSelectBuddy(user)}
                          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition whitespace-nowrap ml-4"
                        >
                          Chat ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Interest Users */}
            {otherUsers.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-400">
                  Other Interests ({otherUsers.length})
                </h2>
                <div className="space-y-3">
                  {otherUsers.map((user) => (
                    <div
                      key={user._id}
                      className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{user.name}</p>
                          <p className="text-sm text-gray-400">
                            {user.profession}
                          </p>
                          <p className="text-sm text-blue-400">
                            💬 {user.interest}
                          </p>
                          {user.availabilityComment && (
                            <div className="mt-2 p-2 bg-gray-800 rounded border-l-2 border-blue-500">
                              <p className="text-sm text-gray-300 italic">
                                "{user.availabilityComment}"
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleSelectBuddy(user)}
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition whitespace-nowrap ml-4"
                        >
                          Chat ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!finding &&
          matchedUsers.length === 0 &&
          otherUsers.length === 0 &&
          location && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No buddies available nearby right now.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Try changing your interest or check back later!
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
