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

const initialData = {
  // Seller Details
  sellerName: "",
  sellerAadhaar: "",
  sellerRelation: "W/O",
  sellerRelationName: "",
  sellerAddress: "",
  
  // Purchaser Details
  purchaserName: "",
  purchaserRelation: "W/O",
  purchaserRelationName: "",
  purchaserAddress: "",
  
  // Property Details
  propertyAddress: "",
  
  // Agreement Details
  agreementDate: "",
  totalConsideration: "",
  totalConsiderationWords: "",
  firstPayment: "",
  firstPaymentWords: "",
  balanceAmount: "",
  balanceAmountWords: "",
  balancePaymentDays: "1",
  balancePaymentEndDate: "",
  
  // Payment Transactions
  paymentTransactions: [
    { from: "Rekha", to: "Rupam", amount: "", date: "" },
    { from: "Vikash Kumar", to: "Rupam", amount: "", date: "" }
  ],
  
  // Witness
  witnessName: "",
  witnessAddress: "",
  
  stampDutyAmount: 0,
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

export default function AgreementToSaleAfterLoan() {
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

  // Calculate balance amount and end date
  useEffect(() => {
    const total = parseFloat(data.totalConsideration) || 0;
    const firstPay = parseFloat(data.firstPayment) || 0;
    const balance = total - firstPay;
    setData(prev => ({ 
      ...prev, 
      balanceAmount: balance.toString(),
      balanceAmountWords: numberToWords(balance)
    }));
  }, [data.totalConsideration, data.firstPayment]);

  useEffect(() => {
    if (data.agreementDate && data.balancePaymentDays) {
      const startDate = new Date(data.agreementDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + parseInt(data.balancePaymentDays) * 30);
      const formattedEndDate = endDate.toISOString().split('T')[0];
      setData(prev => ({ ...prev, balancePaymentEndDate: formattedEndDate }));
    }
  }, [data.agreementDate, data.balancePaymentDays]);

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
      const response = await serviceChargeAPI.getChargeByDocumentType('agreement-to-sale');
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
        documentType: 'agreement-to-sale'
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
    } else if (name === "totalConsideration") {
      setData(prev => ({ 
        ...prev, 
        totalConsideration: value,
        totalConsiderationWords: numberToWords(value)
      }));
    } else if (name === "firstPayment") {
      setData(prev => ({ 
        ...prev, 
        firstPayment: value,
        firstPaymentWords: numberToWords(value)
      }));
    } else if (name === "paymentTransactions") {
      setData(prev => ({ ...prev, paymentTransactions: value }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const updatePaymentTransaction = (index, field, value) => {
    const updatedTransactions = [...data.paymentTransactions];
    updatedTransactions[index][field] = value;
    setData(prev => ({ ...prev, paymentTransactions: updatedTransactions }));
  };

  const addPaymentTransaction = () => {
    setData(prev => ({
      ...prev,
      paymentTransactions: [...prev.paymentTransactions, { from: "", to: "", amount: "", date: "" }]
    }));
  };

  const removePaymentTransaction = (index) => {
    const updatedTransactions = [...data.paymentTransactions];
    updatedTransactions.splice(index, 1);
    setData(prev => ({ ...prev, paymentTransactions: updatedTransactions }));
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
      filename: "Agreement_To_Sale.pdf",
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
        documentType: 'agreement-to-sale',
        formData: data,
        paymentAmount: finalAmount,
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discountAmount: couponDiscount
        } : null
      });

      const requestId = response.data.requestId;
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'agreement-to-sale', requestId);
      
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
        filename: "Agreement_To_Sale.pdf",
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
            Agreement to Sale
          </h2>

          {/* Seller Details */}
          <div className="bg-purple-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-purple-800 mb-2">Seller Details (First Party)</h3>
            <Input label="Seller Name" name="sellerName" value={data.sellerName} onChange={update} />
            <Input label="Aadhaar Card No." name="sellerAadhaar" value={data.sellerAadhaar} onChange={update} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Relation Type (W/O, S/O)" name="sellerRelation" value={data.sellerRelation} onChange={update} />
              <Input label="Relation Name" name="sellerRelationName" value={data.sellerRelationName} onChange={update} />
            </div>
            <Input label="Residential Address" name="sellerAddress" value={data.sellerAddress} onChange={update} />
          </div>

          {/* Purchaser Details */}
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Purchaser Details (Second Party)</h3>
            <Input label="Purchaser Name" name="purchaserName" value={data.purchaserName} onChange={update} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Relation Type (W/O, S/O)" name="purchaserRelation" value={data.purchaserRelation} onChange={update} />
              <Input label="Relation Name" name="purchaserRelationName" value={data.purchaserRelationName} onChange={update} />
            </div>
            <Input label="Residential Address" name="purchaserAddress" value={data.purchaserAddress} onChange={update} />
          </div>

          {/* Property Details */}
          <div className="bg-green-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-green-800 mb-2">Property Details</h3>
            <Input label="Property Address" name="propertyAddress" value={data.propertyAddress} onChange={update} />
          </div>

          {/* Agreement Details */}
          <div className="bg-yellow-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Agreement Details</h3>
            <DateInput label="Agreement Date" name="agreementDate" value={data.agreementDate} onChange={update} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Total Consideration (₹)" name="totalConsideration" type="number" value={data.totalConsideration} onChange={update} />
              <Input label="Total Consideration in Words" name="totalConsiderationWords" value={data.totalConsiderationWords} onChange={update} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Payment (₹)" name="firstPayment" type="number" value={data.firstPayment} onChange={update} />
              <Input label="First Payment in Words" name="firstPaymentWords" value={data.firstPaymentWords} onChange={update} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Balance Amount (₹)" name="balanceAmount" value={data.balanceAmount} readOnly className="bg-gray-100" />
              <Input label="Balance Amount in Words" name="balanceAmountWords" value={data.balanceAmountWords} readOnly className="bg-gray-100" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Balance Payment Time (Months)" name="balancePaymentDays" type="number" value={data.balancePaymentDays} onChange={update} />
              {data.balancePaymentEndDate && (
                <div className="p-2 bg-green-50 rounded">
                  <label className="block text-xs text-green-700">Payment End Date</label>
                  <p className="text-green-800 font-medium">{formatDateForDisplay(data.balancePaymentEndDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Transactions */}
          <div className="bg-orange-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-orange-800 mb-2">Payment Transactions</h3>
            {data.paymentTransactions.map((transaction, idx) => (
              <div key={idx} className="border border-orange-200 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-orange-700">Transaction {idx + 1}</span>
                  {idx >= 2 && (
                    <button
                      type="button"
                      onClick={() => removePaymentTransaction(idx)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="From" value={transaction.from} onChange={(e) => updatePaymentTransaction(idx, 'from', e.target.value)} />
                  <Input label="To" value={transaction.to} onChange={(e) => updatePaymentTransaction(idx, 'to', e.target.value)} />
                  <Input label="Amount (₹)" type="number" value={transaction.amount} onChange={(e) => updatePaymentTransaction(idx, 'amount', e.target.value)} />
                  <DateInput label="Date" value={transaction.date} onChange={(e) => updatePaymentTransaction(idx, 'date', e.target.value)} />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addPaymentTransaction}
              className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
            >
              + Add More Payment
            </button>
          </div>

          {/* Witness */}
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Witness</h3>
            <Input label="Witness Name" name="witnessName" value={data.witnessName} onChange={update} />
            <Input label="Witness Address" name="witnessAddress" value={data.witnessAddress} onChange={update} />
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
              AGREEMENT TO SALE
            </div>

            {/* Seller Section */}
            <p style={{ textAlign: "justify", marginBottom: "12px" }}>
              <b>(Seller)</b> This Sale Agreement is executed at <b>New Delhi</b> on this <b>{formatDateForDisplay(data.agreementDate)}</b>, between <b>{data.sellerName || "MRS. RUPAM DEVI"}</b> (AADHAR CARD NO. <b>{data.sellerAadhaar || "6306 5660 0255"}</b>) {data.sellerRelation || "W/O"} <b>{data.sellerRelationName || "MR. MUKESH SINGH"}</b> R/O <b>{data.sellerAddress || "H. NO.RC-193, ADARSH NAGAR, F BLOCK, KHORA, GHAZIABAD, UTTAR PRADESH-201309"}</b>, (hereinafter referred to as to <b>SELLER / FIRST PARTY</b>, which term and administrator) of the one part.
            </p>

            <p style={{ textAlign: "justify", marginBottom: "12px" }}>
              <b>AND (Purchaser)</b> <b>{data.purchaserName || "MRS REKHA DEVI"}</b> {data.purchaserRelation || "W/O"} <b>{data.purchaserRelationName || "MR. AMIT KUMAR"}</b> R/O <b>{data.purchaserAddress || "KHASRA NO.232, KRISHNA NAGAR BAGU, VIJAY NAGAR, NEAR ROSE VALLEY PUBLIC SCHOOL, VIJAY NAGAR, GHAZIABAD, UTTAR PRADESH-201009"}</b> (hereinafter referred to as the <b>PURCHASER / SECOND PARTY</b>), which terms assigns, executors, successors, legal representatives and administrators) of the other part.
            </p>

            <p style={{ textAlign: "justify", marginBottom: "12px" }}>
              Whereas the above said Seller is the sole owner and in possession of Purchase PROPERTY/HOUSE <b>{data.propertyAddress || "NO.232, KRISHNA NAGAR, BAGU, VIJAY NAGAR, GHAZIABAD UTTAR PRADESH-201009"}</b>.
            </p>

            <p style={{ textAlign: "justify", marginBottom: "12px" }}>
              AND WHEREAS the said seller is interested in the sake of his/ her above said property to the purchaser is also interested to Purchase the same and both the parties have agreed with each other on the following term and condition:
            </p>

            {/* Terms */}
            <div style={{ marginLeft: "0px" }}>
              <p style={{ margin: "8px 0" }}>
                1. That the first party is in need of amount and agreed to sell the property to the second party for a total consideration amount of <b>Rs.{data.totalConsideration || "22,40,000"}/-</b> (<b>{data.totalConsiderationWords || "Rupees Twenty-Two Lakhs Forty Thousand Only"}</b>).
              </p>

              <p style={{ margin: "8px 0" }}>
                2. And the first party have received first amount payment of <b>Rs.{data.firstPayment || "4,50,000"}/-</b> (<b>{data.firstPaymentWords || "Rupees Four Lac Fifty Thousand Only"}</b>) and the balance amount <b>Rs.{data.balanceAmount || "17,90,000"}/-</b> (<b>{data.balanceAmountWords || "Rupees Seventeen Lakhs Ninety Thousand Only"}</b>) will be paid by the second party to the first party within <b>{data.balancePaymentDays || "1"}</b> months from today i.e. <b>{formatDateForDisplay(data.agreementDate)}</b>.
              </p>

              <p style={{ margin: "8px 0" }}>
                3. Payment Details are Below:
              </p>
              
              {/* Payment Transactions Table */}
              <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
                {data.paymentTransactions.map((transaction, idx) => (
                  transaction.from && transaction.to && (
                    <p key={idx} style={{ margin: "4px 0" }}>
                      <b>Banking OCR {transaction.from} to {transaction.to}</b> - Total ₹{transaction.amount || "0"}
                      {transaction.date && ` dated ${formatDateForDisplay(transaction.date)}`}
                    </p>
                  )
                ))}
                <p style={{ margin: "4px 0", fontWeight: "bold" }}>Total: ₹{data.firstPayment || "4,50,000"}</p>
              </div>

              <p style={{ margin: "8px 0" }}>
                4. That said seller will clear all the outstanding dues against this property (i.e. electricity bills, water charges etc.)
              </p>

              <p style={{ margin: "8px 0" }}>
                5. That if the second party will fail to pay the balance amount the advance will be forfeited. And if the first party fail or refuse to execute the sale deed and other necessary document in favor of purchaser the stipulated time the seller will be responsible to pay the double advance paid by the purchasers/second party executed.
              </p>

              <p style={{ margin: "8px 0" }}>
                6. That the seller will be responsible to pay all dues up to date of execution of sale deed.
              </p>

              <p style={{ margin: "8px 0" }}>
                7. That if first Party will return the token money to second party, in case first party will pay double amount of token money to second party.
              </p>

              <p style={{ margin: "8px 0" }}>
                8. That the seller will responsible to hand over clear and vacant possession at the time of final payment.
              </p>

              <p style={{ margin: "8px 0" }}>
                9. That the seller assures the above said property is free from all sort of encumbrances, like mortgage gift, sale, lien, lease agreement, decree, injunction, suit etc.
              </p>

              <p style={{ margin: "8px 0" }}>
                10. That both the parties and their nominees will abide by term and condition of the above said agreement.
              </p>
            </div>

            <p style={{ marginTop: "15px" }}>
              In witnesses whereof the parties of this agreement gave set their respective hands on the date month and year's first above given.
            </p>

            <div style={{ marginTop: "20px" }}>
              <p><b>Witnesses:</b></p>
              <p>Name: <b>{data.witnessName || "____________________"}</b></p>
              <p>Address: <b>{data.witnessAddress || "____________________"}</b></p>
            </div>

            <div style={{ marginTop: "40px", display: "flex", justifyContent: "space-between" }}>
              <div>
                <p><b>FIRST PARTY (Seller)</b></p>
                <p style={{ marginTop: "30px" }}>Signature: ____________________</p>
              </div>
              <div>
                <p><b>SECOND PARTY (Purchaser)</b></p>
                <p style={{ marginTop: "30px" }}>Signature: ____________________</p>
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