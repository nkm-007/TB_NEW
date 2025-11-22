import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function FindFoodBuddy() {
  const [foodPreference, setFoodPreference] = useState("");
  const [foodMode, setFoodMode] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [isEditingPrefs, setIsEditingPrefs] = useState(false);
  const [comment, setComment] = useState("");
  const [tempComment, setTempComment] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [location, setLocation] = useState(null);
  const [finding, setFinding] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.foodPreference) {
        setFoodPreference(user.foodPreference);
      }
      if (user?.foodMode) {
        setFoodMode(user.foodMode);
      }
      if (user?.cuisine) {
        setCuisine(user.cuisine);
      }

      // Fetch latest comment from backend
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await API.get("/profile/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.user.availabilityComment) {
            const savedComment = data.user.availabilityComment;
            setComment(savedComment);
            setTempComment(savedComment);
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      }
    };

    fetchUserData();
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

  const handleSaveComment = async () => {
    const token = localStorage.getItem("token");
    try {
      await API.put(
        "/profile/update-comment",
        { availabilityComment: tempComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment(tempComment);
      setIsEditingComment(false);
    } catch (err) {
      console.error("Save comment error:", err);
      alert("Failed to save comment");
    }
  };

  const handleSavePreferences = async () => {
    if (!foodPreference || !foodMode) {
      alert("Please select food preference and mode");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const { data } = await API.post(
        "/profile/save-food",
        { foodPreference, foodMode, cuisine },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      user.foodPreference = foodPreference;
      user.foodMode = foodMode;
      user.cuisine = cuisine;
      user.foodProfileCompleted = true;
      localStorage.setItem("user", JSON.stringify(user));

      setIsEditingPrefs(false);
    } catch (err) {
      console.error("Save preferences error:", err);
      alert("Failed to save preferences");
    }
  };

  const handleFindFoodBuddies = async () => {
    if (!foodPreference || !foodMode) {
      alert("Please set your food preferences first");
      return;
    }

    setFinding(true);
    try {
      const loc = await getLocation();
      setLocation(loc);

      const token = localStorage.getItem("token");

      // Update location
      await API.put(
        "/profile/update-location",
        {
          longitude: loc.longitude,
          latitude: loc.latitude,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Find nearby food buddies
      const { data } = await API.get("/buddy/find-nearby-food", {
        params: {
          longitude: loc.longitude,
          latitude: loc.latitude,
          foodPreference: foodPreference,
          foodMode: foodMode,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setMatchedUsers(data.matchedUsers || []);
      setOtherUsers(data.otherUsers || []);

      if (data.totalFound === 0) {
        alert("No food buddies found nearby. Try again later!");
      }
    } catch (err) {
      console.error("Find food buddies error:", err);
      if (err.message?.includes("denied")) {
        alert("Location permission denied. Please enable location access.");
      } else {
        alert(err.response?.data?.msg || "Failed to find food buddies");
      }
    } finally {
      setFinding(false);
    }
  };

  const handleSelectBuddy = async (buddy) => {
    const token = localStorage.getItem("token");

    try {
      const { data } = await API.get(
        `/friend-request/status?userId=${buddy._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.canChat) {
        const user = JSON.parse(localStorage.getItem("user"));
        const buddyType = "food";
        const roomId = [user.id, buddy._id].sort().join("-") + `-${buddyType}`;
        navigate(`/chat/${roomId}`, { state: { buddy, buddyType } });
      } else if (data.status === "pending") {
        alert("Friend request already sent! Wait for them to accept.");
      } else {
        await API.post(
          "/friend-request/send",
          { toUserId: buddy._id, buddyType: "food" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSentRequests((prev) => new Set([...prev, buddy._id]));
        alert("Friend request sent! 🎉");
        window.dispatchEvent(new Event("message-update"));
      }
    } catch (err) {
      console.error("Select buddy error:", err);
      alert(err.response?.data?.msg || "Failed to connect");
    }
  };

  const isRequestSent = (userId) => {
    return sentRequests.has(userId);
  };

  const getModeIcon = (mode) => {
    if (mode === "Restaurant") return "🟢";
    if (mode === "Online") return "🔵";
    return "🟣";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-black to-red-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-2">
          <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Find Your Food Buddy
          </span>
        </h1>
        <p className="text-gray-400 mb-8">
          People in your zone (1KM) • Split bills, share meals!
        </p>

        {/* Food Preferences Selection */}
        <div className="mb-4 bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-lg font-semibold flex items-center gap-2">
              <span>🍽️</span> Your Food Preferences
            </label>
            {!isEditingPrefs && foodPreference && foodMode && (
              <button
                onClick={() => setIsEditingPrefs(true)}
                className="text-xs px-3 py-1 bg-orange-500 rounded-lg hover:bg-orange-600 transition"
              >
                Edit
              </button>
            )}
          </div>

          {isEditingPrefs || !foodPreference || !foodMode ? (
            <div className="space-y-4">
              {/* Food Type */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-300">
                  Food Type
                </label>
                <select
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                  className="w-full p-4 bg-black bg-opacity-50 border border-orange-500 border-opacity-30 rounded-xl focus:outline-none focus:border-orange-500 text-lg font-medium"
                >
                  <option value="">Select...</option>
                  <option value="Veg">🥗 Veg</option>
                  <option value="Non-Veg">🍗 Non-Veg</option>
                  <option value="Both">🍽️ Both</option>
                </select>
              </div>

              {/* Food Mode */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-300">
                  Mode
                </label>
                <select
                  value={foodMode}
                  onChange={(e) => setFoodMode(e.target.value)}
                  className="w-full p-4 bg-black bg-opacity-50 border border-orange-500 border-opacity-30 rounded-xl focus:outline-none focus:border-orange-500 text-lg font-medium"
                >
                  <option value="">Select...</option>
                  <option value="Restaurant">🟢 Going to Restaurant</option>
                  <option value="Online">🔵 Ordering Online</option>
                  <option value="Both">🟣 Both</option>
                </select>
              </div>

              {/* Optional Cuisine */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-300">
                  Preferred Cuisine (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Italian, Chinese, Indian..."
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full p-4 bg-black bg-opacity-50 border border-orange-500 border-opacity-30 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-2 justify-end">
                {foodPreference && foodMode && (
                  <button
                    onClick={() => setIsEditingPrefs(false)}
                    className="text-xs px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSavePreferences}
                  className="text-xs px-4 py-1 bg-green-500 rounded-lg hover:bg-green-600 transition font-semibold"
                  disabled={!foodPreference || !foodMode}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-4 bg-orange-500 bg-opacity-10 rounded-lg border-l-2 border-orange-500">
                <p className="text-sm text-gray-400">Food Type</p>
                <p className="text-xl font-semibold text-orange-300">
                  {foodPreference === "Veg" && "🥗 Veg"}
                  {foodPreference === "Non-Veg" && "🍗 Non-Veg"}
                  {foodPreference === "Both" && "🍽️ Both"}
                </p>
              </div>
              <div className="p-4 bg-orange-500 bg-opacity-10 rounded-lg border-l-2 border-orange-500">
                <p className="text-sm text-gray-400">Mode</p>
                <p className="text-xl font-semibold text-orange-300">
                  {getModeIcon(foodMode)} {foodMode}
                </p>
              </div>
              {cuisine && (
                <div className="p-4 bg-orange-500 bg-opacity-10 rounded-lg border-l-2 border-orange-500">
                  <p className="text-sm text-gray-400">Cuisine</p>
                  <p className="text-xl font-semibold text-orange-300">
                    {cuisine}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment Box - Same as Tea Buddy */}
        <div className="mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-0.5">
          <div className="bg-black rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <span>✨</span> Additional Info
              </label>
              {!isEditingComment && comment && (
                <button
                  onClick={() => {
                    setTempComment(comment);
                    setIsEditingComment(true);
                  }}
                  className="text-xs px-3 py-1 bg-orange-500 rounded-lg hover:bg-orange-600 transition"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingComment || !comment ? (
              <>
                <textarea
                  value={tempComment}
                  onChange={(e) => setTempComment(e.target.value)}
                  maxLength={150}
                  placeholder="e.g., 'Craving pizza!' or 'Looking for lunch partner near MG Road'"
                  rows="3"
                  className="w-full p-4 bg-white bg-opacity-5 border border-orange-500 border-opacity-30 rounded-xl focus:outline-none focus:border-orange-500 resize-none placeholder-gray-500"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-400">
                    {tempComment.length}/150 • Auto-deletes after 1 hour
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setTempComment(comment);
                        setIsEditingComment(false);
                      }}
                      className="text-xs px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveComment}
                      className="text-xs px-4 py-1 bg-green-500 rounded-lg hover:bg-green-600 transition font-semibold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 bg-orange-500 bg-opacity-10 rounded-lg border-l-2 border-orange-500">
                <p className="text-gray-200 italic">"{comment}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Find Button */}
        <button
          onClick={handleFindFoodBuddies}
          disabled={finding || !foodPreference || !foodMode}
          className="w-full group relative px-8 py-5 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-8"
        >
          {finding ? (
            <span className="flex items-center justify-center gap-3">
              <span className="animate-spin">🔄</span> Scanning nearby...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              🔍 Find Food Buddies Within 1KM
            </span>
          )}
        </button>

        {/* Results */}
        {(matchedUsers.length > 0 || otherUsers.length > 0) && (
          <div>
            {/* Matched Users */}
            {matchedUsers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">🎯</span>
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Perfect Match ({matchedUsers.length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {matchedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-0.5 hover:scale-102 transition-transform"
                    >
                      <div className="bg-black rounded-2xl p-5">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="font-bold text-2xl mb-1">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-400 mb-1">
                              <span className="text-purple-300">
                                {user.profession}
                              </span>
                              {user.professionDetails && (
                                <span className="text-gray-500">
                                  {" "}
                                  • {user.professionDetails}
                                </span>
                              )}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="text-xs px-2 py-1 bg-green-500 bg-opacity-20 border border-green-500 rounded-full">
                                {user.foodPreference === "Veg" && "🥗 Veg"}
                                {user.foodPreference === "Non-Veg" &&
                                  "🍗 Non-Veg"}
                                {user.foodPreference === "Both" && "🍽️ Both"}
                              </span>
                              <span className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full">
                                {getModeIcon(user.foodMode)} {user.foodMode}
                              </span>
                              {user.cuisine && (
                                <span className="text-xs px-2 py-1 bg-purple-500 bg-opacity-20 border border-purple-500 rounded-full">
                                  🍴 {user.cuisine}
                                </span>
                              )}
                            </div>
                            {user.interests && user.interests.length > 0 && (
                              <p className="text-sm text-blue-400">
                                💬 {user.interests.join(", ")}
                              </p>
                            )}
                            {user.availabilityComment && (
                              <div className="mt-3 p-3 bg-green-500 bg-opacity-10 rounded-lg border-l-2 border-green-500">
                                <p className="text-sm text-gray-200 italic">
                                  "{user.availabilityComment}"
                                </p>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleSelectBuddy(user)}
                            disabled={isRequestSent(user._id)}
                            className={`px-6 py-3 font-bold rounded-xl hover:shadow-lg transition whitespace-nowrap ${
                              isRequestSent(user._id)
                                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-green-500/50"
                            }`}
                          >
                            {isRequestSent(user._id)
                              ? "Request Sent ✓"
                              : "Send Request ✉️"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Users */}
            {otherUsers.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-400">
                  Other Food Buddies ({otherUsers.length})
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
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-orange-500 bg-opacity-20 border border-orange-500 rounded-full">
                              {user.foodPreference}
                            </span>
                            <span className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full">
                              {getModeIcon(user.foodMode)} {user.foodMode}
                            </span>
                          </div>
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
                          disabled={isRequestSent(user._id)}
                          className={`px-6 py-2 rounded-lg transition whitespace-nowrap ml-4 font-semibold ${
                            isRequestSent(user._id)
                              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                              : "bg-orange-500 text-white hover:bg-orange-600"
                          }`}
                        >
                          {isRequestSent(user._id)
                            ? "Request Sent ✓"
                            : "Send Request ✉️"}
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
                No food buddies available nearby right now.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Try changing your preferences or check back later!
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
