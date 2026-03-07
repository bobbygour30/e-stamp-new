import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Aarav Mehta",
      date: "Jan 18, 2026",
      rating: 5,
      text: "The documentation process was incredibly smooth and transparent.",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      name: "Neha Kapoor",
      date: "Jan 15, 2026",
      rating: 5,
      text: "Professional service with clear guidance at every step.",
      avatar: "https://i.pravatar.cc/150?img=29",
    },
    {
      name: "BlueStone Solutions",
      date: "Jan 14, 2026",
      rating: 5,
      text: "Reliable platform. Everything was delivered exactly as promised.",
      initial: "B",
    },
    {
      name: "Kunal Verma",
      date: "Jan 12, 2026",
      rating: 4,
      text: "Great experience overall. Support team was quick to respond.",
      avatar: "https://i.pravatar.cc/150?img=46",
    },
    {
      name: "Ritika Sharma",
      date: "Jan 10, 2026",
      rating: 5,
      text: "Saved me a lot of time. Very intuitive and easy to use.",
      avatar: "https://i.pravatar.cc/150?img=52",
    },
    {
      name: "Nova Enterprises",
      date: "Jan 09, 2026",
      rating: 5,
      text: "A dependable service provider for legal documentation.",
      initial: "N",
    },
  ];

  return (
    <section className="relative py-28 bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute -top-40 -left-40 h-96 w-96 bg-indigo-300/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 bg-purple-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Trusted by Professionals Nationwide
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Real feedback from individuals and businesses using our legal
            documentation platform.
          </p>
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-3xl p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-3xl bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition pointer-events-none" />

              {/* Header */}
              <div className="flex items-center gap-4 mb-5 relative">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-100"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold">
                    {review.initial}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-slate-900">
                    {review.name}
                  </p>
                  <p className="text-xs text-slate-500">{review.date}</p>
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
              </div>

              {/* Review Text */}
              <p className="text-slate-600 text-sm leading-relaxed relative">
                “{review.text}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
