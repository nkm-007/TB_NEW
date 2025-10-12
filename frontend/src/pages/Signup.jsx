import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", { phone, password });
      alert("OTP sent! Check console (for testing)");
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.msg || "Error signing up");
    }
  };

  const handleVerify = async () => {
    try {
      const { data } = await API.post("/auth/verify-otp", { phone, otp });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ phone, isNewUser: true }));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "OTP verification failed");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white">
      <h1 className="text-3xl mb-6 font-semibold">Create Account</h1>
      <div className="w-80">
        <input
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
        />
        {!otpSent && (
          <>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
            />
            <button
              onClick={handleSignup}
              className="w-full p-2 bg-white text-black rounded hover:bg-gray-200"
            >
              Send OTP
            </button>
          </>
        )}
        {otpSent && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
            />
            <button
              onClick={handleVerify}
              className="w-full p-2 bg-white text-black rounded hover:bg-gray-200"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
