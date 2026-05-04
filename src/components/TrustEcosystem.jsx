import { useState } from "react";
import {
  ShieldCheck,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  FileText,
  Home,
  FileSignature,
  Building2,
  Stamp,
  Scale,
  ChevronLeft,
  ChevronRight,
  Star,
  Phone,
  Mail,
  MapPin as MapPinIcon,
  MessageCircle,
  ArrowRight,
  Lock,
  ThumbsUp,
  Globe,
  Award,
  Headphones,
  Zap,
  Heart,
} from "lucide-react";

export default function TrustEcosystem() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const stats = [
    { label: "Documents Generated", value: "750K+", icon: FileText },
    { label: "Active Cities", value: "120+", icon: MapPin },
    { label: "Daily Requests", value: "3,000+", icon: Clock },
    { label: "Customer Satisfaction", value: "98%", icon: ThumbsUp },
  ];

  const assurances = [
    {
      title: "Legally Verified Formats",
      desc: "Every document follows updated legal frameworks and regional requirements with expert oversight.",
      icon: ShieldCheck,
    },
    {
      title: "Time-Bound Delivery",
      desc: "Structured workflows ensure documents are processed without unnecessary delays, guaranteed.",
      icon: Clock,
    },
    {
      title: "Human + Tech Review",
      desc: "Automated checks combined with manual verification for maximum accuracy and reliability.",
      icon: Users,
    },
  ];

  const testimonials = [
    {
      name: "Jaya Sharma",
      rating: 5,
      text: "I had a great experience... needed some document urgently and got it within hours!",
      initial: "J",
    },
    {
      name: "Advisory Monks Consulting",
      rating: 5,
      text: "Great support and timeline of delivery by Sunil Chauhan. Highly professional team.",
      initial: "A",
    },
    {
      name: "Tanvi Nelli",
      rating: 5,
      text: "Had a smooth experience with the Edrafter Team. Special thanks for the guidance.",
      initial: "T",
    },
    {
      name: "Avi Gawai",
      rating: 5,
      text: "It was good experience with edrafter. Quick and efficient service.",
      initial: "A",
    },
    {
      name: "RN8 COMPANY",
      rating: 5,
      text: "Excellent Service. Will definitely recommend to others.",
      initial: "R",
    },
    {
      name: "Ipstia Panwar",
      rating: 5,
      text: "Quick and easy service, very convenient for legal document making.",
      initial: "I",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.ceil(testimonials.length / 3) - 1 : prev - 1
    );
  };

  return (
    <section className="relative py-28 bg-gradient-to-br from-slate-50 via-white to-purple-50/30 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-28">
        {/* Heading */}
        <div className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold backdrop-blur">
            <ShieldCheck size={14} />
            Built for Nationwide Compliance
          </span>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
            Simplifying Legal Compliance with{" "}
            <span className="text-purple-700">Instant e-Stamping</span>
          </h2>

          <p className="max-w-2xl mx-auto text-slate-600 text-lg">
            Trust isn't claimed. It's engineered into every step of our process
            — from document creation to final delivery.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group rounded-2xl bg-white p-6 text-center shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                  <Icon size={24} className="text-purple-700" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* About Us Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
              <Globe size={14} />
              About Easy eStamp
            </div>
            <h3 className="text-3xl font-bold text-slate-900">
              Revolutionizing Legal Documentation Across India
            </h3>
            <p className="text-slate-600 leading-relaxed">
              e-Stamping is a computer-based application and a secured way of
              paying non-judicial stamp duty to the government. e-Stamping is
              currently operational in the states of Haryana, Odisha, Gujarat,
              Karnataka, NCR Delhi, Maharashtra, Assam, Tamil Nadu, Rajasthan,
              Himachal Pradesh, Andhra Pradesh, Uttarakhand, and the union
              territories of Dadra & Nagar Haveli, Daman & Diu Puducherry,
              Jharkhand, Uttar Pradesh, and West Bengal.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-purple-700" />
                <span className="text-sm text-slate-600">Tamper-Proof</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-purple-700" />
                <span className="text-sm text-slate-600">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-purple-700" />
                <span className="text-sm text-slate-600">Govt. Approved</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-8 border border-purple-200">
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-slate-900">Security Notice</h4>
              <p className="text-slate-600 text-sm">
                E-Stamping ensures authenticity and security through unique
                identification numbers generated for every transaction. This
                system is tamper-proof and eliminates the need for physical
                stamp papers, reducing the risk of counterfeit or misuse.
              </p>
              <h4 className="text-xl font-bold text-slate-900 pt-4">Service Updates</h4>
              <p className="text-slate-600 text-sm">
                E-Stamping improves transparency and reduces paperwork, making
                it an eco-friendly alternative. It supports faster
                documentation, saves time, and ensures legally valid records
                with traceability and online verification.
              </p>
            </div>
          </div>
        </div>

        {/* Assurance Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {assurances.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group relative rounded-2xl bg-white p-8 shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <span className="absolute -top-4 -right-4 h-10 w-10 rounded-xl bg-purple-700 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                  {i + 1}
                </span>

                <div className="space-y-5">
                  <div className="h-14 w-14 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition">
                    <Icon size={28} className="text-purple-700" />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonials Slider */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
              <Star size={14} fill="#9333EA" />
              Client Testimonials
            </div>
            <h3 className="text-3xl font-bold text-slate-900">
              We Are The Most Popular Service Provider
            </h3>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials
                .slice(currentSlide * 3, currentSlide * 3 + 3)
                .map((testimonial, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-6 shadow-md border border-slate-100"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-700 to-purple-500 text-white flex items-center justify-center font-bold">
                        {testimonial.initial}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {testimonial.name}
                        </p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: testimonial.rating }).map(
                            (_, i) => (
                              <Star
                                key={i}
                                size={12}
                                fill="#fbbf24"
                                className="text-yellow-400"
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm">"{testimonial.text}"</p>
                  </div>
                ))}
            </div>

            {Math.ceil(testimonials.length / 3) > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-purple-700 hover:text-white transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-purple-700 hover:text-white transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-purple-700 to-purple-500 rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative px-8 py-16 md:px-16 text-center">
            <Heart size={48} className="text-white/30 mx-auto mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied customers who trust us for their legal
              documentation needs. Get your e-stamp paper in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 rounded-xl bg-white text-purple-700 font-semibold hover:bg-slate-50 hover:scale-105 transition-all shadow-lg">
                Get Started Now
                <ArrowRight size={18} className="inline ml-2" />
              </button>
              
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Phone size={14} />
                <span>9711149319</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Mail size={14} />
                <span>info@easyestamp.in</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <MessageCircle size={14} />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            "Secure Digital Delivery",
            "Region-Specific Compliance",
            "Transparent Pricing",
            "Dedicated Support",
            "ISO Certified",
            "Govt. Approved",
          ].map((point, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border border-slate-100 text-sm text-slate-700"
            >
              <CheckCircle2 size={14} className="text-purple-700" />
              {point}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}