import { Star, Quote, ChevronLeft, ChevronRight, ShieldCheck, Clock, ThumbsUp } from "lucide-react";
import { useState } from "react";

export default function Testimonials() {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 6;

  const reviews = [
    {
      name: "Aarav Mehta",
      date: "Jan 18, 2026",
      rating: 5,
      text: "The documentation process was incredibly smooth and transparent. I got my rental agreement within hours. Highly recommended!",
      avatar: "https://i.pravatar.cc/150?img=11",
      role: "Business Owner",
    },
    {
      name: "Neha Kapoor",
      date: "Jan 15, 2026",
      rating: 5,
      text: "Professional service with clear guidance at every step. The team ensured all my documents were legally compliant.",
      avatar: "https://i.pravatar.cc/150?img=29",
      role: "Lawyer",
    },
    {
      name: "BlueStone Solutions",
      date: "Jan 14, 2026",
      rating: 5,
      text: "Reliable platform. Everything was delivered exactly as promised. Will definitely use again for all legal needs.",
      initial: "B",
      role: "Real Estate",
    },
    {
      name: "Kunal Verma",
      date: "Jan 12, 2026",
      rating: 4,
      text: "Great experience overall. Support team was quick to respond and resolved all my queries promptly.",
      avatar: "https://i.pravatar.cc/150?img=46",
      role: "Homeowner",
    },
    {
      name: "Ritika Sharma",
      date: "Jan 10, 2026",
      rating: 5,
      text: "Saved me a lot of time. Very intuitive and easy to use. The e-stamp feature is a game-changer!",
      avatar: "https://i.pravatar.cc/150?img=52",
      role: "CA",
    },
    {
      name: "Nova Enterprises",
      date: "Jan 09, 2026",
      rating: 5,
      text: "A dependable service provider for legal documentation. Fast turnaround and excellent quality.",
      initial: "N",
      role: "Corporate",
    },
    {
      name: "Priya Singh",
      date: "Jan 07, 2026",
      rating: 5,
      text: "Best platform for name change documentation. Everything was handled professionally.",
      avatar: "https://i.pravatar.cc/150?img=33",
      role: "Individual",
    },
    {
      name: "Rajesh Malhotra",
      date: "Jan 05, 2026",
      rating: 5,
      text: "Outstanding service! The affidavit was prepared exactly as needed. Will recommend to everyone.",
      avatar: "https://i.pravatar.cc/150?img=15",
      role: "Consultant",
    },
  ];

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const displayedReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const stats = [
    { icon: ThumbsUp, value: "98%", label: "Satisfaction Rate", color: "text-[#60AF70]" },
    { icon: Clock, value: "24/7", label: "Customer Support", color: "text-emerald-600" },
    { icon: ShieldCheck, value: "10K+", label: "Happy Clients", color: "text-[#60AF70]" },
  ];

  return (
    <section className="relative py-28 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-40 -left-40 h-96 w-96 bg-[#60AF70]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 bg-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#60AF70]/5 rounded-full blur-3xl" />

      {/* Floating quote decorations */}
      <div className="absolute top-20 left-10 opacity-10 animate-pulse">
        <Quote size={80} className="text-[#60AF70]" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 animate-pulse">
        <Quote size={80} className="text-[#60AF70]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#60AF70]/10 text-[#60AF70] text-sm font-semibold tracking-wide mb-4">
            <Star size={14} fill="#60AF70" />
            TESTIMONIALS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            What Our <span className="text-[#60AF70]">Clients Say</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Join thousands of satisfied customers who trust us for their legal documentation needs
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-slate-100"
              >
                <div className={`${stat.color} bg-[#60AF70]/10 p-2 rounded-full`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedReviews.map((review, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Gradient border effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#60AF70]/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition duration-500 -z-10" />

              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition">
                <Quote size={40} />
              </div>

              {/* Header */}
              <div className="flex items-center gap-4 mb-5 relative">
                {review.avatar ? (
                  <div className="relative">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="h-14 w-14 rounded-full object-cover ring-3 ring-[#60AF70]/20"
                    />
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-[#60AF70] rounded-full flex items-center justify-center">
                      <Star size={10} fill="white" className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#60AF70] to-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                      {review.initial}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-[#60AF70] rounded-full flex items-center justify-center">
                      <Star size={10} fill="white" className="text-white" />
                    </div>
                  </div>
                )}

                <div>
                  <p className="font-bold text-slate-900 text-lg">
                    {review.name}
                  </p>
                  <p className="text-xs text-[#60AF70] font-medium">{review.role}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{review.date}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    className={
                      idx < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }
                  />
                ))}
                <span className="text-xs text-slate-400 ml-2">({review.rating}.0)</span>
              </div>

              {/* Review Text */}
              <p className="text-slate-600 text-sm leading-relaxed relative z-10">
                “{review.text}”
              </p>

              {/* Verified Badge */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#60AF70] animate-pulse" />
                <span className="text-xs text-slate-400">Verified Purchase</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-[#60AF70] hover:text-white hover:border-[#60AF70] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentPage === idx
                      ? "bg-[#60AF70] w-8"
                      : "bg-slate-300 hover:bg-[#60AF70]/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-[#60AF70] hover:text-white hover:border-[#60AF70] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Trust indicators */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={16} className="text-[#60AF70]" />
              <span>100% Legal Compliant</span>
            </div>
            <div className="w-px h-4 bg-slate-300" />
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Star size={16} className="text-[#60AF70]" fill="#60AF70" />
              <span>4.9/5 Average Rating</span>
            </div>
            <div className="w-px h-4 bg-slate-300" />
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ThumbsUp size={16} className="text-[#60AF70]" />
              <span>10,000+ Happy Customers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
            opacity: 0;
          }
        `}
      </style>
    </section>
  );
}