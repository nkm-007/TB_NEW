// import { useState, useEffect, useRef } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import socketService from "../services/socket";

// export default function Chat() {
//   const { roomId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const buddy = location.state?.buddy;

//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [showQuickReplies, setShowQuickReplies] = useState(true);
//   const messagesEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   const quickReplies = [
//     "Hi! 👋",
//     "Let's catch up! ☕",
//     "When are you free? 🕐",
//   ];

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

//     // Connect to socket
//     socketService.connect(token);
//     socketService.joinRoom(roomId);

//     // Load previous messages
//     socketService.onPreviousMessages((msgs) => {
//       setMessages(msgs);

//       // Mark messages as read when opening chat
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
//             // Trigger message update event to refresh navbar badge
//             window.dispatchEvent(new Event("message-update"));
//           })
//           .catch(console.error);
//       });
//     });

//     // Listen for new messages
//     socketService.onReceiveMessage((msg) => {
//       setMessages((prev) => [...prev, msg]);
//       // Trigger message update event
//       window.dispatchEvent(new Event("message-update"));
//     });

//     // Typing indicators
//     socketService.onUserTyping(() => {
//       setIsTyping(true);
//     });

//     socketService.onUserStopTyping(() => {
//       setIsTyping(false);
//     });

//     return () => {
//       socketService.disconnect();
//     };
//   }, [roomId, buddy, navigate]);

//   useEffect(() => {
//     // Scroll to bottom when new messages arrive
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;

//     socketService.sendMessage(roomId, buddy._id, newMessage);
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

//     // Clear previous timeout
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     // Stop typing after 1 second of inactivity
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

//   return (
//     <div className="flex flex-col h-screen bg-black text-white">
//       {/* Header */}
//       <div className="bg-gray-900 p-4 border-b border-gray-800 flex items-center justify-between">
//         <div className="flex items-center">
//           <button
//             onClick={() => navigate("/find-buddy")}
//             className="mr-4 text-2xl hover:text-gray-400"
//           >
//             ←
//           </button>
//           <div>
//             <h2 className="font-semibold text-lg">{buddy?.name}</h2>
//             <p className="text-sm text-gray-400">{buddy?.profession}</p>
//           </div>
//         </div>
//         <div className="text-sm text-gray-500">💬 {buddy?.interest}</div>
//       </div>

//       {/* Warning Banner */}
//       <div className="bg-red-900 bg-opacity-30 p-2 text-center text-sm border-b border-red-800">
//         ⚠️ Messages will be deleted after 1 hour of inactivity
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {messages.length === 0 && (
//           <div className="text-center text-gray-500 mt-12">
//             <p>👋 Say hello to start the conversation!</p>
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
//                 className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                   isCurrentUser
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-800 text-white"
//                 }`}
//               >
//                 {!isCurrentUser && (
//                   <p className="text-xs text-gray-400 mb-1">
//                     {msg.sender.name}
//                   </p>
//                 )}
//                 <p>{msg.message}</p>
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
//             <div className="bg-gray-800 px-4 py-2 rounded-lg">
//               <p className="text-gray-400 text-sm">typing...</p>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="bg-gray-900 border-t border-gray-800">
//         {/* Quick Replies */}
//         {showQuickReplies && messages.length === 0 && (
//           <div className="p-3 border-b border-gray-800">
//             <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
//             <div className="flex gap-2 flex-wrap">
//               {quickReplies.map((reply, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleQuickReply(reply)}
//                   className="px-4 py-2 bg-purple-600 bg-opacity-20 border border-purple-500 rounded-xl text-sm hover:bg-opacity-30 transition"
//                 >
//                   {reply}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="p-4">
//           <div className="flex space-x-2">
//             <textarea
//               value={newMessage}
//               onChange={handleTyping}
//               onKeyPress={handleKeyPress}
//               placeholder="Type a message..."
//               rows="1"
//               className="flex-1 p-3 bg-black border border-gray-700 rounded-lg resize-none focus:outline-none focus:border-white"
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={!newMessage.trim()}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import socketService from "../services/socket";
import LiveLocationMap from "../components/LiveLocationMap";

export default function Chat() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const buddy = location.state?.buddy;

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

  const quickReplies = [
    "Hi! 👋",
    "Let's catch up! ☕",
    "When are you free? 🕐",
  ];

  useEffect(() => {
    if (!buddy) {
      alert("Invalid chat session");
      navigate("/dashboard");
      return;
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

      // Mark messages as read when opening chat
      const token = localStorage.getItem("token");
      import("../services/api").then(({ default: API }) => {
        API.post(
          "/chat/mark-read",
          { roomId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
          .then(() => {
            // Trigger message update event to refresh navbar badge
            window.dispatchEvent(new Event("message-update"));
          })
          .catch(console.error);
      });
    });

    // Listen for new messages
    socketService.onReceiveMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
      setShowQuickReplies(false);
      // Trigger message update event
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
      if (data.userId === buddy._id) {
        setBuddyLocation(data.location);
      }
    });

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
      socketService.disconnect();
    };
  }, [roomId, buddy, navigate]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (text = newMessage) => {
    if (!text.trim()) return;

    socketService.sendMessage(roomId, buddy._id, text);
    setNewMessage("");
    setShowQuickReplies(false);
    socketService.emitStopTyping(roomId);
  };

  const handleQuickReply = (text) => {
    socketService.sendMessage(roomId, buddy._id, text);
    setShowQuickReplies(false);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    socketService.emitTyping(roomId);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 1 second of inactivity
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
      // Start sharing location
      if (!navigator.geolocation) {
        alert("Geolocation not supported by your browser");
        return;
      }

      setSharingLocation(true);

      // Share location immediately and then every 10 seconds
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
      // Stop sharing
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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-lg p-4 border-b border-purple-500 border-opacity-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/chat-list")}
            className="text-2xl hover:text-purple-400 transition"
          >
            ←
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl font-bold">
              {buddy?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-lg">{buddy?.name}</h2>
              <p className="text-sm text-purple-300">{buddy?.profession}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-xs px-3 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full">
              💬 {buddy?.interest}
            </div>
            {buddy?.availabilityComment && (
              <div className="text-xs px-3 py-1 bg-purple-500 bg-opacity-20 border border-purple-500 rounded-full max-w-xs truncate">
                "{buddy.availabilityComment}"
              </div>
            )}
          </div>
          <button
            onClick={toggleLocationSharing}
            className={`text-xs px-3 py-2 rounded-lg font-semibold transition ${
              sharingLocation
                ? "bg-green-500 text-white"
                : "bg-white bg-opacity-10 hover:bg-opacity-20"
            }`}
          >
            {sharingLocation ? "📍 Sharing..." : "📍 Share Location"}
          </button>
          {buddyLocation && (
            <button
              onClick={openBuddyLocation}
              className="text-xs px-3 py-2 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              🗺️ View Live Location
            </button>
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
      <div className="bg-red-900 bg-opacity-30 p-2 text-center text-sm border-b border-red-800">
        ⚠️ Messages auto-delete after 1 hour of inactivity
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  isCurrentUser
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
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
      <div className="bg-black bg-opacity-50 backdrop-blur-lg border-t border-purple-500 border-opacity-30">
        {/* Quick Replies */}
        {showQuickReplies && (
          <div className="p-3 border-b border-purple-500 border-opacity-20">
            <p className="text-xs text-gray-400 mb-2">Quick replies:</p>
            <div className="flex gap-2 flex-wrap">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-4 py-2 bg-purple-600 bg-opacity-30 border border-purple-500 rounded-xl text-sm hover:bg-opacity-50 transition transform hover:scale-105"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="flex space-x-2">
            <textarea
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows="1"
              className="flex-1 p-3 bg-white bg-opacity-10 border border-purple-500 border-opacity-30 rounded-xl resize-none focus:outline-none focus:border-purple-500 placeholder-gray-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
