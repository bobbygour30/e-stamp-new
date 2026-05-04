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
  IdCard,
  FileWarning,
  HeartHandshake,
  Baby,
  Users,
  PenTool,
  FileSignature,
  Heart,
  ScrollText,
  Calendar,
  Landmark,
  School,
  DollarSign,
  UserMinus,
  BookOpen,
  Home,
  Stamp,
  FileText,
  Briefcase,
  Phone,
  HelpCircle,
  Book,
  ArrowRight,
  Star,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import assets from "../assets/assets";

// Custom UserPlus Icon
const UserPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

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

  // All legal documents with their icons, colors, and descriptions
  const allLegalDocuments = [
    { name: "Address Proof", path: "/address-proof", icon: IdCard, color: "from-blue-500 to-blue-600", description: "Official address verification document", popular: true },
    { name: "Lost Document", path: "/lost-document", icon: FileWarning, color: "from-orange-500 to-orange-600", description: "Declaration for lost certificates", popular: false },
    { name: "Marriage Registration", path: "/marriage-registration", icon: HeartHandshake, color: "from-pink-500 to-pink-600", description: "Legal marriage certificate registration", popular: true },
    { name: "Name Addition (Birth Certificate)", path: "/name-addition-birth-certificate", icon: Baby, color: "from-cyan-500 to-cyan-600", description: "Add name to birth certificate", popular: false },
    { name: "Name Correction", path: "/name-correction", icon: PenTool, color: "from-violet-500 to-violet-600", description: "Correct name in documents", popular: true },
    { name: "After Marriage Name Change", path: "/after-marriage-name-change", icon: Users, color: "from-red-500 to-red-600", description: "Name change post marriage", popular: false },
    { name: "Signature Change", path: "/signature", icon: FileSignature, color: "from-indigo-500 to-indigo-600", description: "Update signature legally", popular: false },
    { name: "First Baby", path: "/first-baby", icon: Baby, color: "from-sky-500 to-sky-600", description: "First child documentation", popular: true },
    { name: "Single Girl Child", path: "/single-girl", icon: Heart, color: "from-pink-400 to-pink-500", description: "Single girl child benefits", popular: false },
    { name: "Additional Name", path: "/additional-name", icon: UserPlus, color: "from-teal-500 to-teal-600", description: "Add secondary name", popular: false },
    { name: "Birth Certificate", path: "/birth-certificate", icon: ScrollText, color: "from-green-500 to-green-600", description: "Official birth record", popular: true },
    { name: "Short Attendance", path: "/short-attendence", icon: Calendar, color: "from-yellow-500 to-yellow-600", description: "Attendance certificate", popular: false },
    { name: "Anti Ragging", path: "/anti-ragging", icon: Shield, color: "from-red-600 to-red-700", description: "Anti-ragging undertaking", popular: false },
    { name: "Education Loan", path: "/education-loan", icon: Landmark, color: "from-amber-500 to-amber-600", description: "Education loan documents", popular: true },
    { name: "Gap Year", path: "/gap-year", icon: School, color: "from-orange-500 to-orange-600", description: "Academic gap affidavit", popular: false },
    { name: "Income Certificate", path: "/income", icon: DollarSign, color: "from-lime-500 to-lime-600", description: "Income proof document", popular: true },
    { name: "Name Change", path: "/name-change", icon: UserMinus, color: "from-purple-500 to-purple-600", description: "Complete name change", popular: true },
    { name: "Marriage Register", path: "/marriage-register", icon: BookOpen, color: "from-rose-500 to-rose-600", description: "Marriage register extract", popular: false },
    { name: "Rental Agreements", path: "/rental-agreements", icon: Home, color: "from-emerald-500 to-emerald-600", description: "Legal rent agreement", popular: true },
  ];

  const navItems = [
    {
      label: "Stamp Papers",
      submenu: [
        { name: "Buy e-Stamp", path: "#", icon: Stamp },
        { name: "State-wise e-Stamp", path: "#", icon: FileText },
        { name: "Stamp Duty Guide", path: "#", icon: Book },
      ],
      icon: Stamp,
    },
    {
      label: "Legal Documents",
      hasBigCards: true,
      documents: allLegalDocuments,
    },
    {
      label: "Services",
      submenu: [
        { name: "Document Drafting", path: "#", icon: FileText },
        { name: "Notary Support", path: "#", icon: Stamp },
        { name: "Legal Consultation", path: "#", icon: Briefcase },
      ],
      icon: Briefcase,
    },
    {
      label: "Contact Us",
      submenu: [
        { name: "Contact Information", path: "/contact", icon: Phone },
        { name: "FAQs", path: "#", icon: HelpCircle },
        { name: "Legal Guides", path: "#", icon: Book },
      ],
      icon: Phone,
    },
  ];

  return (
    <header className="w-full">
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-100 text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap justify-between items-center gap-2">
          <p className="opacity-90 flex items-center gap-2">
            <Shield size={14} /> Trusted platform for legal & documentation services
          </p>
          <p className="opacity-90">
            Support: <span className="font-medium">+91 9711149319</span>
          </p>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src={assets.logo}
                alt="Company Logo"
                className="h-14 w-auto object-contain sm:h-12 md:h-14 lg:h-16 max-w-[220px]"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(idx)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 text-slate-700 font-medium hover:text-purple-700 transition group">
                    {item.label}
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                  </button>

                  {/* BIG CARDS DROPDOWN for Legal Documents */}
                  {item.hasBigCards ? (
                    <div
                      className={`fixed left-1/2 transform -translate-x-1/2 mt-3 w-[95vw] max-w-[1400px] rounded-2xl bg-white shadow-2xl border border-slate-100 z-50 overflow-hidden
                      transition-all duration-300 origin-top
                      ${
                        activeDropdown === idx
                          ? "opacity-100 scale-100 visible"
                          : "opacity-0 scale-95 invisible"
                      }`}
                    >
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-white">Legal Documents</h2>
                            <p className="text-purple-100 text-sm mt-1">Choose from 19+ verified legal document templates</p>
                          </div>
                          <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-white text-sm font-medium">Trusted by 10,000+ customers</span>
                          </div>
                        </div>
                      </div>

                      {/* Big Cards Grid */}
                      <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {item.documents.map((doc, docIdx) => {
                            const IconComponent = doc.icon;
                            return (
                              <Link
                                key={docIdx}
                                to={doc.path}
                                onClick={() => setActiveDropdown(null)}
                                className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100"
                              >
                                {/* Gradient Top Bar */}
                                <div className={`h-2 bg-gradient-to-r ${doc.color}`} />
                                
                                {/* Card Content */}
                                <div className="p-5">
                                  <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${doc.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                      <IconComponent size={24} className="text-white" />
                                    </div>
                                    {doc.popular && (
                                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold">
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  
                                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                                    {doc.name}
                                  </h3>
                                  
                                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                    {doc.description}
                                  </p>
                                  
                                  <div className="flex items-center gap-2 text-purple-600 font-medium text-sm group-hover:gap-3 transition-all">
                                    Get Started
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                  </div>
                                </div>
                                
                                {/* Hover Overlay Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${doc.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer Section */}
                      <div className="bg-gradient-to-r from-purple-50 to-white px-8 py-4 border-t border-purple-100">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <p className="text-sm text-slate-600">
                            🚀 Need help? <span className="text-purple-600 font-semibold">+91 9711149319</span>
                          </p>
                          <Link 
                            to="/all-documents" 
                            onClick={() => setActiveDropdown(null)}
                            className="text-purple-600 font-medium text-sm hover:text-purple-700 flex items-center gap-1"
                          >
                            View All Documents
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Regular Dropdown with Icons */
                    <div
                      className={`absolute left-0 mt-3 w-72 rounded-2xl bg-white shadow-xl border border-slate-100 z-50 overflow-hidden
                      transition-all duration-300
                      ${
                        activeDropdown === idx
                          ? "opacity-100 translate-y-0 visible"
                          : "opacity-0 -translate-y-2 invisible"
                      }`}
                    >
                      <div className="py-2">
                        {item.submenu.map((sub, subIdx) => {
                          const IconComponent = sub.icon;
                          return (
                            <Link
                              key={subIdx}
                              to={sub.path}
                              className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition group"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                                {IconComponent && <IconComponent size={14} />}
                              </div>
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* AUTH ICON DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={() => setAuthDropdown(true)}
                onMouseLeave={() => setAuthDropdown(false)}
              >
                <button className="flex items-center gap-2 text-slate-700 hover:text-purple-700 transition">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                    <User size={18} className="text-white" />
                  </div>
                  {user && (
                    <span className="text-sm font-medium text-slate-700">
                      {user.name.split(" ")[0]}
                    </span>
                  )}
                </button>

                <div
                  className={`absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 z-50 overflow-hidden
                  transition-all duration-300
                  ${
                    authDropdown
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 -translate-y-2 invisible"
                  }`}
                >
                  {user ? (
                    <>
                      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <User size={18} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        {user.role === "admin" && (
                          <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>

                      {user.role !== "admin" && (
                        <Link
                          to="/dashboard"
                          onClick={() => setAuthDropdown(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition group"
                        >
                          <LayoutDashboard size={16} className="text-purple-500" />
                          My Dashboard
                        </Link>
                      )}

                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setAuthDropdown(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-purple-600 hover:bg-purple-50 transition group"
                        >
                          <Shield size={16} />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition border-t border-slate-100"
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

              {/* Dashboard/Admin Panel Button */}
              {user && user.role !== "admin" && (
                <Link
                  to="/dashboard"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:from-purple-700 hover:to-purple-800 transition shadow-md hover:shadow-lg"
                >
                  Dashboard
                </Link>
              )}

              {user && user.role === "admin" && (
                <Link
                  to="/admin"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:from-purple-700 hover:to-purple-800 transition shadow-md hover:shadow-lg"
                >
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-slate-800 p-2 hover:bg-purple-50 rounded-lg transition"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>

        {/* CSS for custom scrollbar */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c084fc;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a855f7;
          }
        `}</style>

        {/* Mobile Overlay & Drawer - Keep existing mobile code */}
        <div
          className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity ${
            menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        <div
          className={`lg:hidden fixed top-0 right-0 z-50 h-full w-85 bg-white shadow-2xl transform transition-transform duration-300 ease-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-full">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xl font-bold text-purple-700">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-purple-50 rounded-lg transition">
                <X size={22} />
              </button>
            </div>

            {user && (
              <div className="bg-gradient-to-r from-purple-50 to-white rounded-xl p-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    {user.role === "admin" && (
                      <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Admin</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Items */}
            {navItems.map((item, idx) => (
              <details key={idx} className="group">
                <summary className="flex cursor-pointer items-center justify-between py-3 text-slate-700 font-semibold hover:text-purple-700 transition">
                  {item.label}
                  <ChevronDown className="group-open:rotate-180 transition-transform duration-300" size={18} />
                </summary>
                <div className="ml-4 mt-2 flex flex-col gap-2 pb-3">
                  {item.hasBigCards ? (
                    <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                      {item.documents.map((doc, docIdx) => {
                        const IconComponent = doc.icon;
                        return (
                          <Link
                            key={docIdx}
                            to={doc.path}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-purple-700 transition rounded-lg hover:bg-purple-50"
                          >
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${doc.color} text-white`}>
                              <IconComponent size={16} />
                            </div>
                            <div className="flex-1">
                              <span className="font-medium">{doc.name}</span>
                              <p className="text-xs text-slate-400">{doc.description}</p>
                            </div>
                            {doc.popular && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Popular</span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    item.submenu?.map((sub, subIdx) => {
                      const IconComponent = sub.icon;
                      return (
                        <Link
                          key={subIdx}
                          to={sub.path}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 text-sm text-slate-600 hover:text-purple-700 transition py-2 px-2 rounded-lg hover:bg-purple-50"
                        >
                          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
                            {IconComponent && <IconComponent size={12} />}
                          </div>
                          {sub.name}
                        </Link>
                      );
                    })
                  )}
                </div>
              </details>
            ))}

            <div className="border-t border-slate-200 my-3"></div>

            {user ? (
              <>
                {user.role !== "admin" && (
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-slate-700 font-medium hover:text-purple-700 transition py-2 px-2 rounded-lg hover:bg-purple-50">
                    <LayoutDashboard size={18} className="text-purple-500" />
                    My Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-purple-600 font-medium hover:text-purple-700 transition py-2 px-2 rounded-lg hover:bg-purple-50">
                    <Shield size={18} />
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-3 text-red-600 font-medium hover:text-red-700 transition py-2 px-2 rounded-lg hover:bg-red-50">
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-slate-700 font-medium hover:text-purple-700 transition py-2 px-2 rounded-lg hover:bg-purple-50">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="text-slate-700 font-medium hover:text-purple-700 transition py-2 px-2 rounded-lg hover:bg-purple-50">Sign Up</Link>
              </>
            )}

            {user && user.role !== "admin" && (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center font-medium hover:from-purple-700 hover:to-purple-800 transition shadow-md">
                Go to Dashboard
              </Link>
            )}
            {user && user.role === "admin" && (
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center font-medium hover:from-purple-700 hover:to-purple-800 transition shadow-md">
                Go to Admin Panel
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}