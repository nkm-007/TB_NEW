import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login state from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
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
            <Link
              to="/login"
              className="hover:underline px-3 py-1 border border-white rounded-md sm:px-4"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:underline px-3 py-1 border border-white rounded-md sm:px-4"
            >
              Signup
            </Link>
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
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
