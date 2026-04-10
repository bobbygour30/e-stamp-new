import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  Headphones,
  CheckCircle,
  ArrowRight,
  User,
  FileText,
  Calendar,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["9711149319", "9711149666"],
      subtext: "Mon-Sat, 9 AM to 7 PM",
      color: "from-purple-600 to-purple-400",
    },
    {
      icon: Mail,
      title: "Email Address",
      details: ["info@easyestamp.com", "support@easyestamp.com"],
      subtext: "24/7 Online Support",
      color: "from-purple-500 to-purple-300",
    },
    {
      icon: MapPin,
      title: "Office Address",
      details: ["A90 sector 2, Noida"],
      subtext: "Uttar Pradesh - 201301",
      color: "from-purple-600 to-purple-400",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Saturday: 9:00 AM - 7:00 PM"],
      subtext: "Sunday: Closed",
      color: "from-purple-500 to-purple-300",
    },
  ];

  const faqs = [
    {
      question: "How do I purchase e-Stamp paper online?",
      answer: "You can purchase e-Stamp paper by selecting your state, entering document details, and making payment online. The e-Stamp certificate will be delivered instantly to your email.",
    },
    {
      question: "Is e-Stamp legally valid across India?",
      answer: "Yes, e-Stamp is approved by the Government of India and is legally valid for all types of agreements and documents across the country.",
    },
    {
      question: "How long does it take to get the document?",
      answer: "Most documents are delivered within 15-30 minutes after successful payment and verification.",
    },
    {
      question: "Can I get a refund if I make a mistake?",
      answer: "Please review all details carefully before payment. Refunds are processed within 7-10 business days in case of technical errors or duplicate payments.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-700 to-purple-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us anytime for support, 
            inquiries, or feedback about our services.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative -mt-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, idx) => {
            const Icon = info.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-slate-600 text-sm mb-1">{detail}</p>
                ))}
                <p className="text-xs text-slate-400 mt-2">{info.subtext}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h2>
              <p className="text-slate-500">Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-green-700 text-sm">Message sent successfully! We'll contact you soon.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject *</label>
                  <div className="relative">
                    <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Please describe your query in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-800 hover:to-purple-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Social Links */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-600 mb-3">Connect with us on social media:</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all duration-300">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all duration-300">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all duration-300">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all duration-300">
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Headphones size={20} className="text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
              </div>
              
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <details key={idx} className="group">
                    <summary className="flex cursor-pointer items-center justify-between py-3 text-slate-900 font-medium hover:text-purple-600 transition-colors">
                      {faq.question}
                      <ArrowRight size={16} className="group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="text-slate-600 text-sm pb-3 pl-0">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            

            {/* Office Hours Note */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
              <Calendar size={24} className="mx-auto mb-3 text-purple-600" />
              <p className="text-slate-600 text-sm">
                Our customer support team is available <strong className="text-slate-900">Monday to Saturday</strong><br />
                from <strong className="text-slate-900">9:00 AM to 7:00 PM IST</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">Find Us Here</h3>
            <p className="text-slate-500 text-sm">A90 sector 2, Noida, Uttar Pradesh - 201301</p>
          </div>
          <div className="h-80 bg-slate-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.786573281936!2d77.318785!3d28.6129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce4e8e3c6e6e3%3A0x8e0e6e0e6e0e6e0e!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}