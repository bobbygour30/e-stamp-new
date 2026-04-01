import { useRef, useState, useContext } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";

const initialData = {
  name: "",
  relationType: "S/D/W/O",
  relationName: "",
  residentOf: "",

  childGender: "",
  birthDate: "",
  birthPlace: "",

  certificateNumber: "",
  certificateDate: "",

  verificationPlace: "",
  verificationDay: "",
  verificationMonth: "",
};

export default function NameAdditionBirthCertificate() {
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
        documentType: 'name-addition-birth-certificate',
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
        filename: "Birth_Certificate_Name_Addition_Affidavit.pdf",
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
            Birth Certificate Affidavit (Name Addition)
          </h2>

          <Input label="Name" name="name" value={data.name} onChange={update} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Relation Type (S/D/W/O)" name="relationType" value={data.relationType} onChange={update} />
            <Input label="Relation Name" name="relationName" value={data.relationName} onChange={update} />
          </div>

          <Input label="Resident Of (R/O)" name="residentOf" value={data.residentOf} onChange={update} />

          <Input label="Child Gender (Male/Female)" name="childGender" value={data.childGender} onChange={update} />
          <Input label="Birth Date" name="birthDate" value={data.birthDate} onChange={update} />
          <Input label="Birth Place" name="birthPlace" value={data.birthPlace} onChange={update} />

          <Input label="Birth Certificate Registration Number" name="certificateNumber" value={data.certificateNumber} onChange={update} />
          <Input label="Certificate Date" name="certificateDate" value={data.certificateDate} onChange={update} />

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
                marginBottom: "22px",
              }}
            >
              AFFIDAVIT
            </div>

            {/* INTRO */}
            <p style={{ textAlign: "justify", marginBottom: "16px" }}>
              I,{" "}
              <b>{data.name || "____________________"}</b>{" "}
              <b>{data.relationType}</b>{" "}
              <b>{data.relationName || "____________________"}</b>{" "}
              R/O{" "}
              <b>{data.residentOf || "____________________"}</b>, do hereby
              solemnly affirm and declare as under:-
            </p>

            {/* POINTS */}
            <div style={{ marginLeft: "14px" }}>
              <p style={{ margin: "12px 0", textIndent: "-14px" }}>
                1. That I am a citizen of India.
              </p>

              <p style={{ margin: "12px 0", textIndent: "-14px" }}>
                2. That I/My wife delivered a{" "}
                <b>{data.childGender || "__________"}</b>{" "}
                baby child on{" "}
                <b>{data.birthDate || "__________"}</b>{" "}
                at{" "}
                <b>{data.birthPlace || "__________"}</b>.
              </p>

              <p style={{ margin: "12px 0", textIndent: "-14px" }}>
                3. That my son/daughter Birth Certificate Registration Number is{" "}
                <b>{data.certificateNumber || "__________"}</b>{" "}
                dated{" "}
                <b>{data.certificateDate || "__________"}</b>.
              </p>

              <p style={{ margin: "12px 0", textIndent: "-14px" }}>
                4. That I want to include my child name in his/her Birth Certificate.
              </p>

              <p style={{ margin: "12px 0", textIndent: "-14px" }}>
                5. That it is my true and correct statement.
              </p>
            </div>

            {/* DEPONENT */}
            <div style={{ marginTop: "45px", textAlign: "right", fontWeight: "bold" }}>
              DEPONENT
            </div>

            {/* VERIFICATION */}
            <div style={{ marginTop: "40px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "12px" }}>
                VERIFICATION
              </div>

              <p style={{ textAlign: "justify" }}>
                Verified at{" "}
                <b>{data.verificationPlace || "__________"}</b>{" "}
                on this{" "}
                <b>{data.verificationDay || "__"}</b>{" "}
                day of{" "}
                <b>{data.verificationMonth || "__________"}</b>, 2025 that the
                contents of the above affidavit are true and correct to the best
                of my knowledge and belief and nothing material has been
                concealed therefrom.
              </p>

              <div style={{ marginTop: "25px", textAlign: "right", fontWeight: "bold" }}>
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