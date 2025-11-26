// import { io } from "socket.io-client";

// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5001";

// class SocketService {
//   constructor() {
//     this.socket = null;
//   }

//   connect(token) {
//     if (!this.socket) {
//       this.socket = io(SOCKET_URL, {
//         autoConnect: true,
//         reconnection: true,
//         reconnectionDelay: 1000,
//         reconnectionAttempts: 5,
//         transports: ["websocket", "polling"],
//       });

//       this.socket.emit("authenticate", token);

//       this.socket.on("connect", () => {
//         console.log("Connected to socket server");
//       });

//       this.socket.on("disconnect", () => {
//         console.log("Disconnected from socket server");
//       });

//       this.socket.on("connect_error", (error) => {
//         console.error("Connection error:", error);
//       });
//     }
//     return this.socket;
//   }

//   disconnect() {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//     }
//   }

//   joinRoom(roomId) {
//     if (this.socket) {
//       this.socket.emit("join-room", { roomId });
//     }
//   }

//   sendMessage(roomId, receiverId, message) {
//     if (this.socket) {
//       this.socket.emit("send-message", { roomId, receiverId, message });
//     }
//   }

//   onReceiveMessage(callback) {
//     if (this.socket) {
//       this.socket.on("receive-message", callback);
//     }
//   }

//   onPreviousMessages(callback) {
//     if (this.socket) {
//       this.socket.on("previous-messages", callback);
//     }
//   }

//   emitTyping(roomId) {
//     if (this.socket) {
//       this.socket.emit("typing", { roomId });
//     }
//   }

//   emitStopTyping(roomId) {
//     if (this.socket) {
//       this.socket.emit("stop-typing", { roomId });
//     }
//   }

//   onUserTyping(callback) {
//     if (this.socket) {
//       this.socket.on("user-typing", callback);
//     }
//   }

//   onUserStopTyping(callback) {
//     if (this.socket) {
//       this.socket.on("user-stop-typing", callback);
//     }
//   }
// }

// export default new SocketService();
import { io } from "socket.io-client";
import notificationService from "./notificationService";

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

      // Setup notification listeners
      this.setupNotificationListeners();
    }
    return this.socket;
  }

  setupNotificationListeners() {
    // Listen for new message notifications
    this.socket.on("new-message-notification", (data) => {
      const { senderName, message, roomId, buddyType } = data;

      // Only show notification if user is not currently in that chat
      const currentPath = window.location.pathname;
      const isInChat = currentPath.includes(`/chat/${roomId}`);

      if (!isInChat) {
        notificationService.notifyNewMessage(
          senderName,
          message,
          roomId,
          buddyType
        );
      }
    });

    // Listen for friend request notifications
    this.socket.on("friend-request-received", (data) => {
      const { fromUser, buddyType } = data;
      notificationService.notifyFriendRequest(fromUser, buddyType);

      // Trigger message update event for navbar
      window.dispatchEvent(new Event("message-update"));
    });

    // Listen for request accepted notifications
    this.socket.on("friend-request-accepted-notification", (data) => {
      const { userName, buddyType } = data;
      notificationService.notifyRequestAccepted(userName, buddyType);

      // Trigger message update event
      window.dispatchEvent(new Event("message-update"));
    });
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

  // Notify server about friend request
  notifyFriendRequest(toUserId, fromUserId, buddyType) {
    if (this.socket) {
      this.socket.emit("friend-request-sent", {
        toUserId,
        fromUserId,
        buddyType,
      });
    }
  }

  // Notify server about accepted request
  notifyRequestAccepted(fromUserId, acceptedByUserId, buddyType) {
    if (this.socket) {
      this.socket.emit("friend-request-accepted", {
        fromUserId,
        acceptedByUserId,
        buddyType,
      });
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
