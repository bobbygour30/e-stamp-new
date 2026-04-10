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

  return (
    <footer className="relative bg-slate-900 text-slate-300 overflow-hidden">
      {/* Decorative gradient with purple color */}
      <div className="absolute inset-x-0 -top-40 h-96 bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-purple-400/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
          {/* Brand */}
          <div className="space-y-6">
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

          {/* Legal Documents Menu */}
          <div className="space-y-5">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <FileText size={16} className="text-purple-400" />
              Legal Documents
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Rental Agreements",
                "Affidavits",
                "Name Change",
                "Marriage Registration",
                "Property Documents",
                "Gift Deed",
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-1 group"
                  >
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <Heart size={16} className="text-purple-400" />
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Home",
                "Agreement",
                "Affidavit",
                "Deed",
                "Property",
                "e-Stamp Paper Buy",
                "Contact",
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-1 group"
                  >
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Trust */}
          <div className="space-y-6">
            <h4 className="text-white font-semibold">Get in Touch</h4>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 group">
                <Phone size={16} className="mt-1 text-purple-400 group-hover:scale-110 transition" />
                <div>
                  <p className="text-slate-400 text-xs">Phone Numbers</p>
                  <span>9711149319 / 9711149666</span>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <Mail size={16} className="mt-1 text-purple-400 group-hover:scale-110 transition" />
                <div>
                  <p className="text-slate-400 text-xs">Email</p>
                  <span>info@easyestamp.com</span>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <MapPin size={16} className="mt-1 text-purple-400 group-hover:scale-110 transition" />
                <div>
                  <p className="text-slate-400 text-xs">Address</p>
                  <span className="text-xs">A90 sector 2, Noida, Uttar Pradesh - 201301</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 p-3 rounded-lg">
              <ShieldCheck size={16} className="text-purple-400" />
              <span>DMCA.com Protection Status</span>
            </div>
          </div>
        </div>

        {/* Other Links Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-white text-sm font-semibold mb-3">Links</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-purple-400 transition">Home</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Agreement</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Affidavit</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Deed</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Property</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">eStamp Paper Buy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white text-sm font-semibold mb-3">Other Links</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-purple-400 transition">Legal Documents</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Affidavits</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Rental Agreement</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Request for Customized Document</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Gift Deed</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Make your Will</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Partnership Deed</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Non Disclosure Agreement</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white text-sm font-semibold mb-3">Resources</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-purple-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">FAQs</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Blogs</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Legal Guides</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white text-sm font-semibold mb-3">Legal</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-purple-400 transition">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Refund Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Privacy Policy</a></li>
              </ul>
            </div>
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