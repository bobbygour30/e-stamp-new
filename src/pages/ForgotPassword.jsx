import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setSuccess(response.data.msg);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send reset email. Please try again.");
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

          {/* Back to Login */}
          <Link to="/login" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6">
            <ArrowLeft size={18} className="mr-2" />
            Back to Login
          </Link>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-slate-900 text-center">
            Forgot Password?
          </h2>
          <p className="text-slate-600 text-center mt-2">
            Enter your email and we'll send you a reset link
          </p>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            {/* Email */}
            <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
              <Mail className="text-indigo-600 mr-3" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full outline-none text-slate-700"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}