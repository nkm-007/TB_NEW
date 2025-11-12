import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import FindBuddy from "./pages/FindBuddy";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";
import "./App.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is actually logged in by verifying token AND user data
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // Only consider logged in if BOTH token and user exist
    const isAuth = !!(token && user);
    setIsLoggedIn(isAuth);
    return isAuth;
  };

  // Check login status on mount and route change
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  // Listen for storage changes (login/logout events)
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom event we'll trigger on login/logout
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUnreadCount(0);

    // Trigger auth change event
    window.dispatchEvent(new Event("auth-change"));

    navigate("/");
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
    // If not logged in, don't do anything (stay on current page)
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black text-white border-b border-gray-800">
      <h1
        className={`text-xl font-semibold ${
          isLoggedIn ? "cursor-pointer" : ""
        }`}
        onClick={handleLogoClick}
      >
        TeaBreak ☕
      </h1>

      <div className="flex space-x-4 text-sm sm:text-base items-center">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/chat-list")}
              className="hover:underline px-3 py-1 border border-white rounded-md sm:px-4 relative"
            >
              Messages
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-1 bg-white text-black rounded hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="hover:underline px-3 py-1 border border-white rounded-md sm:px-4"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="hover:underline px-3 py-1 border border-white rounded-md sm:px-4"
            >
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/find-buddy" element={<FindBuddy />} />
          <Route path="/chat/:roomId" element={<Chat />} />
          <Route path="/chat-list" element={<ChatList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
