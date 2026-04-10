import { useRef, useEffect, forwardRef } from "react";
import {
  IdCard,
  FileWarning,
  HeartHandshake,
  Baby,
  Users,
  PenTool,
  FileSignature,
  Heart,
  ScrollText,
  Calendar,
  Shield,
  Landmark,
  School,
  DollarSign,
  UserMinus,
  BookOpen,
  Home,
} from "lucide-react";

/* ✅ FIX: forwardRef added */
const UserPlus = forwardRef((props, ref) => (
  <svg
    ref={ref}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
));

UserPlus.displayName = "UserPlus";

const legalDocuments = [
  { name: "Address Proof", icon: IdCard },
  { name: "Lost Document", icon: FileWarning },
  { name: "Marriage Registration", icon: HeartHandshake },
  { name: "Name Addition (Birth Certificate)", icon: Baby },
  { name: "Name Correction", icon: PenTool },
  { name: "After Marriage Name Change", icon: Users },
  { name: "Signature Change", icon: FileSignature },
  { name: "First Baby", icon: Baby },
  { name: "Single Girl Child", icon: Heart },
  { name: "Additional Name", icon: UserPlus },
  { name: "Birth Certificate", icon: ScrollText },
  { name: "Short Attendance", icon: Calendar },
  { name: "Anti Ragging", icon: Shield },
  { name: "Education Loan", icon: Landmark },
  { name: "Gap Year", icon: School },
  { name: "Income Certificate", icon: DollarSign },
  { name: "Name Change", icon: UserMinus },
  { name: "Marriage Register", icon: BookOpen },
  { name: "Rental Agreements", icon: Home },
];

export default function DocumentRibbon() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrame;
    let scrollAmount = 0;

    const smoothScroll = () => {
      scrollAmount += 0.5;
      if (scrollAmount >= el.scrollWidth / 2) {
        scrollAmount = 0;
      }

      el.scrollLeft = scrollAmount;
      animationFrame = requestAnimationFrame(smoothScroll);
    };

    animationFrame = requestAnimationFrame(smoothScroll);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const duplicatedItems = [...legalDocuments, ...legalDocuments];

  return (
    <div className="w-full bg-gradient-to-r from-purple-100 via-white to-purple-100 py-4 border-y border-purple-200">
      <div className="relative overflow-hidden">

        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden"
        >
          {duplicatedItems.map((doc, idx) => {
            const Icon = doc.icon;
            return (
              <div
                key={`${doc.name}-${idx}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-purple-200 hover:shadow-md hover:border-purple-400 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-purple-700 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={18} />
                </div>
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap group-hover:text-purple-700 transition-colors">
                  {doc.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center gap-1 mt-3">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
      </div>
    </div>
  );
}