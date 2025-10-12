import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await API.post("/auth/login", { phone, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ phone, isNewUser: false }));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white">
      <h1 className="text-3xl mb-6 font-semibold">Login</h1>
      <div className="w-80">
        <input
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full p-2 bg-white text-black rounded hover:bg-gray-200"
        >
          Login
        </button>
      </div>
    </div>
  );
}
