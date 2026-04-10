import { useRef, useState, useContext } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";
import { uploadPDFToCloudinary } from "../utils/cloudinary";

const initialData = {
  name: "",
  relationType: "D/O",
  fatherName: "",
  address: "",
  collegeName: "",
  universityName: "",
  course: "",
  year: "",
  section: "",
};

export default function ShortAttendence() {
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

  // Generate PDF as Blob using html2pdf
  const generatePDFBlob = async () => {
    const element = pdfRef.current;
    if (!element) {
      throw new Error('PDF element not found');
    }
    
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3], // Smaller margins to prevent cutting
      filename: "Short_Attendance_Affidavit.pdf",
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
        documentType: 'short-attendance',
        formData: data,
        paymentAmount: 1,
      });

      const requestId = response.data.requestId;
      
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'short-attendance', requestId);
      
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
        filename: "Short_Attendance_Affidavit.pdf",
        margin: [0.3, 0.3, 0.3, 0.3],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          scrollY: 0,
          backgroundColor: "#ffffff",
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
            Short Attendance Affidavit
          </h2>

          <Input label="Student Name" name="name" value={data.name} onChange={update} />
          <Input label="Relation Type (D/O / S/O)" name="relationType" value={data.relationType} onChange={update} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="College Name" name="collegeName" value={data.collegeName} onChange={update} />
          <Input label="University Name" name="universityName" value={data.universityName} onChange={update} />
          <Input label="Course" name="course" value={data.course} onChange={update} />
          <Input label="Year" name="year" value={data.year} onChange={update} />
          <Input label="Section" name="section" value={data.section} onChange={update} />

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
                marginBottom: "25px",
              }}
            >
              AFFIDAVIT
            </div>

            {/* BODY */}
            <p style={{ textAlign: "justify", marginBottom: "15px" }}>
              I, <b>{data.name || "____________________"}</b> {data.relationType} <b>{data.fatherName || "____________________"}</b> address <b>{data.address || "____________________"}</b> studying in <b>{data.collegeName || "____________________"}</b> (<b>{data.universityName || "____________________"}</b>), Delhi.
            </p>

            <p style={{ textAlign: "justify", marginBottom: "15px" }}>
              <b>{data.course || "__________"}</b> year (<b>{data.section || "___"}</b>) am severally short of attendance. I assure that this will not be repeated next year. I will make up my attendance of the previous year as well as next year, failing which I will not be allowed to appear for the examination.
            </p>

            {/* SIGNATURE */}
            <div
              style={{
                marginTop: "80px",
                textAlign: "right",
                fontWeight: "bold"
              }}
            >
              Signature
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