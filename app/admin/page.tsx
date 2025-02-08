"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "mehmilzeeshan125@gmail.com" && password === "fatiandashibffs") {
      Swal.fire({
        title: "Login Successful!",
        text: "Welcome Mehmil Zeeshan to your Admin Dashboard.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/admin/dashboard");
      });
    } else {
      Swal.fire({
        title: "Login Failed",
        text: "Invalid Email or Password",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96 border border-gray-500">
        <h2 className="text-3xl font-bold text-center mb-3 text-white">Admin Login</h2>
        
        {/* Lock Icon Below Heading */}
        <div className="flex justify-center mb-4">
          <FaLock className="text-gray-300 text-3xl" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 bg-transparent border border-gray-500 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 bg-transparent border border-gray-500 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button
              type="button"
              className="absolute right-4 top-3 text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}


