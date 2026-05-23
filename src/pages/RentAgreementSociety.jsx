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
  // Agreement Date
  agreementDate: "",
  
  // First Party (Landlord/Owner)
  landlordName: "",
  landlordAge: "",
  landlordOccupation: "",
  landlordRelation: "W/O",
  landlordRelationName: "",
  landlordAddress: "",
  landlordAadhaar: "",
  landlordMobile: "",
  
  // Second Party (Tenant)
  tenantName: "",
  tenantFatherName: "",
  tenantAge: "",
  tenantOccupation: "",
  tenantAddress: "",
  tenantAadhaar: "",
  tenantMobile: "",
  
  // Property Details
  propertyAddress: "",
  
  // Tenancy Period
  tenancyStartDate: "",
  tenancyEndDate: "",
  
  // Rent Details
  monthlyRent: "",
  monthlyRentWords: "",
  oneMonthAdvanceRent: "",
  oneMonthAdvanceRentWords: "",
  securityDeposit: "",
  securityDepositWords: "",
  
  // Additional Charges
  powerBackupCharges: "250",
  waterCharges: "",
  
  // Annexure Items
  annexureItems: [
    { name: "Tube light & bulbs", value: "" },
    { name: "Ceiling fan", value: "" },
    { name: "LED", value: "" },
    { name: "Chimney", value: "" },
    { name: "RO water unit", value: "" },
    { name: "Exhaust fan", value: "" },
    { name: "Bell", value: "" },
    { name: "Furnishing wall mirror", value: "" },
    { name: "Curtain rods", value: "" },
    { name: "Wardrobe", value: "" },
    { name: "Kitchen cupboard above platform", value: "" },
    { name: "Modular kitchen", value: "" },
    { name: "AC", value: "" },
    { name: "Key in Main door other key", value: "" },
    { name: "Other", value: "" }
  ],
  otherDetails: "",
  
  // Witnesses
  witness1Name: "",
  witness2Name: "",
  
  stampDutyAmount: 0,
};

export default function RentAgreementSociety() {
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
      const response = await serviceChargeAPI.getChargeByDocumentType('rent-agreement-society');
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
        documentType: 'rent-agreement-society'
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
    } else if (name === "oneMonthAdvanceRent") {
      const words = numberToWords(value);
      setData(prev => ({ 
        ...prev, 
        oneMonthAdvanceRent: value,
        oneMonthAdvanceRentWords: words
      }));
    } else if (name === "securityDeposit") {
      const words = numberToWords(value);
      setData(prev => ({ 
        ...prev, 
        securityDeposit: value,
        securityDepositWords: words
      }));
    } else if (name.includes("annexure_")) {
      const index = parseInt(name.split("_")[1]);
      const newValue = value;
      setData(prev => {
        const updatedItems = [...prev.annexureItems];
        updatedItems[index] = { ...updatedItems[index], value: newValue };
        return { ...prev, annexureItems: updatedItems };
      });
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
      filename: "Rent_Agreement_Society.pdf",
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
        documentType: 'rent-agreement-society',
        formData: data,
        paymentAmount: finalAmount,
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discountAmount: couponDiscount
        } : null
      });

      const requestId = response.data.requestId;
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'rent-agreement-society', requestId);
      
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
        filename: "Rent_Agreement_Society.pdf",
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
            Rent Agreement (Society)
          </h2>

          {/* Agreement Date */}
          <div className="bg-purple-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-purple-800 mb-2">Agreement Details</h3>
            <DateInput label="Agreement Date" name="agreementDate" value={data.agreementDate} onChange={update} />
          </div>

          {/* First Party (Landlord/Owner) */}
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">First Party (Landlord/Owner)</h3>
            <Input label="Landlord/Owner Name" name="landlordName" value={data.landlordName} onChange={update} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Age" name="landlordAge" value={data.landlordAge} onChange={update} />
              <Input label="Occupation" name="landlordOccupation" value={data.landlordOccupation} onChange={update} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Relation Type (W/O, S/O)" name="landlordRelation" value={data.landlordRelation} onChange={update} />
              <Input label="Relation Name" name="landlordRelationName" value={data.landlordRelationName} onChange={update} />
            </div>
            <Input label="Residential Address" name="landlordAddress" value={data.landlordAddress} onChange={update} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Aadhaar Number" name="landlordAadhaar" value={data.landlordAadhaar} onChange={update} />
              <Input label="Mobile Number" name="landlordMobile" value={data.landlordMobile} onChange={update} />
            </div>
          </div>

          {/* Second Party (Tenant) */}
          <div className="bg-green-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-green-800 mb-2">Second Party (Tenant)</h3>
            <Input label="Tenant Name" name="tenantName" value={data.tenantName} onChange={update} />
            <Input label="Father's Name" name="tenantFatherName" value={data.tenantFatherName} onChange={update} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Age" name="tenantAge" value={data.tenantAge} onChange={update} />
              <Input label="Occupation" name="tenantOccupation" value={data.tenantOccupation} onChange={update} />
            </div>
            <Input label="Residential Address" name="tenantAddress" value={data.tenantAddress} onChange={update} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Aadhaar Number" name="tenantAadhaar" value={data.tenantAadhaar} onChange={update} />
              <Input label="Mobile Number" name="tenantMobile" value={data.tenantMobile} onChange={update} />
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-yellow-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Property Details</h3>
            <Input label="Property Address" name="propertyAddress" value={data.propertyAddress} onChange={update} />
          </div>

          {/* Tenancy Period */}
          <div className="bg-orange-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-orange-800 mb-2">Tenancy Period</h3>
            <div className="grid grid-cols-2 gap-3">
              <DateInput label="Commencement Date (From)" name="tenancyStartDate" value={data.tenancyStartDate} onChange={update} />
              <DateInput label="End Date (To)" name="tenancyEndDate" value={data.tenancyEndDate} onChange={update} />
            </div>
          </div>

          {/* Rent Details */}
          <div className="bg-pink-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-pink-800 mb-2">Rent & Payment Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Monthly Rent (₹)" name="monthlyRent" type="number" value={data.monthlyRent} onChange={update} />
              <Input label="Monthly Rent in Words" name="monthlyRentWords" value={data.monthlyRentWords} onChange={update} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="One Month Advance Rent (₹)" name="oneMonthAdvanceRent" type="number" value={data.oneMonthAdvanceRent} onChange={update} />
              <Input label="Advance Rent in Words" name="oneMonthAdvanceRentWords" value={data.oneMonthAdvanceRentWords} onChange={update} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Security Deposit (₹)" name="securityDeposit" type="number" value={data.securityDeposit} onChange={update} />
              <Input label="Security Deposit in Words" name="securityDepositWords" value={data.securityDepositWords} onChange={update} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Power Backup Charges (₹)" name="powerBackupCharges" type="number" value={data.powerBackupCharges} onChange={update} />
              <Input label="Water Charges (₹)" name="waterCharges" type="number" value={data.waterCharges} onChange={update} />
            </div>
          </div>

          {/* Annexure - Fixtures & Fittings */}
          <div className="bg-teal-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-teal-800 mb-2">Annexure: Fixtures & Fittings</h3>
            <p className="text-xs text-gray-500 mb-3">Detail of fixtures & fittings provided in the flat</p>
            <div className="grid grid-cols-2 gap-3">
              {data.annexureItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <label className="text-sm text-gray-700 w-40">{item.name}:</label>
                  <select
                    name={`annexure_${idx}`}
                    value={item.value}
                    onChange={update}
                    className="flex-1 border border-purple-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              ))}
            </div>
            <Input label="Other Details" name="otherDetails" value={data.otherDetails} onChange={update} placeholder="Specify any other items..." />
          </div>

          {/* Witnesses */}
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Witnesses</h3>
            <Input label="Witness 1 Name" name="witness1Name" value={data.witness1Name} onChange={update} />
            <Input label="Witness 2 Name" name="witness2Name" value={data.witness2Name} onChange={update} />
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
              fontSize: "11pt",
              lineHeight: "1.4",
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
              This Rent Agreement is made on this <b>{formatDateForDisplay(data.agreementDate)}</b>. BETWEEN
            </p>

            <p style={{ textAlign: "justify", marginBottom: "12px" }}>
              <b>FIRST PARTY (LANDLORD)</b> <b>{data.landlordName || "_____________"}</b> Age: <b>{data.landlordAge || "__"}</b> Years, Occupation: <b>{data.landlordOccupation || "________"}</b>, {data.landlordRelation || "W/O"} <b>{data.landlordRelationName || "_____________"}</b>, R/o <b>{data.landlordAddress || "_____________"}</b> (Aadhaar Number <b>{data.landlordAadhaar || "_____________"}</b>) Mobile No.: <b>{data.landlordMobile || "_____________"}</b> (Hereinafter referred to as the First Party / Owner)
            </p>

            <p style={{ textAlign: "justify", marginBottom: "12px" }}>
              AND
            </p>

            <p style={{ textAlign: "justify", marginBottom: "12px" }}>
              <b>Mr./Mrs. {data.tenantName || "_____________"}</b> S/o <b>{data.tenantFatherName || "_____________"}</b>, Age: <b>{data.tenantAge || "__"}</b> Years, Occupation: <b>{data.tenantOccupation || "________"}</b>, R/o <b>{data.tenantAddress || "_____________"}</b> (Aadhaar Number <b>{data.tenantAadhaar || "_____________"}</b>). Contact No.: <b>{data.tenantMobile || "_____________"}</b> (Hereinafter referred to as the Second Party / Tenant)
            </p>

            <p style={{ textAlign: "justify", marginBottom: "12px" }}>
              And whereas the First Party has agreed to let out <b>{data.propertyAddress || "_____________"}</b> And the Second Party has agreed to take on rent the said premises mentioned as above the following terms and condition:
            </p>

            <p style={{ textAlign: "justify", fontWeight: "bold", marginBottom: "12px" }}>
              TERMS & CONDITIONS
            </p>

            <div style={{ marginLeft: "0px" }}>
              <p style={{ margin: "6px 0" }}>
                1. That the monthly rent agreed between both the parties is Rs. <b>{data.monthlyRent || "_________"}/-</b> (Rupees <b>{data.monthlyRentWords || "_____________"}</b> only) including maintenance
              </p>

              <p style={{ margin: "6px 0" }}>
                2. If tenant vacates the said premises before 06 months of tenancy period in that case security amount will not be refunded
              </p>

              <p style={{ margin: "6px 0" }}>
                3. That the tenancy has commenced from <b>{formatDateForDisplay(data.tenancyStartDate)}</b> to <b>{formatDateForDisplay(data.tenancyEndDate)}</b> for a period of 11 months and there after the agreement will be renewed for further period of 11 months.
              </p>

              <p style={{ margin: "6px 0" }}>
                4. The monthly Rent of Rs. <b>{data.monthlyRent || "_________"}/-</b> (Rupees <b>{data.monthlyRentWords || "_____________"}</b> only) which shall be paid by the Second Party to the First Party by the day of every English calendar month.
              </p>

              <p style={{ margin: "6px 0" }}>
                5. If both the parties have agreed to continue further, then after 11 months of tenancy period it's mandatory that the rent will be increased by 10%.
              </p>

              <p style={{ margin: "6px 0" }}>
                6. That the Second party shall not make any additions or alteration in the said premises without permission of the First party. That the Second party shall use the said premises only for residential purpose not for any other purpose. That the First party can visit the said premises at reasonable hours
              </p>

              <p style={{ margin: "6px 0" }}>
                7. That electric charge, Gas charges (IGL), club charges, shall be paid by the Second party. power backup (Rs.<b>{data.powerBackupCharges || "250"}</b>/-), water charges will be borne by the Second party directly to the concerned authorities. That if in future maintenance charges increases or applicable then second party/tenant will pay.
              </p>

              <p style={{ margin: "6px 0" }}>
                8. That the Second party will be giving Rs. <b>{data.oneMonthAdvanceRent || "_________"}/-</b> (Rupees <b>{data.oneMonthAdvanceRentWords || "_____________"}</b> only) as one-month advance rent and Rs. <b>{data.securityDeposit || "_________"}/-</b> (Rupees <b>{data.securityDepositWords || "_____________"}</b> only) as interest free security deposit.
              </p>

              <p style={{ margin: "6px 0" }}>
                9. If this agreement is not renewed after expiry of the tenancy period, the Second party will hand over the said premises to the First party in smooth manner.
              </p>

              <p style={{ margin: "6px 0" }}>
                10. The security amount is not adjustable. The First party will refund the security amount to the Second party when the Second party will vacate the premises. All the keys which were handed over to the Second party at the time of possession should be handed over back to the First party otherwise the First party will get that lock replaced or will get the amount deducted from the security money in getting that lock replaced.
              </p>

              <p style={{ margin: "6px 0" }}>
                11. That in case if the First party wants to evict the said premises prior to the completion of tenancy period, then the First party will give one month prior notice to the Second party and if the Second party wants to vacate the said Premises prior to the completion of the tenancy period, then the Second party will also give one months notice in written or one month rent to the First party.
              </p>

              <p style={{ margin: "6px 0" }}>
                12. All furniture & fixtures as per annexure/if any should be taken due care of. Regular Maintenance & servicing of furniture & fixture must be done by the Second party. Any damage/breakage to the property/furniture & fixtures will have to be borne by Second party or that will be deducted from the security deposit.
              </p>

              <p style={{ margin: "6px 0" }}>
                13. That the lease has been granted for exclusive residential use and under no circumstances Second party cannot sublet the premises for PG or to any other party.
              </p>

              <p style={{ margin: "6px 0" }}>
                14. That the First party shall not be responsible for any incident in the premises during the tenancy period.
              </p>

              <p style={{ margin: "6px 0" }}>
                15. That on the day of handing over of the said premises to the second party by the owner all the things should be given back in good condition as given to the second party.
              </p>

              <p style={{ margin: "6px 0" }}>
                16. In case the rent is not paid timely for consecutive two months and if the rent not paid for the running month by the Second party then, he/she shall be liable to vacate the premises immediately. In this case First party shall not be liable to any refund of security deposit.
              </p>

              <p style={{ margin: "6px 0" }}>
                17. That the second party shall not use the said property for any illegal purpose, if the second party shall use the said property for illegal purpose he will liable himself for the same, the first party and his property shall not be responsible for the same.
              </p>

              <p style={{ margin: "6px 0" }}>
                18. In no way the second party or his heir will claim for ownership of the said flat.
              </p>
            </div>

            <p style={{ marginTop: "15px" }}>
              IN WITNESSES WHEREOF both the parties have signed this rent agreement on the day, month and year first above written in the presence of the following witnesses:
            </p>

            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "45%" }}>
                  <p><b>WITNESSES</b></p>
                  <p style={{ marginTop: "15px" }}>1. Name: <b>{data.witness1Name || "____________________"}</b></p>
                  <p>Signature: ____________________</p>
                </div>
                <div style={{ width: "45%", textAlign: "right" }}>
                  <p><b>OWNER/FIRST PARTY</b></p>
                  <p style={{ marginTop: "15px" }}>Signature: ____________________</p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <div style={{ width: "45%" }}>
                  <p>2. Name: <b>{data.witness2Name || "____________________"}</b></p>
                  <p>Signature: ____________________</p>
                </div>
                <div style={{ width: "45%", textAlign: "right" }}>
                  <p><b>TENANT/SECOND PARTY</b></p>
                  <p style={{ marginTop: "15px" }}>Signature: ____________________</p>
                </div>
              </div>
            </div>

            {/* ANNEXURE */}
            <div style={{ marginTop: "40px", pageBreakBefore: "always" }}>
              <p style={{ fontWeight: "bold", fontSize: "14pt", textDecoration: "underline", textAlign: "center" }}>ANNEXURE - I</p>
              <p style={{ marginTop: "10px" }}>Detail of fixtures & fittings provided in the flat no. <b>{data.propertyAddress?.split(',')[0] || "_____________"}</b></p>
              
              <div style={{ marginTop: "15px" }}>
                {data.annexureItems.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", margin: "4px 0", padding: "2px 0", borderBottom: "1px solid #eee" }}>
                    <span>{item.name}</span>
                    <span><b>{item.value || "_____"}</b></span>
                  </div>
                ))}
                {data.otherDetails && (
                  <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0", padding: "2px 0" }}>
                    <span>Other Details:</span>
                    <span><b>{data.otherDetails}</b></span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                <div>
                  <p><b>SIGNATURES</b></p>
                  <p style={{ marginTop: "20px" }}>OWNER / FIRST PARTY</p>
                  <p>DATE: <b>{formatDateForDisplay(data.agreementDate)}</b></p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ marginTop: "20px" }}>TENANT / SECOND PARTY</p>
                  <p>DATE: <b>{formatDateForDisplay(data.agreementDate)}</b></p>
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