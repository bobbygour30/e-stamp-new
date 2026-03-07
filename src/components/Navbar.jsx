"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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
        {name: "Rental Agreements", path: "/rental-agreements"}
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
      label: "Resources",
      submenu: [
        { name: "Blogs", path: "#" },
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
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold">
                L
              </div>
              <span className="text-lg font-semibold text-slate-900">
                LexDraft
              </span>
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
                  <button className="flex items-center gap-1 text-slate-700 font-medium hover:text-indigo-600 transition">
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
                        className="block px-5 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <Link
                to="/get-started"
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-sm"
              >
                Get Started
              </Link>
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
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-900">
                Menu
              </span>
              <button onClick={() => setMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            {navItems.map((item, idx) => (
              <details key={idx} className="group">
                <summary className="flex cursor-pointer items-center justify-between py-2 text-slate-700 font-medium">
                  {item.label}
                  <ChevronDown className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="ml-3 flex flex-col gap-2 pb-2">
                  {item.submenu.map((sub, subIdx) => (
                    <Link
                      key={subIdx}
                      to={sub.path}
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-slate-600 hover:text-indigo-600 transition"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </details>
            ))}

            <Link
              to="/get-started"
              onClick={() => setMenuOpen(false)}
              className="mt-4 px-4 py-3 rounded-lg bg-indigo-600 text-white text-center font-medium hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
