import { useNavigate } from "react-router-dom";
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
  IdCard,
  FileWarning,
  HeartHandshake,
  Baby,
  PenTool,
  Users,
  Heart,
  UserPlus,
  Calendar,
  Shield,
  School,
  DollarSign,
  UserMinus,
  BookOpen,
  Handshake,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function WhatWeDoAndHowItWorks() {
  const navigate = useNavigate();

  // Updated navigation paths with all new items
  const navigationPaths = [
    { name: "Address Proof", path: "/address-proof" },
    { name: "Lost Document", path: "/lost-document" },
    { name: "Marriage Registration", path: "/marriage-registration" },
    { name: "Name Addition (Birth Certificate)", path: "/name-addition-birth-certificate" },
    { name: "Name Correction", path: "/name-correction" },
    { name: "After Marriage Name Change", path: "/after-marriage-name-change" },
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
    { name: "Rental Agreements", path: "/rental-agreements" },
    { name: "Agreement to Sale (Before Loan)", path: "/agreement-to-sale-before-loan" },
    { name: "Agreement to Sale (After Loan)", path: "/agreement-to-sale-after-loan" },
  ];

  // Helper function to get path by name
  const getPath = (name) => {
    const item = navigationPaths.find(item => item.name === name);
    return item ? item.path : "/";
  };

  const services = [
    {
      title: "RENT OR LEASE AGREEMENT",
      description: "A legal agreement is not a mere piece of paper for signing among two parties but it defends one business organization with its rights and remedies.",
      icon: Home,
      gradient: "from-purple-700 to-purple-500",
      linkName: "Rental Agreements"
    },
    {
      title: "PROPERTY DOCUMENT",
      description: "Property is commodity that's possessed, whether it's goods, land or creative. An illustration of property is a person's house.",
      icon: Building2,
      gradient: "from-purple-600 to-purple-400",
      linkName: "Address Proof"
    },
    {
      title: "AFFIDAVIT LEGAL DOCUMENT",
      description: "An 'affidavit' is a written statement. It considers having a format under oath. It's only valid when it is on a voluntary basis and without coercion.",
      icon: FileSignature,
      gradient: "from-purple-500 to-purple-700",
      linkName: "Name Change"
    },
    {
      title: "REGISTRATION SERVICE",
      description: "The act or process of entering information about commodity in a book or system of public records. A document showing that something has been officially registered.",
      icon: ScrollText,
      gradient: "from-purple-700 to-purple-600",
      linkName: "Marriage Registration"
    },
    {
      title: "E-STAMP LEGAL DOCUMENT",
      description: "E-stamping is an important component of the property purchase or sale.",
      icon: Stamp,
      gradient: "from-purple-600 to-purple-700",
      linkName: "Signature Change"
    },
    {
      title: "DEEDS LEGAL DOCUMENT",
      description: "The formal nature of a contract guarantees that such a condition will be carried out as expected and agreed upon by all parties involved.",
      icon: FileCheck,
      gradient: "from-purple-500 to-purple-700",
      linkName: "Birth Certificate"
    },
  ];

  const steps = [
    {
      title: "Select Service",
      desc: "Choose the legal service you need from verified formats.",
      icon: FileText,
      linkName: "Address Proof"
    },
    {
      title: "Customize Draft",
      desc: "Edit details instantly with our guided live editor.",
      icon: Edit3,
      linkName: "Name Correction"
    },
    {
      title: "Get Document",
      desc: "Receive legally valid documents securely on email.",
      icon: Mail,
      linkName: "Birth Certificate"
    },
  ];

  // Updated bestsellers with all items - all using consistent purple gradient
  const bestsellers = [
    { title: "Address Proof", icon: IdCard, linkName: "Address Proof" },
    { title: "Lost Document", icon: FileWarning, linkName: "Lost Document" },
    { title: "Marriage Registration", icon: HeartHandshake, linkName: "Marriage Registration" },
    { title: "Name Addition (Birth Certificate)", icon: Baby, linkName: "Name Addition (Birth Certificate)" },
    { title: "Name Correction", icon: PenTool, linkName: "Name Correction" },
    { title: "After Marriage Name Change", icon: Users, linkName: "After Marriage Name Change" },
    { title: "Signature Change", icon: FileSignature, linkName: "Signature Change" },
    { title: "First Baby", icon: Baby, linkName: "First Baby" },
    { title: "Single Girl Child", icon: Heart, linkName: "Single Girl Child" },
    { title: "Additional Name", icon: UserPlus, linkName: "Additional Name" },
    { title: "Birth Certificate", icon: ScrollText, linkName: "Birth Certificate" },
    { title: "Short Attendance", icon: Calendar, linkName: "Short Attendance" },
    { title: "Anti Ragging", icon: Shield, linkName: "Anti Ragging" },
    { title: "Education Loan", icon: Landmark, linkName: "Education Loan" },
    { title: "Gap Year", icon: School, linkName: "Gap Year" },
    { title: "Income Certificate", icon: DollarSign, linkName: "Income Certificate" },
    { title: "Name Change", icon: UserMinus, linkName: "Name Change" },
    { title: "Marriage Register", icon: BookOpen, linkName: "Marriage Register" },
    { title: "Rental Agreements", icon: Home, linkName: "Rental Agreements" },
    { title: "Agreement to Sale (Before Loan)", icon: FileCheck, linkName: "Agreement to Sale (Before Loan)" },
    { title: "Agreement to Sale (After Loan)", icon: Handshake, linkName: "Agreement to Sale (After Loan)" },
  ];

  // Auto-slide logic
  const scrollContainerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const autoSlideInterval = useRef(null);

  const startAutoSlide = () => {
    if (autoSlideInterval.current) clearInterval(autoSlideInterval.current);
    autoSlideInterval.current = setInterval(() => {
      if (!isHovering && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = 216;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft + cardWidth >= maxScroll) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
    }, 3000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (autoSlideInterval.current) clearInterval(autoSlideInterval.current);
    };
  }, [isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleNavigation = (linkName) => {
    const path = getPath(linkName);
    if (path) {
      navigate(path);
    }
  };

  return (
    <section className="relative py-28 overflow-x-clip overflow-y-visible bg-gradient-to-br from-slate-50 via-purple-50/30 to-white">
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
                  onClick={() => handleNavigation(service.linkName)}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 cursor-pointer"
                >
                  <div className={`absolute -top-5 left-6 h-14 w-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent" />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="relative group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <span className="absolute -top-5 -left-5 h-12 w-12 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition">
                    {i + 1}
                  </span>
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

        {/* BESTSELLERS - Auto-sliding carousel with Water Drop effect */}
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

          {/* Auto-sliding horizontal carousel */}
          <div 
            className="relative w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto pb-12 hide-scrollbar"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="flex gap-6 px-4" style={{ minWidth: 'max-content' }}>
                {bestsellers.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      onClick={() => handleNavigation(item.linkName)}
                      className="bestseller-card group relative rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-5 text-white shadow-lg cursor-pointer w-[200px] flex-shrink-0"
                    >
                      {/* Water drop ripple effects */}
                      <div className="ripple ripple-1"></div>
                      <div className="ripple ripple-2"></div>
                      <div className="ripple ripple-3"></div>
                      
                      {/* Shine effect */}
                      <div className="shine"></div>
                      
                      {/* Card content */}
                      <div className="relative z-10 h-full flex flex-col justify-between gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm  transition-transform duration-300 group-hover:rotate-6">
                          <Icon size={22} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold leading-tight">
                            {item.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-1 text-xs opacity-90 group-hover:gap-2 transition-all duration-300">
                            Explore
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 via-slate-50/30 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 via-slate-50/30 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Water Drop Animation Effect */
        .bestseller-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: visible;
          position: relative;
        }
        
       
        
        /* Ripple animations */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
          pointer-events: none;
          opacity: 0;
        }
        
        .bestseller-card:hover .ripple-1 {
          animation: waterDrop 0.8s ease-out forwards;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          margin-left: 0;
          margin-top: 0;
        }
        
        .bestseller-card:hover .ripple-2 {
          animation: waterDrop 0.8s ease-out 0.2s forwards;
          top: 30%;
          left: 70%;
          width: 0;
          height: 0;
        }
        
        .bestseller-card:hover .ripple-3 {
          animation: waterDrop 0.8s ease-out 0.4s forwards;
          top: 70%;
          left: 20%;
          width: 0;
          height: 0;
        }
        
        @keyframes waterDrop {
          0% {
            width: 0;
            height: 0;
            opacity: 0.6;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
            margin-left: -100px;
            margin-top: -100px;
          }
        }
        
        /* Shine effect on hover */
        .shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
          pointer-events: none;
          border-radius: inherit;
        }
        
        .bestseller-card:hover .shine {
          left: 100%;
        }
      `}</style>
    </section>
  );
}