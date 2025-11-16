import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [rating, setRating] = useState({ averageRating: 0, totalCount: 0 });

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      // User is logged in, redirect to dashboard
      navigate("/dashboard");
    }

    // Fetch rating
    fetchRating();
  }, [navigate]);

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
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 text-center max-w-3xl">
        {/* Greeting */}
        <p className="text-xl mb-2 text-purple-300 animate-fade-in">
          {getGreeting()} ☀️
        </p>

        {/* Main heading with gradient */}
        <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            Welcome to TeaChat
          </span>
          <span className="block text-5xl md:text-6xl mt-2">☕✨</span>
        </h1>

        {/* Subtitle with typing effect style */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Connect with{" "}
          <span className="text-purple-400 font-bold">real people</span> nearby.
          <br />
          Grab a tea. Have a{" "}
          <span className="text-pink-400 font-bold">real conversation</span>. No
          cap. 🔥
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="px-4 py-2 bg-purple-500 bg-opacity-20 border border-purple-500 rounded-full text-sm backdrop-blur-sm">
            📍 1KM Radius
          </div>
          <div className="px-4 py-2 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full text-sm backdrop-blur-sm">
            💬 Real-time Chat
          </div>
          <div className="px-4 py-2 bg-pink-500 bg-opacity-20 border border-pink-500 rounded-full text-sm backdrop-blur-sm">
            🔒 Privacy First
          </div>
          <div className="px-4 py-2 bg-green-500 bg-opacity-20 border border-green-500 rounded-full text-sm backdrop-blur-sm">
            ⏰ Auto-delete
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
          Join people who prefer real conversations over endless scrolling 🌟
        </p>
      </div>

      {/* Custom CSS for animations */}
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
      `}</style>
    </div>
  );
}
