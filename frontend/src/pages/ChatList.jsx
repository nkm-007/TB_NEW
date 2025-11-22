// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// export default function ChatList() {
//   const [chatRooms, setChatRooms] = useState([]);
//   const [friendRequests, setFriendRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchChatRooms();
//     fetchFriendRequests();
//   }, []);

//   const fetchChatRooms = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const { data } = await API.get("/chat/my-chats", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setChatRooms(data.chatRooms || []);
//       setError(null);
//     } catch (err) {
//       console.error("Fetch chat rooms error:", err);
//       setError("Failed to load chats");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFriendRequests = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const { data } = await API.get("/friend-request/pending", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setFriendRequests(data.requests || []);
//     } catch (err) {
//       console.error("Fetch friend requests error:", err);
//     }
//   };

//   const handleAcceptRequest = async (requestId, fromUser) => {
//     const token = localStorage.getItem("token");
//     try {
//       const { data } = await API.post(
//         "/friend-request/accept",
//         { requestId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Refresh lists
//       fetchFriendRequests();
//       fetchChatRooms();

//       // Trigger message update
//       window.dispatchEvent(new Event("message-update"));

//       alert("Request accepted! You can now chat.");

//       // Navigate to chat
//       navigate(`/chat/${data.roomId}`, { state: { buddy: fromUser } });
//     } catch (err) {
//       console.error("Accept request error:", err);
//       alert("Failed to accept request");
//     }
//   };

//   const handleDeclineRequest = async (requestId) => {
//     const token = localStorage.getItem("token");
//     try {
//       await API.post(
//         "/friend-request/decline",
//         { requestId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       fetchFriendRequests();
//       alert("Request declined");
//     } catch (err) {
//       console.error("Decline request error:", err);
//       alert("Failed to decline request");
//     }
//   };

//   const handleOpenChat = (room) => {
//     navigate(`/chat/${room.roomId}`, {
//       state: { buddy: room.otherUser },
//     });
//   };

//   const getTotalUnreadCount = () => {
//     const chatUnread = chatRooms.reduce(
//       (sum, room) => sum + (room.unreadCount || 0),
//       0
//     );
//     return chatUnread + friendRequests.length;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin text-6xl mb-4">💬</div>
//           <p className="text-xl">Loading your chats...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-6">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-4xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Messages
//           </h1>
//           <div className="text-center py-12 bg-red-500 bg-opacity-10 border border-red-500 rounded-2xl">
//             <p className="text-red-400 text-lg mb-4">{error}</p>
//             <button
//               onClick={fetchChatRooms}
//               className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:shadow-lg transition"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-4xl font-black mb-2">
//             <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//               Your Chats
//             </span>
//             {getTotalUnreadCount() > 0 && (
//               <span className="ml-3 text-sm bg-red-600 px-3 py-1 rounded-full animate-pulse">
//                 {getTotalUnreadCount()} new
//               </span>
//             )}
//           </h1>
//           <p className="text-gray-400">
//             Active conversations • Auto-delete after 1hr
//           </p>
//         </div>

//         {chatRooms.length === 0 && friendRequests.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">💬</div>
//             <p className="text-gray-400 text-xl mb-2">No active chats yet</p>
//             <p className="text-gray-500 text-sm mb-6">
//               Start a conversation with someone nearby!
//             </p>
//             <button
//               onClick={() => navigate("/find-buddy")}
//               className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition"
//             >
//               Find Tea Buddy ☕
//             </button>
//           </div>
//         ) : (
//           <div>
//             {/* Friend Requests Section */}
//             {friendRequests.length > 0 && (
//               <div className="mb-8">
//                 <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//                   <span className="text-3xl">✉️</span>
//                   <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
//                     Friend Requests ({friendRequests.length})
//                   </span>
//                 </h2>
//                 <div className="space-y-3">
//                   {friendRequests.map((request) => (
//                     <div
//                       key={request._id}
//                       className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-0.5"
//                     >
//                       <div className="bg-black rounded-2xl p-5">
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold">
//                               {request.from.name.charAt(0).toUpperCase()}
//                             </div>
//                             <div>
//                               <p className="font-bold text-xl">
//                                 {request.from.name}
//                               </p>
//                               <p className="text-sm text-gray-400">
//                                 {request.from.profession}
//                               </p>
//                               <p className="text-sm text-yellow-400">
//                                 {request.from.interest}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() =>
//                                 handleAcceptRequest(request._id, request.from)
//                               }
//                               className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition font-semibold"
//                             >
//                               Accept ✓
//                             </button>
//                             <button
//                               onClick={() => handleDeclineRequest(request._id)}
//                               className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition font-semibold"
//                             >
//                               Decline ✗
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Active Chats */}
//             <div className="space-y-4">
//               {chatRooms.map((room) => (
//                 <div
//                   key={room.roomId}
//                   onClick={() => handleOpenChat(room)}
//                   className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl p-5 hover:bg-opacity-10 transition cursor-pointer transform hover:scale-102"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold">
//                           {room.otherUser.name.charAt(0).toUpperCase()}
//                         </div>
//                         <div>
//                           <div className="flex items-center gap-2">
//                             <p className="font-bold text-xl">
//                               {room.otherUser.name}
//                             </p>
//                             {room.unreadCount > 0 && (
//                               <span className="bg-red-600 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
//                                 {room.unreadCount}
//                               </span>
//                             )}
//                           </div>
//                           <p className="text-sm text-purple-300">
//                             {room.otherUser.profession}
//                             {room.otherUser.professionDetails && (
//                               <span className="text-gray-400">
//                                 {" "}
//                                 ({room.otherUser.professionDetails})
//                               </span>
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full">
//                           💬 {room.otherUser.interest}
//                         </span>
//                       </div>
//                       {room.lastMessage && (
//                         <p className="text-sm text-gray-400 truncate mt-2">
//                           {room.lastMessage}
//                         </p>
//                       )}
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs text-gray-500 mb-2">
//                         {new Date(room.lastMessageTime).toLocaleDateString()}
//                       </p>
//                       <p className="text-2xl">→</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Info Card */}
//         <div className="mt-8 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-xl">
//           <p className="text-sm text-yellow-200 flex items-center gap-2">
//             <span>⏰</span>
//             <span>
//               Chats automatically delete after 1 hour of inactivity for your
//               privacy!
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// Theme colors for buddy types
const BUDDY_THEMES = {
  tea: {
    gradient: "from-teal-500 to-cyan-500",
    bg: "bg-teal-500",
    text: "text-teal-300",
    border: "border-teal-500",
    icon: "☕",
    label: "Tea Buddy",
  },
  food: {
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-500",
    text: "text-amber-300",
    border: "border-amber-500",
    icon: "🍽️",
    label: "Food Buddy",
  },
};

export default function ChatList() {
  const [chatRooms, setChatRooms] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatRooms();
    fetchFriendRequests();
  }, []);

  const fetchChatRooms = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await API.get("/chat/my-chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChatRooms(data.chatRooms || []);
      setError(null);
    } catch (err) {
      console.error("Fetch chat rooms error:", err);
      setError("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await API.get("/friend-request/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendRequests(data.requests || []);
    } catch (err) {
      console.error("Fetch friend requests error:", err);
    }
  };

  const handleAcceptRequest = async (requestId, fromUser, buddyType) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await API.post(
        "/friend-request/accept",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh lists
      fetchFriendRequests();
      fetchChatRooms();

      // Trigger message update
      window.dispatchEvent(new Event("message-update"));

      alert("Request accepted! You can now chat.");

      // Navigate to chat with buddy type
      navigate(`/chat/${data.roomId}`, {
        state: {
          buddy: fromUser,
          buddyType: data.buddyType || buddyType || "tea",
        },
      });
    } catch (err) {
      console.error("Accept request error:", err);
      alert("Failed to accept request");
    }
  };

  const handleDeclineRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    try {
      await API.post(
        "/friend-request/decline",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchFriendRequests();
      alert("Request declined");
    } catch (err) {
      console.error("Decline request error:", err);
      alert("Failed to decline request");
    }
  };

  const handleOpenChat = (room) => {
    navigate(`/chat/${room.roomId}`, {
      state: {
        buddy: room.otherUser,
        buddyType: room.buddyType || "tea",
      },
    });
  };

  const getTotalUnreadCount = () => {
    const chatUnread = chatRooms.reduce(
      (sum, room) => sum + (room.unreadCount || 0),
      0
    );
    return chatUnread + friendRequests.length;
  };

  // Get user interests display
  const getUserInterests = (user) => {
    if (user.interests && user.interests.length > 0) {
      return user.interests;
    } else if (user.interest) {
      return [user.interest];
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">💬</div>
          <p className="text-xl">Loading your chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Messages
          </h1>
          <div className="text-center py-12 bg-red-500 bg-opacity-10 border border-red-500 rounded-2xl">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={fetchChatRooms}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Chats
            </span>
            {getTotalUnreadCount() > 0 && (
              <span className="ml-3 text-sm bg-red-600 px-3 py-1 rounded-full animate-pulse">
                {getTotalUnreadCount()} new
              </span>
            )}
          </h1>
          <p className="text-gray-400">
            Active conversations • Auto-delete after 1hr
          </p>
        </div>

        {chatRooms.length === 0 && friendRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-400 text-xl mb-2">No active chats yet</p>
            <p className="text-gray-500 text-sm mb-6">
              Start a conversation with someone nearby!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/find-buddy")}
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-teal-500/50 transform hover:scale-105 transition"
              >
                Find Tea Buddy ☕
              </button>
              <button
                onClick={() => navigate("/find-foodbuddy")}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-amber-500/50 transform hover:scale-105 transition"
              >
                Find Food Buddy 🍽️
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Friend Requests Section */}
            {friendRequests.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">✉️</span>
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Friend Requests ({friendRequests.length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {friendRequests.map((request) => {
                    const buddyType = request.buddyType || "tea";
                    const theme = BUDDY_THEMES[buddyType];
                    const userInterests = getUserInterests(request.from);

                    return (
                      <div
                        key={request._id}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-0.5"
                      >
                        <div className="bg-black rounded-2xl p-5">
                          <div className="flex justify-between items-center flex-wrap gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div
                                className={`w-12 h-12 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0`}
                              >
                                {request.from.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-xl">
                                  {request.from.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {request.from.profession}
                                  {request.otherUser.professionDetails && (
                                    <span className="text-gray-400">
                                      {" "}
                                      ({request.otherUser.professionDetails})
                                    </span>
                                  )}
                                </p>

                                {/* Buddy Type Badge */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span
                                    className={`text-xs px-2 py-1 ${theme.bg} bg-opacity-20 border ${theme.border} rounded-full`}
                                  >
                                    {theme.icon} {theme.label}
                                  </span>

                                  {/* Show interests for tea buddy */}
                                  {buddyType === "tea" &&
                                    userInterests.length > 0 && (
                                      <>
                                        {userInterests
                                          .slice(0, 2)
                                          .map((interest) => (
                                            <span
                                              key={interest}
                                              className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full"
                                            >
                                              {interest}
                                            </span>
                                          ))}
                                        {userInterests.length > 2 && (
                                          <span className="text-xs px-2 py-1 bg-gray-500 bg-opacity-20 border border-gray-500 rounded-full">
                                            +{userInterests.length - 2} more
                                          </span>
                                        )}
                                      </>
                                    )}

                                  {/* Show food preferences for food buddy */}
                                  {buddyType === "food" && (
                                    <>
                                      {request.from.foodPreference && (
                                        <span className="text-xs px-2 py-1 bg-green-500 bg-opacity-20 border border-green-500 rounded-full">
                                          {request.from.foodPreference ===
                                            "Veg" && "🥗 Veg"}
                                          {request.from.foodPreference ===
                                            "Non-Veg" && "🍗 Non-Veg"}
                                          {request.from.foodPreference ===
                                            "Both" && "🍽️ Both"}
                                        </span>
                                      )}
                                      {request.from.foodMode && (
                                        <span className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full">
                                          {request.from.foodMode ===
                                            "Restaurant" && "🟢 Restaurant"}
                                          {request.from.foodMode === "Online" &&
                                            "🔵 Online"}
                                          {request.from.foodMode === "Both" &&
                                            "🟣 Both"}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() =>
                                  handleAcceptRequest(
                                    request._id,
                                    request.from,
                                    buddyType
                                  )
                                }
                                className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition font-semibold"
                              >
                                Accept ✓
                              </button>
                              <button
                                onClick={() =>
                                  handleDeclineRequest(request._id)
                                }
                                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition font-semibold"
                              >
                                Decline ✗
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Chats */}
            <div className="space-y-4">
              {chatRooms.map((room) => {
                const buddyType = room.buddyType || "tea";
                const theme = BUDDY_THEMES[buddyType];
                const userInterests = getUserInterests(room.otherUser);

                return (
                  <div
                    key={room.roomId}
                    onClick={() => handleOpenChat(room)}
                    className={`bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl p-5 hover:bg-opacity-10 transition cursor-pointer transform hover:scale-102 hover:border-${
                      buddyType === "tea" ? "teal" : "amber"
                    }-500 hover:border-opacity-30`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0`}
                          >
                            {room.otherUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-xl">
                                {room.otherUser.name}
                              </p>
                              {room.unreadCount > 0 && (
                                <span className="bg-red-600 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                  {room.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className={`text-sm ${theme.text}`}>
                              {room.otherUser.profession}
                              {room.otherUser.professionDetails && (
                                <span className="text-gray-400">
                                  {" "}
                                  • {room.otherUser.professionDetails}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Buddy Type and Interest/Food Badges */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {/* Buddy Type Badge */}
                          <span
                            className={`text-xs px-2 py-1 ${theme.bg} bg-opacity-20 border ${theme.border} rounded-full`}
                          >
                            {theme.icon} {theme.label}
                          </span>

                          {/* Show interests for tea buddy */}
                          {buddyType === "tea" && userInterests.length > 0 && (
                            <>
                              {userInterests.slice(0, 2).map((interest) => (
                                <span
                                  key={interest}
                                  className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full"
                                >
                                  💬 {interest}
                                </span>
                              ))}
                              {userInterests.length > 2 && (
                                <span className="text-xs px-2 py-1 bg-gray-500 bg-opacity-20 border border-gray-500 rounded-full">
                                  +{userInterests.length - 2} more
                                </span>
                              )}
                            </>
                          )}

                          {/* Show food preferences for food buddy */}
                          {buddyType === "food" && (
                            <>
                              {room.otherUser.foodPreference && (
                                <span className="text-xs px-2 py-1 bg-green-500 bg-opacity-20 border border-green-500 rounded-full">
                                  {room.otherUser.foodPreference === "Veg" &&
                                    "🥗 Veg"}
                                  {room.otherUser.foodPreference ===
                                    "Non-Veg" && "🍗 Non-Veg"}
                                  {room.otherUser.foodPreference === "Both" &&
                                    "🍽️ Both"}
                                </span>
                              )}
                              {room.otherUser.foodMode && (
                                <span className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full">
                                  {room.otherUser.foodMode === "Restaurant" &&
                                    "🟢 Restaurant"}
                                  {room.otherUser.foodMode === "Online" &&
                                    "🔵 Online"}
                                  {room.otherUser.foodMode === "Both" &&
                                    "🟣 Both"}
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Last Message */}
                        {room.lastMessage && (
                          <p className="text-sm text-gray-400 truncate mt-2">
                            {room.lastMessage}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-xs text-gray-500 mb-2">
                          {new Date(room.lastMessageTime).toLocaleDateString()}
                        </p>
                        <p className="text-2xl">→</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-xl">
          <p className="text-sm text-yellow-200 flex items-center gap-2">
            <span>⏰</span>
            <span>
              Chats automatically delete after 1 hour of inactivity for your
              privacy!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
