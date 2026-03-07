import {
  FileText,
  Edit3,
  Mail,
  ArrowRight,
  Stamp,
  Printer,
  UserCheck,
} from "lucide-react";

export default function HowItWorksAndBestsellers() {
  const steps = [
    {
      title: "Select Service",
      desc: "Choose the legal service you need from verified formats.",
      icon: FileText,
    },
    {
      title: "Customize Draft",
      desc: "Edit details instantly with our guided live editor.",
      icon: Edit3,
    },
    {
      title: "Get Document",
      desc: "Receive legally valid documents securely on email.",
      icon: Mail,
    },
  ];

  const bestsellers = [
    {
      title: "Rental Agreement",
      icon: FileText,
      gradient: "from-indigo-600 to-violet-600",
    },
    {
      title: "Print on Stamp Paper",
      icon: Printer,
      gradient: "from-purple-600 to-fuchsia-600",
    },
    {
      title: "Name Change",
      icon: UserCheck,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "State Stamp Paper",
      icon: Stamp,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "e-Stamp Paper",
      icon: FileText,
      gradient: "from-sky-500 to-blue-600",
    },
  ];

  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-white">
      {/* Background decor */}
      <div className="absolute -top-32 -left-32 h-96 w-96 bg-indigo-300/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 bg-purple-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-32">

        {/* HOW IT WORKS */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              How It Works
            </h2>
            <p className="max-w-2xl mx-auto text-slate-600">
              A simple, guided process designed to make legal documentation
              effortless and reliable.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Animated connector */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-300 to-transparent animate-pulse" />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="relative group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 animate-step"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {/* Step number */}
                  <span className="absolute -top-5 -left-5 h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition">
                    {i + 1}
                  </span>

                  {/* Glow */}
                  <div className="absolute inset-0 rounded-3xl bg-indigo-600/10 opacity-0 group-hover:opacity-100 blur-xl transition" />

                  <div className="relative space-y-5">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:rotate-6 transition">
                      <Icon size={28} />
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BESTSELLERS */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Our <span className="text-indigo-600">Bestsellers</span>
            </h2>
            <p className="max-w-2xl mx-auto text-slate-600">
              Most popular services trusted by thousands across India.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {bestsellers.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.gradient} p-6 text-white shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 animate-card`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {/* Inner highlight */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />

                  <div className="relative h-full flex flex-col justify-between gap-6">
                    <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                      <Icon size={26} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">
                        {item.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-2 text-sm opacity-90 group-hover:translate-x-1 transition">
                        Explore
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
