import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ChatList() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatRooms();
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
      // Don't show alert, just display error message in UI
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (room) => {
    navigate(`/chat/${room.roomId}`, {
      state: { buddy: room.otherUser },
    });
  };

  const getTotalUnreadCount = () => {
    return chatRooms.reduce((sum, room) => sum + (room.unreadCount || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading chats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Messages</h1>
          <div className="text-center py-12">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={fetchChatRooms}
              className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Messages{" "}
          {getTotalUnreadCount() > 0 && (
            <span className="ml-2 text-sm bg-red-600 px-2 py-1 rounded-full">
              {getTotalUnreadCount()} new
            </span>
          )}
        </h1>

        {chatRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No active chats</p>
            <p className="text-gray-500 text-sm mb-6">
              Chats are deleted after 1 hour of inactivity
            </p>
            <button
              onClick={() => navigate("/find-buddy")}
              className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Find Tea Buddy
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {chatRooms.map((room) => (
              <div
                key={room.roomId}
                onClick={() => handleOpenChat(room)}
                className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg">
                        {room.otherUser.name}
                      </p>
                      {room.unreadCount > 0 && (
                        <span className="bg-red-600 text-xs px-2 py-1 rounded-full">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {room.otherUser.profession}
                    </p>
                    <p className="text-sm text-blue-400">
                      💬 {room.otherUser.interest}
                    </p>
                    {room.lastMessage && (
                      <p className="text-sm text-gray-500 mt-2 truncate">
                        {room.lastMessage}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(room.lastMessageTime).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Warning Banner */}
        <div className="mt-8 bg-yellow-900 bg-opacity-30 p-4 rounded-lg border border-yellow-800">
          <p className="text-sm text-yellow-200">
            ⚠️ Chats are automatically deleted after 1 hour of inactivity
          </p>
        </div>
      </div>
    </div>
  );
}
