// import express from "express";
// import {
//   signup,
//   login,
//   forgotPassword,
//   resetPassword,
// } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/signup", signup);
// router.post("/login", login);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

// export default router;
import express from "express";
import {
  sendOTP,
  verifyAndSignup,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-signup", verifyAndSignup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
