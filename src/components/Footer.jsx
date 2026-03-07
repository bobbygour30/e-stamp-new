import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-300 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-x-0 -top-40 h-96 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                L
              </div>
              <span className="text-xl font-semibold text-white">
                LexDraft
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-400">
              A digital platform designed to simplify legal documentation,
              agreements, and compliance through secure and guided workflows.
            </p>

            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-indigo-600 transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-white font-semibold">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                "Rental Agreements",
                "Affidavits",
                "Name Change",
                "e-Stamp Papers",
                "Pricing",
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-white transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-5">
            <h4 className="text-white font-semibold">Resources</h4>
            <ul className="space-y-3 text-sm">
              {[
                "Help Center",
                "FAQs",
                "Privacy Policy",
                "Terms & Conditions",
                "Refund Policy",
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-white transition"
                  >
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
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-1 text-indigo-400" />
                <span>+91 90000 00000</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-1 text-indigo-400" />
                <span>support@lexdraft.io</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 text-indigo-400" />
                <span>Serving customers across India</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <ShieldCheck size={16} className="text-green-400" />
              Secure & compliant workflows
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-white/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© 2026 LexDraft. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-yellow-400">
              ★★★★★
            </span>
            <span>Trusted by 1M+ users</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
