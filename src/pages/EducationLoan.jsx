import { useRef, useState, useContext } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";
import { uploadPDFToCloudinary } from "../utils/cloudinary";

const initialData = {
  deponent1Name: "",
  deponent1Relation: "S/O",
  deponent1Father: "",
  deponent2Name: "",
  deponent2Relation: "S/O",
  deponent2Father: "",
  address: "",
  studentName: "",
  course: "B.TECH",
  duration: "4",
  institute: "",
  verificationPlace: "Delhi",
  verificationDate: "",
};

export default function EducationLoan() {
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
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: "Education_Loan_Affidavit.pdf",
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
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
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
      
      // Create document request
      const response = await documentAPI.createRequest({
        documentType: 'education-loan',
        formData: data,
        paymentAmount: 1,
      });
      
      const requestId = response.data.requestId;
      
      // Upload PDF to Cloudinary
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'education-loan', requestId);
      
      // Update request with PDF URL
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
        filename: "Education_Loan_Affidavit.pdf",
        margin: [0.5, 0.5, 0.5, 0.5],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0, backgroundColor: "#ffffff" },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: [] },
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-[#f3f1fa] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Education Loan Affidavit
          </h2>

          <Input label="Deponent (1) Name" name="deponent1Name" value={data.deponent1Name} onChange={update} />
          <Input label="Deponent (1) Father Name" name="deponent1Father" value={data.deponent1Father} onChange={update} />

          <Input label="Deponent (2) Name" name="deponent2Name" value={data.deponent2Name} onChange={update} />
          <Input label="Deponent (2) Father Name" name="deponent2Father" value={data.deponent2Father} onChange={update} />

          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="Student Name" name="studentName" value={data.studentName} onChange={update} />
          <Input label="Institute Name" name="institute" value={data.institute} onChange={update} />

          <DateInput 
            label="Verification Date" 
            name="verificationDate" 
            value={data.verificationDate} 
            onChange={update} 
          />

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
              {uploading ? 'Generating PDF...' : loading ? 'Processing...' : 'Proceed to Payment (₹1)'}
            </button>
          </div>
        </div>

        {/* ================= PDF PREVIEW ================= */}
        <div className="bg-gray-100 rounded shadow overflow-y-auto flex justify-center p-4" style={{ height: "90vh" }}>
          <div
            ref={pdfRef}
            style={{
              width: "210mm",
              minHeight: "297mm",
              backgroundColor: "#fff",
              color: "#000",
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: "12pt",
              lineHeight: "1.55",
              padding: "25px",
              boxSizing: "border-box",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              margin: "0 auto",
            }}
          >
            {/* TITLE */}
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                textDecoration: "underline",
                marginBottom: "22px",
                fontSize: "15pt",
              }}
            >
              AFFIDAVIT
            </div>

            {/* INTRO */}
            <p style={{ textAlign: "justify" }}>
              We, (1) <b>{data.deponent1Name || "____________________"}</b>{" "}
              S/O <b>{data.deponent1Father || "____________________"}</b> (2){" "}
              <b>{data.deponent2Name || "____________________"}</b> S/O{" "}
              <b>{data.deponent2Father || "____________________"}</b> both R/o{" "}
              <b>{data.address || "____________________"}</b>, do hereby
              solemnly affirm and declare as under:-
            </p>

            {/* POINTS */}
            <div style={{ marginLeft: "20px", marginTop: "16px" }}>
              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                (I) That we are citizen of India.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                (II) That we are bonafide resident of{" "}
                <b>{data.address || "____________________"}</b>.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                (III) That neither we nor any member of our family has applied
                for/availed any type of Education Loan for any member of the
                family from any bank / financial Institution.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                (IV) That we have applied for an education loan from State Bank
                of India for{" "}
                <b>{data.studentName || "____________________"}</b> for{" "}
                <b>{data.course}</b> ({data.duration} years) from{" "}
                <b>{data.institute || "____________________"}</b>.
              </p>

              <p style={{ marginTop: "6px" }}>
                That this is a true statement.
              </p>
            </div>

            {/* DEPONENTS */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "45px",
              }}
            >
              <div>Deponent (1)</div>
              <div>Deponent (2)</div>
            </div>

            {/* VERIFICATION */}
            <div style={{ marginTop: "30px" }}>
              <p>
                <b>Verification:-</b>
              </p>
              <p style={{ textAlign: "justify", marginTop: "10px" }}>
                Verified at <b>{data.verificationPlace}</b> on{" "}
                <b>{formatDateForDisplay(data.verificationDate)}</b> that the contents
                of the above affidavit are true and correct to the best of my
                knowledge and belief.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "40px",
              }}
            >
              <div>Deponent (1)</div>
              <div>Deponent (2)</div>
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