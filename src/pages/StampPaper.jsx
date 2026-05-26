import { useRef, useState, useContext, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI, serviceChargeAPI, couponAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";
import { uploadPDFToCloudinary } from "../utils/cloudinary";
import { 
  FileText, 
  MapPin, 
  Building2, 
  Users, 
  Phone, 
  IndianRupee,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Generate stamp duty options
const generateStampDutyOptions = () => {
  const options = [
    10, 20, 50, 100, 200, 300, 500, 1000, 1500, 2000,
    2500, 3000, 3500, 4000, 4500, 5000, 7500, 10000,
    15000, 20000, 25000, 30000, 40000, 50000
  ];
  
  return options.map(value => ({
    value: value,
    label: `₹${value.toLocaleString('en-IN')}`
  }));
};

// State and City Data
const stateCityData = {
  "Uttar Pradesh": {
    cities: [
      "Lucknow", "Kanpur", "Agra", "Varanasi", "Noida", 
      "Ghaziabad", "Meerut", "Allahabad", "Bareilly", "Aligarh"
    ]
  },
  "Maharashtra": {
    cities: [
      "Mumbai", "Pune", "Nagpur", "Nashik", "Thane", 
      "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Navi Mumbai"
    ]
  },
  "Delhi NCR": {
    cities: [
      "New Delhi", "South Delhi", "North Delhi", "East Delhi", 
      "West Delhi", "Central Delhi", "Gurugram", "Noida", "Faridabad"
    ]
  },
  "Karnataka": {
    cities: [
      "Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum",
      "Gulbarga", "Davanagere", "Bellary", "Shimoga", "Tumkur"
    ]
  },
  "Tamil Nadu": {
    cities: [
      "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
      "Tirunelveli", "Vellore", "Erode", "Thoothukkudi", "Dindigul"
    ]
  }
};

// Stamp paper purposes
const stampPurposes = [
  "Property Sale Agreement",
  "Rent Agreement",
  "Loan Agreement",
  "Partnership Deed",
  "Affidavit",
  "Power of Attorney",
  "Gift Deed",
  "Will/Testament",
  "Lease Agreement",
  "Construction Contract",
  "Employment Contract",
  "Non-Disclosure Agreement",
  "Memorandum of Understanding (MOU)",
  "Settlement Agreement",
  "Indemnity Bond",
  "Other"
];

const initialData = {
  selectedState: "",
  selectedCity: "",
  purpose: "",
  stampAmount: "",
  firstPartyName: "",
  firstPartyMobile: "",
  secondPartyName: "",
  secondPartyMobile: "",
};

export default function StampPaper() {
  const [data, setData] = useState(initialData);
  const [showPayment, setShowPayment] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [serviceCharge, setServiceCharge] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const pdfRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const stampDutyOptions = generateStampDutyOptions();
  const states = Object.keys(stateCityData);
  const cities = data.selectedState ? stateCityData[data.selectedState].cities : [];

  useEffect(() => {
    fetchServiceCharge();
  }, []);

  useEffect(() => {
    if (pricing) {
      calculateFinalAmount();
    }
  }, [pricing, couponDiscount]);

  const fetchServiceCharge = async () => {
    setLoadingPrice(true);
    try {
      const response = await serviceChargeAPI.getChargeByDocumentType('stamp-paper');
      if (response.data.success) {
        setServiceCharge(response.data.charge);
        setPricing(response.data.pricing);
        setFinalAmount(response.data.pricing.total);
      }
    } catch (error) {
      console.error('Error fetching service charge:', error);
      setPricing({
        subtotal: 500,
        gstAmount: 90,
        total: 590,
        breakdown: { platformFee: 500, gstPercentage: 18, gstAmount: 90 }
      });
      setFinalAmount(590);
    } finally {
      setLoadingPrice(false);
    }
  };

  const calculateFinalAmount = () => {
    if (pricing) {
      const stampAmount = Number(data.stampAmount) || 0;
      const platformFee = Number(pricing.breakdown.platformFee) || Number(pricing.subtotal) || 0;
      const subtotalWithStamp = platformFee + stampAmount;
      const gstPercentage = Number(pricing.breakdown.gstPercentage) || 18;
      const gstAmount = (subtotalWithStamp * gstPercentage) / 100;
      const totalWithStamp = subtotalWithStamp + gstAmount;
      const couponDiscountAmount = Number(couponDiscount) || 0;
      const discountedAmount = totalWithStamp - couponDiscountAmount;
      setFinalAmount(Math.round(discountedAmount * 100) / 100);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    
    try {
      const stampAmount = Number(data.stampAmount) || 0;
      const platformFee = Number(pricing?.breakdown?.platformFee) || Number(pricing?.subtotal) || 0;
      const totalAmount = platformFee + stampAmount;
      
      const response = await couponAPI.validateCoupon({
        code: couponCode,
        amount: totalAmount,
        documentType: 'stamp-paper'
      });
      
      if (response.data.valid) {
        setAppliedCoupon(response.data.coupon);
        setCouponDiscount(response.data.coupon.discountAmount);
        setCouponError('');
        alert(`Coupon applied! You saved ₹${response.data.coupon.discountAmount}`);
      } else {
        setCouponError(response.data.message || 'Invalid coupon code');
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Failed to apply coupon');
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    setCouponError('');
  };

  const update = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    
    // Reset city when state changes
    if (name === "selectedState") {
      setData(prev => ({ ...prev, selectedState: value, selectedCity: "" }));
    }
  };

  const generatePDFBlob = async () => {
    const element = pdfRef.current;
    if (!element) {
      throw new Error('PDF element not found');
    }
    
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: "Stamp_Paper_Application.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        scrollY: 0, 
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true
      },
      jsPDF: { 
        unit: "in", 
        format: "a4", 
        orientation: "portrait" 
      },
      pagebreak: { mode: ['css', 'legacy'] },
    };
    
    try {
      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');
      return pdfBlob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Validate required fields
    if (!data.selectedState || !data.selectedCity || !data.stampAmount || !data.firstPartyName || !data.secondPartyName) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      setUploading(true);
      const pdfBlob = await generatePDFBlob();
      
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('Generated PDF is empty');
      }
      
      const response = await documentAPI.createRequest({
        documentType: 'stamp-paper',
        formData: data,
        paymentAmount: finalAmount,
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discountAmount: couponDiscount
        } : null
      });

      const requestId = response.data.requestId;
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'stamp-paper', requestId);
      
      await documentAPI.updatePDFUrl(requestId, {
        pdfUrl: uploadResult.url,
        cloudinaryPublicId: uploadResult.publicId
      });

      setRequestId(requestId);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating request:', error);
      alert(error.message || 'Failed to create request. Please try again.');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    navigate('/dashboard');
  };

  const downloadPDF = () => {
    const element = pdfRef.current;
    html2pdf()
      .from(element)
      .set({
        filename: "Stamp_Paper_Application.pdf",
        margin: [0.3, 0.3, 0.3, 0.3],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0, backgroundColor: "#ffffff" },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .save();
  };

  const stampAmount = Number(data.stampAmount) || 0;
  const platformFee = Number(pricing?.breakdown?.platformFee) || Number(pricing?.subtotal) || 0;
  const subtotalWithStamp = platformFee + stampAmount;
  const gstPercentage = Number(pricing?.breakdown?.gstPercentage) || 18;
  const gstAmount = Math.round((subtotalWithStamp * gstPercentage) / 100);
  const displayFinalAmount = Math.round(finalAmount * 100) / 100;

  const isFormValid = data.selectedState && data.selectedCity && data.stampAmount && data.firstPartyName && data.secondPartyName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
            <FileText size={32} className="text-purple-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Apply for e-Stamp Paper
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Get your e-Stamp paper online from any city across India. Fast, secure, and legally valid.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FORM SECTION */}
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText size={20} />
                Stamp Paper Details
              </h2>
            </div>
            
            <div className="p-6 space-y-5">
              {/* State Dropdown */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Select State <span className="text-red-500">*</span>
                </label>
                <select
                  name="selectedState"
                  value={data.selectedState}
                  onChange={update}
                  className="w-full border border-purple-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
                  <Building2 size={16} />
                  Select City <span className="text-red-500">*</span>
                </label>
                <select
                  name="selectedCity"
                  value={data.selectedCity}
                  onChange={update}
                  disabled={!data.selectedState}
                  className="w-full border border-purple-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white disabled:bg-gray-100"
                >
                  <option value="">{data.selectedState ? "Select City" : "First select state"}</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Purpose - Large Text */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
                  <FileText size={16} />
                  Purpose of Stamp Paper
                </label>
                <select
                  name="purpose"
                  value={data.purpose}
                  onChange={update}
                  className="w-full border border-purple-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="">Select Purpose</option>
                  {stampPurposes.map(purpose => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
              </div>

              {/* Amount of Stamp Paper */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
                  <IndianRupee size={16} />
                  Amount of Stamp Paper <span className="text-red-500">*</span>
                </label>
                <select
                  name="stampAmount"
                  value={data.stampAmount}
                  onChange={update}
                  className="w-full border border-purple-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="">Select Stamp Amount</option>
                  {stampDutyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Select the denomination of stamp paper required</p>
              </div>

              {/* First Party Details */}
              <div className="border-t border-purple-100 pt-4 mt-2">
                <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Users size={18} />
                  First Party Details
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="firstPartyName"
                    value={data.firstPartyName}
                    onChange={update}
                    placeholder="Full Name"
                    className="w-full border border-purple-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="tel"
                    name="firstPartyMobile"
                    value={data.firstPartyMobile}
                    onChange={update}
                    placeholder="Mobile Number"
                    className="w-full border border-purple-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Second Party Details */}
              <div className="border-t border-purple-100 pt-4 mt-2">
                <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Users size={18} />
                  Second Party Details
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="secondPartyName"
                    value={data.secondPartyName}
                    onChange={update}
                    placeholder="Full Name"
                    className="w-full border border-purple-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="tel"
                    name="secondPartyMobile"
                    value={data.secondPartyMobile}
                    onChange={update}
                    placeholder="Mobile Number"
                    className="w-full border border-purple-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-md font-semibold text-gray-800 mb-3">Price Details</h3>
                {loadingPrice ? (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stamp Paper Value:</span>
                      <span className="font-medium">₹{stampAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee:</span>
                      <span className="font-medium">₹{platformFee}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-300 pt-2 mt-1">
                      <span className="text-gray-600 font-medium">Total before GST:</span>
                      <span className="font-medium">₹{subtotalWithStamp.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST ({gstPercentage}%):</span>
                      <span className="font-medium">₹{gstAmount}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount ({appliedCoupon.code}):</span>
                        <span>- ₹{couponDiscount}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-gray-400 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>Total Amount:</span>
                        <span className="text-lg text-indigo-600">₹{displayFinalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Coupon Section */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  Apply Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    disabled={!!appliedCoupon}
                    className="flex-1 border border-purple-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  />
                  {!appliedCoupon ? (
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode}
                      className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {couponLoading ? 'Applying...' : 'Apply'}
                    </button>
                  ) : (
                    <button
                      onClick={handleRemoveCoupon}
                      className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {couponError && (
                  <p className="text-xs text-red-600 mt-1">{couponError}</p>
                )}
                {appliedCoupon && (
                  <p className="text-xs text-green-600 mt-1">
                    Coupon applied! You saved ₹{couponDiscount}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={downloadPDF}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition"
                >
                  Preview Application
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || uploading || !isFormValid}
                  className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition"
                >
                  {uploading ? 'Generating...' : loading ? 'Processing...' : `Proceed to Payment (₹${displayFinalAmount})`}
                </button>
              </div>
            </div>
          </div>

          {/* PDF PREVIEW SECTION */}
          <div className="bg-gray-100 rounded-xl shadow-lg overflow-auto p-4" style={{ height: "80vh" }}>
            <div
              ref={pdfRef}
              style={{
                width: "100%",
                maxWidth: "100%",
                backgroundColor: "#ffffff",
                color: "#000000",
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: "12pt",
                lineHeight: "1.5",
                padding: "20px",
                boxSizing: "border-box",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Header with Stamp */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{
                  border: "2px solid #000",
                  display: "inline-block",
                  padding: "8px 20px",
                  marginBottom: "15px",
                  background: "#f0f0f0"
                }}>
                  <span style={{ fontSize: "14pt", fontWeight: "bold" }}>E-STAMP PAPER</span>
                </div>
                <h1 style={{ fontSize: "18pt", fontWeight: "bold", margin: "10px 0" }}>
                  Government of India
                </h1>
                <p style={{ fontSize: "10pt", color: "#555" }}>
                  Authorized under the Indian Stamp Act, 1899
                </p>
              </div>

              {/* Application Details */}
              <div style={{ marginTop: "20px" }}>
                <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "5px", marginBottom: "15px" }}>
                  Stamp Paper Application
                </h2>
                
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "8px", width: "40%", fontWeight: "bold" }}>State:</td>
                      <td style={{ padding: "8px" }}>{data.selectedState || "_____________"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "8px", fontWeight: "bold" }}>City:</td>
                      <td style={{ padding: "8px" }}>{data.selectedCity || "_____________"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "8px", fontWeight: "bold" }}>Purpose:</td>
                      <td style={{ padding: "8px" }}>{data.purpose || "_____________"}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "8px", fontWeight: "bold" }}>Stamp Amount:</td>
                      <td style={{ padding: "8px", color: "#2563eb", fontWeight: "bold" }}>₹{stampAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Party Details */}
                <div style={{ marginTop: "25px" }}>
                  <h3 style={{ fontSize: "12pt", fontWeight: "bold", backgroundColor: "#f3f4f6", padding: "8px", marginBottom: "10px" }}>
                    First Party (Buyer/Applicant)
                  </h3>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "8px", width: "40%", fontWeight: "bold" }}>Name:</td>
                        <td style={{ padding: "8px" }}>{data.firstPartyName || "_____________"}</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "8px", fontWeight: "bold" }}>Mobile Number:</td>
                        <td style={{ padding: "8px" }}>{data.firstPartyMobile || "_____________"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <h3 style={{ fontSize: "12pt", fontWeight: "bold", backgroundColor: "#f3f4f6", padding: "8px", marginBottom: "10px" }}>
                    Second Party (Seller/Opposite Party)
                  </h3>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "8px", width: "40%", fontWeight: "bold" }}>Name:</td>
                        <td style={{ padding: "8px" }}>{data.secondPartyName || "_____________"}</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "8px", fontWeight: "bold" }}>Mobile Number:</td>
                        <td style={{ padding: "8px" }}>{data.secondPartyMobile || "_____________"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Declaration */}
                <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#fefce8", borderRadius: "5px" }}>
                  <p style={{ fontSize: "10pt", textAlign: "center" }}>
                    I/We hereby declare that the information provided above is true and correct to the best of my/our knowledge.
                    This e-Stamp paper is being purchased for the purpose mentioned above and will be used for lawful purposes only.
                  </p>
                </div>

                {/* Signature Area */}
                <div style={{ marginTop: "40px", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p>Date: _____________</p>
                    <p style={{ marginTop: "30px" }}>Place: {data.selectedCity || "_____________"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p>Signature of First Party</p>
                    <p style={{ marginTop: "30px" }}>Signature of Second Party</p>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: "30px", textAlign: "center", fontSize: "8pt", color: "#666", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
                  <p>This is a computer generated e-Stamp paper. Valid under the Indian Stamp Act, 1899.</p>
                  <p>e-Stamp Certificate Number: {Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">Legally Valid</p>
                <p className="text-xs text-blue-600">Accepted by all government authorities</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <AlertCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Instant Delivery</p>
                <p className="text-xs text-green-600">Get e-Stamp paper instantly via email</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-800">Pan India Coverage</p>
                <p className="text-xs text-purple-600">Available across all states and cities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && requestId && (
        <PaymentModal
          requestId={requestId}
          amount={finalAmount}
          couponApplied={appliedCoupon}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}