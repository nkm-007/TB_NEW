import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import admin from "../config/firebase.js";

// Verify Firebase ID Token (OTP verification happens on frontend via Firebase)
export const signup = async (req, res) => {
  const { phone, password, firebaseToken } = req.body;

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phoneFromToken = decodedToken.phone_number;

    // Check if phone matches
    if (phoneFromToken !== phone) {
      return res.status(400).json({ msg: "Phone number mismatch" });
    }

    // Check if user already exists
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    user = await User.create({
      phone,
      password: hashed,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      msg: "Signup successful",
      token,
      user: {
        id: user._id,
        phone: user.phone,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    // Update last active
    user.lastActive = Date.now();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        profession: user.profession,
        interest: user.interest,
        profileCompleted: user.profileCompleted,
        availableForTea: user.availableForTea,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Forgot password - send OTP
export const forgotPassword = async (req, res) => {
  const { phone, firebaseToken } = req.body;

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phoneFromToken = decodedToken.phone_number;

    if (phoneFromToken !== phone) {
      return res.status(400).json({ msg: "Phone number mismatch" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    res.json({ msg: "OTP verified, proceed to reset password" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { phone, newPassword, firebaseToken } = req.body;

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phoneFromToken = decodedToken.phone_number;

    if (phoneFromToken !== phone) {
      return res.status(400).json({ msg: "Phone number mismatch" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
