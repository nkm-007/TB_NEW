// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// export default function Home() {
//   const navigate = useNavigate();
//   const [rating, setRating] = useState({ averageRating: 0, totalCount: 0 });

//   useEffect(() => {
//     // Check if user is already logged in
//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("user");

//     if (token && user) {
//       // User is logged in, redirect to dashboard
//       navigate("/dashboard");
//     }

//     // Fetch rating
//     fetchRating();
//   }, [navigate]);

//   const fetchRating = async () => {
//     try {
//       const { data } = await API.get("/feedback/average");
//       setRating(data);
//     } catch (err) {
//       console.error("Failed to fetch rating:", err);
//     }
//   };

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good Morning";
//     if (hour < 17) return "Good Afternoon";
//     if (hour < 21) return "Good Evening";
//     return "Night Owl";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
//       <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
//       <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

//       <div className="relative z-10 text-center max-w-3xl">
//         {/* Greeting */}
//         <p className="text-xl mb-2 text-purple-300 animate-fade-in">
//           {getGreeting()} ☀️
//         </p>

//         {/* Main heading with gradient */}
//         <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
//           <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
//             Welcome to teaG
//           </span>
//           <span className="block text-5xl md:text-6xl mt-2">☕✨</span>
//         </h1>

//         {/* Subtitle with typing effect style */}
//         <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
//           Connect with{" "}
//           <span className="text-purple-400 font-bold">real people</span> nearby.
//           <br />
//           Grab a tea. Spark a{" "}
//           <span className="text-pink-400 font-bold">convo</span>.
//         </p>

//         {/* Feature pills */}
//         <div className="flex flex-wrap justify-center gap-3 mb-10">
//           <div className="px-4 py-2 bg-purple-500 bg-opacity-20 border border-purple-500 rounded-full text-sm backdrop-blur-sm">
//             📍 1KM Radius
//           </div>
//           <div className="px-4 py-2 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full text-sm backdrop-blur-sm">
//             💬 Real-time Chat
//           </div>
//           {/* <div className="px-4 py-2 bg-pink-500 bg-opacity-20 border border-pink-500 rounded-full text-sm backdrop-blur-sm">
//             🔒 Privacy First
//           </div> */}
//           <div className="px-4 py-2 bg-green-500 bg-opacity-20 border border-green-500 rounded-full text-sm backdrop-blur-sm">
//             ⏰ Auto-delete
//           </div>
//         </div>

//         {/* CTA Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <button
//             onClick={() => navigate("/signup")}
//             className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
//           >
//             <span className="relative z-10">Get Started 🚀</span>
//             <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
//           </button>

//           <button
//             onClick={() => navigate("/login")}
//             className="px-8 py-4 bg-white bg-opacity-10 backdrop-blur-md border-2 border-white border-opacity-30 rounded-full font-bold text-lg hover:bg-opacity-20 transform hover:scale-105 transition-all duration-200"
//           >
//             Login 👋
//           </button>
//         </div>

//         {/* Stats section */}
//         <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
//           <div className="text-center">
//             <p className="text-3xl font-bold text-purple-400">1KM</p>
//             <p className="text-sm text-gray-400">Nearby Radius</p>
//           </div>
//           <div className="text-center">
//             <p className="text-3xl font-bold text-pink-400">1hr</p>
//             <p className="text-sm text-gray-400">Auto Delete</p>
//           </div>
//           <div className="text-center">
//             <p className="text-3xl font-bold text-blue-400 flex items-center justify-center gap-1">
//               {rating.totalCount > 0 ? (
//                 <>
//                   <span>⭐</span>
//                   <span>{rating.averageRating}/5</span>
//                 </>
//               ) : (
//                 "100%"
//               )}
//             </p>
//             <p className="text-sm text-gray-400">
//               {rating.totalCount > 0
//                 ? `${rating.totalCount} ratings`
//                 : "Free & Safe"}
//             </p>
//           </div>
//         </div>

//         {/* Social proof */}
//         <p className="mt-12 text-gray-500 text-sm">
//           Made for people who sip & speak. 🌟
//         </p>
//       </div>

//       {/* Custom CSS for animations */}
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

//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }

//         @keyframes gradient {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }

//         .animate-gradient {
//           background-size: 200% 200%;
//           animation: gradient 3s ease infinite;
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
import API from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [rating, setRating] = useState({ averageRating: 0, totalCount: 0 });
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      navigate("/dashboard");
    }

    fetchRating();
    checkNotificationSupport();
  }, [navigate]);

  const checkNotificationSupport = () => {
    // Check if browser supports notifications
    if ("Notification" in window) {
      // Show banner if permission is default (not asked yet)
      if (Notification.permission === "default") {
        setShowNotificationBanner(true);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        setShowNotificationBanner(false);

        if (permission === "granted") {
          // Show a test notification
          new Notification("TeaG Notifications Enabled! 🎉", {
            body: "You'll now receive notifications for friend requests and messages.",
            icon: "/logo192.png", // Make sure you have this icon
            badge: "/logo192.png",
            tag: "teag-welcome",
            requireInteraction: false,
          });
        } else if (permission === "denied") {
          alert(
            "Notifications blocked. To enable, go to your browser settings and allow notifications for this site."
          );
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    } else {
      alert(
        "Your browser doesn't support notifications. Please use Chrome, Firefox, or Edge."
      );
    }
  };

  const fetchRating = async () => {
    try {
      const { data } = await API.get("/feedback/average");
      setRating(data);
    } catch (err) {
      console.error("Failed to fetch rating:", err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Night Owl";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Notification Permission Banner */}
      {showNotificationBanner && (
        <div className="fixed top-20 left-0 right-0 z-50 mx-4 md:mx-auto md:max-w-2xl">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 shadow-2xl border border-purple-400 animate-slide-down">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🔔</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Enable Notifications</h3>
                <p className="text-sm text-gray-100 mb-3">
                  Stay updated with friend requests and messages. We recommend
                  using <strong>Chrome browser</strong> for the best experience.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={requestNotificationPermission}
                    className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition text-sm"
                  >
                    Enable Notifications
                  </button>
                  <button
                    onClick={() => setShowNotificationBanner(false)}
                    className="px-4 py-2 bg-black bg-opacity-30 rounded-lg hover:bg-opacity-50 transition text-sm"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationBanner(false)}
                className="text-2xl hover:text-gray-200 transition"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated background */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 text-center max-w-3xl">
        {/* Greeting */}
        <p className="text-xl mb-2 text-purple-300 animate-fade-in">
          {getGreeting()} ☀️
        </p>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            Welcome to teaG
          </span>
          <span className="block text-5xl md:text-6xl mt-2">☕✨</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Connect with{" "}
          <span className="text-purple-400 font-bold">real people</span> nearby.
          <br />
          Grab a tea. Spark a{" "}
          <span className="text-pink-400 font-bold">convo</span>.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="px-4 py-2 bg-purple-500 bg-opacity-20 border border-purple-500 rounded-full text-sm backdrop-blur-sm">
            📍 1KM Radius
          </div>
          <div className="px-4 py-2 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full text-sm backdrop-blur-sm">
            💬 Real-time Chat
          </div>
          <div className="px-4 py-2 bg-green-500 bg-opacity-20 border border-green-500 rounded-full text-sm backdrop-blur-sm">
            ⏰ Auto-delete
          </div>
          <div className="px-4 py-2 bg-pink-500 bg-opacity-20 border border-pink-500 rounded-full text-sm backdrop-blur-sm">
            🔔 Instant Notifications
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/signup")}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="relative z-10">Get Started 🚀</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-white bg-opacity-10 backdrop-blur-md border-2 border-white border-opacity-30 rounded-full font-bold text-lg hover:bg-opacity-20 transform hover:scale-105 transition-all duration-200"
          >
            Login 👋
          </button>
        </div>

        {/* Browser Recommendation */}
        {notificationPermission === "default" && (
          <div className="mt-6 p-3 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-xl">
            <p className="text-sm text-blue-200">
              💡 <strong>Best Experience:</strong> Use Chrome browser for
              notifications
            </p>
          </div>
        )}

        {/* Stats section */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">1KM</p>
            <p className="text-sm text-gray-400">Nearby Radius</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-pink-400">1hr</p>
            <p className="text-sm text-gray-400">Auto Delete</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400 flex items-center justify-center gap-1">
              {rating.totalCount > 0 ? (
                <>
                  <span>⭐</span>
                  <span>{rating.averageRating}/5</span>
                </>
              ) : (
                "100%"
              )}
            </p>
            <p className="text-sm text-gray-400">
              {rating.totalCount > 0
                ? `${rating.totalCount} ratings`
                : "Free & Safe"}
            </p>
          </div>
        </div>

        {/* Social proof */}
        <p className="mt-12 text-gray-500 text-sm">
          Made for people who sip & speak. 🌟
        </p>
      </div>

      {/* Custom CSS */}
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
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        @keyframes slide-down {
          from { 
            opacity: 0; 
            transform: translateY(-100%); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
