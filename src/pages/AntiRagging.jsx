import { useRef, useState, useContext } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";
import { uploadPDFToCloudinary } from "../utils/cloudinary";

const initialData = {
  studentName: "",
  relationType: "D/O",
  fatherName: "",
  address: "",
  age: "",
  hostelName: "",
  guardianName: "",
  guardianRelation: "Father",
  guardianAddress: "",
  date: "",
};

export default function AntiRagging() {
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
    if (!dateString) return "__/__/____";
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
      filename: "Anti_Ragging_Undertaking_Affidavit.pdf",
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
        documentType: 'anti-ragging',
        formData: data,
        paymentAmount: 1,
      });
      
      const requestId = response.data.requestId;
      
      // Upload PDF to Cloudinary
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'anti-ragging', requestId);
      
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
        filename: "Anti_Ragging_Undertaking_Affidavit.pdf",
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
            Anti Ragging Undertaking
          </h2>

          <Input label="Student Name" name="studentName" value={data.studentName} onChange={update} />
          <Input label="Relation Type (S/O, D/O)" name="relationType" value={data.relationType} onChange={update} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Age" name="age" value={data.age} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />
          <Input label="Hostel Name" name="hostelName" value={data.hostelName} onChange={update} />

          <hr className="my-4" />

          <Input label="Guardian Name" name="guardianName" value={data.guardianName} onChange={update} />
          <Input label="Guardian Relation" name="guardianRelation" value={data.guardianRelation} onChange={update} />
          <Input label="Guardian Address" name="guardianAddress" value={data.guardianAddress} onChange={update} />
          
          <DateInput 
            label="Date" 
            name="date" 
            value={data.date} 
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
            <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "6px" }}>
              ANTI RAGGING
            </div>
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                textDecoration: "underline",
                marginBottom: "18px",
              }}
            >
              UNDERTAKING AFFIDAVIT
            </div>

            {/* INTRO */}
            <p style={{ textAlign: "justify" }}>
              I, <b>{data.studentName || "____________________"}</b>{" "}
              {data.relationType}{" "}
              <b>{data.fatherName || "____________________"}</b>{" "}
              R/O <b>{data.address || "____________________"}</b>, aged{" "}
              <b>{data.age || "__"}</b> years, presently residing in allotted
              room in <b>{data.hostelName || "____________________"}</b> hostel,
              do hereby solemnly affirm, undertake, and declare as under:-
            </p>

            {/* POINTS */}
            <div style={{ marginLeft: "16px", marginTop: "14px" }}>
              <p style={{ textIndent: "-16px", marginBottom: "10px" }}>
                1. That my parents and I have obtained and read the prospectus,
                hostel book containing Anti Ragging regulations of the
                University and have read them thoroughly, undertake to abide by
                them in letter and spirit. I understand that my failure to abide
                by any of them shall make me liable to disciplinary action
                including rustication by the college authorities. I understand
                that the decision by the administration in this regard shall be
                binding and final for me.
              </p>

              <p style={{ textIndent: "-16px", marginBottom: "10px" }}>
                2. That I understand that Ragging is an offence and punishable by
                law as per the direction of the Hon'ble Supreme Court of India.
              </p>

              <p style={{ textIndent: "-16px", marginBottom: "10px" }}>
                3. That I understand that Ragging in any form is strictly
                prohibited.
              </p>

              <p style={{ textIndent: "-16px", marginBottom: "10px" }}>
                4. I have read the relevant instruction/regulations regarding
                Ragging and understand that it is punishable as per law. If I
                indulge in Ragging of any sort in hostel/campus and been found
                guilty the Administration can take action as stipulated by law
                and FIR may be lodge.
              </p>

              <p style={{ textIndent: "-16px", marginBottom: "10px" }}>
                5. I will abide with the rules of the Hostel and will not indulge
                in any type of ragging activities.
              </p>
            </div>

            <p style={{ marginTop: "14px" }}>
              I have also read and understood the above contents.
            </p>

            {/* SIGNATURES */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "25px",
              }}
            >
              <div>Signature of Guardian/parent:</div>
              <div>Signature of Student</div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "18px",
              }}
            >
              <div>
                Name: <b>{data.guardianName || "____________________"}</b>
                <br />
                Relation: <b>{data.guardianRelation}</b>
                <br />
                Address: <b>{data.guardianAddress || "____________________"}</b>
                <br />
                Dated: <b>{formatDateForDisplay(data.date)}</b>
              </div>
              <div>
                Name: <b>{data.studentName || "____________________"}</b>
                <br />
                Date: <b>{formatDateForDisplay(data.date)}</b>
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