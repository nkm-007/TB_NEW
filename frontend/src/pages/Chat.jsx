// import { useState, useEffect, useRef } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import socketService from "../services/socket";
// import LiveLocationMap from "../components/LiveLocationMap";

// // THEME CONFIGURATION
// const CHAT_THEMES = {
//   tea: {
//     gradient: "from-teal-900 via-black to-cyan-900",
//     primary: "from-teal-600 to-cyan-600",
//     secondary: "from-teal-400 to-cyan-400",
//     border: "border-teal-500",
//     bgOpacity: "bg-teal-500",
//     text: "text-teal-300",
//     hover: "hover:bg-teal-700",
//     messageGradient: "from-teal-600 to-cyan-600",
//     icon: "☕",
//     label: "Tea Buddy",
//   },
//   food: {
//     gradient: "from-amber-900 via-black to-orange-900",
//     primary: "from-amber-600 to-orange-600",
//     secondary: "from-amber-400 to-orange-400",
//     border: "border-amber-500",
//     bgOpacity: "bg-amber-500",
//     text: "text-amber-300",
//     hover: "hover:bg-amber-700",
//     messageGradient: "from-amber-600 to-orange-600",
//     icon: "🍽️",
//     label: "Food Buddy",
//   },
// };

// export default function Chat() {
//   const { roomId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const buddy = location.state?.buddy;
//   const buddyType = location.state?.buddyType || "tea";

//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [showQuickReplies, setShowQuickReplies] = useState(true);
//   const [sharingLocation, setSharingLocation] = useState(false);
//   const [buddyLocation, setBuddyLocation] = useState(null);
//   const [showLiveMap, setShowLiveMap] = useState(false);
//   const messagesEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);
//   const locationIntervalRef = useRef(null);

//   // Get theme based on buddy type
//   const theme = CHAT_THEMES[buddyType] || CHAT_THEMES.tea;

//   const quickReplies =
//     buddyType === "tea"
//       ? ["Hi! 👋", "Let's catch up! ☕", "When are you free? 🕐"]
//       : ["Hey! 🍽️", "Let's grab food! 🍕", "Where should we meet? 📍"];

//   useEffect(() => {
//     if (!buddy) {
//       alert("Invalid chat session");
//       navigate("/dashboard");
//       return;
//     }

//     const user = JSON.parse(localStorage.getItem("user"));
//     const token = localStorage.getItem("token");

//     if (!user || !token) {
//       navigate("/login");
//       return;
//     }

//     setCurrentUser(user);

//     socketService.connect(token);
//     socketService.joinRoom(roomId);

//     socketService.onPreviousMessages((msgs) => {
//       setMessages(msgs);
//       if (msgs.length > 0) {
//         setShowQuickReplies(false);
//       }

//       const token = localStorage.getItem("token");
//       import("../services/api").then(({ default: API }) => {
//         API.post(
//           "/chat/mark-read",
//           { roomId },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )
//           .then(() => {
//             window.dispatchEvent(new Event("message-update"));
//           })
//           .catch(console.error);
//       });
//     });

//     socketService.onReceiveMessage((msg) => {
//       setMessages((prev) => [...prev, msg]);
//       setShowQuickReplies(false);
//       window.dispatchEvent(new Event("message-update"));
//     });

//     socketService.onUserTyping(() => {
//       setIsTyping(true);
//     });

//     socketService.onUserStopTyping(() => {
//       setIsTyping(false);
//     });

//     socketService.socket?.on("location-update", (data) => {
//       if (data.userId === buddy._id) {
//         setBuddyLocation(data.location);
//       }
//     });

//     return () => {
//       if (locationIntervalRef.current) {
//         clearInterval(locationIntervalRef.current);
//       }
//       socketService.disconnect();
//     };
//   }, [roomId, buddy, navigate]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = (text = newMessage) => {
//     if (!text.trim()) return;

//     socketService.sendMessage(roomId, buddy._id, text);
//     setNewMessage("");
//     setShowQuickReplies(false);
//     socketService.emitStopTyping(roomId);
//   };

//   const handleQuickReply = (text) => {
//     socketService.sendMessage(roomId, buddy._id, text);
//     setShowQuickReplies(false);
//   };

//   const handleTyping = (e) => {
//     setNewMessage(e.target.value);
//     socketService.emitTyping(roomId);

//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     typingTimeoutRef.current = setTimeout(() => {
//       socketService.emitStopTyping(roomId);
//     }, 1000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const toggleLocationSharing = () => {
//     if (!sharingLocation) {
//       if (!navigator.geolocation) {
//         alert("Geolocation not supported by your browser");
//         return;
//       }

//       setSharingLocation(true);

//       const shareLocation = () => {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const location = {
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             };
//             socketService.socket?.emit("share-location", {
//               roomId,
//               userId: currentUser.id,
//               location,
//             });
//           },
//           (error) => {
//             console.error("Location error:", error);
//             setSharingLocation(false);
//             if (locationIntervalRef.current) {
//               clearInterval(locationIntervalRef.current);
//             }
//           }
//         );
//       };

//       shareLocation();
//       locationIntervalRef.current = setInterval(shareLocation, 10000);
//     } else {
//       setSharingLocation(false);
//       if (locationIntervalRef.current) {
//         clearInterval(locationIntervalRef.current);
//       }
//       socketService.socket?.emit("stop-location", {
//         roomId,
//         userId: currentUser.id,
//       });
//     }
//   };

//   const openBuddyLocation = () => {
//     if (buddyLocation) {
//       setShowLiveMap(true);
//     } else {
//       alert("Buddy hasn't shared their location yet");
//     }
//   };

//   return (
//     <div
//       className={`fixed inset-0 flex flex-col bg-gradient-to-br ${theme.gradient} text-white`}
//     >
//       {/* Header - Fixed with Theme */}
//       <div
//         className={`flex-shrink-0 bg-black bg-opacity-50 backdrop-blur-lg p-3 border-b ${theme.border} border-opacity-30`}
//       >
//         <div className="flex items-center justify-between gap-2">
//           <div className="flex items-center gap-2 min-w-0 flex-1">
//             <button
//               onClick={() => navigate("/chat-list")}
//               className={`text-xl ${theme.text} hover:text-white transition flex-shrink-0`}
//             >
//               ←
//             </button>
//             <div className="flex items-center gap-2 min-w-0 flex-1">
//               <div
//                 className={`w-10 h-10 bg-gradient-to-br ${theme.primary} rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}
//               >
//                 {buddy?.name?.charAt(0).toUpperCase()}
//               </div>
//               <div className="min-w-0 flex-1">
//                 <h2 className="font-bold text-sm truncate">{buddy?.name}</h2>
//                 <p className={`text-xs ${theme.text} truncate`}>
//                   {buddy?.profession}
//                   {buddy?.professionDetails && ` • ${buddy.professionDetails}`}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Location buttons */}
//           <div className="flex items-center gap-1 flex-shrink-0">
//             <button
//               onClick={toggleLocationSharing}
//               className={`text-xs px-2 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
//                 sharingLocation
//                   ? "bg-green-500 text-white"
//                   : "bg-white bg-opacity-10 hover:bg-opacity-20"
//               }`}
//             >
//               📍
//             </button>
//             {buddyLocation && (
//               <button
//                 onClick={openBuddyLocation}
//                 className={`text-xs px-2 py-1.5 bg-gradient-to-r ${theme.primary} rounded-lg font-semibold ${theme.hover} transition whitespace-nowrap`}
//               >
//                 🗺️
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Info badges */}
//         <div className="flex items-center gap-2 mt-2 overflow-x-auto">
//           {/* Buddy Type Badge */}
//           <div
//             className={`text-xs px-2 py-1 ${theme.bgOpacity} bg-opacity-20 border ${theme.border} rounded-full whitespace-nowrap flex-shrink-0`}
//           >
//             {theme.icon} {theme.label}
//           </div>

//           {/* Interest/Food Preference Badge */}
//           {/* Interest Badges (Tea Mode — multiple interests) */}
//           {buddyType === "tea" &&
//             Array.isArray(buddy?.interests) &&
//             buddy.interests.length > 0 &&
//             buddy.interests.map((item, index) => (
//               <div
//                 key={index}
//                 className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full whitespace-nowrap flex-shrink-0"
//               >
//                 {item}
//               </div>
//             ))}

//           {buddyType === "food" && (
//             <>
//               {buddy?.foodPreference && (
//                 <div className="text-xs px-2 py-1 bg-green-500 bg-opacity-20 border border-green-500 rounded-full whitespace-nowrap flex-shrink-0">
//                   {buddy.foodPreference === "Veg" && "🥗 Veg"}
//                   {buddy.foodPreference === "Non-Veg" && "🍗 Non-Veg"}
//                   {buddy.foodPreference === "Both" && "🍽️ Both"}
//                 </div>
//               )}
//               {buddy?.foodMode && (
//                 <div className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full whitespace-nowrap flex-shrink-0">
//                   {buddy.foodMode === "Restaurant" && "🟢 Restaurant"}
//                   {buddy.foodMode === "Online" && "🔵 Online"}
//                   {buddy.foodMode === "Both" && "🟣 Both"}
//                 </div>
//               )}
//             </>
//           )}

//           {buddy?.availabilityComment && (
//             <div
//               className={`text-xs px-2 py-1 ${theme.bgOpacity} bg-opacity-20 border ${theme.border} rounded-full truncate flex-shrink-0 max-w-[200px]`}
//             >
//               "{buddy.availabilityComment}"
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Live Location Map */}
//       {showLiveMap && (
//         <LiveLocationMap
//           buddyLocation={buddyLocation}
//           onClose={() => setShowLiveMap(false)}
//         />
//       )}

//       {/* Warning Banner */}
//       <div className="flex-shrink-0 bg-red-900 bg-opacity-30 p-2 text-center text-xs border-b border-red-800">
//         ⚠️ Messages auto-delete after 1 hour of inactivity
//       </div>

//       {/* Messages Area */}
//       <div
//         className="flex-1 overflow-y-auto p-3 space-y-3"
//         style={{ WebkitOverflowScrolling: "touch" }}
//       >
//         {messages.length === 0 && (
//           <div className="text-center text-gray-400 mt-12">
//             <div className="text-5xl mb-3">👋</div>
//             <p className="text-lg">Start the conversation!</p>
//             <p className="text-sm">Use quick replies below to break the ice</p>
//           </div>
//         )}

//         {messages.map((msg, index) => {
//           const isCurrentUser = msg.sender._id === currentUser?.id;
//           return (
//             <div
//               key={index}
//               className={`flex ${
//                 isCurrentUser ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-[75%] px-4 py-3 rounded-2xl ${
//                   isCurrentUser
//                     ? `bg-gradient-to-r ${theme.messageGradient} text-white`
//                     : "bg-white bg-opacity-10 backdrop-blur-lg text-white"
//                 }`}
//               >
//                 {!isCurrentUser && (
//                   <p className="text-xs text-gray-300 mb-1">
//                     {msg.sender.name}
//                   </p>
//                 )}
//                 <p className="break-words">{msg.message}</p>
//                 <p className="text-xs text-gray-300 mt-1">
//                   {new Date(msg.timestamp).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>
//               </div>
//             </div>
//           );
//         })}

//         {isTyping && (
//           <div className="flex justify-start">
//             <div className="bg-white bg-opacity-10 backdrop-blur-lg px-4 py-2 rounded-2xl">
//               <p className="text-gray-400 text-sm animate-pulse">typing...</p>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div
//         className={`flex-shrink-0 bg-black bg-opacity-50 backdrop-blur-lg border-t ${theme.border} border-opacity-30 safe-area-bottom`}
//       >
//         {/* Quick Replies */}
//         {showQuickReplies && (
//           <div className={`p-3 border-b ${theme.border} border-opacity-20`}>
//             <p className="text-xs text-gray-400 mb-2">Quick replies:</p>
//             <div className="flex gap-2 flex-wrap">
//               {quickReplies.map((reply, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleQuickReply(reply)}
//                   className={`px-3 py-2 ${theme.bgOpacity} bg-opacity-30 border ${theme.border} rounded-xl text-sm hover:bg-opacity-50 transition transform hover:scale-105`}
//                 >
//                   {reply}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="p-3">
//           <div className="flex space-x-2">
//             <textarea
//               value={newMessage}
//               onChange={handleTyping}
//               onKeyPress={handleKeyPress}
//               placeholder="Type a message..."
//               rows="1"
//               className={`flex-1 p-3 bg-white bg-opacity-10 border ${theme.border} border-opacity-30 rounded-xl resize-none focus:outline-none focus:${theme.border} placeholder-gray-500 max-h-24`}
//               style={{ minHeight: "44px" }}
//             />
//             <button
//               onClick={() => handleSendMessage()}
//               disabled={!newMessage.trim()}
//               className={`px-4 py-3 bg-gradient-to-r ${
//                 theme.primary
//               } text-white font-bold rounded-xl hover:shadow-lg hover:shadow-${
//                 buddyType === "tea" ? "teal" : "amber"
//               }-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0`}
//               style={{ minHeight: "44px" }}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .safe-area-bottom {
//           padding-bottom: env(safe-area-inset-bottom);
//         }

//         @supports (padding: max(0px)) {
//           .safe-area-bottom {
//             padding-bottom: max(12px, env(safe-area-inset-bottom));
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import socketService from "../services/socket";
import LiveLocationMap from "../components/LiveLocationMap";
import API from "../services/api";

// THEME CONFIGURATION
const CHAT_THEMES = {
  tea: {
    gradient: "from-teal-900 via-black to-cyan-900",
    primary: "from-teal-600 to-cyan-600",
    secondary: "from-teal-400 to-cyan-400",
    border: "border-teal-500",
    bgOpacity: "bg-teal-500",
    text: "text-teal-300",
    hover: "hover:bg-teal-700",
    messageGradient: "from-teal-600 to-cyan-600",
    icon: "☕",
    label: "Tea Buddy",
  },
  food: {
    gradient: "from-amber-900 via-black to-orange-900",
    primary: "from-amber-600 to-orange-600",
    secondary: "from-amber-400 to-orange-400",
    border: "border-amber-500",
    bgOpacity: "bg-amber-500",
    text: "text-amber-300",
    hover: "hover:bg-amber-700",
    messageGradient: "from-amber-600 to-orange-600",
    icon: "🍽️",
    label: "Food Buddy",
  },
};

export default function Chat() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState(location.state?.buddy || null);
  const [buddyType, setBuddyType] = useState(
    location.state?.buddyType || "tea"
  );
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [buddyLocation, setBuddyLocation] = useState(null);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const locationIntervalRef = useRef(null);

  const theme = CHAT_THEMES[buddyType] || CHAT_THEMES.tea;

  const quickReplies =
    buddyType === "tea"
      ? ["Hi! 👋", "Let's catch up! ☕", "When are you free? 🕐"]
      : ["Hey! 🍽️", "Let's grab food! 🍕", "Where should we meet? 📍"];

  useEffect(() => {
    initializeChat();

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
      socketService.disconnect();
    };
  }, [roomId, navigate]);

  const initializeChat = async () => {
    setLoading(true);

    // Get buddy info from ChatRoom if not available
    if (!buddy) {
      await fetchBuddyInfo();
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    setCurrentUser(user);

    // Connect to socket
    socketService.connect(token);
    socketService.joinRoom(roomId);

    // Load previous messages
    socketService.onPreviousMessages((msgs) => {
      setMessages(msgs);
      if (msgs.length > 0) {
        setShowQuickReplies(false);
      }

      // Mark messages as read
      API.post(
        "/chat/mark-read",
        { roomId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then(() => {
          window.dispatchEvent(new Event("message-update"));
        })
        .catch(console.error);
    });

    // Listen for new messages
    socketService.onReceiveMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
      setShowQuickReplies(false);
      window.dispatchEvent(new Event("message-update"));
    });

    // Typing indicators
    socketService.onUserTyping(() => {
      setIsTyping(true);
    });

    socketService.onUserStopTyping(() => {
      setIsTyping(false);
    });

    // Listen for location updates
    socketService.socket?.on("location-update", (data) => {
      if (buddy && data.userId === buddy._id) {
        setBuddyLocation(data.location);
      }
    });

    setLoading(false);
  };

  const fetchBuddyInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/chat/my-chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const chatRoom = data.chatRooms?.find((room) => room.roomId === roomId);
      if (chatRoom && chatRoom.otherUser) {
        setBuddy(chatRoom.otherUser);
        setBuddyType(chatRoom.buddyType || "tea");
      } else {
        alert("Chat not found");
        navigate("/chat-list");
      }
    } catch (err) {
      console.error("Failed to fetch buddy info:", err);
      navigate("/chat-list");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (text = newMessage) => {
    if (!text.trim() || !buddy) return;

    socketService.sendMessage(roomId, buddy._id, text);
    setNewMessage("");
    setShowQuickReplies(false);
    socketService.emitStopTyping(roomId);
  };

  const handleQuickReply = (text) => {
    if (!buddy) return;
    socketService.sendMessage(roomId, buddy._id, text);
    setShowQuickReplies(false);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socketService.emitTyping(roomId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.emitStopTyping(roomId);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleLocationSharing = () => {
    if (!sharingLocation) {
      if (!navigator.geolocation) {
        alert("Geolocation not supported by your browser");
        return;
      }

      setSharingLocation(true);

      const shareLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            socketService.socket?.emit("share-location", {
              roomId,
              userId: currentUser.id,
              location,
            });
          },
          (error) => {
            console.error("Location error:", error);
            setSharingLocation(false);
            if (locationIntervalRef.current) {
              clearInterval(locationIntervalRef.current);
            }
          }
        );
      };

      shareLocation();
      locationIntervalRef.current = setInterval(shareLocation, 10000);
    } else {
      setSharingLocation(false);
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
      socketService.socket?.emit("stop-location", {
        roomId,
        userId: currentUser.id,
      });
    }
  };

  const openBuddyLocation = () => {
    if (buddyLocation) {
      setShowLiveMap(true);
    } else {
      alert("Buddy hasn't shared their location yet");
    }
  };

  if (loading || !buddy) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-gradient-to-br ${theme.gradient} text-white`}
      >
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔄</div>
          <p className="text-xl">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 flex flex-col bg-gradient-to-br ${theme.gradient} text-white`}
    >
      {/* Header */}
      <div
        className={`flex-shrink-0 bg-black bg-opacity-50 backdrop-blur-lg p-3 border-b ${theme.border} border-opacity-30`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={() => navigate("/chat-list")}
              className={`text-xl ${theme.text} hover:text-white transition flex-shrink-0`}
            >
              ←
            </button>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${theme.primary} rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}
              >
                {buddy?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-sm truncate">
                  {buddy?.name || "User"}
                </h2>
                <p className={`text-xs ${theme.text} truncate`}>
                  {buddy?.profession || ""}
                  {buddy?.professionDetails && ` • ${buddy.professionDetails}`}
                </p>
              </div>
            </div>
          </div>

          {/* Location buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={toggleLocationSharing}
              className={`text-xs px-2 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                sharingLocation
                  ? "bg-green-500 text-white"
                  : "bg-white bg-opacity-10 hover:bg-opacity-20"
              }`}
            >
              📍
            </button>
            {buddyLocation && (
              <button
                onClick={openBuddyLocation}
                className={`text-xs px-2 py-1.5 bg-gradient-to-r ${theme.primary} rounded-lg font-semibold ${theme.hover} transition whitespace-nowrap`}
              >
                🗺️
              </button>
            )}
          </div>
        </div>

        {/* Info badges */}
        <div className="flex items-center gap-2 mt-2 overflow-x-auto">
          <div
            className={`text-xs px-2 py-1 ${theme.bgOpacity} bg-opacity-20 border ${theme.border} rounded-full whitespace-nowrap flex-shrink-0`}
          >
            {theme.icon} {theme.label}
          </div>

          {buddyType === "tea" &&
            Array.isArray(buddy?.interests) &&
            buddy.interests.length > 0 &&
            buddy.interests.slice(0, 2).map((item, index) => (
              <div
                key={index}
                className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full whitespace-nowrap flex-shrink-0"
              >
                {item}
              </div>
            ))}

          {buddyType === "food" && (
            <>
              {buddy?.foodPreference && (
                <div className="text-xs px-2 py-1 bg-green-500 bg-opacity-20 border border-green-500 rounded-full whitespace-nowrap flex-shrink-0">
                  {buddy.foodPreference === "Veg" && "🥗 Veg"}
                  {buddy.foodPreference === "Non-Veg" && "🍗 Non-Veg"}
                  {buddy.foodPreference === "Both" && "🍽️ Both"}
                </div>
              )}
              {buddy?.foodMode && (
                <div className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full whitespace-nowrap flex-shrink-0">
                  {buddy.foodMode === "Restaurant" && "🟢 Restaurant"}
                  {buddy.foodMode === "Online" && "🔵 Online"}
                  {buddy.foodMode === "Both" && "🟣 Both"}
                </div>
              )}
            </>
          )}

          {buddy?.availabilityComment && (
            <div
              className={`text-xs px-2 py-1 ${theme.bgOpacity} bg-opacity-20 border ${theme.border} rounded-full truncate flex-shrink-0 max-w-[200px]`}
            >
              "{buddy.availabilityComment}"
            </div>
          )}
        </div>
      </div>

      {/* Live Location Map */}
      {showLiveMap && (
        <LiveLocationMap
          buddyLocation={buddyLocation}
          onClose={() => setShowLiveMap(false)}
        />
      )}

      {/* Warning Banner */}
      <div className="flex-shrink-0 bg-red-900 bg-opacity-30 p-2 text-center text-xs border-b border-red-800">
        ⚠️ Messages auto-delete after 1 hour of inactivity
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-3"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <div className="text-5xl mb-3">👋</div>
            <p className="text-lg">Start the conversation!</p>
            <p className="text-sm">Use quick replies below to break the ice</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isCurrentUser = msg.sender._id === currentUser?.id;
          return (
            <div
              key={index}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  isCurrentUser
                    ? `bg-gradient-to-r ${theme.messageGradient} text-white`
                    : "bg-white bg-opacity-10 backdrop-blur-lg text-white"
                }`}
              >
                {!isCurrentUser && (
                  <p className="text-xs text-gray-300 mb-1">
                    {msg.sender.name}
                  </p>
                )}
                <p className="break-words">{msg.message}</p>
                <p className="text-xs text-gray-300 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg px-4 py-2 rounded-2xl">
              <p className="text-gray-400 text-sm animate-pulse">typing...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className={`flex-shrink-0 bg-black bg-opacity-50 backdrop-blur-lg border-t ${theme.border} border-opacity-30 safe-area-bottom`}
      >
        {/* Quick Replies */}
        {showQuickReplies && (
          <div className={`p-3 border-b ${theme.border} border-opacity-20`}>
            <p className="text-xs text-gray-400 mb-2">Quick replies:</p>
            <div className="flex gap-2 flex-wrap">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className={`px-3 py-2 ${theme.bgOpacity} bg-opacity-30 border ${theme.border} rounded-xl text-sm hover:bg-opacity-50 transition transform hover:scale-105`}
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-3">
          <div className="flex space-x-2">
            <textarea
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows="1"
              className={`flex-1 p-3 bg-white bg-opacity-10 border ${theme.border} border-opacity-30 rounded-xl resize-none focus:outline-none focus:${theme.border} placeholder-gray-500 max-h-24`}
              style={{ minHeight: "44px" }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!newMessage.trim()}
              className={`px-4 py-3 bg-gradient-to-r ${
                theme.primary
              } text-white font-bold rounded-xl hover:shadow-lg hover:shadow-${
                buddyType === "tea" ? "teal" : "amber"
              }-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0`}
              style={{ minHeight: "44px" }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        @supports (padding: max(0px)) {
          .safe-area-bottom {
            padding-bottom: max(12px, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
}
