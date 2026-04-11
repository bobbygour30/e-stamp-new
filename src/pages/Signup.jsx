import React, { useState, useContext } from "react";
import { Mail, Lock, User, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "user", // Default role is user
    vendorDetails: {
      companyName: "",
      gstNumber: "",
      address: "",
      city: "",
      state: "",
      pincode: ""
    }
  });
  const [isVendor, setIsVendor] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRoleToggle = (role) => {
    setIsVendor(role === 'vendor');
    setFormData(prev => ({
      ...prev,
      role: role
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      // Prepare data for API
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role
      };
      
      // Add vendor details if signing up as vendor
      if (formData.role === 'vendor') {
        signupData.vendorDetails = formData.vendorDetails;
      }
      
      await signup(signupData.name, signupData.email, signupData.password, signupData.phone, signupData.role, signupData.vendorDetails);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-white px-6 py-12">

      {/* Background */}
      <div className="absolute -top-24 -right-24 h-96 w-96 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 bg-blue-200/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-2xl">
        <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8">

          {/* Heading */}
          <h2 className="text-3xl font-bold text-slate-900 text-center">
            Create Account
          </h2>
          <p className="text-slate-600 text-center mt-2">
            Join us as a Customer or Vendor
          </p>

          {/* Role Selection Buttons */}
          <div className="flex gap-4 mt-6 mb-6">
            <button
              type="button"
              onClick={() => handleRoleToggle('user')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                !isVendor 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <User size={18} />
              Sign up as Customer
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('vendor')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                isVendor 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Briefcase size={18} />
              Sign up as Vendor
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

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

            {/* Phone */}
            <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
              <Mail className="text-indigo-600 mr-3" size={18} />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={handleChange}
                className="bg-transparent w-full outline-none text-slate-700"
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

            {/* Vendor Specific Fields */}
            {isVendor && (
              <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Company Details</h3>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    name="vendorDetails.companyName"
                    placeholder="Company Name"
                    value={formData.vendorDetails.companyName}
                    onChange={handleChange}
                    className="w-full border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                  
                  <input
                    type="text"
                    name="vendorDetails.gstNumber"
                    placeholder="GST Number (Optional)"
                    value={formData.vendorDetails.gstNumber}
                    onChange={handleChange}
                    className="w-full border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                  
                  <textarea
                    name="vendorDetails.address"
                    placeholder="Company Address"
                    value={formData.vendorDetails.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="vendorDetails.city"
                      placeholder="City"
                      value={formData.vendorDetails.city}
                      onChange={handleChange}
                      className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <input
                      type="text"
                      name="vendorDetails.state"
                      placeholder="State"
                      value={formData.vendorDetails.state}
                      onChange={handleChange}
                      className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <input
                      type="text"
                      name="vendorDetails.pincode"
                      placeholder="Pincode"
                      value={formData.vendorDetails.pincode}
                      onChange={handleChange}
                      className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Creating Account..." : (isVendor ? "Sign up as Vendor" : "Sign up")}
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