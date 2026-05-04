import { useRef, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
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
  { name: "Address Proof", icon: IdCard, path: "/address-proof" },
  { name: "Lost Document", icon: FileWarning, path: "/lost-document" },
  { name: "Marriage Registration", icon: HeartHandshake, path: "/marriage-registration" },
  { name: "Name Addition (Birth Certificate)", icon: Baby, path: "/name-addition-birth-certificate" },
  { name: "Name Correction", icon: PenTool, path: "/name-correction" },
  { name: "After Marriage Name Change", icon: Users, path: "/after-marriage-name-change" },
  { name: "Signature Change", icon: FileSignature, path: "/signature" },
  { name: "First Baby", icon: Baby, path: "/first-baby" },
  { name: "Single Girl Child", icon: Heart, path: "/single-girl" },
  { name: "Additional Name", icon: UserPlus, path: "/additional-name" },
  { name: "Birth Certificate", icon: ScrollText, path: "/birth-certificate" },
  { name: "Short Attendance", icon: Calendar, path: "/short-attendence" },
  { name: "Anti Ragging", icon: Shield, path: "/anti-ragging" },
  { name: "Education Loan", icon: Landmark, path: "/education-loan" },
  { name: "Gap Year", icon: School, path: "/gap-year" },
  { name: "Income Certificate", icon: DollarSign, path: "/income" },
  { name: "Name Change", icon: UserMinus, path: "/name-change" },
  { name: "Marriage Register", icon: BookOpen, path: "/marriage-register" },
  { name: "Rental Agreements", icon: Home, path: "/rental-agreements" },
];

export default function DocumentRibbon() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

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

  const handleNavigation = (path) => {
    navigate(path);
  };

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
                onClick={() => handleNavigation(doc.path)}
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
    </div>
  );
}