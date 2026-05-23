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
  const commonValues = [10, 20, 50, 100, 200, 300, 500, 1000, 1500, 2000];
  
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

// Function to convert number to Indian Rupees words
const numberToWords = (num) => {
  if (!num || num === "") return "";
  
  const convertToWords = (n) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const convertLessThanThousand = (n) => {
      if (n === 0) return '';
      let result = '';
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        n = 0;
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result.trim();
    };
    
    if (n === 0) return 'Zero';
    let result = '';
    const crore = Math.floor(n / 10000000);
    const lakh = Math.floor((n % 10000000) / 100000);
    const thousand = Math.floor((n % 100000) / 1000);
    const remainder = n % 1000;
    
    if (crore > 0) result += convertLessThanThousand(crore) + ' Crore ';
    if (lakh > 0) result += convertLessThanThousand(lakh) + ' Lakh ';
    if (thousand > 0) result += convertLessThanThousand(thousand) + ' Thousand ';
    if (remainder > 0) result += convertLessThanThousand(remainder);
    
    return result.trim() + ' Rupees';
  };
  
  const numValue = parseFloat(num);
  if (isNaN(numValue)) return "";
  
  const rupees = Math.floor(numValue);
  let result = convertToWords(rupees);
  return result;
};

const initialData = {
  // Agreement Location
  agreementPlace: "Ghaziabad",
  agreementDate: "",
  
  // First Party (Landlord/Owner)
  landlordName: "",
  landlordFatherName: "",
  landlordAddress: "",
  
  // Second Party (Company/Tenant)
  companyName: "",
  proprietorName: "",
  directorName: "",
  tenantAddress: "",
  
  // Property Details
  propertyAddress: "",
  
  // Rent Details
  monthlyRent: "",
  monthlyRentWords: "",
  rentIncreasePercentage: "10",
  noticePeriodMonths: "2",
  commencementDate: "",
  
  // Witnesses
  witness1Name: "",
  witness1Address: "",
  witness2Name: "",
  witness2Address: "",
  
  stampDutyAmount: 0,
};

export default function RentAgreementGST() {
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
      const response = await serviceChargeAPI.getChargeByDocumentType('rent-agreement-gst');
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
      const stampDuty = Number(data.stampDutyAmount) || 0;
      const platformFee = Number(pricing.breakdown.platformFee) || Number(pricing.subtotal) || 0;
      const subtotalWithStampDuty = platformFee + stampDuty;
      const gstPercentage = Number(pricing.breakdown.gstPercentage) || 18;
      const gstAmount = (subtotalWithStampDuty * gstPercentage) / 100;
      const totalWithStampDuty = subtotalWithStampDuty + gstAmount;
      const couponDiscountAmount = Number(couponDiscount) || 0;
      const discountedAmount = totalWithStampDuty - couponDiscountAmount;
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
      const stampDuty = Number(data.stampDutyAmount) || 0;
      const platformFee = Number(pricing?.breakdown?.platformFee) || Number(pricing?.subtotal) || 0;
      const totalAmount = platformFee + stampDuty;
      
      const response = await couponAPI.validateCoupon({
        code: couponCode,
        amount: totalAmount,
        documentType: 'rent-agreement-gst'
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
    
    if (name === "stampDutyAmount") {
      setData(prev => ({ ...prev, [name]: Number(value) || 0 }));
    } else if (name === "monthlyRent") {
      const words = numberToWords(value);
      setData(prev => ({ 
        ...prev, 
        monthlyRent: value,
        monthlyRentWords: words
      }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "__________";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const generatePDFBlob = async () => {
    const element = pdfRef.current;
    if (!element) {
      throw new Error('PDF element not found');
    }
    
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: "Rent_Agreement_GST.pdf",
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
      
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('Generated PDF is empty');
      }
      
      const response = await documentAPI.createRequest({
        documentType: 'rent-agreement-gst',
        formData: data,
        paymentAmount: finalAmount,
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discountAmount: couponDiscount
        } : null
      });

      const requestId = response.data.requestId;
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'rent-agreement-gst', requestId);
      
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
        filename: "Rent_Agreement_GST.pdf",
        margin: [0.3, 0.3, 0.3, 0.3],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0, backgroundColor: "#ffffff" },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .save();
  };

  const stampDuty = Number(data.stampDutyAmount) || 0;
  const platformFee = Number(pricing?.breakdown?.platformFee) || Number(pricing?.subtotal) || 0;
  const subtotalWithStampDuty = platformFee + stampDuty;
  const gstPercentage = Number(pricing?.breakdown?.gstPercentage) || 18;
  const gstAmount = Math.round((subtotalWithStampDuty * gstPercentage) / 100);
  const displayFinalAmount = Math.round(finalAmount * 100) / 100;

  return (
    <div className="min-h-screen bg-[#f3f1fa] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FORM SECTION */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200 overflow-y-auto" style={{ maxHeight: "90vh" }}>
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Rent Agreement (GST)
          </h2>

          {/* Agreement Details */}
          <div className="bg-purple-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-purple-800 mb-2">Agreement Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Agreement Place" name="agreementPlace" value={data.agreementPlace} onChange={update} />
              <DateInput label="Agreement Date" name="agreementDate" value={data.agreementDate} onChange={update} />
            </div>
          </div>

          {/* First Party (Landlord/Owner) */}
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">First Party (Landlord/Owner)</h3>
            <Input label="Landlord/Owner Name" name="landlordName" value={data.landlordName} onChange={update} />
            <Input label="Father's Name" name="landlordFatherName" value={data.landlordFatherName} onChange={update} />
            <Input label="Residential Address" name="landlordAddress" value={data.landlordAddress} onChange={update} />
          </div>

          {/* Second Party (Company/Tenant) */}
          <div className="bg-green-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-green-800 mb-2">Second Party (Company/Tenant)</h3>
            <Input label="Company Name" name="companyName" value={data.companyName} onChange={update} />
            <Input label="Proprietor Name" name="proprietorName" value={data.proprietorName} onChange={update} />
            <Input label="Director Name" name="directorName" value={data.directorName} onChange={update} />
            <Input label="Tenant Address" name="tenantAddress" value={data.tenantAddress} onChange={update} />
          </div>

          {/* Property Details */}
          <div className="bg-yellow-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Property Details</h3>
            <Input label="Shop/Office Address" name="propertyAddress" value={data.propertyAddress} onChange={update} />
            <DateInput label="Commencement Date" name="commencementDate" value={data.commencementDate} onChange={update} />
          </div>

          {/* Rent Details */}
          <div className="bg-orange-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-orange-800 mb-2">Rent Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Monthly Rent (₹)" name="monthlyRent" type="number" value={data.monthlyRent} onChange={update} />
              <Input label="Monthly Rent in Words" name="monthlyRentWords" value={data.monthlyRentWords} onChange={update} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Rent Increase (%) per year" name="rentIncreasePercentage" type="number" value={data.rentIncreasePercentage} onChange={update} />
              <Input label="Notice Period (Months)" name="noticePeriodMonths" type="number" value={data.noticePeriodMonths} onChange={update} />
            </div>
          </div>

          {/* Witnesses */}
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Witnesses</h3>
            <Input label="Witness 1 Name" name="witness1Name" value={data.witness1Name} onChange={update} />
            <Input label="Witness 1 Address" name="witness1Address" value={data.witness1Address} onChange={update} />
            <div className="mt-3">
              <Input label="Witness 2 Name" name="witness2Name" value={data.witness2Name} onChange={update} />
              <Input label="Witness 2 Address" name="witness2Address" value={data.witness2Address} onChange={update} />
            </div>
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
                    <span className="text-gray-600">Service Fee:</span>
                    <span className="font-medium">₹{platformFee}</span>
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

        {/* PDF PREVIEW SECTION */}
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
            <div style={{
              textAlign: "center",
              fontSize: "16pt",
              fontWeight: "bold",
              textDecoration: "underline",
              marginBottom: "20px",
            }}>
              RENT AGREEMENT
            </div>

            {/* Agreement Body */}
            <p style={{ textAlign: "justify", marginBottom: "12px" }}>
              This Indenture made at <b>{data.agreementPlace || "Ghaziabad"}</b> on this <b>{formatDateForDisplay(data.agreementDate)}</b>. Between shop or office Owner, <b>{data.landlordName || "____________________"}</b> S/o <b>{data.landlordFatherName || "____________________"}</b> R/O <b>{data.landlordAddress || "____________________"}</b> (hereinafter called the <b>First Party/Landlord Owner</b>) and Company name <b>{data.companyName || "M/s. ____________________"}</b> Prop/Dir of <b>{data.proprietorName || "____________________"}</b> / <b>{data.directorName || "____________________"}</b> R/O <b>{data.tenantAddress || "____________________"}</b> (hereinafter called the <b>Second Party/Tenant</b>):
            </p>

            <p style={{ textAlign: "justify", marginBottom: "12px" }}>
              Whereas the First Party is the landlord/Owner of the premises:- <b>{data.propertyAddress || "____________________"}</b> AND WHEREAS the Second Party approached and requested the First Party to take the said premises on rent for which the first party agreed to give the same on rent to the second party for a limited period of <b>11 months</b>. Both parties agreed on the following terms and conditions. Second Party use the premises for their trading only:
            </p>

            <p style={{ textAlign: "justify", fontWeight: "bold", marginBottom: "12px" }}>
              TERMS & CONDITIONS OF THE TENANCY:
            </p>

            <div style={{ marginLeft: "0px" }}>
              <p style={{ margin: "8px 0" }}>
                1. That the tenancy shall be for a period of <b>eleven months</b>.
              </p>

              <p style={{ margin: "8px 0" }}>
                2. That the monthly rent of the tenanted premises shall be <b>Rs.{data.monthlyRent || "_________"}/-</b> (<b>{data.monthlyRentWords || "____________________"}</b>) with an increase of <b>{data.rentIncreasePercentage || "10"}</b>% every year.
              </p>

              <p style={{ margin: "8px 0" }}>
                3. Rent will be payable in advance.
              </p>

              <p style={{ margin: "8px 0" }}>
                4. That in case of any party wants to terminate the tenancy they are bound to serve the notice of <b>{data.noticePeriodMonths || "2"}</b> months prior vacation of the tenanted premises.
              </p>

              <p style={{ margin: "8px 0" }}>
                5. That the alteration and development of any kind whatsoever in the tenanted portion is expressly disallowed.
              </p>

              <p style={{ margin: "8px 0" }}>
                6. That the second party will not be authorized to sublet the same in part or whole in any manner.
              </p>

              <p style={{ margin: "8px 0" }}>
                7. That on the expiry of the period of the rental agreement the second party is under obligation to hand over the peaceful vacant possession to the first party as in the condition at the time of taking over the possession. In case of any breakage/damage of losses the second party will make good/compensate the same to first party.
              </p>

              <p style={{ margin: "8px 0" }}>
                8. That the electricity dues and water charges shall be payable by the second party.
              </p>

              <p style={{ margin: "8px 0" }}>
                That the tenancy shall commence from <b>{formatDateForDisplay(data.commencementDate)}</b>.
              </p>
            </div>

            <p style={{ marginTop: "20px" }}>
              THIS RENT AGREEMENT IS executed at <b>{data.agreementPlace || "Ghaziabad"}</b> before the following witnesses:
            </p>

            {/* Witnesses and Signatures */}
            <div style={{ marginTop: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "45%" }}>
                  <p><b>WITNESSES:</b></p>
                  <p style={{ marginTop: "15px" }}>1. <b>{data.witness1Name || "____________________"}</b></p>
                  <p>Address: <b>{data.witness1Address || "____________________"}</b></p>
                  <p style={{ marginTop: "15px" }}>2. <b>{data.witness2Name || "____________________"}</b></p>
                  <p>Address: <b>{data.witness2Address || "____________________"}</b></p>
                </div>
                <div style={{ width: "45%", textAlign: "right" }}>
                  <p><b>LESSOR (First Party)</b></p>
                  <p style={{ marginTop: "30px" }}>Signature: ____________________</p>
                  <p style={{ marginTop: "30px" }}><b>LESSEE (Second Party)</b></p>
                  <p style={{ marginTop: "30px" }}>Signature: ____________________</p>
                </div>
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
function Input({ label, readOnly, className = "", ...props }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-purple-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        readOnly={readOnly}
        className={`w-full border border-purple-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${readOnly ? 'bg-gray-100' : ''} ${className}`}
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