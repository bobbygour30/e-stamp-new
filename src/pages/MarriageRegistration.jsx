import { useRef, useState, useContext } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";

const initialData = {
  name: "",
  fatherName: "",
  residentOf: "",

  spouseName: "",
  spouseFatherName: "",
  spouseResidentOf: "",

  marriageDate: "",
  marriagePlace: "",
  marriageAccordingTo: "",

  dob: "",
  maritalStatusBefore: "",
  religion: "",

  verificationPlace: "",
  verificationDay: "",
  verificationMonth: "",
};

export default function MarriageRegistration() {
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
        documentType: 'marriage-registration',
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
        filename: "Marriage_Registration_Affidavit.pdf",
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
        pagebreak: { mode: ["css", "legacy"] },
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-[#f3f1fa] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= FORM SECTION ================= */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Marriage Registration Affidavit
          </h2>

          <Input label="Your Name" name="name" value={data.name} onChange={update} />
          <Input label="Father's Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Resident Of" name="residentOf" value={data.residentOf} onChange={update} />

          <hr className="my-4" />

          <Input label="Spouse Name" name="spouseName" value={data.spouseName} onChange={update} />
          <Input label="Spouse Father Name" name="spouseFatherName" value={data.spouseFatherName} onChange={update} />
          <Input label="Spouse Resident Of" name="spouseResidentOf" value={data.spouseResidentOf} onChange={update} />

          <hr className="my-4" />

          <Input label="Marriage Date" name="marriageDate" value={data.marriageDate} onChange={update} />
          <Input label="Marriage Place" name="marriagePlace" value={data.marriagePlace} onChange={update} />
          <Input label="Marriage According To" name="marriageAccordingTo" value={data.marriageAccordingTo} onChange={update} />

          <Input label="Date of Birth" name="dob" value={data.dob} onChange={update} />
          <Input label="Marital Status Before Marriage" name="maritalStatusBefore" value={data.maritalStatusBefore} onChange={update} />
          <Input label="Religion" name="religion" value={data.religion} onChange={update} />

          <div className="grid grid-cols-3 gap-3">
            <Input label="Verification Place" name="verificationPlace" value={data.verificationPlace} onChange={update} />
            <Input label="Day" name="verificationDay" value={data.verificationDay} onChange={update} />
            <Input label="Month" name="verificationMonth" value={data.verificationMonth} onChange={update} />
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
              disabled={loading}
              className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-lg font-medium disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : 'Proceed to Payment (₹1)'}
            </button>
          </div>
        </div>

        {/* ================= FIXED PDF PREVIEW SECTION ================= */}
        <div className="bg-gray-100 rounded-xl shadow overflow-y-auto flex justify-center p-4" style={{ height: "90vh" }}>
          <div
            ref={pdfRef}
            style={{
              width: "210mm",
              minHeight: "594mm",           // Enough height for 2 pages
              backgroundColor: "#fff",
              color: "#000",
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: "12pt",
              lineHeight: "1.55",
              padding: "0",
              boxSizing: "border-box",
              margin: "0 auto",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* ================= PAGE 1 ================= */}
            <div
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "25px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline", fontSize: "15pt", marginBottom: "20px" }}>
                AFFIDAVIT
              </div>

              <p style={{ textAlign: "justify" }}>
                I, <b>{data.name || "____________________"}</b> S/O{" "}
                <b>{data.fatherName || "____________________"}</b> Resident of{" "}
                <b>{data.residentOf || "____________________"}</b> do hereby
                solemnly affirm and declare as under:-
              </p>

              <p style={{ marginTop: "14px", textAlign: "justify" }}>
                1. That I got married to <b>{data.spouseName || "____________________"}</b>{" "}
                D/O <b>{data.spouseFatherName || "____________________"}</b>{" "}
                R/O <b>{data.spouseResidentOf || "____________________"}</b>{" "}
                on <b>{data.marriageDate || "__________"}</b> at{" "}
                <b>{data.marriagePlace || "____________________"}</b>{" "}
                according to <b>{data.marriageAccordingTo || "__________"}</b>.
              </p>

              <p style={{ marginTop: "10px" }}>
                2. That my date of birth is <b>{data.dob || "__________"}</b>.
              </p>

              <p style={{ marginTop: "10px" }}>
                3. That I was <b>{data.maritalStatusBefore || "__________"}</b>{" "}
                till the time of marriage and I did not have any other living
                spouse at the time of marriage.
              </p>

              <p style={{ marginTop: "10px" }}>
                4. That at the time of marriage I was not related to the bride/groom
                within the prohibited degree of relationship as per Hindu Marriage Act.
              </p>

              <p style={{ marginTop: "10px" }}>
                5. That I belong to <b>{data.religion || "__________"}</b> religion.
              </p>

              <p style={{ marginTop: "10px" }}>
                6. That I am a citizen of India.
              </p>

              <div style={{ marginTop: "50px", textAlign: "right", fontWeight: "bold" }}>
                DEPONENT
              </div>
            </div>

            {/* ================= PAGE 2 ================= */}
            <div
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "25px",
                boxSizing: "border-box",
                borderTop: "1px solid #ddd",
              }}
            >
              <div style={{ fontWeight: "bold", textDecoration: "underline", marginBottom: "12px" }}>
                VERIFICATION:
              </div>

              <p style={{ textAlign: "justify" }}>
                Verified at <b>{data.verificationPlace || "__________"}</b> on{" "}
                <b>{data.verificationDay || "__"}</b> day of{" "}
                <b>{data.verificationMonth || "__________"}</b>, 2025 that the
                contents of this above affidavit are true and correct to the best
                of my knowledge and belief and nothing has been concealed
                therefrom.
              </p>

              <div style={{ marginTop: "80px", textAlign: "right", fontWeight: "bold" }}>
                DEPONENT
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