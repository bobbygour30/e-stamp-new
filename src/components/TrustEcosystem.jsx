import { ShieldCheck, Clock, Users, MapPin, CheckCircle2 } from "lucide-react";

export default function TrustEcosystem() {
  const stats = [
    { label: "Documents Generated", value: "750K+" },
    { label: "Active Cities", value: "120+" },
    { label: "Daily Requests", value: "3,000+" },
    { label: "Customer Satisfaction", value: "98%" },
  ];

  const assurances = [
    {
      title: "Legally Verified Formats",
      desc: "Every document follows updated legal frameworks and regional requirements.",
      icon: ShieldCheck,
    },
    {
      title: "Time-Bound Delivery",
      desc: "Structured workflows ensure documents are processed without unnecessary delays.",
      icon: Clock,
    },
    {
      title: "Human + Tech Review",
      desc: "Automated checks combined with manual verification for accuracy.",
      icon: Users,
    },
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-28">

        {/* Heading */}
        <div className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-sm backdrop-blur">
            <MapPin size={14} />
            Built for Nationwide Compliance
          </span>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Trust Isn’t Claimed.  
            <span className="block text-indigo-400">
              It’s Engineered Into the Process.
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-slate-300">
            From document creation to final delivery, every step is designed to
            ensure clarity, legality, and reliability at scale.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group rounded-3xl bg-white/5 p-8 text-center backdrop-blur border border-white/10 hover:bg-white/10 transition"
            >
              <p className="text-3xl md:text-4xl font-bold text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Assurance Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {assurances.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group relative rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-10 border border-white/10 hover:from-white/20 hover:to-white/10 transition-all duration-500"
              >
                {/* step marker */}
                <span className="absolute -top-4 -right-4 h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-sm font-bold shadow-lg">
                  {i + 1}
                </span>

                <div className="space-y-6">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantees */}
        <div className="flex flex-wrap justify-center gap-6">
          {[
            "Secure Digital Delivery",
            "Region-Specific Compliance",
            "Transparent Pricing",
            "Dedicated Support",
          ].map((point, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur border border-white/10 text-sm"
            >
              <CheckCircle2 size={16} className="text-green-400" />
              {point}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
