import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import socketService from "../services/socket";

export default function Chat() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const buddy = location.state?.buddy;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

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
    });

    // Listen for new messages
    socketService.onReceiveMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Typing indicators
    socketService.onUserTyping(() => {
      setIsTyping(true);
    });

    socketService.onUserStopTyping(() => {
      setIsTyping(false);
    });

    return () => {
      socketService.disconnect();
    };
  }, [roomId, buddy, navigate]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    socketService.sendMessage(roomId, buddy._id, newMessage);
    setNewMessage("");
    socketService.emitStopTyping(roomId);
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

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/find-buddy")}
            className="mr-4 text-2xl hover:text-gray-400"
          >
            ←
          </button>
          <div>
            <h2 className="font-semibold text-lg">{buddy?.name}</h2>
            <p className="text-sm text-gray-400">{buddy?.profession}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">💬 {buddy?.interest}</div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-900 bg-opacity-30 p-2 text-center text-sm border-b border-red-800">
        ⚠️ Messages will be deleted after 1 hour of inactivity
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <p>👋 Say hello to start the conversation!</p>
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
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isCurrentUser
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-white"
                }`}
              >
                {!isCurrentUser && (
                  <p className="text-xs text-gray-400 mb-1">
                    {msg.sender.name}
                  </p>
                )}
                <p>{msg.message}</p>
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
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <p className="text-gray-400 text-sm">typing...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-900 p-4 border-t border-gray-800">
        <div className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows="1"
            className="flex-1 p-3 bg-black border border-gray-700 rounded-lg resize-none focus:outline-none focus:border-white"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
