import { useRef, useState, useContext, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI, serviceChargeAPI, couponAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";
import { uploadPDFToCloudinary } from "../utils/cloudinary";

const initialData = {
  fatherName: "",
  motherName: "",
  residentOf: "",
  childName: "",
  className: "",
  category: "",
  schoolName: "",
  firstBornName: "",
  birthDate: "",
  birthPlace: "",
  verificationPlace: "Delhi",
  verificationDate: "",
};

export default function FirstBaby() {
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
      const response = await serviceChargeAPI.getChargeByDocumentType('first-baby');
      if (response.data.success) {
        setServiceCharge(response.data.charge);
        setPricing(response.data.pricing);
        setFinalAmount(response.data.pricing.total);
      }
    } catch (error) {
      console.error('Error fetching service charge:', error);
      // Fallback to default pricing
      setPricing({
        subtotal: 500,
        gstAmount: 90,
        total: 590,
        breakdown: { basePrice: 500, platformFee: 0, gstPercentage: 18, gstAmount: 90 }
      });
      setFinalAmount(590);
    } finally {
      setLoadingPrice(false);
    }
  };

  const calculateFinalAmount = () => {
    if (pricing) {
      const discountedAmount = pricing.total - couponDiscount;
      setFinalAmount(discountedAmount > 0 ? discountedAmount : 0);
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
      const response = await couponAPI.validateCoupon({
        code: couponCode,
        amount: pricing?.total || 0,
        documentType: 'first-baby'
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
  };

  // Format date for display in PDF
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "__________";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // Generate PDF as Blob using html2pdf
  const generatePDFBlob = async () => {
    const element = pdfRef.current;
    if (!element) {
      throw new Error('PDF element not found');
    }
    
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: "First_Born_Child_Affidavit.pdf",
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
    
    setLoading(true);
    try {
      setUploading(true);
      const pdfBlob = await generatePDFBlob();
      
      console.log('PDF Blob generated:', pdfBlob);
      console.log('PDF Blob size:', pdfBlob.size);
      
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('Generated PDF is empty');
      }
      
      const response = await documentAPI.createRequest({
        documentType: 'first-born-child',
        formData: data,
        paymentAmount: finalAmount,
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discountAmount: couponDiscount
        } : null
      });
      
      const requestId = response.data.requestId;
      
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'first-born-child', requestId);
      
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
        filename: "First_Born_Child_Affidavit.pdf",
        margin: [0.3, 0.3, 0.3, 0.3],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0, backgroundColor: "#ffffff" },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-[#f3f1fa] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FORM SECTION */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            First Born Child Affidavit
          </h2>

          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Mother Name" name="motherName" value={data.motherName} onChange={update} />
          <Input label="Resident Of (R/O)" name="residentOf" value={data.residentOf} onChange={update} />

          <hr className="my-4" />

          <Input label="Name of Child (Applied For Admission)" name="childName" value={data.childName} onChange={update} />
          <Input label="Class" name="className" value={data.className} onChange={update} />
          <Input label="Category" name="category" value={data.category} onChange={update} />
          <Input label="School Name" name="schoolName" value={data.schoolName} onChange={update} />

          <hr className="my-4" />

          <Input label="First Born Child Name" name="firstBornName" value={data.firstBornName} onChange={update} />
          <DateInput 
            label="Date of Birth" 
            name="birthDate" 
            value={data.birthDate} 
            onChange={update} 
          />
          <Input label="Place of Birth" name="birthPlace" value={data.birthPlace} onChange={update} />

          <div className="grid grid-cols-2 gap-3">
            <Input 
              label="Verification Place" 
              name="verificationPlace" 
              value={data.verificationPlace} 
              onChange={update} 
            />
            <DateInput 
              label="Verification Date" 
              name="verificationDate" 
              value={data.verificationDate} 
              onChange={update} 
            />
          </div>

          {/* Price Breakdown Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Price Details</h3>
            {loadingPrice ? (
              <div className="flex justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Document Fee:</span>
                    <span className="font-medium">₹{pricing?.breakdown?.basePrice || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee:</span>
                    <span className="font-medium">₹{pricing?.breakdown?.platformFee || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST ({pricing?.breakdown?.gstPercentage || 18}%):</span>
                    <span className="font-medium">₹{pricing?.breakdown?.gstAmount || 0}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount ({appliedCoupon.code}):</span>
                      <span>- ₹{couponDiscount}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Total Amount:</span>
                      <span className="text-lg text-indigo-600">₹{finalAmount}</span>
                    </div>
                  </div>
                </div>
              </>
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
                className="flex-1 border border-purple-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />
              {!appliedCoupon ? (
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
                >
                  {couponLoading ? 'Applying...' : 'Apply'}
                </button>
              ) : (
                <button
                  onClick={handleRemoveCoupon}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
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

          <div className="flex gap-3 mt-6">
            <button
              onClick={downloadPDF}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition"
            >
              Preview PDF
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-lg font-medium disabled:opacity-50 transition"
            >
              {uploading ? 'Generating PDF...' : loading ? 'Processing...' : `Proceed to Payment (₹${finalAmount})`}
            </button>
          </div>
        </div>

        {/* PDF PREVIEW SECTION - FIXED LAYOUT */}
        <div className="bg-gray-100 rounded-xl shadow overflow-auto flex justify-center p-4" style={{ height: "90vh" }}>
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
            {/* TITLE */}
            <div
              style={{
                textAlign: "center",
                fontSize: "15pt",
                fontWeight: "bold",
                textDecoration: "underline",
                marginBottom: "22px",
              }}
            >
              AFFIDAVIT
            </div>

            {/* INTRO */}
            <p style={{ textAlign: "justify", marginBottom: "15px" }}>
              We <b>{data.fatherName || "____________________"}</b> & <b>{data.motherName || "____________________"}</b> R/O <b>{data.residentOf || "____________________"}</b> do hereby solemnly affirm and declare as under:
            </p>

            {/* POINTS */}
            <div style={{ marginLeft: "0px" }}>
              <p style={{ margin: "10px 0" }}>
                1. That we have applied for admission of our ward <b>{data.childName || "____________________"}</b> in class <b>{data.className || "__________"}</b> under <b>{data.category || "__________"}</b> category in <b>{data.schoolName || "____________________"}</b>.
              </p>

              <p style={{ margin: "10px 0" }}>
                2. That <b>{data.firstBornName || "____________________"}</b> is our first born child having born on <b>{formatDateForDisplay(data.birthDate)}</b> at <b>{data.birthPlace || "____________________"}</b>.
              </p>
            </div>

            {/* SIGNATURES */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "40px",
                fontWeight: "bold",
              }}
            >
              <div>(FATHER)</div>
              <div>(MOTHER)</div>
            </div>

            <div style={{ textAlign: "center", marginTop: "12px", fontWeight: "bold" }}>
              DEPONENT (S)
            </div>

            {/* VERIFICATION */}
            <div style={{ marginTop: "35px" }}>
              <div style={{ fontWeight: "bold", textDecoration: "underline", marginBottom: "10px" }}>
                VERIFICATION:
              </div>

              <p style={{ textAlign: "justify" }}>
                Verified at <b>{data.verificationPlace || "Delhi"}</b> on this <b>{formatDateForDisplay(data.verificationDate)}</b> that the contents of the above affidavit are true to my knowledge; no part of it is false and nothing has been concealed therefrom.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "35px",
                  fontWeight: "bold",
                }}
              >
                <div>(FATHER)</div>
                <div>(MOTHER)</div>
              </div>

              <div style={{ textAlign: "center", marginTop: "12px", fontWeight: "bold" }}>
                DEPONENT (S)
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

/* INPUT COMPONENT */
function Input({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-purple-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full border border-purple-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}

/* DATE INPUT COMPONENT */
function DateInput({ label, name, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-purple-700 mb-1">
        {label}
      </label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-purple-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}