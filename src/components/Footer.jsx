import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  FileText,
  Home,
  FileSignature,
  Building2,
  Stamp,
  Scale,
  Heart,
  ChevronRight,
  HelpCircle,
  BookOpen,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Star component for ratings
  const Star = ({ size, className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  // Navigation items from navbar
  const stampPapersLinks = [
    { name: "Buy e-Stamp", path: "#" },
    { name: "State-wise e-Stamp", path: "#" },
    { name: "Stamp Duty Guide", path: "#" },
  ];

  const legalDocumentsLinks = [
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
  ];

  const servicesLinks = [
    { name: "Document Drafting", path: "#" },
    { name: "Notary Support", path: "#" },
    { name: "Consultation", path: "#" },
  ];

  const contactLinks = [
    { name: "Contact Information", path: "/contact" },
    { name: "FAQs", path: "#" },
    { name: "Legal Guides", path: "#" },
  ];

  return (
    <footer className="relative bg-slate-900 text-slate-300 overflow-hidden">
      {/* Decorative gradient with purple color */}
      <div className="absolute inset-x-0 -top-40 h-96 bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-purple-400/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                E
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  Easy<span className="text-purple-400">eStamp</span>
                </span>
                <p className="text-xs text-slate-400 mt-0.5">by FinoLead Solutions Pvt Ltd</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-400">
              A digital platform designed to simplify legal documentation,
              agreements, and compliance through secure and guided workflows.
              Trusted by thousands across India.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="#"
                className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-purple-600 transition-colors duration-300"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-purple-600 transition-colors duration-300"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-purple-600 transition-colors duration-300"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-purple-600 transition-colors duration-300"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Stamp Papers Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <Stamp size={16} className="text-purple-400" />
              Stamp Papers
            </h4>
            <ul className="space-y-2 text-sm">
              {stampPapersLinks.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.path}
                    className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-1 group text-slate-400"
                  >
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <HelpCircle size={16} className="text-purple-400" />
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              {servicesLinks.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.path}
                    className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-1 group text-slate-400"
                  >
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <MessageCircle size={16} className="text-purple-400" />
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              {contactLinks.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.path}
                    className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-1 group text-slate-400"
                  >
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 p-3 rounded-lg">
                <ShieldCheck size={16} className="text-purple-400" />
                <span>DMCA.com Protection Status</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Documents Section - Full Width */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h4 className="text-white font-semibold flex items-center gap-2 mb-6">
            <FileText size={16} className="text-purple-400" />
            Legal Documents
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {legalDocumentsLinks.map((item, i) => (
              <a
                key={i}
                href={item.path}
                className="text-sm text-slate-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-1 group"
              >
                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                {item.name}
              </a>
            ))}
          </div>
        </div>

        {/* Contact & Trust Info */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-3 group">
              <Phone size={18} className="mt-1 text-purple-400 group-hover:scale-110 transition" />
              <div>
                <p className="text-white text-sm font-semibold mb-1">Phone Numbers</p>
                <p className="text-slate-400 text-sm">9711149319 / 9711149666</p>
                <p className="text-xs text-slate-500 mt-1">Mon-Sat, 9 AM to 7 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3 group">
              <Mail size={18} className="mt-1 text-purple-400 group-hover:scale-110 transition" />
              <div>
                <p className="text-white text-sm font-semibold mb-1">Email Address</p>
                <p className="text-slate-400 text-sm">info@easyestamp.com</p>
                <p className="text-slate-400 text-sm">support@easyestamp.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3 group">
              <MapPin size={18} className="mt-1 text-purple-400 group-hover:scale-110 transition" />
              <div>
                <p className="text-white text-sm font-semibold mb-1">Office Address</p>
                <p className="text-slate-400 text-sm">A90 sector 2, Noida</p>
                <p className="text-slate-400 text-sm">Uttar Pradesh - 201301</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            <a href="#" className="text-slate-400 hover:text-purple-400 transition">Home</a>
            <a href="#" className="text-slate-400 hover:text-purple-400 transition">Terms & Conditions</a>
            <a href="#" className="text-slate-400 hover:text-purple-400 transition">Refund Policy</a>
            <a href="#" className="text-slate-400 hover:text-purple-400 transition">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-purple-400 transition">FAQs</a>
            <a href="#" className="text-slate-400 hover:text-purple-400 transition">Blogs</a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>
            © {currentYear} Easy eStamp (easyestamp.com is a unit of FinoLead Solutions Pvt Ltd). 
            All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
            </span>
            <span>Trusted by 10,000+ customers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}