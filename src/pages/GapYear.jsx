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
  fatherName: "",
  address: "",
  passedYear: "",
  gapClass: "",
  gapFrom: "",
  gapTo: "",
  verificationPlace: "Delhi",
  verificationDate: "",
};

export default function GapYear() {
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
      filename: "Gap_Year_Affidavit.pdf",
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
        documentType: 'gap-year',
        formData: data,
        paymentAmount: 1,
      });
      
      const requestId = response.data.requestId;
      
      // Upload PDF to Cloudinary
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'gap-year', requestId);
      
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
        filename: "Gap_Year_Affidavit.pdf",
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

        {/* ================= FORM SECTION ================= */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Gap Year Affidavit
          </h2>

          <Input label="Your Name" name="name" value={data.name} onChange={update} />
          <Input label="Relation Type (S/O, D/O)" name="relationType" value={data.relationType} onChange={update} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="12th Passed Year" name="passedYear" value={data.passedYear} onChange={update} />
          <Input label="Gap After Class (e.g. 12th)" name="gapClass" value={data.gapClass} onChange={update} />
          <Input label="Gap From (Month/Year)" name="gapFrom" value={data.gapFrom} onChange={update} />
          <Input label="Gap To (Month/Year)" name="gapTo" value={data.gapTo} onChange={update} />

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

        {/* ================= PDF PREVIEW SECTION ================= */}
        <div className="bg-gray-100 rounded-xl shadow overflow-y-auto flex justify-center p-4" style={{ height: "90vh" }}>
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
              I, <b>{data.name || "____________________"}</b>{" "}
              {data.relationType}{" "}
              <b>{data.fatherName || "____________________"}</b>{" "}
              R/O <b>{data.address || "____________________"}</b>, do hereby
              solemnly affirm and declare as under:-
            </p>

            {/* POINTS */}
            <div style={{ marginLeft: "20px", marginTop: "16px" }}>
              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                1. That I am citizen of India.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                2. That I have passed 12<sup>th</sup> class Examination in the
                year <b>{data.passedYear || "______"}</b> from CBSE board Delhi.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                3. That after passing{" "}
                <b>{data.gapClass || "__"}</b> class examination I did not taken
                admission in any other college/Institution in Delhi or anywhere
                in India.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                4. That during the Gap period of{" "}
                <b>{data.gapFrom || "______"}</b> to{" "}
                <b>{data.gapTo || "______"}</b> I was at home and preparing for
                competition exam.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                5. That during the Gap Period I was not involved in any
                civil/criminal activities.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                6. That it is my true and correct statement.
              </p>
            </div>

            {/* DEPONENT */}
            <div style={{ marginTop: "40px", textAlign: "right", fontWeight: "bold" }}>
              DEPONENT
            </div>

            {/* VERIFICATION */}
            <div style={{ marginTop: "30px" }}>
              <p>
                <b>VERIFICATION:-</b>
              </p>
              <p style={{ textAlign: "justify", marginTop: "10px" }}>
                Verified at <b>{data.verificationPlace}</b> on{" "}
                <b>{formatDateForDisplay(data.verificationDate)}</b>, that the contents
                of this affidavit are true and correct to the best of my
                knowledge and belief.
              </p>
            </div>

            <div style={{ marginTop: "35px", textAlign: "right", fontWeight: "bold" }}>
              DEPONENT
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