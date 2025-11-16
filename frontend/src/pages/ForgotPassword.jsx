import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setStep(2);
      alert("OTP sent to your email!");
    } catch (err) {
      console.error("OTP send error:", err);
      alert(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    setStep(3);
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
      await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
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
      <h1 className="text-3xl mb-6 font-semibold">Forgot Password</h1>
      <div className="w-80">
        {step === 1 && (
          <>
            <input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <p className="mb-4 text-sm text-gray-400">OTP sent to {email}</p>
            <input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
            />
            <button
              onClick={handleVerifyOTP}
              disabled={!otp}
              className="w-full p-2 bg-white text-black rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Verify OTP
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
