import User from "../models/User.js";
import jwt from "jsonwebtoken";
import admin from "../config/firebase.js";

// Save/Update profile
export const saveProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, profession, interest } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        name,
        profession,
        interest,
        profileCompleted: true,
      },
      { new: true }
    );

    res.json({
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        profession: user.profession,
        interest: user.interest,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update phone number (requires OTP verification)
export const updatePhone = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { newPhone, firebaseToken } = req.body;

    // Verify Firebase token for new phone number
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phoneFromToken = decodedToken.phone_number;

    if (phoneFromToken !== newPhone) {
      return res.status(400).json({ msg: "Phone number mismatch" });
    }

    // Check if new phone already exists
    const existingUser = await User.findOne({ phone: newPhone });
    if (existingUser) {
      return res.status(400).json({ msg: "Phone number already registered" });
    }

    // Update phone
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { phone: newPhone },
      { new: true }
    ).select("-password");

    res.json({
      msg: "Phone number updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Toggle availability
export const toggleAvailability = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { availableForTea } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { availableForTea, lastActive: Date.now() },
      { new: true }
    ).select("-password");

    res.json({
      msg: "Availability updated",
      availableForTea: user.availableForTea,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update location
export const updateLocation = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { longitude, latitude } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        lastActive: Date.now(),
      },
      { new: true }
    ).select("-password");

    res.json({
      msg: "Location updated",
      location: user.location,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
