import { Link } from "react-router-dom";
import {
  IdCard,
  FileWarning,
  HeartHandshake,
  Baby,
  PenTool,
  Users,
  FileSignature,
  Heart,
  UserPlus,
  ScrollText,
  Calendar,
  Shield,
  Landmark,
  School,
  DollarSign,
  UserMinus,
  BookOpen,
  Home,
  FileCheck,
  Handshake,
  ArrowRight,
  Star,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

// Custom UserPlus Icon component
const UserPlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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
);

// All legal documents data
const allLegalDocuments = [
  { name: "Address Proof", path: "/address-proof", icon: IdCard, color: "from-blue-500 to-blue-600", description: "Official address verification document", popular: true, category: "Identity" },
  { name: "Lost Document", path: "/lost-document", icon: FileWarning, color: "from-orange-500 to-orange-600", description: "Declaration for lost certificates", popular: false, category: "Affidavit" },
  { name: "Marriage Registration", path: "/marriage-registration", icon: HeartHandshake, color: "from-pink-500 to-pink-600", description: "Legal marriage certificate registration", popular: true, category: "Marriage" },
  { name: "Name Addition (Birth Certificate)", path: "/name-addition-birth-certificate", icon: Baby, color: "from-cyan-500 to-cyan-600", description: "Add name to birth certificate", popular: false, category: "Birth" },
  { name: "Name Correction", path: "/name-correction", icon: PenTool, color: "from-violet-500 to-violet-600", description: "Correct name in documents", popular: true, category: "Correction" },
  { name: "After Marriage Name Change", path: "/after-marriage-name-change", icon: Users, color: "from-red-500 to-red-600", description: "Name change post marriage", popular: false, category: "Marriage" },
  { name: "Signature Change", path: "/signature", icon: FileSignature, color: "from-indigo-500 to-indigo-600", description: "Update signature legally", popular: false, category: "Affidavit" },
  { name: "First Baby", path: "/first-baby", icon: Baby, color: "from-sky-500 to-sky-600", description: "First child documentation", popular: true, category: "Birth" },
  { name: "Single Girl Child", path: "/single-girl", icon: Heart, color: "from-pink-400 to-pink-500", description: "Single girl child benefits", popular: false, category: "Benefits" },
  { name: "Additional Name", path: "/additional-name", icon: UserPlusIcon, color: "from-teal-500 to-teal-600", description: "Add secondary name", popular: false, category: "Correction" },
  { name: "Birth Certificate", path: "/birth-certificate", icon: ScrollText, color: "from-green-500 to-green-600", description: "Official birth record", popular: true, category: "Birth" },
  { name: "Short Attendance", path: "/short-attendence", icon: Calendar, color: "from-yellow-500 to-yellow-600", description: "Attendance certificate", popular: false, category: "Education" },
  { name: "Anti Ragging", path: "/anti-ragging", icon: Shield, color: "from-red-600 to-red-700", description: "Anti-ragging undertaking", popular: false, category: "Education" },
  { name: "Education Loan", path: "/education-loan", icon: Landmark, color: "from-amber-500 to-amber-600", description: "Education loan documents", popular: true, category: "Loan" },
  { name: "Gap Year", path: "/gap-year", icon: School, color: "from-orange-500 to-orange-600", description: "Academic gap affidavit", popular: false, category: "Education" },
  { name: "Income Certificate", path: "/income", icon: DollarSign, color: "from-lime-500 to-lime-600", description: "Income proof document", popular: true, category: "Financial" },
  { name: "Name Change", path: "/name-change", icon: UserMinus, color: "from-purple-500 to-purple-600", description: "Complete name change", popular: true, category: "Correction" },
  { name: "Marriage Register", path: "/marriage-register", icon: BookOpen, color: "from-rose-500 to-rose-600", description: "Marriage register extract", popular: false, category: "Marriage" },
  { name: "Rental Agreements", path: "/rental-agreements", icon: Home, color: "from-emerald-500 to-emerald-600", description: "Legal rent agreement", popular: true, category: "Property" },
  { name: "Agreement to Sale (Before Loan)", path: "/agreement-to-sale-before-loan", icon: FileCheck, color: "from-blue-600 to-blue-700", description: "Pre-loan property sale agreement", popular: true, category: "Property" },
  { name: "Agreement to Sale (After Loan)", path: "/agreement-to-sale-after-loan", icon: Handshake, color: "from-indigo-600 to-indigo-700", description: "Post-loan property sale agreement", popular: true, category: "Property" },
];

// Categories for filtering
const categories = ["All", "Identity", "Affidavit", "Marriage", "Birth", "Correction", "Education", "Loan", "Financial", "Property", "Benefits"];

export default function AllDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  // Filter documents based on search, category, and popular filter
  const filteredDocuments = allLegalDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    const matchesPopular = !showPopularOnly || doc.popular;
    return matchesSearch && matchesCategory && matchesPopular;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">21+ Legal Documents Available</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Legal Documents
              <span className="block text-purple-200">Made Simple</span>
            </h1>
            <p className="text-lg text-purple-100 mb-8">
              Choose from our comprehensive collection of verified legal document templates.
              Trusted by over 10,000+ customers across India.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md shadow-md border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 flex-1 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-purple-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Popular Only Toggle */}
            <button
              onClick={() => setShowPopularOnly(!showPopularOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                showPopularOnly
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600"
              }`}
            >
              <Star size={18} className={showPopularOnly ? "fill-white" : ""} />
              Popular Only
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <p className="text-slate-500">
          Showing <span className="font-semibold text-purple-600">{filteredDocuments.length}</span> documents
          {searchTerm && <span> matching "<span className="font-semibold">{searchTerm}</span>"</span>}
          {selectedCategory !== "All" && <span> in <span className="font-semibold">{selectedCategory}</span> category</span>}
          {showPopularOnly && <span> that are popular</span>}
        </p>
      </div>

      {/* Documents Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">No documents found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc, index) => {
              const IconComponent = doc.icon;
              return (
                <Link
                  key={index}
                  to={doc.path}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100"
                >
                  {/* Gradient Top Bar */}
                  <div className={`h-2 bg-gradient-to-r ${doc.color}`} />
                  
                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${doc.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {typeof IconComponent === 'function' ? (
                          <IconComponent size={24} className="text-white" />
                        ) : (
                          <IconComponent size={24} className="text-white" />
                        )}
                      </div>
                      {doc.popular && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                          <Star size={10} className="fill-orange-500" />
                          Popular
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {doc.name}
                    </h3>
                    
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                      {doc.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 capitalize">{doc.category}</span>
                      <div className="flex items-center gap-1 text-purple-600 font-medium text-sm group-hover:gap-2 transition-all">
                        Get Started
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Overlay Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${doc.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Trust Section */}
      <div className="bg-gradient-to-r from-purple-50 to-white border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Why Choose Our Legal Documents?
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              We provide verified, legally compliant documents that are accepted by government authorities nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Legally Verified</h3>
              <p className="text-sm text-slate-500">All documents are verified by legal experts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileCheck size={32} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Instant Download</h3>
              <p className="text-sm text-slate-500">Get your documents instantly after customization</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">10,000+ Customers</h3>
              <p className="text-sm text-slate-500">Trusted by thousands across India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}