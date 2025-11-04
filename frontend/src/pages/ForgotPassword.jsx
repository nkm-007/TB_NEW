import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebaseConfig";
import API from "../services/api";

export default function ForgotPassword() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: phone, 2: otp, 3: new password
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
  };

  const handleSendOTP = async () => {
    if (!phone) {
      alert("Please enter phone number");
      return;
    }

    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );

      setConfirmationResult(result);
      setStep(2);
      alert("OTP sent to your phone!");
    } catch (err) {
      console.error("OTP send error:", err);
      alert(err.message || "Failed to send OTP");
      window.recaptchaVerifier = null;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();
      const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

      // Verify with backend that user exists
      await API.post("/auth/forgot-password", {
        phone: formattedPhone,
        firebaseToken,
      });

      setStep(3);
      alert("OTP verified! Set your new password.");
    } catch (err) {
      console.error("Verification error:", err);
      alert(
        err.response?.data?.msg || err.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();
      const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

      await API.post("/auth/reset-password", {
        phone: formattedPhone,
        newPassword,
        firebaseToken,
      });

      alert("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      alert(err.response?.data?.msg || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white">
      <div id="recaptcha-container"></div>

      <h1 className="text-3xl mb-6 font-semibold">Forgot Password</h1>
      <div className="w-80">
        {step === 1 && (
          <>
            <input
              placeholder="Phone number (10 digits)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
            />
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full p-2 bg-white text-black rounded hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="mb-4 text-sm text-gray-400">OTP sent to {phone}</p>
            <input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full p-2 bg-white text-black rounded hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              placeholder="New Password (min 6 characters)"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
            />
            <input
              placeholder="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
            />
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full p-2 bg-white text-black rounded hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
