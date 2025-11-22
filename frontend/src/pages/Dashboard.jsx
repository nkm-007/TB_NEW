// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ProfilePopup from "../components/ProfilePopup";
// import FeedbackPopup from "../components/FeedbackPopup";
// import API from "../services/api";

// export default function Dashboard() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
//   const [user, setUser] = useState(null);
//   const [buddyMode, setBuddyMode] = useState("tea"); // "tea" or "food"
//   const [availableForTea, setAvailableForTea] = useState(false);
//   const [availableForFood, setAvailableForFood] = useState(false);
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
//     setAvailableForFood(userData?.availableForFood || false);
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
//       if (buddyMode === "tea") {
//         const { data } = await API.put(
//           "/profile/toggle-availability",
//           { availableForTea: !availableForTea },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setAvailableForTea(data.availableForTea);
//         const updatedUser = { ...user, availableForTea: data.availableForTea };
//         setUser(updatedUser);
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//       } else {
//         const { data } = await API.put(
//           "/profile/toggle-food-availability",
//           { availableForFood: !availableForFood },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setAvailableForFood(data.availableForFood);
//         const updatedUser = {
//           ...user,
//           availableForFood: data.availableForFood,
//         };
//         setUser(updatedUser);
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//       }
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

//     if (buddyMode === "tea") {
//       navigate("/find-buddy");
//     } else {
//       navigate("/find-foodbuddy");
//     }
//   };

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good Morning";
//     if (hour < 17) return "Good Afternoon";
//     if (hour < 21) return "Good Evening";
//     return "What's up Night Owl";
//   };

//   const getMotivationalText = () => {
//     if (buddyMode === "tea") {
//       const texts = [
//         "Ready to vibe with someone new?",
//         "Time for a tea break? ☕",
//         "Let's find your next conversation!",
//       ];
//       return texts[Math.floor(Math.random() * texts.length)];
//     } else {
//       const texts = [
//         "Hungry? Find someone to share a meal! 🍽️",
//         "Split the bill, double the fun!",
//         "Let's make dining affordable together!",
//       ];
//       return texts[Math.floor(Math.random() * texts.length)];
//     }
//   };

//   const isAvailable = buddyMode === "tea" ? availableForTea : availableForFood;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white p-4 relative overflow-hidden">
//       {/* Animated background */}
//       <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
//       <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

//       <div className="relative z-10 max-w-2xl w-full">
//         {/* Mode Toggle */}
//         <div className="mb-8 flex justify-center">
//           <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-full p-2 flex gap-2">
//             <button
//               onClick={() => setBuddyMode("tea")}
//               className={`px-6 py-3 rounded-full font-bold transition-all ${
//                 buddyMode === "tea"
//                   ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
//                   : "text-gray-400 hover:text-white"
//               }`}
//             >
//               ☕ Tea Buddy
//             </button>
//             <button
//               onClick={() => setBuddyMode("food")}
//               className={`px-6 py-3 rounded-full font-bold transition-all ${
//                 buddyMode === "food"
//                   ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
//                   : "text-gray-400 hover:text-white"
//               }`}
//             >
//               🍽️ Food Buddy
//             </button>
//           </div>
//         </div>

//         {/* Greeting Section */}
//         <div className="text-center mb-8 animate-fade-in">
//           <p className="text-purple-300 text-lg mb-2">{getGreeting()}</p>
//           {user && (
//             <h2 className="text-4xl md:text-5xl font-black mb-2">
//               <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//                 {user.name || "Hey there"}!
//               </span>
//             </h2>
//           )}
//           <p className="text-gray-400 text-lg">{getMotivationalText()}</p>
//         </div>

//         {/* Profile Card */}
//         {user && user.profileCompleted && (
//           <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl p-6 mb-6 shadow-2xl">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <p className="text-2xl font-bold">{user.name}</p>
//                 <p className="text-purple-300">{user.profession}</p>
//                 {user.professionDetails && (
//                   <p className="text-sm text-gray-400">
//                     {user.professionDetails}
//                   </p>
//                 )}
//               </div>
//               <button
//                 onClick={() => setShowPopup(true)}
//                 className="px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition text-sm"
//               >
//                 Edit Profile
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Availability Toggle Card */}
//         <div
//           className={`rounded-2xl p-1 mb-6 shadow-2xl ${
//             buddyMode === "tea"
//               ? "bg-gradient-to-r from-purple-500 to-pink-500"
//               : "bg-gradient-to-r from-orange-500 to-red-500"
//           }`}
//         >
//           <div className="bg-black rounded-2xl p-6">
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//                 <p className="text-xl font-bold mb-1">
//                   {isAvailable
//                     ? `You're Available for ${
//                         buddyMode === "tea" ? "Tea" : "Food"
//                       }! 🔥`
//                     : "Not Available Right Now"}
//                 </p>
//                 <p className="text-sm text-gray-400">
//                   {isAvailable
//                     ? `People nearby can see you're down for ${
//                         buddyMode === "tea" ? "tea" : "food"
//                       }`
//                     : `Toggle on when you're ready to meet someone for ${
//                         buddyMode === "tea" ? "tea" : "food"
//                       }`}
//                 </p>
//               </div>
//               <button
//                 onClick={handleToggleAvailability}
//                 disabled={loading}
//                 className="ml-4 relative"
//               >
//                 <div
//                   className={`w-16 h-8 rounded-full transition-all duration-300 ${
//                     isAvailable
//                       ? "bg-gradient-to-r from-green-400 to-emerald-500"
//                       : "bg-gray-700"
//                   }`}
//                 >
//                   <div
//                     className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
//                       isAvailable ? "transform translate-x-8" : ""
//                     }`}
//                   ></div>
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Find Buddy Button */}
//         <button
//           onClick={handleFindBuddy}
//           disabled={!user?.profileCompleted}
//           className={`w-full group relative px-8 py-6 rounded-2xl font-bold text-2xl shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-4 ${
//             buddyMode === "tea"
//               ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/50"
//               : "bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-orange-500/50"
//           }`}
//         >
//           <span className="relative z-10 flex items-center justify-center gap-3">
//             {buddyMode === "tea" ? "Find Tea Buddy ☕" : "Find Food Buddy 🍽️"}
//             <span className="text-3xl">→</span>
//           </span>
//         </button>

//         {!user?.profileCompleted && (
//           <p className="text-center text-red-400 text-sm animate-pulse">
//             Complete your profile to start finding buddies! ⬆️
//           </p>
//         )}

//         {/* Quick Actions */}
//         <div className="grid grid-cols-2 gap-4 mt-6">
//           <button
//             onClick={() => navigate("/chat-list")}
//             className="p-4 bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-xl hover:bg-opacity-10 transition text-center"
//           >
//             <p className="text-2xl mb-1">💬</p>
//             <p className="font-semibold">My Chats</p>
//           </button>
//           <button
//             onClick={() => setShowFeedbackPopup(true)}
//             className="p-4 bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-xl hover:bg-opacity-10 transition text-center"
//           >
//             <p className="text-2xl mb-1">⭐</p>
//             <p className="font-semibold">Feedback</p>
//           </button>
//         </div>

//         {/* Info Card */}
//         <div className="mt-6 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-xl">
//           <p className="text-sm text-yellow-200">
//             💡 <span className="font-semibold">Pro tip:</span> Chats auto-delete
//             after 1 hour of inactivity for your privacy!
//           </p>
//         </div>
//       </div>

//       {/* Profile Popup */}
//       {showPopup && (
//         <ProfilePopup
//           onClose={() => setShowPopup(false)}
//           onComplete={handleProfileComplete}
//         />
//       )}

//       {/* Feedback Popup */}
//       {showFeedbackPopup && (
//         <FeedbackPopup onClose={() => setShowFeedbackPopup(false)} />
//       )}

//       <style>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           25% { transform: translate(20px, -50px) scale(1.1); }
//           50% { transform: translate(-20px, 20px) scale(0.9); }
//           75% { transform: translate(20px, 10px) scale(1.05); }
//         }

//         .animate-blob {
//           animation: blob 7s infinite;
//         }

//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }

//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.6s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "../components/ProfilePopup";
import FeedbackPopup from "../components/FeedbackPopup";
import API from "../services/api";

// NEW THEME COLORS
const THEMES = {
  tea: {
    primary: "from-teal-600 to-cyan-600",
    secondary: "from-teal-400 to-cyan-400",
    bg: "from-teal-900 via-black to-cyan-900",
    text: "text-teal-300",
    border: "border-teal-500",
    hover: "hover:shadow-teal-500/50",
    blob1: "bg-teal-500",
    blob2: "bg-cyan-500",
    icon: "☕",
    name: "Tea Buddy",
  },
  food: {
    primary: "from-amber-600 to-orange-600",
    secondary: "from-amber-400 to-orange-400",
    bg: "from-amber-900 via-black to-orange-900",
    text: "text-amber-300",
    border: "border-amber-500",
    hover: "hover:shadow-amber-500/50",
    blob1: "bg-amber-500",
    blob2: "bg-orange-500",
    icon: "🍽️",
    name: "Food Buddy",
  },
};

export default function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [buddyMode, setBuddyMode] = useState("tea");
  const [availableForTea, setAvailableForTea] = useState(false);
  const [availableForFood, setAvailableForFood] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const theme = THEMES[buddyMode];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    if (userData?.isNewUser || !userData?.profileCompleted) {
      setShowPopup(true);
    }

    setAvailableForTea(userData?.availableForTea || false);
    setAvailableForFood(userData?.availableForFood || false);
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
      if (buddyMode === "tea") {
        const { data } = await API.put(
          "/profile/toggle-availability",
          { availableForTea: !availableForTea },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAvailableForTea(data.availableForTea);
        const updatedUser = { ...user, availableForTea: data.availableForTea };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        const { data } = await API.put(
          "/profile/toggle-food-availability",
          { availableForFood: !availableForFood },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAvailableForFood(data.availableForFood);
        const updatedUser = {
          ...user,
          availableForFood: data.availableForFood,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
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

    if (buddyMode === "tea") {
      navigate("/find-buddy");
    } else {
      navigate("/find-foodbuddy");
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Night Owl Vibes";
  };

  const getMotivationalText = () => {
    if (buddyMode === "tea") {
      return "Time for meaningful connections ☕";
    }
    return "Let's share a meal, split the bill! 🍽️";
  };

  const isAvailable = buddyMode === "tea" ? availableForTea : availableForFood;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${theme.bg} text-white p-4 relative overflow-hidden`}
    >
      {/* Animated background with theme colors */}
      <div
        className={`absolute top-20 left-10 w-64 h-64 ${theme.blob1} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob`}
      ></div>
      <div
        className={`absolute bottom-20 right-10 w-64 h-64 ${theme.blob2} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000`}
      ></div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Mode Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-full p-2 flex gap-2">
            <button
              onClick={() => setBuddyMode("tea")}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                buddyMode === "tea"
                  ? `bg-gradient-to-r ${THEMES.tea.primary} text-white shadow-lg`
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {THEMES.tea.icon} {THEMES.tea.name}
            </button>
            <button
              onClick={() => setBuddyMode("food")}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                buddyMode === "food"
                  ? `bg-gradient-to-r ${THEMES.food.primary} text-white shadow-lg`
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {THEMES.food.icon} {THEMES.food.name}
            </button>
          </div>
        </div>

        {/* Greeting Section */}
        <div className="text-center mb-8 animate-fade-in">
          <p className={`${theme.text} text-lg mb-2`}>{getGreeting()}</p>
          {user && (
            <h2 className="text-4xl md:text-5xl font-black mb-2">
              <span
                className={`bg-gradient-to-r ${theme.secondary} bg-clip-text text-transparent`}
              >
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
                <p className={theme.text}>{user.profession}</p>
                {user.professionDetails && (
                  <p className="text-sm text-gray-400">
                    {user.professionDetails}
                  </p>
                )}
                {user.interests && user.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.interests.map((interest) => (
                      <span
                        key={interest}
                        className={`text-xs px-2 py-1 ${theme.border} border rounded-full ${theme.text}`}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
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
        <div
          className={`rounded-2xl p-1 mb-6 shadow-2xl bg-gradient-to-r ${theme.primary}`}
        >
          <div className="bg-black rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xl font-bold mb-1">
                  {isAvailable
                    ? `You're Available for ${theme.name}! 🔥`
                    : "Not Available Right Now"}
                </p>
                <p className="text-sm text-gray-400">
                  {isAvailable
                    ? `People nearby can see you're down for ${
                        buddyMode === "tea" ? "tea" : "food"
                      }`
                    : `Toggle on when you're ready to meet someone for ${
                        buddyMode === "tea" ? "tea" : "food"
                      }`}
                </p>
              </div>
              <button
                onClick={handleToggleAvailability}
                disabled={loading}
                className="ml-4 relative"
              >
                <div
                  className={`w-16 h-8 rounded-full transition-all duration-300 ${
                    isAvailable
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-2 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                      isAvailable ? "transform translate-x-8" : ""
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
          className={`w-full group relative px-8 py-6 bg-gradient-to-r ${theme.primary} rounded-2xl font-bold text-2xl shadow-2xl ${theme.hover} transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-4`}
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            Find {theme.name} {theme.icon}
            <span className="text-3xl">→</span>
          </span>
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
        <div
          className={`mt-6 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-xl`}
        >
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
