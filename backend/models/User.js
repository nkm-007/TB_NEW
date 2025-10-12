import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String },
  profession: { type: String },
  interest: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
});

export default mongoose.model("User", userSchema);
