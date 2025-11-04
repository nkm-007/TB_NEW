import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import FindBuddy from "./pages/FindBuddy";
import Chat from "./pages/Chat";
import "./App.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black text-white border-b border-gray-800">
      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        TeaBreak ☕
      </h1>

      <div className="flex space-x-4 text-sm sm:text-base">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-white text-black rounded hover:bg-gray-200 transition"
          >
            Logout
          </button>
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}
