"use client";

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import assets from "../assets/assets";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [authDropdown, setAuthDropdown] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAuthDropdown(false);
    navigate("/");
  };

  const navItems = [
    {
      label: "Stamp Papers",
      submenu: [
        { name: "Buy e-Stamp", path: "#" },
        { name: "State-wise e-Stamp", path: "#" },
        { name: "Stamp Duty Guide", path: "#" },
      ],
    },
    {
      label: "Legal Documents",
      submenu: [
        { name: "Address Proof", path: "/address-proof" },
        { name: "Lost Document", path: "/lost-document" },
        { name: "Marriage Registration", path: "/marriage-registration" },
        {
          name: "Name Addition (Birth Certificate)",
          path: "/name-addition-birth-certificate",
        },
        { name: "Name Correction", path: "/name-correction" },
        {
          name: "After Marriage Name Change",
          path: "/after-marriage-name-change",
        },
        { name: "Signature Change", path: "/signature" },
        { name: "First Baby", path: "/first-baby" },
        { name: "Single Girl Child", path: "/single-girl" },
        { name: "Additional Name", path: "/additional-name" },
        { name: "Birth Certificate", path: "/birth-certificate" },
        { name: "Short Attendance", path: "/short-attendence" },
        { name: "Anti Ragging", path: "/anti-ragging" },
        { name: "Education Loan", path: "/education-loan" },
        { name: "Gap Year", path: "/gap-year" },
        { name: "Income Certificate", path: "/income" },
        { name: "Name Change", path: "/name-change" },
        { name: "Marriage Register", path: "/marriage-register" },
        { name: "Rental Agreements", path: "/rental-agreements" },
      ],
    },
    {
      label: "Services",
      submenu: [
        { name: "Document Drafting", path: "#" },
        { name: "Notary Support", path: "#" },
        { name: "Consultation", path: "#" },
      ],
    },
    {
      label: "Contact Us",
      submenu: [
        { name: "Contact Information", path: "/contact" },
        { name: "FAQs", path: "#" },
        { name: "Legal Guides", path: "#" },
      ],
    },
  ];

  return (
    <header className="w-full">
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-100 text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap justify-between items-center gap-2">
          <p className="opacity-90">
            ✔ Trusted platform for legal & documentation services
          </p>
          <p className="opacity-90">
            Support: <span className="font-medium">+91 98765 43210</span>
          </p>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
  src={assets.logo}
  alt="Company Logo"
  className="h-14 w-auto object-contain 
             sm:h-12 md:h-14 lg:h-16 
             max-w-[220px]"
/>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(idx)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 text-slate-700 font-medium hover:text-purple-700 transition">
                    {item.label}
                    <ChevronDown size={16} />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute left-0 mt-3 w-72 rounded-xl bg-white shadow-xl border border-slate-100 z-50
                    transition-all duration-300
                    ${
                      activeDropdown === idx
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-2 invisible"
                    }`}
                  >
                    {item.submenu.map((sub, subIdx) => (
                      <Link
                        key={subIdx}
                        to={sub.path}
                        className="block px-5 py-3 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* AUTH ICON DROPDOWN - Updated with user context and admin link */}
              <div
                className="relative"
                onMouseEnter={() => setAuthDropdown(true)}
                onMouseLeave={() => setAuthDropdown(false)}
              >
                <button className="flex items-center gap-2 text-slate-700 hover:text-purple-700 transition">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <User size={18} className="text-purple-700" />
                  </div>
                  {user && (
                    <span className="text-sm font-medium text-slate-700">
                      {user.name.split(" ")[0]}
                    </span>
                  )}
                </button>

                <div
                  className={`absolute right-0 mt-3 w-56 rounded-xl bg-white shadow-xl border border-slate-100 z-50
                  transition-all duration-300
                  ${
                    authDropdown
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 -translate-y-2 invisible"
                  }`}
                >
                  {user ? (
                    <>
                      <div className="px-5 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user.email}
                        </p>
                        {user.role === "admin" && (
                          <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            Admin
                          </span>
                        )}
                      </div>

                      {/* Only show My Dashboard for non-admin users */}
                      {user.role !== "admin" && (
                        <Link
                          to="/dashboard"
                          onClick={() => setAuthDropdown(false)}
                          className="flex items-center gap-2 px-5 py-3 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                        >
                          <LayoutDashboard size={16} />
                          My Dashboard
                        </Link>
                      )}

                      {/* Admin Dashboard Link - Only for admin users */}
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setAuthDropdown(false)}
                          className="flex items-center gap-2 px-5 py-3 text-sm text-purple-600 hover:bg-purple-50 transition"
                        >
                          <Shield size={16} />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition border-t border-slate-100"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setAuthDropdown(false)}
                        className="block px-5 py-3 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setAuthDropdown(false)}
                        className="block px-5 py-3 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Dashboard/Admin Panel Button - Only shown when user is logged in */}
              {user && user.role !== "admin" && (
                <Link
                  to="/dashboard"
                  className="px-5 py-2 rounded-lg bg-purple-700 text-white font-medium hover:bg-purple-800 transition shadow-sm"
                >
                  Dashboard
                </Link>
              )}

              {user && user.role === "admin" && (
                <Link
                  to="/admin"
                  className="px-5 py-2 rounded-lg bg-purple-700 text-white font-medium hover:bg-purple-800 transition shadow-sm"
                >
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-slate-800"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        <div
          className={`lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity ${
            menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Mobile Drawer */}
        <div
          className={`lg:hidden fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-full">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-900">Menu</span>
              <button onClick={() => setMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            {/* User Info for Mobile */}
            {user && (
              <div className="bg-purple-50 rounded-lg p-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                    <User size={20} className="text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-600 truncate">
                      {user.email}
                    </p>
                    {user.role === "admin" && (
                      <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {navItems.map((item, idx) => (
              <details key={idx} className="group">
                <summary className="flex cursor-pointer items-center justify-between py-2 text-slate-700 font-medium">
                  {item.label}
                  <ChevronDown
                    className="group-open:rotate-180 transition-transform"
                    size={16}
                  />
                </summary>
                <div className="ml-3 flex flex-col gap-2 pb-2">
                  {item.submenu.map((sub, subIdx) => (
                    <Link
                      key={subIdx}
                      to={sub.path}
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-slate-600 hover:text-purple-700 transition py-1"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </details>
            ))}

            {/* Divider */}
            <div className="border-t border-slate-200 my-2"></div>

            {/* MOBILE AUTH SECTION - Updated with user context and admin link */}
            {user ? (
              <>
                {/* Only show My Dashboard for non-admin users */}
                {user.role !== "admin" && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-slate-700 font-medium hover:text-purple-700 transition py-2"
                  >
                    <LayoutDashboard size={18} />
                    My Dashboard
                  </Link>
                )}

                {/* Admin Dashboard Link for Mobile - Only for admin users */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition py-2"
                  >
                    <Shield size={18} />
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition py-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-700 font-medium hover:text-purple-700 transition py-2"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-700 font-medium hover:text-purple-700 transition py-2"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Dashboard/Admin Panel Button */}
            {user && user.role !== "admin" && (
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="mt-4 px-4 py-3 rounded-lg bg-purple-700 text-white text-center font-medium hover:bg-purple-800 transition"
              >
                Go to Dashboard
              </Link>
            )}

            {user && user.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="mt-4 px-4 py-3 rounded-lg bg-purple-700 text-white text-center font-medium hover:bg-purple-800 transition"
              >
                Go to Admin Panel
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
