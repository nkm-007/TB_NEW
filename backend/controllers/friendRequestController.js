// import FriendRequest from "../models/FriendRequest.js";
// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// // Send friend request
// export const sendFriendRequest = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { toUserId } = req.body;

//     // Check if request already exists
//     const existingRequest = await FriendRequest.findOne({
//       from: decoded.id,
//       to: toUserId,
//       status: { $in: ["pending", "accepted"] },
//     });

//     if (existingRequest) {
//       return res.status(400).json({ msg: "Request already sent or accepted" });
//     }

//     // Create room ID
//     const roomId = [decoded.id, toUserId].sort().join("-");

//     const friendRequest = await FriendRequest.create({
//       from: decoded.id,
//       to: toUserId,
//       roomId,
//     });

//     res.json({
//       msg: "Friend request sent",
//       requestId: friendRequest._id,
//     });
//   } catch (err) {
//     console.error("Send friend request error:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Get pending friend requests (received)
// export const getPendingRequests = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const requests = await FriendRequest.find({
//       to: decoded.id,
//       status: "pending",
//     })
//       .populate("from", "name profession interest")
//       .sort({ createdAt: -1 });

//     res.json({ requests });
//   } catch (err) {
//     console.error("Get pending requests error:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Accept friend request
// export const acceptFriendRequest = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { requestId } = req.body;

//     const request = await FriendRequest.findOne({
//       _id: requestId,
//       to: decoded.id,
//       status: "pending",
//     });

//     if (!request) {
//       return res.status(404).json({ msg: "Request not found" });
//     }

//     request.status = "accepted";
//     request.updatedAt = Date.now();
//     await request.save();

//     res.json({
//       msg: "Friend request accepted",
//       roomId: request.roomId,
//     });
//   } catch (err) {
//     console.error("Accept friend request error:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Decline friend request
// export const declineFriendRequest = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { requestId } = req.body;

//     const request = await FriendRequest.findOne({
//       _id: requestId,
//       to: decoded.id,
//       status: "pending",
//     });

//     if (!request) {
//       return res.status(404).json({ msg: "Request not found" });
//     }

//     request.status = "declined";
//     request.updatedAt = Date.now();
//     await request.save();

//     res.json({ msg: "Friend request declined" });
//   } catch (err) {
//     console.error("Decline friend request error:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Check if users are friends (accepted request exists)
// export const checkFriendStatus = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { userId } = req.query;

//     const request = await FriendRequest.findOne({
//       $or: [
//         { from: decoded.id, to: userId },
//         { from: userId, to: decoded.id },
//       ],
//     });

//     res.json({
//       status: request ? request.status : "none",
//       requestId: request?._id,
//       canChat: request?.status === "accepted",
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Send friend request
export const sendFriendRequest = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { toUserId } = req.body;

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      from: decoded.id,
      to: toUserId,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingRequest) {
      return res.status(400).json({ msg: "Request already sent or accepted" });
    }

    // Create room ID
    const roomId = [decoded.id, toUserId].sort().join("-");

    const friendRequest = await FriendRequest.create({
      from: decoded.id,
      to: toUserId,
      roomId,
    });

    // Populate sender info
    const populatedRequest = await FriendRequest.findById(
      friendRequest._id
    ).populate("from", "name profession interest");

    // Emit socket event to receiver
    req.app.get("io").emit(`friend-request-${toUserId}`, {
      request: populatedRequest,
    });

    res.json({
      msg: "Friend request sent",
      requestId: friendRequest._id,
    });
  } catch (err) {
    console.error("Send friend request error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Get pending friend requests (received)
export const getPendingRequests = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const requests = await FriendRequest.find({
      to: decoded.id,
      status: "pending",
    })
      .populate("from", "name profession interest")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (err) {
    console.error("Get pending requests error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Accept friend request
export const acceptFriendRequest = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { requestId } = req.body;

    const request = await FriendRequest.findOne({
      _id: requestId,
      to: decoded.id,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    request.status = "accepted";
    request.updatedAt = Date.now();
    await request.save();

    // Emit socket event to sender
    req.app.get("io").emit(`request-accepted-${request.from}`, {
      acceptedBy: decoded.id,
      roomId: request.roomId,
    });

    res.json({
      msg: "Friend request accepted",
      roomId: request.roomId,
    });
  } catch (err) {
    console.error("Accept friend request error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Decline friend request
export const declineFriendRequest = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { requestId } = req.body;

    const request = await FriendRequest.findOne({
      _id: requestId,
      to: decoded.id,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    request.status = "declined";
    request.updatedAt = Date.now();
    await request.save();

    res.json({ msg: "Friend request declined" });
  } catch (err) {
    console.error("Decline friend request error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Check if users are friends (accepted request exists)
export const checkFriendStatus = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = req.query;

    const request = await FriendRequest.findOne({
      $or: [
        { from: decoded.id, to: userId },
        { from: userId, to: decoded.id },
      ],
    });

    res.json({
      status: request ? request.status : "none",
      requestId: request?._id,
      canChat: request?.status === "accepted",
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
