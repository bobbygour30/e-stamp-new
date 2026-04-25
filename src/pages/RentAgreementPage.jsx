import { useRef, useState, useContext, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI, serviceChargeAPI, couponAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";
import { uploadPDFToCloudinary } from "../utils/cloudinary";

const initialData = {
  ownerName: "",
  ownerRelation: "S/O",
  ownerRelationName: "",
  ownerAddress: "",
  ownerAadhaar: "",

  tenantName: "",
  tenantRelation: "S/O",
  tenantRelationName: "",
  tenantAddress: "",
  tenantAadhaar: "",

  propertyAddress: "",
  monthlyRent: "",
  maintenance: "",
  rentDay: "",
  securityAmount: "",

  paymentMethod: "Cash",
  duration: "",
  startDate: "",
  endDate: "",
  noticePeriod: "",
  increment: "",
  purpose: "",
};

export default function RentAgreementPage() {
  const [step, setStep] = useState(1);
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

  const previewRef = useRef(null);
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
      const response = await serviceChargeAPI.getChargeByDocumentType('rent-agreement');
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
        documentType: 'rent-agreement'
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
    const element = previewRef.current;
    if (!element) {
      throw new Error('PDF element not found');
    }
    
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: "Rent_Agreement.pdf",
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
        documentType: 'rent-agreement',
        formData: data,
        paymentAmount: finalAmount,
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discountAmount: couponDiscount
        } : null
      });

      const requestId = response.data.requestId;
      
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'rent-agreement', requestId);
      
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
    const element = previewRef.current;
    html2pdf()
      .from(element)
      .set({
        margin: [0.3, 0.3, 0.3, 0.3],
        filename: "Rent_Agreement.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] p-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT - FORM */}
        <div className="bg-[#fbf5e6] p-6 rounded shadow">
          <div className="mb-4">
            <div className="text-sm mb-1">Step {step} of 4</div>
            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="h-2 bg-orange-400 rounded"
                style={{ width: `${step * 25}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <>
              <Input label="Owner Name" name="ownerName" value={data.ownerName} onChange={update} />
              <Input label="Relation" name="ownerRelation" value={data.ownerRelation} onChange={update} />
              <Input label="Related Person Name" name="ownerRelationName" value={data.ownerRelationName} onChange={update} />
              <Input label="Permanent Address" name="ownerAddress" value={data.ownerAddress} onChange={update} />
              <Input label="Aadhaar Number" name="ownerAadhaar" value={data.ownerAadhaar} onChange={update} />
            </>
          )}

          {step === 2 && (
            <>
              <Input label="Tenant Name" name="tenantName" value={data.tenantName} onChange={update} />
              <Input label="Relation" name="tenantRelation" value={data.tenantRelation} onChange={update} />
              <Input label="Related Person Name" name="tenantRelationName" value={data.tenantRelationName} onChange={update} />
              <Input label="Permanent Address" name="tenantAddress" value={data.tenantAddress} onChange={update} />
              <Input label="Aadhaar Number" name="tenantAadhaar" value={data.tenantAadhaar} onChange={update} />
            </>
          )}

          {step === 3 && (
            <>
              <Input label="Property Address" name="propertyAddress" value={data.propertyAddress} onChange={update} />
              <Input label="Monthly Rent" name="monthlyRent" value={data.monthlyRent} onChange={update} />
              <Input label="Maintenance Charges" name="maintenance" value={data.maintenance} onChange={update} />
              <Input label="Rent Payable Day" name="rentDay" value={data.rentDay} onChange={update} />
              <Input label="Security Amount" name="securityAmount" value={data.securityAmount} onChange={update} />
            </>
          )}

          {step === 4 && (
            <>
              <Input label="Security Payment Method" name="paymentMethod" value={data.paymentMethod} onChange={update} />
              <Input label="Duration (Months)" name="duration" value={data.duration} onChange={update} />
              <DateInput label="Start Date" name="startDate" value={data.startDate} onChange={update} />
              <DateInput label="End Date" name="endDate" value={data.endDate} onChange={update} />
              <Input label="Notice Period (Months)" name="noticePeriod" value={data.noticePeriod} onChange={update} />
              <Input label="Rent Increment (%)" name="increment" value={data.increment} onChange={update} />
              <Input label="Purpose of Rent" name="purpose" value={data.purpose} onChange={update} />
            </>
          )}

          {/* Price Breakdown Section */}
          {step === 4 && (
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
          )}

          {/* Coupon Section */}
          {step === 4 && (
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
          )}

          <div className="flex justify-between mt-8 gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-4 py-2.5 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Previous
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 px-4 py-2.5 bg-orange-400 text-white rounded hover:bg-orange-500 transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || uploading}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
              >
                {uploading ? 'Generating PDF...' : loading ? 'Processing...' : `Proceed to Payment (₹${finalAmount})`}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT - PREVIEW - FIXED LAYOUT */}
        <div className="bg-gray-100 p-4 rounded shadow overflow-auto" style={{ height: "90vh" }}>
          <div
            ref={previewRef}
            style={{
              width: "100%",
              maxWidth: "100%",
              backgroundColor: "#fffdf5",
              color: "#111827",
              fontFamily: "monospace",
              padding: "12mm 10mm",
              boxSizing: "border-box",
              margin: "0 auto",
              fontSize: "9.8pt",
              lineHeight: "1.3",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "15pt",
                margin: "0 0 10px 0",
              }}
            >
              RENT AGREEMENT
            </h1>

            <p style={{ margin: "0 0 8px 0", fontSize: "9.5pt" }}>
              THIS AGREEMENT IS MADE AND EXECUTED AT{" "}
              <b>{data.propertyAddress || "__________"}</b> ON THIS{" "}
              <b>{formatDateForDisplay(data.startDate)}</b>, BY AND BETWEEN:
            </p>

            <p style={{ margin: "6px 0" }}>
              <b>{data.ownerName || "__________"}</b>{" "}
              ({data.ownerRelation || "___"} {data.ownerRelationName || "__________"}){" "}
              (Aadhaar No. <b>{data.ownerAadhaar || "__________"}</b>)
              <br />
              (Hereinafter called the First Party/Owner)
            </p>

            <p style={{ margin: "8px 0", fontWeight: "bold", textAlign: "center" }}>
              AND
            </p>

            <p style={{ margin: "6px 0" }}>
              <b>{data.tenantName || "__________"}</b>{" "}
              ({data.tenantRelation || "___"} {data.tenantRelationName || "__________"}){" "}
              (Aadhaar No. <b>{data.tenantAadhaar || "__________"}</b>)
              <br />
              (Hereinafter called the Second Party/Tenant)
            </p>

            <p style={{ margin: "8px 0 10px 0", fontSize: "9.5pt" }}>
              The expression of both the parties shall mean and include their respective legal heirs, executors, administrators, representatives and legal assigns.
            </p>

            <p style={{ margin: "0 0 8px 0" }}>
              WHEREAS the first party is the true and lawful owner of{" "}
              <b>{data.propertyAddress || "__________"}</b> (hereinafter called the property) and WHEREAS on the request of the second party the first party wants to let out the said property on the following terms and conditions:
            </p>

            <ol style={{ margin: "8px 0 0 0", paddingLeft: "16px", listStyleType: "decimal" }}>
              <li style={{ marginBottom: "4px" }}>
                Monthly rent is fixed at ₹<b>{data.monthlyRent || "______"}</b>/- payable in advance on or before <b>{data.rentDay || "___"}</b> of each English calendar month.
              </li>
              <li style={{ marginBottom: "4px" }}>
                The tenancy is for <b>{data.duration || "___"}</b> months w.e.f. <b>{formatDateForDisplay(data.startDate)}</b>. Tenant to vacate after expiry.
              </li>
              <li style={{ marginBottom: "4px" }}>
                Second Party shall pay Water & Electricity bills as per consumption (extra).
              </li>
              <li style={{ marginBottom: "4px" }}>House tax shall be paid by First Party.</li>
              <li style={{ marginBottom: "4px" }}>
                Maintenance charges ₹<b>{data.maintenance || "______"}</b> payable by Second Party.
              </li>
              <li style={{ marginBottom: "4px" }}>
                Security deposit of ₹<b>{data.securityAmount || "______"}</b>/- received via <b>{data.paymentMethod || "________"}</b>. Refundable without interest on vacating.
              </li>
              <li style={{ marginBottom: "4px" }}>
                If First Party wants early termination, <b>{data.noticePeriod || "___"}</b> months' notice shall be given.
              </li>
              <li style={{ marginBottom: "4px" }}>
                Tenancy may be extended by mutual consent with <b>{data.increment || "___"}</b>% rent increase.
              </li>
              <li style={{ marginBottom: "4px" }}>
                Second Party shall not sublet the premises or any part thereof.
              </li>
              <li style={{ marginBottom: "4px" }}>
                Non-payment of rent for one month shall lead to automatic cancellation.
              </li>
              <li style={{ marginBottom: "4px" }}>Second Party to abide by all statutory rules.</li>
              <li style={{ marginBottom: "4px" }}>
                Premises to be used only for <b>{data.purpose || "________"}</b> purpose.
              </li>
              <li style={{ marginBottom: "4px" }}>No additions/alterations without permission.</li>
              <li style={{ marginBottom: "4px" }}>Minor repairs by tenant, major by owner.</li>
              <li style={{ marginBottom: "4px" }}>No illegal/unlawful activities.</li>
              <li style={{ marginBottom: "4px" }}>No inflammable/explosive materials.</li>
              <li style={{ marginBottom: "4px" }}>First Party may inspect premises with prior notice.</li>
              <li style={{ marginBottom: "4px" }}>No loan/credit card applications using premises address.</li>
              <li style={{ marginBottom: "4px" }}>
                Breach allows First Party to evict and take possession.
              </li>
              <li style={{ marginBottom: "2px" }}>
                Disputes subject to __________ jurisdiction.
              </li>
            </ol>

            <div style={{ pageBreakAfter: "always", height: "20px" }} />

            <p style={{ margin: "8px 0 6px 0" }}>
              IN WITNESS WHEREOF the parties have signed this agreement on the day and year first above written.
            </p>

            <div style={{ marginTop: "12px" }}>
              <p style={{ margin: "3px 0" }}>WITNESSES:</p>
              <p style={{ margin: "3px 0" }}>1. ____________________ (FIRST PARTY)</p>
              <p style={{ margin: "3px 0" }}>2. ____________________ (SECOND PARTY)</p>
            </div>

            <div style={{ height: "100mm", marginTop: "20px" }} />
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

function Input({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="text-sm block mb-1 font-medium">{label}</label>
      <input
        {...props}
        className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}

/* DATE INPUT COMPONENT */
function DateInput({ label, name, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="text-sm block mb-1 font-medium">{label}</label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}