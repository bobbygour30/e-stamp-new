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
  childName: "",
  childGender: "Son",
  dob: "",
  className: "",
  section: "",
  schoolName: "",
  income: "",
  category: "SC",
  verificationPlace: "Delhi",
  verificationDate: "",
};

export default function Income() {
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
      filename: "Income_Affidavit.pdf",
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
        documentType: 'income-affidavit',
        formData: data,
        paymentAmount: 1,
      });
      
      const requestId = response.data.requestId;
      
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'income-affidavit', requestId);
      
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
        filename: "Income_Affidavit.pdf",
        margin: [0.3, 0.3, 0.3, 0.3],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0, backgroundColor: "#ffffff" },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
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
            Income Affidavit
          </h2>

          <Input label="Your Name" name="name" value={data.name} onChange={update} />
          <Input label="Relation Type (S/O, D/O)" name="relationType" value={data.relationType} onChange={update} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="Child Name" name="childName" value={data.childName} onChange={update} />
          <Input label="Child Gender (Son/Daughter)" name="childGender" value={data.childGender} onChange={update} />
          <DateInput 
            label="Date of Birth" 
            name="dob" 
            value={data.dob} 
            onChange={update} 
          />
          <Input label="Class" name="className" value={data.className} onChange={update} />
          <Input label="Section" name="section" value={data.section} onChange={update} />
          <Input label="School Name" name="schoolName" value={data.schoolName} onChange={update} />

          <hr className="my-4" />

          <Input label="Annual Family Income (Rs.)" name="income" value={data.income} onChange={update} />
          <Input label="Category (SC/ST/OBC)" name="category" value={data.category} onChange={update} />
          
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
                fontWeight: "bold",
                textDecoration: "underline",
                marginBottom: "22px",
                fontSize: "15pt",
              }}
            >
              AFFIDAVIT
            </div>

            {/* INTRO */}
            <p style={{ textAlign: "justify", marginBottom: "15px" }}>
              I, <b>{data.name || "____________________"}</b> {data.relationType} <b>{data.fatherName || "____________________"}</b> R/O <b>{data.address || "____________________"}</b>, do hereby solemnly affirm and declare as under:-
            </p>

            {/* POINTS */}
            <div style={{ marginLeft: "0px", marginTop: "10px" }}>
              <p style={{ margin: "8px 0" }}>
                1. That I am a citizen of India.
              </p>

              <p style={{ margin: "8px 0" }}>
                2. That the above said address is my permanent address.
              </p>

              <p style={{ margin: "8px 0" }}>
                3. That my {data.childGender.toLowerCase()} <b>{data.childName || "____________________"}</b> and his/her correct date of birth is <b>{formatDateForDisplay(data.dob)}</b>, he/she is studying in class <b>{data.className || "__"}</b> Sec-<b>{data.section || "_"}</b> from <b>{data.schoolName || "____________________"}</b>.
              </p>

              <p style={{ margin: "8px 0" }}>
                4. That my total family income from all sources is <b>Rs.{data.income || "________"}/-</b> per annum.
              </p>

              <p style={{ margin: "8px 0" }}>
                5. That I belong to <b>{data.category}</b> category.
              </p>

              <p style={{ margin: "8px 0" }}>
                6. That I am getting benefits only for two children.
              </p>

              <p style={{ margin: "8px 0" }}>
                7. That the above statements are true and correct to the best of my knowledge and belief.
              </p>
            </div>

            {/* DEPONENT */}
            <div style={{ marginTop: "40px", textAlign: "right" }}>
              <b>DEPONENT</b>
            </div>

            {/* VERIFICATION */}
            <div style={{ marginTop: "30px" }}>
              <p>
                <b>VERIFICATION:-</b>
              </p>
              <p style={{ textAlign: "justify", marginTop: "10px" }}>
                Verified at <b>{data.verificationPlace}</b> on <b>{formatDateForDisplay(data.verificationDate)}</b> that the contents of this affidavit are true and correct to the best of my knowledge and belief.
              </p>
            </div>

            <div style={{ marginTop: "35px", textAlign: "right" }}>
              <b>DEPONENT</b>
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