import React, { useState, useContext } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signup } = useContext(AuthContext);
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed. Please try again.");
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
            Create Account
          </h2>
          <p className="text-slate-600 text-center mt-2">
            Start your journey with us
          </p>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            {/* Name */}
            <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
              <User className="text-indigo-600 mr-3" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="bg-transparent w-full outline-none text-slate-700"
                required
              />
            </div>

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
                minLength="6"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
              <Lock className="text-indigo-600 mr-3" size={18} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-transparent w-full outline-none text-slate-700"
                required
                minLength="6"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Redirect */}
          <p className="text-center text-slate-600 mt-6">
            Already have an account?
            <Link
              to="/login"
              className="ml-2 text-indigo-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}