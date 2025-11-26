// frontend/src/services/notificationService.js

class NotificationService {
  constructor() {
    this.permission =
      typeof Notification !== "undefined" ? Notification.permission : "default";
  }

  // Check if notifications are supported
  isSupported() {
    return "Notification" in window;
  }

  // Check if permission is granted
  isGranted() {
    return this.permission === "granted";
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported()) {
      console.warn("Notifications not supported in this browser");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;

      if (permission === "granted") {
        // Send welcome notification
        this.sendNotification({
          title: "TeaG Notifications Enabled! 🎉",
          body: "You'll now receive notifications for friend requests and messages.",
          tag: "teag-welcome",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  // Send a notification
  sendNotification({ title, body, icon, tag, data, onClick }) {
    if (!this.isSupported()) {
      console.warn("Notifications not supported");
      return null;
    }

    if (!this.isGranted()) {
      console.warn("Notification permission not granted");
      return null;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: icon || "/logo192.png",
        badge: "/logo192.png",
        tag: tag || "teag-notification",
        requireInteraction: false,
        vibrate: [200, 100, 200],
        data: data || {},
      });

      // Handle click event
      if (onClick) {
        notification.onclick = function (event) {
          event.preventDefault();
          window.focus();
          onClick(event);
          notification.close();
        };
      }

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error("Error sending notification:", error);
      return null;
    }
  }

  // Friend request notification
  notifyFriendRequest(fromUser, buddyType = "tea") {
    const icon = buddyType === "tea" ? "☕" : "🍽️";
    const label = buddyType === "tea" ? "Tea Buddy" : "Food Buddy";

    return this.sendNotification({
      title: `New ${label} Request ${icon}`,
      body: `${fromUser.name} wants to connect with you!`,
      tag: "friend-request",
      data: { type: "friend-request", userId: fromUser._id },
      onClick: () => {
        window.location.href = "/chat-list";
      },
    });
  }

  // New message notification
  notifyNewMessage(senderName, message, roomId, buddyType = "tea") {
    const icon = buddyType === "tea" ? "☕" : "🍽️";

    return this.sendNotification({
      title: `${senderName} ${icon}`,
      body: message.length > 50 ? message.substring(0, 50) + "..." : message,
      tag: `message-${roomId}`,
      data: { type: "message", roomId },
      onClick: () => {
        window.location.href = `/chat/${roomId}`;
      },
    });
  }

  // Request accepted notification
  notifyRequestAccepted(userName, buddyType = "tea") {
    const icon = buddyType === "tea" ? "☕" : "🍽️";
    const label = buddyType === "tea" ? "Tea Buddy" : "Food Buddy";

    return this.sendNotification({
      title: `${label} Request Accepted! ${icon}`,
      body: `${userName} accepted your request. Start chatting now!`,
      tag: "request-accepted",
      data: { type: "request-accepted" },
      onClick: () => {
        window.location.href = "/chat-list";
      },
    });
  }

  // Nearby buddy notification
  notifyNearbyBuddy(count, buddyType = "tea") {
    const icon = buddyType === "tea" ? "☕" : "🍽️";
    const label = buddyType === "tea" ? "tea buddies" : "food buddies";

    return this.sendNotification({
      title: `${count} ${label} nearby! ${icon}`,
      body: `There are ${count} people available near you right now.`,
      tag: "nearby-buddies",
      data: { type: "nearby-buddies" },
    });
  }
}

export default new NotificationService();
