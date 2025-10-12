import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const saveProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, profession, interest } = req.body;

    await User.findByIdAndUpdate(decoded.id, { name, profession, interest });
    res.json({ msg: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
