import { Search, ShieldCheck, FileText } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-white">
      {/* Decorative background shapes */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        
        {/* Left Content */}
        <div className="space-y-6 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
            <ShieldCheck size={16} />
            Trusted Legal Documentation Platform
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
            Simple, Secure &  
            <span className="text-indigo-600"> Legally Valid</span>  
            <br /> Documentation — Online
          </h1>

          <p className="text-slate-600 max-w-xl">
            Create legally compliant documents, agreements, and affidavits
            online with guided steps, expert-backed formats, and nationwide
            validity.
          </p>

          {/* Search Bar */}
          <div className="flex items-center w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search rental agreement, affidavit, name change..."
              className="flex-1 px-5 py-4 text-slate-700 outline-none"
            />
            <button className="px-6 py-4 bg-indigo-600 text-white hover:bg-indigo-700 transition">
              <Search />
            </button>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#"
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md"
            >
              Get Started
            </a>
            <a
              href="#"
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:border-indigo-600 hover:text-indigo-600 transition"
            >
              Explore Services
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6 pt-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-indigo-600" />
              500K+ Documents Generated
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-600" />
              ISO Certified Processes
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative animate-slide-up">
          <div className="relative rounded-2xl bg-white/70 backdrop-blur-xl shadow-2xl p-6">
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-xl bg-indigo-600/90 text-white flex items-center justify-center font-semibold shadow-lg">
              Legal ✓
            </div>

            <div className="space-y-4">
              <div className="h-40 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-slate-500">
                Illustration / Animation
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-bold text-slate-900">27+</p>
                  <p className="text-sm text-slate-600">States Covered</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-bold text-slate-900">8+</p>
                  <p className="text-sm text-slate-600">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
