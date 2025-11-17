// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   useNavigate,
//   useLocation,
// } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import ForgotPassword from "./pages/ForgotPassword";
// import Dashboard from "./pages/Dashboard";
// import FindBuddy from "./pages/FindBuddy";
// import Chat from "./pages/Chat";
// import ChatList from "./pages/ChatList";
// import API from "./services/api";
// import "./App.css";

// function Navbar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Check if user is actually logged in by verifying token AND user data
//   const checkAuthStatus = () => {
//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("user");

//     // Only consider logged in if BOTH token and user exist
//     const isAuth = !!(token && user);
//     setIsLoggedIn(isAuth);

//     // Fetch unread count if logged in
//     if (isAuth) {
//       fetchUnreadCount();
//     } else {
//       setUnreadCount(0);
//     }

//     return isAuth;
//   };

//   // Fetch unread message count
//   const fetchUnreadCount = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const { data } = await API.get("/chat/my-chats", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const total = (data.chatRooms || []).reduce(
//         (sum, room) => sum + (room.unreadCount || 0),
//         0
//       );
//       setUnreadCount(total);
//     } catch (err) {
//       console.error("Failed to fetch unread count:", err);
//       setUnreadCount(0);
//     }
//   };

//   // Check login status on mount and route change
//   useEffect(() => {
//     checkAuthStatus();
//   }, [location.pathname]);

//   // Periodically refresh unread count every 10 seconds when logged in
//   useEffect(() => {
//     if (!isLoggedIn) return;

//     const interval = setInterval(() => {
//       fetchUnreadCount();
//     }, 10000); // Every 10 seconds

//     return () => clearInterval(interval);
//   }, [isLoggedIn]);

//   // Listen for storage changes (login/logout events)
//   useEffect(() => {
//     const handleStorageChange = () => {
//       checkAuthStatus();
//     };

//     window.addEventListener("storage", handleStorageChange);
//     // Also listen for custom event we'll trigger on login/logout
//     window.addEventListener("auth-change", handleStorageChange);
//     // Listen for message updates
//     window.addEventListener("message-update", fetchUnreadCount);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       window.removeEventListener("auth-change", handleStorageChange);
//       window.removeEventListener("message-update", fetchUnreadCount);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//     setUnreadCount(0);

//     // Trigger auth change event
//     window.dispatchEvent(new Event("auth-change"));

//     navigate("/");
//   };

//   const handleLogoClick = () => {
//     if (isLoggedIn) {
//       navigate("/dashboard");
//     }
//     // If not logged in, don't do anything (stay on current page)
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-black text-white border-b border-gray-800 backdrop-blur-lg bg-opacity-95">
//       <h1
//         className={`text-xl font-semibold ${
//           isLoggedIn ? "cursor-pointer hover:text-purple-400 transition" : ""
//         }`}
//         onClick={handleLogoClick}
//       >
//         TeaBreak ☕
//       </h1>

//       <div className="flex space-x-4 text-sm sm:text-base items-center">
//         {isLoggedIn ? (
//           <>
//             <button
//               onClick={() => navigate("/chat-list")}
//               className="hover:underline px-3 py-1 border border-white rounded-md sm:px-4 relative hover:border-purple-400 hover:text-purple-400 transition"
//             >
//               Messages
//               {unreadCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
//                   {unreadCount > 99 ? "99+" : unreadCount}
//                 </span>
//               )}
//             </button>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-1 bg-white text-black rounded hover:bg-gray-200 transition"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <button
//               onClick={() => navigate("/login")}
//               className="hover:underline px-3 py-1 border border-white rounded-md sm:px-4 hover:border-purple-400 hover:text-purple-400 transition"
//             >
//               Login
//             </button>
//             <button
//               onClick={() => navigate("/signup")}
//               className="hover:underline px-3 py-1 border border-white rounded-md sm:px-4 hover:border-purple-400 hover:text-purple-400 transition"
//             >
//               Signup
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <div className="min-h-screen bg-black text-white flex flex-col pt-20">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/find-buddy" element={<FindBuddy />} />
//           <Route path="/chat/:roomId" element={<Chat />} />
//           <Route path="/chat-list" element={<ChatList />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }
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
import API from "./services/api";
import "./App.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on chat page
  const hiddenPaths = ["/chat/"];
  const shouldHideNavbar = hiddenPaths.some((path) =>
    location.pathname.includes(path)
  );

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    const isAuth = !!(token && user);
    setIsLoggedIn(isAuth);

    if (isAuth) {
      fetchUnreadCount();
    } else {
      setUnreadCount(0);
    }

    return isAuth;
  };

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await API.get("/chat/my-chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const total = (data.chatRooms || []).reduce(
        (sum, room) => sum + (room.unreadCount || 0),
        0
      );
      setUnreadCount(total);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleStorageChange);
    window.addEventListener("message-update", fetchUnreadCount);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
      window.removeEventListener("message-update", fetchUnreadCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUnreadCount(0);

    window.dispatchEvent(new Event("auth-change"));

    navigate("/");
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  };

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-black text-white border-b border-gray-800 backdrop-blur-lg bg-opacity-95">
      <h1
        className={`text-xl font-semibold ${
          isLoggedIn ? "cursor-pointer hover:text-purple-400 transition" : ""
        }`}
        onClick={handleLogoClick}
      >
        teaG ☕
      </h1>

      <div className="flex space-x-4 text-sm sm:text-base items-center">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/chat-list")}
              className="hover:underline px-3 py-1 border border-white rounded-md sm:px-4 relative hover:border-purple-400 hover:text-purple-400 transition"
            >
              Messages
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
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
              className="hover:underline px-3 py-1 border border-white rounded-md sm:px-4 hover:border-purple-400 hover:text-purple-400 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="hover:underline px-3 py-1 border border-white rounded-md sm:px-4 hover:border-purple-400 hover:text-purple-400 transition"
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
      <div className="min-h-screen bg-black text-white flex flex-col app-container">
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

      <style>{`
        .app-container {
          padding-top: 80px;
        }
        
        /* Remove padding on chat page */
        .app-container:has(+ div[class*="chat"]) {
          padding-top: 0;
        }
      `}</style>
    </BrowserRouter>
  );
}
