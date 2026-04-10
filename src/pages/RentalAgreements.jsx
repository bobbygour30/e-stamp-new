import { useRef, useState, useContext } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI } from "../services/api";
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
    secondlicenseType: "",
    licensePurpose: "",
    licenseDurationMonths: "",
    licenseStartDate: "",
    licenseEndDate: "",
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
    const pdfRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

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
            margin: [0.3, 0.3, 0.3, 0.3], // Smaller margins to prevent cutting
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
            
            const response = await documentAPI.createRequest({
                documentType: 'rental-agreement',
                formData: data,
                paymentAmount: 1,
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

                    {/* License Details */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <Input label="License Type" name="secondlicenseType" value={data.secondlicenseType} onChange={update} />
                        <Input label="License Purpose" name="licensePurpose" value={data.licensePurpose} onChange={update} />
                        <Input label="License Duration (Months)" name="licenseDurationMonths" value={data.licenseDurationMonths} onChange={update} />
                        <DateInput label="License Start Date" name="licenseStartDate" value={data.licenseStartDate} onChange={update} />
                        <DateInput label="License End Date" name="licenseEndDate" value={data.licenseEndDate} onChange={update} />
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
                            {uploading ? 'Generating PDF...' : loading ? 'Processing...' : 'Proceed to Payment (₹1)'}
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
                                The Licensee has approached the Licensor with request to permit him/her to use & occupy the said premises on{" "}
                                <b>{data.secondlicenseType || "____________"}</b> basis as{" "}
                                <b>{data.licensePurpose || "____________"}</b> Purpose for a period of{" "}
                                <b>{data.licenseDurationMonths || "____"}</b> months.
                            </p>

                            <h2 style={{ fontWeight: "bold", margin: "20px 0", textAlign: "center", fontSize: "13pt" }}>
                                NOW THEREFORE THESE PRESENT WITNESSTH THIS AGREEMENT AND IT IS HEREBY AGREED BY AND BETWEEN THE PARTIES HERETO AS FOLLOWS:
                            </h2>
                        </div>

                        {/* Terms & Conditions */}
                        <div style={{ marginLeft: "0px" }}>
                            <div style={{ margin: "10px 0" }}>
                                1. The Licensor agrees to demise unto the Licensee and the Licensee hereby accepts the said premises... for a period of <b>{data.licenseDurationMonths || "____"} Months</b> with effect from <b>{formatDateForDisplay(data.licenseStartDate)}</b> to <b>{formatDateForDisplay(data.licenseEndDate)}</b> on Leave and License basis.
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
                    amount={1}
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