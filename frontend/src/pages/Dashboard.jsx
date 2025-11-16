// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ProfilePopup from "../components/ProfilePopup";
// import API from "../services/api";

// export default function Dashboard() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [user, setUser] = useState(null);
//   const [availableForTea, setAvailableForTea] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     setUser(userData);

//     // Show profile popup for new users or incomplete profiles
//     if (userData?.isNewUser || !userData?.profileCompleted) {
//       setShowPopup(true);
//     }

//     setAvailableForTea(userData?.availableForTea || false);
//   }, []);

//   const handleProfileComplete = (updatedUser) => {
//     setShowPopup(false);
//     setUser(updatedUser);
//     localStorage.setItem("user", JSON.stringify(updatedUser));
//   };

//   const handleToggleAvailability = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please login again");
//       navigate("/login");
//       return;
//     }

//     setLoading(true);
//     try {
//       const { data } = await API.put(
//         "/profile/toggle-availability",
//         { availableForTea: !availableForTea },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setAvailableForTea(data.availableForTea);

//       const updatedUser = { ...user, availableForTea: data.availableForTea };
//       setUser(updatedUser);
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       alert(
//         data.availableForTea
//           ? "You're now available for tea! ☕"
//           : "You're now unavailable"
//       );
//     } catch (err) {
//       console.error("Toggle availability error:", err);
//       alert("Failed to update availability");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFindBuddy = () => {
//     if (!user?.profileCompleted) {
//       alert("Please complete your profile first");
//       setShowPopup(true);
//       return;
//     }
//     navigate("/find-buddy");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
//       <h2 className="text-3xl font-bold mb-4">Dashboard</h2>

//       {user && (
//         <div className="mb-6 text-center">
//           <p className="text-gray-400">Welcome, {user.name || user.phone}!</p>
//           {user.interest && (
//             <p className="text-sm text-gray-500">
//               Interested in: {user.interest}
//             </p>
//           )}
//         </div>
//       )}

//       {/* Availability Toggle */}
//       <div className="mb-8">
//         <label className="flex items-center space-x-3 cursor-pointer">
//           <span className="text-lg">Available for Tea Break?</span>
//           <div className="relative">
//             <input
//               type="checkbox"
//               checked={availableForTea}
//               onChange={handleToggleAvailability}
//               disabled={loading}
//               className="sr-only peer"
//             />
//             <div className="w-14 h-8 bg-gray-700 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
//             <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
//           </div>
//         </label>
//       </div>

//       {/* Find Buddy Button */}
//       <button
//         onClick={handleFindBuddy}
//         disabled={!user?.profileCompleted}
//         className="px-8 py-3 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
//       >
//         Find Tea Buddy ☕
//       </button>

//       {!user?.profileCompleted && (
//         <p className="text-sm text-red-400">
//           Complete your profile to find buddies
//         </p>
//       )}

//       {/* Profile Popup */}
//       {showPopup && (
//         <ProfilePopup
//           onClose={() => setShowPopup(false)}
//           onComplete={handleProfileComplete}
//         />
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "../components/ProfilePopup";
import FeedbackPopup from "../components/FeedbackPopup";
import API from "../services/api";

export default function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "What's up Night Owl";
  };

  const getMotivationalText = () => {
    const texts = [
      "Ready to vibe with someone new?",
      "Time for a tea break? ☕",
      "Let's find your next conversation!",
      "Who's down for a chat today?",
      "Connect. Converse. Chill. 🔥",
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Greeting Section */}
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-purple-300 text-lg mb-2">{getGreeting()}</p>
          {user && (
            <h2 className="text-4xl md:text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {user.name || "Hey there"}!
              </span>
            </h2>
          )}
          <p className="text-gray-400 text-lg">{getMotivationalText()}</p>
        </div>

        {/* Profile Card */}
        {user && user.profileCompleted && (
          <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl p-6 mb-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold">{user.name}</p>
                <p className="text-purple-300">{user.profession}</p>
                <p className="text-sm text-gray-400">
                  Interested in:{" "}
                  <span className="text-pink-400 font-semibold">
                    {user.interest}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setShowPopup(true)}
                className="px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition text-sm"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* Availability Toggle Card */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-1 mb-6 shadow-2xl">
          <div className="bg-black rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xl font-bold mb-1">
                  {availableForTea
                    ? "You're Available! 🔥"
                    : "Not Available Right Now"}
                </p>
                <p className="text-sm text-gray-400">
                  {availableForTea
                    ? "People nearby can see you're down for tea"
                    : "Toggle on when you're ready to meet someone"}
                </p>
              </div>
              <button
                onClick={handleToggleAvailability}
                disabled={loading}
                className="ml-4 relative"
              >
                <div
                  className={`w-16 h-8 rounded-full transition-all duration-300 ${
                    availableForTea
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                      availableForTea ? "transform translate-x-8" : ""
                    }`}
                  ></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Find Buddy Button */}
        <button
          onClick={handleFindBuddy}
          disabled={!user?.profileCompleted}
          className="w-full group relative px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-4"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            Find Tea Buddy ☕<span className="text-3xl">→</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>

        {!user?.profileCompleted && (
          <p className="text-center text-red-400 text-sm animate-pulse">
            Complete your profile to start finding buddies! ⬆️
          </p>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => navigate("/chat-list")}
            className="p-4 bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-xl hover:bg-opacity-10 transition text-center"
          >
            <p className="text-2xl mb-1">💬</p>
            <p className="font-semibold">My Chats</p>
          </button>
          <button
            onClick={() => setShowFeedbackPopup(true)}
            className="p-4 bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-xl hover:bg-opacity-10 transition text-center"
          >
            <p className="text-2xl mb-1">⭐</p>
            <p className="font-semibold">Feedback</p>
          </button>
        </div>

        {/* Info Card */}
        <div className="mt-6 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-xl">
          <p className="text-sm text-yellow-200">
            💡 <span className="font-semibold">Pro tip:</span> Chats auto-delete
            after 1 hour of inactivity for your privacy!
          </p>
        </div>
      </div>

      {/* Profile Popup */}
      {showPopup && (
        <ProfilePopup
          onClose={() => setShowPopup(false)}
          onComplete={handleProfileComplete}
        />
      )}

      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <FeedbackPopup onClose={() => setShowFeedbackPopup(false)} />
      )}

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 10px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
