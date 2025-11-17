import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5001";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        transports: ["websocket", "polling"],
      });

      this.socket.emit("authenticate", token);

      this.socket.on("connect", () => {
        console.log("Connected to socket server");
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit("join-room", { roomId });
    }
  }

  sendMessage(roomId, receiverId, message) {
    if (this.socket) {
      this.socket.emit("send-message", { roomId, receiverId, message });
    }
  }

  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on("receive-message", callback);
    }
  }

  onPreviousMessages(callback) {
    if (this.socket) {
      this.socket.on("previous-messages", callback);
    }
  }

  emitTyping(roomId) {
    if (this.socket) {
      this.socket.emit("typing", { roomId });
    }
  }

  emitStopTyping(roomId) {
    if (this.socket) {
      this.socket.emit("stop-typing", { roomId });
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on("user-typing", callback);
    }
  }

  onUserStopTyping(callback) {
    if (this.socket) {
      this.socket.on("user-stop-typing", callback);
    }
  }
}

export default new SocketService();
