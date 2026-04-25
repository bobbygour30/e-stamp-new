import { useRef, useState, useContext, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI, serviceChargeAPI, couponAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";
import { uploadPDFToCloudinary } from "../utils/cloudinary";

const initialData = {
    name: "",
    relationType: "S/O",
    relationName: "",
    firstPartyOccupation: "",
    restrictedAt: "",
    firstReferredParty: "",
    secondPartyName: "",
    secondPartyFatherName: "",
    secondPartyAge: "",
    secondPartyOccupation: "",
    secondPartyAddress: "",
    propertyAddress: "",
    propertyArea: "",
    propertyType: "",
    subRegistrarOffice: "",
    licenseStartDate: "",
    monthlyRent: "",
    monthlyRentWords: "",
    paymentMode: "",
    paymentDueDay: "",
    witnessAddress: "",
    witnessName: "",
    verificationDate: "",
};

export default function RentalAgreements() {
    const [data, setData] = useState(initialData);
    const [showPayment, setShowPayment] = useState(false);
    const [requestId, setRequestId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [calculatedEndDate, setCalculatedEndDate] = useState("");
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

    // Calculate end date (11 months from start date)
    useEffect(() => {
        if (data.licenseStartDate) {
            const startDate = new Date(data.licenseStartDate);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 11);
            const formattedEndDate = endDate.toISOString().split('T')[0];
            setCalculatedEndDate(formattedEndDate);
        } else {
            setCalculatedEndDate("");
        }
    }, [data.licenseStartDate]);

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
            const response = await serviceChargeAPI.getChargeByDocumentType('rental-agreements');
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
                documentType: 'rental-agreements'
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
            filename: "Rental_Agreement.pdf",
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
            
            // Prepare data with calculated end date
            const submitData = {
                ...data,
                licenseDurationMonths: "11",
                licenseEndDate: calculatedEndDate
            };
            
            const response = await documentAPI.createRequest({
                documentType: 'rental-agreement',
                formData: submitData,
                paymentAmount: finalAmount,
                appliedCoupon: appliedCoupon ? {
                    code: appliedCoupon.code,
                    discountAmount: couponDiscount
                } : null
            });

            const requestId = response.data.requestId;
            
            const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'rental-agreement', requestId);
            
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
                filename: "Rental_Agreement.pdf",
                margin: [0.3, 0.3, 0.3, 0.3],
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    logging: false,
                },
                jsPDF: {
                    unit: "in",
                    format: "a4",
                    orientation: "portrait",
                },
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
                        Rental Agreement
                    </h2>

                    {/* First Party */}
                    <Input label="First Party Name" name="name" value={data.name} onChange={update} />

                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Relation Type (S/D/W/O)" name="relationType" value={data.relationType} onChange={update} />
                        <Input label="First Relation Name" name="relationName" value={data.relationName} onChange={update} />
                    </div>

                    <Input label="Occupation" name="firstPartyOccupation" value={data.firstPartyOccupation} onChange={update} />
                    <Input label="Restricted At (R/at)" name="restrictedAt" value={data.restrictedAt} onChange={update} />
                    <Input label="First Referred Party" name="firstReferredParty" value={data.firstReferredParty} onChange={update} />

                    {/* Second Party */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <Input label="Second Party Name" name="secondPartyName" value={data.secondPartyName} onChange={update} />
                        <Input label="Father's Name" name="secondPartyFatherName" value={data.secondPartyFatherName} onChange={update} />
                        <Input label="Age" name="secondPartyAge" value={data.secondPartyAge} onChange={update} />
                        <Input label="Occupation" name="secondPartyOccupation" value={data.secondPartyOccupation} onChange={update} />
                    </div>

                    <Input label="Residential Address" name="secondPartyAddress" value={data.secondPartyAddress} onChange={update} />

                    {/* Property Details */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <Input label="Flat Address" name="propertyAddress" value={data.propertyAddress} onChange={update} />
                        <Input label="Flat Area (sq.ft.)" name="propertyArea" value={data.propertyArea} onChange={update} />
                        <Input label="Flat Type (1BHK / 2BHK)" name="propertyType" value={data.propertyType} onChange={update} />
                        <Input label="Sub-Registrar Office" name="subRegistrarOffice" value={data.subRegistrarOffice} onChange={update} />
                    </div>

                    {/* License Details - Removed Type and Purpose, Added Auto-calculation */}
                    <div className="grid grid-cols-1 gap-3 mt-6">
                        <DateInput 
                            label="License Start Date" 
                            name="licenseStartDate" 
                            value={data.licenseStartDate} 
                            onChange={update} 
                        />
                        {calculatedEndDate && (
                            <div className="mb-3 p-3 bg-green-50 rounded-lg">
                                <label className="block text-sm font-medium text-green-700 mb-1">
                                    License End Date (Auto-calculated - 11 months)
                                </label>
                                <p className="text-green-800 font-medium">{formatDateForDisplay(calculatedEndDate)}</p>
                            </div>
                        )}
                    </div>

                    {/* Rent Details */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <Input label="Monthly Rent (₹)" name="monthlyRent" type="number" value={data.monthlyRent} onChange={update} />
                        <Input label="Monthly Rent in Words" name="monthlyRentWords" value={data.monthlyRentWords} onChange={update} />
                        <Input label="Payment Due Day" name="paymentDueDay" type="number" value={data.paymentDueDay} onChange={update} />
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-purple-700 mb-1">
                                Payment Mode
                            </label>
                            <select 
                                name="paymentMode" 
                                value={data.paymentMode} 
                                onChange={update} 
                                className="w-full border border-purple-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Select Payment Mode</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Cash">Cash</option>
                                <option value="Online">Online</option>
                            </select>
                        </div>
                    </div>

                    {/* Witness */}
                    <h3 className="mt-6 mb-3 text-lg font-medium text-purple-700">In the presence of</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Witness Name" name="witnessName" value={data.witnessName} onChange={update} />
                        <Input label="Witness Address" name="witnessAddress" value={data.witnessAddress} onChange={update} />
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

                    <div className="flex gap-3 mt-8">
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
                            marginBottom: "24px",
                            fontSize: "14pt",
                            fontWeight: "bold",
                            textDecoration: "underline",
                        }}>
                            RENTAL AGREEMENT
                        </div>

                        {/* First Party */}
                        <div style={{ marginBottom: "16px", textAlign: "justify" }}>
                            <b>{data.name || "______________"}</b>{" "}
                            <b>{data.relationType || "S/D/W/O"}</b>{" "}
                            <b>{data.relationName || "_____________"}</b>

                            <div style={{ marginTop: "8px" }}>
                                Occupation – <b>{data.firstPartyOccupation || "_____________"}</b>
                            </div>

                            <div style={{ marginTop: "8px" }}>
                                R/at <b>{data.restrictedAt || "____________"}</b> referred to as the{" "}
                                <b>{data.firstReferredParty || "____________"}</b>
                            </div>

                            <div style={{ marginTop: "8px" }}>
                                (Which expression shall unless repugnant to the context of meaning
                                thereof mean & include his/her/their legal heirs, executors,
                                administrators & assigns etc.)… <b>OF THE FIRST PART.</b>
                            </div>
                        </div>

                        {/* Second Party */}
                        <div style={{ marginTop: "20px", textAlign: "justify" }}>
                            <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "12px" }}>AND</div>

                            <div>
                                <b>{data.secondPartyName || "_____________"} S/o {data.secondPartyFatherName || "_____________"}</b>
                            </div>

                            <div style={{ marginTop: "6px" }}>
                                Age: <b>{data.secondPartyAge || "_____________"}</b> Years,
                                Occupation – <b>{data.secondPartyOccupation || "_____________"}</b>
                            </div>

                            <div style={{ marginTop: "6px" }}>
                                R/at : <b>{data.secondPartyAddress || "____________"}</b>
                            </div>
                        </div>

                        {/* Property & License Details */}
                        <div style={{ marginTop: "20px" }}>
                            <p style={{ textAlign: "center" }}>
                                <b>HEREINAFTER referred to as the "{data.secondPartyName || "____________"}"</b>
                            </p>

                            <p style={{ marginTop: "12px" }}>
                                WHEREAS the Licensor is the lawful Owner of flat situated at{" "}
                                <b>{data.propertyAddress || "____________"}</b> admeasuring about area{" "}
                                <b>{data.propertyArea || "____________"}</b> sq.ft.{" "}
                                <b>{data.propertyType || "____________"}</b> (hereinafter referred to as the Said Flat),
                                within jurisdiction of Sub-Registrar <b>{data.subRegistrarOffice || "____________"}</b>.
                            </p>

                            <p style={{ marginTop: "12px" }}>
                                The Licensee has approached the Licensor with request to permit him/her to use & occupy the said premises on Leave and License basis for a period of <b>11 months</b>.
                            </p>

                            <h2 style={{ fontWeight: "bold", margin: "20px 0", textAlign: "center", fontSize: "13pt" }}>
                                NOW THEREFORE THESE PRESENT WITNESSTH THIS AGREEMENT AND IT IS HEREBY AGREED BY AND BETWEEN THE PARTIES HERETO AS FOLLOWS:
                            </h2>
                        </div>

                        {/* Terms & Conditions */}
                        <div style={{ marginLeft: "0px" }}>
                            <div style={{ margin: "10px 0" }}>
                                1. The Licensor agrees to demise unto the Licensee and the Licensee hereby accepts the said premises... for a period of <b>11 Months</b> with effect from <b>{formatDateForDisplay(data.licenseStartDate)}</b> to <b>{formatDateForDisplay(calculatedEndDate)}</b> on Leave and License basis.
                            </div>

                            <div style={{ margin: "10px 0" }}>
                                2. During the tenure of the license period, the Licensee shall pay to the Licensor an amount of Rs. <b>{data.monthlyRent || "____"}</b>/- (Rupees <b>{data.monthlyRentWords || "________"}</b> Only) per month by way of <b>{data.paymentMode || "________"}</b> on or before <b>{data.paymentDueDay || "__"}</b> of every month.
                            </div>

                            <div style={{ margin: "10px 0" }}>
                                3. Electricity bills shall be paid and cleared by the Licensee.
                            </div>

                            <div style={{ margin: "10px 0" }}>
                                4. It is agreed between the parties that at all times the judicial possession of the said premises shall be of Licensor and the Licensee has been merely granted the License to make use of the said premises for a limited period only.
                            </div>

                            <div style={{ margin: "10px 0" }}>
                                5. It is hereby agreed between the parties here to that if the Licensee commits any default in payments of the monthly compensation as agreed aforesaid or non-payment of Electric bills, or commits breach of any of the terms, covenant contained in this Agreement the Licensor shall be entitled to revoke this License.
                            </div>

                            <div style={{ marginTop: "40px", textAlign: "right" }}>
                                <b>LICENSOR</b><br />
                                <b>{data.name || "______________"}</b>
                            </div>

                            <div style={{ marginTop: "30px", textAlign: "right" }}>
                                <b>LICENSEE</b><br />
                                <b>{data.secondPartyName || "______________"}</b>
                            </div>

                            <div style={{ marginTop: "40px" }}>
                                <p>In the presence of</p>
                                <p>Name : <b>{data.witnessName || "____________________"}</b></p>
                                <p>Address : <b>{data.witnessAddress || "____________________"}</b></p>
                                <p>Signature : ____________________</p>
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