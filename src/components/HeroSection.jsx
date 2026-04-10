import { Search, ShieldCheck, FileText, Stamp } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-white">
      {/* Decorative background shapes */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        
        {/* Left Content */}
        <div className="space-y-6 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
            <ShieldCheck size={16} />
            Trusted Legal Documentation Platform
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
            Secure Your Agreements with  
            <span className="text-purple-700"> Verified e-Stamping</span>
          </h1>

          <p className="text-slate-600 text-lg max-w-xl">
            Fast & Reliable e-Stamp Services — Create legally compliant documents, agreements, and affidavits
            online with guided steps, expert-backed formats, and nationwide validity.
          </p>

          {/* Search Bar */}
          <div className="flex items-center w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
            <input
              type="text"
              placeholder="Search rental agreement, affidavit, name change..."
              className="flex-1 px-5 py-4 text-slate-700 outline-none"
            />
            <button className="px-6 py-4 bg-purple-700 text-white hover:bg-purple-800 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#"
              className="px-6 py-3 rounded-xl bg-purple-700 text-white font-medium hover:bg-purple-800 transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </a>
            <a
              href="#"
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:border-purple-700 hover:text-purple-700 transition-all"
            >
              Explore Services
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6 pt-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Stamp size={16} className="text-purple-700" />
              500K+ Documents Generated
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-purple-700" />
              ISO Certified Processes
            </div>
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-purple-700" />
              Legally Valid Across India
            </div>
          </div>
        </div>

        {/* Right Visual - Stats Cards */}
        <div className="relative animate-slide-up">
          <div className="relative rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl p-6 border border-slate-100">
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-xl bg-purple-700 text-white flex items-center justify-center font-semibold shadow-lg">
              <Stamp size={28} />
            </div>

            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-5 text-center border border-purple-100 shadow-sm">
                  <p className="text-3xl font-bold text-purple-700">27+</p>
                  <p className="text-sm text-slate-600 font-medium">States Covered</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-5 text-center border border-purple-100 shadow-sm">
                  <p className="text-3xl font-bold text-purple-700">8+</p>
                  <p className="text-sm text-slate-600 font-medium">Years Experience</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-5 text-center border border-purple-100 shadow-sm">
                  <p className="text-3xl font-bold text-purple-700">1M+</p>
                  <p className="text-sm text-slate-600 font-medium">Happy Users</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-5 text-center border border-purple-100 shadow-sm">
                  <p className="text-3xl font-bold text-purple-700">99.9%</p>
                  <p className="text-sm text-slate-600 font-medium">Success Rate</p>
                </div>
              </div>

              {/* Trust Message */}
              <div className="flex items-center justify-center gap-2 pt-2 text-sm text-slate-500 border-t border-slate-100 pt-4">
                <ShieldCheck size={14} className="text-purple-700" />
                <span>Trusted by 10,000+ legal professionals</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}