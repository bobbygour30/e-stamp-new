import {
  FileText,
  Edit3,
  Mail,
  ArrowRight,
  Stamp,
  Printer,
  UserCheck,
  Home,
  FileSignature,
  ScrollText,
  Building2,
  Landmark,
  FileCheck,
} from "lucide-react";

export default function WhatWeDoAndHowItWorks() {
  const services = [
    {
      title: "RENT OR LEASE AGREEMENT",
      description:
        "A legal agreement is not a mere piece of paper for signing among two parties but it defends one business organization with its rights and remedies.",
      icon: Home,
      gradient: "from-purple-700 to-purple-500",
    },
    {
      title: "PROPERTY DOCUMENT",
      description:
        "Property is commodity that's possessed, whether it's goods, land or creative. An illustration of property is a person's house.",
      icon: Building2,
      gradient: "from-purple-600 to-purple-400",
    },
    {
      title: "AFFIDAVIT LEGAL DOCUMENT",
      description:
        "An 'affidavit' is a written statement. It considers having a format under oath. It's only valid when it is on a voluntary basis and without coercion.",
      icon: FileSignature,
      gradient: "from-purple-500 to-purple-700",
    },
    {
      title: "REGISTRATION SERVICE",
      description:
        "The act or process of entering information about commodity in a book or system of public records. A document showing that something has been officially registered.",
      icon: ScrollText,
      gradient: "from-purple-700 to-purple-600",
    },
    {
      title: "E-STAMP LEGAL DOCUMENT",
      description:
        "E-stamping is an important component of the property purchase or sale.",
      icon: Stamp,
      gradient: "from-purple-600 to-purple-700",
    },
    {
      title: "DEEDS LEGAL DOCUMENT",
      description:
        "The formal nature of a contract guarantees that such a condition will be carried out as expected and agreed upon by all parties involved.",
      icon: FileCheck,
      gradient: "from-purple-500 to-purple-700",
    },
  ];

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
      icon: Home,
      gradient: "from-purple-700 to-purple-500",
    },
    {
      title: "Print on Stamp Paper",
      icon: Printer,
      gradient: "from-purple-600 to-purple-400",
    },
    {
      title: "Name Change",
      icon: UserCheck,
      gradient: "from-purple-500 to-purple-700",
    },
    {
      title: "State Stamp Paper",
      icon: Stamp,
      gradient: "from-purple-700 to-purple-600",
    },
    {
      title: "e-Stamp Paper",
      icon: FileText,
      gradient: "from-purple-600 to-purple-700",
    },
  ];

  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-white">
      {/* Background decor */}
      <div className="absolute -top-32 -left-32 h-96 w-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 bg-purple-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-32">
        {/* WHAT WE DO Section */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold tracking-wide">
              OUR SERVICES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              What We Do
            </h2>
            <p className="max-w-2xl mx-auto text-slate-600">
              Comprehensive legal documentation services tailored to meet all
              your requirements with precision and authenticity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100"
                >
                  {/* Gradient icon background */}
                  <div
                    className={`absolute -top-5 left-6 h-14 w-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>

                  <div className="pt-12 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 text-purple-700 font-medium text-sm group-hover:gap-3 transition-all">
                      Learn More
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold tracking-wide">
              SIMPLE PROCESS
            </span>
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
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent" />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="relative group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {/* Step number */}
                  <span className="absolute -top-5 -left-5 h-12 w-12 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition">
                    {i + 1}
                  </span>

                  {/* Glow */}
                  <div className="absolute inset-0 rounded-3xl bg-purple-100 opacity-0 group-hover:opacity-100 blur-xl transition" />

                  <div className="relative space-y-5">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-700 to-purple-500 text-white flex items-center justify-center shadow-md group-hover:rotate-6 transition">
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold tracking-wide">
              POPULAR CHOICES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Our <span className="text-purple-700">Bestsellers</span>
            </h2>
            <p className="max-w-2xl mx-auto text-slate-600">
              Most popular services trusted by thousands across India.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {bestsellers.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-5 text-white shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {/* Inner highlight */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />

                  <div className="relative h-full flex flex-col justify-between gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold leading-tight">
                        {item.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-1 text-xs opacity-90 group-hover:translate-x-1 transition">
                        Explore
                        <ArrowRight size={12} />
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