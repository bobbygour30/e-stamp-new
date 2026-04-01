import { useRef, useState, useContext } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";

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
  const pdfRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const update = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await documentAPI.createRequest({
        documentType: 'short-attendance',
        formData: data,
        paymentAmount: 1, // Change to 500 in production
      });

      setRequestId(response.data.requestId);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request. Please try again.');
    } finally {
      setLoading(false);
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
        margin: 0,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          scrollY: 0,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
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
              disabled={loading}
              className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-lg font-medium disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : 'Proceed to Payment (₹1)'}
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
                fontSize: "15pt",
                fontWeight: "bold",
                textDecoration: "underline",
                marginBottom: "30px",
              }}
            >
              AFFIDAVIT
            </div>

            {/* BODY */}
            <p style={{ textAlign: "justify" }}>
              I, <b>{data.name || "____________________"}</b>{" "}
              {data.relationType}{" "}
              <b>{data.fatherName || "____________________"}</b> address{" "}
              <b>{data.address || "____________________"}</b> studying in{" "}
              <b>{data.collegeName || "____________________"}</b> (
              <b>{data.universityName || "____________________"}</b>), Delhi.
            </p>

            <p style={{ textAlign: "justify", marginTop: "14px" }}>
              <b>{data.course || "__________"}</b> year (
              <b>{data.section || "___"}</b>) am severally short of attendance.
              I assure that this will not be repeated next year. I will make up
              my attendance of the previous year as well as next year, failing
              which I will not be allowed to appear for the examination.
            </p>

            {/* SIGNATURE */}
            <div
              style={{
                marginTop: "100px",
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