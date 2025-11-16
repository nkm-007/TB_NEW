import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTPEmail } from "../services/emailService.js";

// Send OTP to email
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save new OTP to database
    await OTP.create({ email, otp });

    // Send email
    await sendOTPEmail(email, otp);

    console.log(`✅ OTP sent to ${email}: ${otp}`); // For testing
    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ msg: "Failed to send OTP. Please try again." });
  }
};

// Verify OTP and Signup
export const verifyAndSignup = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    if (!email || !password || !otp) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create user
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ email, password: hashed });

    // Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      msg: "Signup successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        profileCompleted: false,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Login (no OTP needed)
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

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
        email: user.email,
        name: user.name,
        profession: user.profession,
        professionDetails: user.professionDetails,
        interest: user.interest,
        profileCompleted: user.profileCompleted,
        availableForTea: user.availableForTea,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Generate and send OTP
    const otp = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp });
    await sendOTPEmail(email, otp);

    console.log(`✅ Password reset OTP sent to ${email}: ${otp}`);
    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Update password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    // Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ msg: err.message });
  }
};
// Verify Firebase ID Token (OTP verification happens on frontend via Firebase)
// export const signup = async (req, res) => {
//   const { phone, password, firebaseToken } = req.body;

//   try {
//     // Verify Firebase token
//     const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
//     const phoneFromToken = decodedToken.phone_number;

//     // Check if phone matches
//     if (phoneFromToken !== phone) {
//       return res.status(400).json({ msg: "Phone number mismatch" });
//     }

//     // Check if user already exists
//     let user = await User.findOne({ phone });
//     if (user) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     // Hash password
//     const hashed = await bcrypt.hash(password, 10);

//     // Create user
//     user = await User.create({
//       phone,
//       password: hashed,
//     });

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });

//     res.json({
//       msg: "Signup successful",
//       token,
//       user: {
//         id: user._id,
//         phone: user.phone,
//         profileCompleted: user.profileCompleted,
//       },
//     });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// export const login = async (req, res) => {
//   const { phone, password } = req.body;

//   try {
//     const user = await User.findOne({ phone });
//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Incorrect password" });
//     }

//     // Update last active
//     user.lastActive = Date.now();
//     await user.save();

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });

//     res.json({
//       msg: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         phone: user.phone,
//         name: user.name,
//         profession: user.profession,
//         interest: user.interest,
//         profileCompleted: user.profileCompleted,
//         availableForTea: user.availableForTea,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // Forgot password - send OTP
// export const forgotPassword = async (req, res) => {
//   const { phone, firebaseToken } = req.body;

//   try {
//     // Verify Firebase token
//     const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
//     const phoneFromToken = decodedToken.phone_number;

//     if (phoneFromToken !== phone) {
//       return res.status(400).json({ msg: "Phone number mismatch" });
//     }

//     const user = await User.findOne({ phone });
//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     res.json({ msg: "OTP verified, proceed to reset password" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Reset password
// export const resetPassword = async (req, res) => {
//   const { phone, newPassword, firebaseToken } = req.body;

//   try {
//     // Verify Firebase token
//     const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
//     const phoneFromToken = decodedToken.phone_number;

//     if (phoneFromToken !== phone) {
//       return res.status(400).json({ msg: "Phone number mismatch" });
//     }

//     const user = await User.findOne({ phone });
//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     const hashed = await bcrypt.hash(newPassword, 10);
//     user.password = hashed;
//     await user.save();

//     res.json({ msg: "Password reset successful" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
