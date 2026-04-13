import { Search, ShieldCheck, FileText, Stamp, Award, CheckCircle, ArrowRight, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-white">
      {/* Decorative background shapes - enhanced */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-purple-100/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        
        {/* Top Banner - India's No. 1 Portal */}
        <div className="flex justify-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600/10 to-purple-500/5 border border-purple-200/50 shadow-sm backdrop-blur-sm">
            <Award size={18} className="text-purple-700" />
            <span className="text-slate-700 font-medium">India's <span className="font-bold text-purple-700">No. 1</span> Legal Documentation Portal</span>
            <span className="text-xs text-slate-500">— Serving millions across 27 states since 2016</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          
          {/* Left Content - Enhanced */}
          <div className="space-y-7 animate-fade-in">
            {/* Trust Badge Row */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                <ShieldCheck size={16} />
                Trusted Legal Documentation Platform
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                4.95/5 Rating
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-slate-900">
              Secure Your Agreements with  
              <span className="text-purple-700 block md:inline"> Verified e-Stamping</span>
            </h1>

            <p className="text-slate-600 text-lg max-w-xl leading-relaxed">
              Fast & Reliable e-Stamp Services — Create legally compliant documents, agreements, and affidavits
              online with guided steps, expert-backed formats, and nationwide validity.
            </p>

            {/* Enhanced Search Bar */}
            <div className="flex items-center w-full max-w-xl bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-purple-300 focus-within:border-purple-400 transition-all">
              <input
                type="text"
                placeholder="Search rental agreement, affidavit, name change..."
                className="flex-1 px-5 py-4 text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button className="px-6 py-4 bg-purple-700 text-white hover:bg-purple-800 transition-all duration-200 hover:scale-105">
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Enhanced CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#"
                className="group px-6 py-3.5 rounded-xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Buy e-Stamp Paper →
              </a>
              <a
                href="#"
                className="px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:border-purple-700 hover:text-purple-700 transition-all flex items-center gap-2"
              >
                Why choose us?
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Trust Badges - Enhanced */}
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-slate-600">
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

          {/* Right Visual - Redesigned Card Layout */}
          <div className="relative animate-slide-up">
            {/* Main Card - Redesigned */}
            <div className="relative rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100">
              {/* Stats Grid - Enhanced */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-5 text-center border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-3xl font-bold text-purple-700">27<span className="text-lg">+</span></p>
                    <p className="text-sm text-slate-600 font-medium">States Covered</p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-5 text-center border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-3xl font-bold text-purple-700">8<span className="text-lg">+</span></p>
                    <p className="text-sm text-slate-600 font-medium">Years Experience</p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-5 text-center border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-3xl font-bold text-purple-700">1M<span className="text-lg">+</span></p>
                    <p className="text-sm text-slate-600 font-medium">Happy Users</p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-5 text-center border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-3xl font-bold text-purple-700">99.9<span className="text-lg">%</span></p>
                    <p className="text-sm text-slate-600 font-medium">Success Rate</p>
                  </div>
                </div>

                {/* New Certification Row - Integrated from your content */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <ShieldCheck size={18} className="text-purple-700" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">ISO 27001 Certified</p>
                      <p className="text-sm font-medium text-slate-700">Data security focused</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <CheckCircle size={18} className="text-purple-700" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">ISO 9001:2015 Certified</p>
                      <p className="text-sm font-medium text-slate-700">Quality assured process</p>
                    </div>
                  </div>
                </div>

                {/* Trust Message - Enhanced */}
                <div className="flex items-center justify-center gap-2 pt-3 text-sm text-slate-500 border-t border-slate-100 pt-4">
                  <ShieldCheck size={14} className="text-purple-700" />
                  <span>Trusted by 10,000+ legal professionals</span>
                </div>
              </div>
            </div>

            {/* Floating testimonial badge - extra touch */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-2 flex items-center gap-2 border border-slate-100 animate-bounce-slow">
              <div className="flex -space-x-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-6 rounded-full bg-purple-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-purple-700">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-xs font-medium text-slate-600">50k+ reviews</span>
              <div className="flex text-amber-400 text-[10px]">★★★★★</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}