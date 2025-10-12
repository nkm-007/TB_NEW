import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const signup = async (req, res) => {
  const { phone, password } = req.body;
  try {
    let user = await User.findOne({ phone });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user = await User.create({
      phone,
      password: hashed,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    // Send OTP (you can print it in console for now)
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ msg: "Signup successful, OTP sent to your phone/email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.otp !== otp || user.otpExpiry < Date.now())
      return res.status(400).json({ msg: "Invalid or expired OTP" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ msg: "OTP verified", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ msg: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
