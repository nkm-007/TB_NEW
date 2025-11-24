// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// export default function Signup() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSendOTP = async () => {
//     if (!email || !password) {
//       alert("Please enter email and password");
//       return;
//     }

//     if (password.length < 6) {
//       alert("Password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);
//     try {
//       await API.post("/auth/send-otp", { email });
//       setOtpSent(true);
//       alert("OTP sent to your email!");
//     } catch (err) {
//       alert(err.response?.data?.msg || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOTP = async () => {
//     if (!otp) {
//       alert("Please enter OTP");
//       return;
//     }

//     setLoading(true);
//     try {
//       const { data } = await API.post("/auth/verify-signup", {
//         email,
//         password,
//         otp,
//       });

//       localStorage.setItem("token", data.token);
//       localStorage.setItem(
//         "user",
//         JSON.stringify({ ...data.user, isNewUser: true })
//       );

//       // alert("Signup successful!");
//       window.dispatchEvent(new Event("auth-change"));
//       navigate("/dashboard");
//     } catch (err) {
//       alert(err.response?.data?.msg || "OTP verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col justify-center items-center bg-black text-white">
//       <h1 className="text-3xl mb-6 font-semibold">Create Account</h1>
//       <div className="w-80">
//         <input
//           placeholder="Email address"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           disabled={otpSent}
//           className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
//         />
//         {!otpSent && (
//           <>
//             <input
//               placeholder="Password (min 6 characters)"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
//             />
//             <button
//               onClick={handleSendOTP}
//               disabled={loading}
//               className="w-full p-2 bg-white text-black rounded hover:bg-gray-200 disabled:opacity-50"
//             >
//               {loading ? "Sending..." : "Send OTP"}
//             </button>
//           </>
//         )}
//         {otpSent && (
//           <>
//             <input
//               placeholder="Enter 6-digit OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               maxLength={6}
//               className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
//             />
//             <button
//               onClick={handleVerifyOTP}
//               disabled={loading}
//               className="w-full p-2 bg-white text-black rounded hover:bg-gray-200 disabled:opacity-50"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import TermsConditionsModal from "../components/TermsConditionsModal";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (!acceptedTerms) {
      alert("Please accept the Terms & Conditions to continue");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/send-otp", { email });
      setOtpSent(true);
      alert("OTP sent to your email!");
    } catch (err) {
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

    setLoading(true);
    try {
      const { data } = await API.post("/auth/verify-signup", {
        email,
        password,
        otp,
      });

      // Clear any old cache
      localStorage.clear();

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, isNewUser: true })
      );

      window.dispatchEvent(new Event("auth-change"));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white px-4">
      <h1 className="text-3xl mb-6 font-semibold">Create Account</h1>
      <div className="w-full max-w-sm">
        <input
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={otpSent}
          className="w-full mb-4 p-3 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-purple-500"
        />
        {!otpSent && (
          <>
            <input
              placeholder="Password (min 6 characters)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 p-3 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-purple-500"
            />

            {/* Terms & Conditions Checkbox */}
            <div className="mb-4 flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-400 leading-relaxed"
              >
                I accept the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-purple-400 hover:text-purple-300 underline font-semibold"
                >
                  Terms & Conditions
                </button>{" "}
                and confirm I am at least 18 years old
              </label>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading || !acceptedTerms}
              className="w-full p-3 bg-white text-black rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition flex items-center justify-center gap-2"
            >
              {loading && <span className="animate-spin">🔄</span>}
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}
        {otpSent && (
          <>
            <div className="mb-4 p-3 bg-purple-900 bg-opacity-30 border border-purple-500 rounded">
              <p className="text-sm text-purple-200">
                ✉️ OTP sent to <strong>{email}</strong>
              </p>
            </div>
            <input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full mb-4 p-3 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-purple-500 text-center text-2xl tracking-widest"
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading || !otp}
              className="w-full p-3 bg-white text-black rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition flex items-center justify-center gap-2"
            >
              {loading && <span className="animate-spin">🔄</span>}
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              onClick={() => {
                setOtpSent(false);
                setOtp("");
              }}
              className="w-full mt-3 p-3 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
            >
              Change Email
            </button>
          </>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-purple-400 hover:text-purple-300 underline font-semibold"
          >
            Login
          </button>
        </p>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <TermsConditionsModal onClose={() => setShowTermsModal(false)} />
      )}
    </div>
  );
}
