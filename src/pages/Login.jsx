import React, { useState, useContext } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      const userRole = response.user?.role || response.data?.user?.role;
      
      // Redirect based on user role
      if (userRole === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-white px-6">
      
      {/* Background */}
      <div className="absolute -top-24 -right-24 h-96 w-96 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 bg-blue-200/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8">

          {/* Heading */}
          <h2 className="text-3xl font-bold text-slate-900 text-center">
            Welcome Back
          </h2>
          <p className="text-slate-600 text-center mt-2">
            Login to your account
          </p>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            {/* Email */}
            <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
              <Mail className="text-indigo-600 mr-3" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent w-full outline-none text-slate-700"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
              <Lock className="text-indigo-600 mr-3" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="bg-transparent w-full outline-none text-slate-700"
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right text-sm">
              <Link to="/forgot-password" className="text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Redirect */}
          <p className="text-center text-slate-600 mt-6">
            Don't have an account?
            <Link
              to="/signup"
              className="ml-2 text-indigo-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}