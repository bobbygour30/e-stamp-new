import { useRef, useState, useContext, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI, serviceChargeAPI, couponAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";
import { uploadPDFToCloudinary } from "../utils/cloudinary";

// Generate stamp duty options from ₹10 to ₹2000
const generateStampDutyOptions = () => {
  const options = [];
  // Common stamp duty values
  const commonValues = [10, 20, 50, 100, 200, 300, 500, 1000, 1500, 2000];
  
  // Generate all values from 10 to 2000 with step of 10
  for (let i = 10; i <= 2000; i += 10) {
    if (!commonValues.includes(i)) {
      commonValues.push(i);
    }
  }
  
  commonValues.sort((a, b) => a - b);
  
  return commonValues.map(value => ({
    value: value,
    label: `₹${value}`
  }));
};

const initialData = {
  name: "",
  relationType: "S/D/W/O",
  relationName: "",
  residentOf: "",
  nameBeforeMarriage: "",
  nameAfterMarriage: "",
  verificationPlace: "",
  verificationDate: "",
  stampDutyAmount: 0, // New field for stamp duty
};

export default function AfterMarriageNameChange() {
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

  useEffect(() => {
    fetchServiceCharge();
  }, []);

  useEffect(() => {
    if (pricing) {
      calculateFinalAmount();
    }
  }, [pricing, couponDiscount, data.stampDutyAmount]);

  const fetchServiceCharge = async () => {
    setLoadingPrice(true);
    try {
      const response = await serviceChargeAPI.getChargeByDocumentType('after-marriage-name-change');
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
      // Ensure stampDutyAmount is a number
      const stampDuty = Number(data.stampDutyAmount) || 0;
      const baseSubtotal = Number(pricing.subtotal) || 0;
      const subtotalWithStampDuty = baseSubtotal + stampDuty;
      const gstPercentage = Number(pricing.breakdown.gstPercentage) || 18;
      const gstAmount = (subtotalWithStampDuty * gstPercentage) / 100;
      const totalWithStampDuty = subtotalWithStampDuty + gstAmount;
      const couponDiscountAmount = Number(couponDiscount) || 0;
      const discountedAmount = totalWithStampDuty - couponDiscountAmount;
      setFinalAmount(Math.round(discountedAmount * 100) / 100); // Round to 2 decimal places
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
      const stampDuty = Number(data.stampDutyAmount) || 0;
      const baseSubtotal = Number(pricing?.subtotal) || 0;
      const totalAmount = baseSubtotal + stampDuty;
      
      const response = await couponAPI.validateCoupon({
        code: couponCode,
        amount: totalAmount,
        documentType: 'after-marriage-name-change'
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
    // Convert stampDutyAmount to number
    if (name === "stampDutyAmount") {
      setData(prev => ({ ...prev, [name]: Number(value) || 0 }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
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
      filename: "After_Marriage_Name_Change_Affidavit.pdf",
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
        documentType: 'after-marriage-name-change',
        formData: data,
        paymentAmount: finalAmount,
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discountAmount: couponDiscount
        } : null
      });
      
      const requestId = response.data.requestId;
      
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'after-marriage-name-change', requestId);
      
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
        filename: "After_Marriage_Name_Change_Affidavit.pdf",
        margin: [0.3, 0.3, 0.3, 0.3],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0, backgroundColor: "#ffffff" },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .save();
  };

  // Calculate values for display
  const stampDuty = Number(data.stampDutyAmount) || 0;
  const baseSubtotal = Number(pricing?.subtotal) || 0;
  const subtotalWithStampDuty = baseSubtotal + stampDuty;
  const gstPercentage = Number(pricing?.breakdown?.gstPercentage) || 18;
  const gstAmount = Math.round((subtotalWithStampDuty * gstPercentage) / 100);
  const displayFinalAmount = Math.round(finalAmount * 100) / 100;

  return (
    <div className="min-h-screen bg-[#f3f1fa] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FORM SECTION */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            After Marriage Name Change Affidavit
          </h2>

          <Input label="Name" name="name" value={data.name} onChange={update} />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Relation Type (S/D/W/O)"
              name="relationType"
              value={data.relationType}
              onChange={update}
            />
            <Input
              label="Relation Name"
              name="relationName"
              value={data.relationName}
              onChange={update}
            />
          </div>

          <Input
            label="Resident Of (R/O)"
            name="residentOf"
            value={data.residentOf}
            onChange={update}
          />

          <hr className="my-4" />

          <Input
            label="Name Before Marriage"
            name="nameBeforeMarriage"
            value={data.nameBeforeMarriage}
            onChange={update}
          />
          <Input
            label="Name After Marriage"
            name="nameAfterMarriage"
            value={data.nameAfterMarriage}
            onChange={update}
          />

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

          {/* Stamp Duty Dropdown */}
          <div className="mb-4 mt-2">
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Stamp Duty Amount
            </label>
            <select
              name="stampDutyAmount"
              value={data.stampDutyAmount}
              onChange={update}
              className="w-full border border-purple-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="0">Select Stamp Duty Amount</option>
              {stampDutyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select the stamp duty amount that applies to your document
            </p>
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
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{baseSubtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stamp Duty:</span>
                    <span className="font-medium">₹{stampDuty}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-2 mt-1">
                    <span className="text-gray-600 font-medium">Total before GST:</span>
                    <span className="font-medium">₹{subtotalWithStampDuty}</span>
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
                      <span className="text-lg text-indigo-600">₹{displayFinalAmount}</span>
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
              {uploading ? 'Generating PDF...' : loading ? 'Processing...' : `Proceed to Payment (₹${displayFinalAmount})`}
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
                fontSize: "16pt",
                fontWeight: "bold",
                textDecoration: "underline",
                marginBottom: "25px",
              }}
            >
              AFFIDAVIT
            </div>

            {/* INTRO */}
            <p style={{ textAlign: "justify", marginBottom: "15px" }}>
              I, <b>{data.name || "____________________"}</b> <b>{data.relationType}</b> <b>{data.relationName || "____________________"}</b> R/O <b>{data.residentOf || "____________________"}</b> do hereby solemnly affirm and declare as under:
            </p>

            {/* POINTS */}
            <div style={{ marginLeft: "0px" }}>
              <p style={{ margin: "10px 0" }}>
                1. That I am a citizen of India.
              </p>

              <p style={{ margin: "10px 0" }}>
                2. That my name before marriage was <b>{data.nameBeforeMarriage || "__________"}</b> and after marriage my name has been changed from <b>{data.nameBeforeMarriage || "__________"}</b> to <b>{data.nameAfterMarriage || "__________"}</b>.
              </p>

              <p style={{ margin: "10px 0" }}>
                3. That I undertake that both names <b>{data.nameBeforeMarriage || "__________"}</b> and <b>{data.nameAfterMarriage || "__________"}</b> refer to the one and same person, i.e., myself.
              </p>

              <p style={{ margin: "10px 0" }}>
                4. That I will be known as <b>{data.nameAfterMarriage || "__________"}</b> in future for all purposes.
              </p>

              <p style={{ margin: "10px 0" }}>
                5. That the above statements are true and correct to the best of my knowledge and belief.
              </p>
            </div>

            {/* DEPONENT */}
            <div style={{ marginTop: "40px", textAlign: "right" }}>
              <b>DEPONENT</b>
            </div>

            {/* VERIFICATION */}
            <div style={{ marginTop: "40px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "10px", textDecoration: "underline" }}>
                VERIFICATION
              </div>

              <p style={{ textAlign: "justify" }}>
                Verified at <b>{data.verificationPlace || "__________"}</b> on this <b>{formatDateForDisplay(data.verificationDate)}</b> that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing material has been concealed therefrom.
              </p>

              <div style={{ marginTop: "40px", textAlign: "right" }}>
                <b>DEPONENT</b>
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