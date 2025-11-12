// import { useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";

// export default function Signup() {
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     try {
//       await API.post("/auth/signup", { phone, password });
//       alert("OTP sent! Check console (for testing)");
//       setOtpSent(true);
//     } catch (err) {
//       alert(err.response?.data?.msg || "Error signing up");
//     }
//   };

//   const handleVerify = async () => {
//     try {
//       const { data } = await API.post("/auth/verify-otp", { phone, otp });
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify({ phone, isNewUser: true }));
//       navigate("/dashboard");
//     } catch (err) {
//       alert(err.response?.data?.msg || "OTP verification failed");
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col justify-center items-center bg-black text-white">
//       <h1 className="text-3xl mb-6 font-semibold">Create Account</h1>
//       <div className="w-80">
//         <input
//           placeholder="Phone number"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
//         />
//         {!otpSent && (
//           <>
//             <input
//               placeholder="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
//             />
//             <button
//               onClick={handleSignup}
//               className="w-full p-2 bg-white text-black rounded hover:bg-gray-200"
//             >
//               Send OTP
//             </button>
//           </>
//         )}
//         {otpSent && (
//           <>
//             <input
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
//             />
//             <button
//               onClick={handleVerify}
//               className="w-full p-2 bg-white text-black rounded hover:bg-gray-200"
//             >
//               Verify OTP
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebaseConfig";
import API from "../services/api";

export default function Signup() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  // Initialize reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA verified");
          },
        }
      );
    }
  };

  const handleSendOTP = async () => {
    if (!phone || !password) {
      alert("Please enter phone number and password");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // Format phone number with country code
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
      setOtpSent(true);
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
      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();

      // Format phone for backend
      const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

      // Send to backend for user creation
      const { data } = await API.post("/auth/signup", {
        phone: formattedPhone,
        password,
        firebaseToken,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, isNewUser: true })
      );

      alert("Signup successful!");

      // Trigger auth change event for navbar update
      window.dispatchEvent(new Event("auth-change"));

      navigate("/dashboard");
    } catch (err) {
      console.error("Verification error:", err);
      alert(
        err.response?.data?.msg || err.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white">
      <div id="recaptcha-container"></div>

      <h1 className="text-3xl mb-6 font-semibold">Create Account</h1>
      <div className="w-80">
        <input
          placeholder="Phone number (10 digits)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={otpSent}
          className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
        />
        {!otpSent && (
          <>
            <input
              placeholder="Password (min 6 characters)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        {otpSent && (
          <>
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
            <button
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                window.recaptchaVerifier = null;
              }}
              className="w-full mt-2 p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Change Phone Number
            </button>
          </>
        )}
      </div>
    </div>
  );
}
