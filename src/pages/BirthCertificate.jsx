import { useRef, useState, useContext } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";

const initialData = {
  name: "",
  fatherName: "",
  motherName: "",
  address: "",

  dob: "",
  placeOfBirth: "",

  advocateLocation: "",
  notaryLocation: "",
};

export default function BirthCertificate() {
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
      // Create document request
      const response = await documentAPI.createRequest({
        documentType: 'birth-certificate',
        formData: data,
        paymentAmount: 1, // Set to 1 for testing, change to actual amount in production
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
    alert('Payment successful! Your document request has been processed.');
    navigate('/dashboard');
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
  };

  const downloadPDF = () => {
    html2pdf()
      .from(pdfRef.current)
      .set({
        filename: "Birth_Certificate_Affidavit.pdf",
        margin: 0,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          backgroundColor: "#ffffff",
          scrollY: 0,
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

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Birth Certificate Affidavit
          </h2>

          <Input label="Your Name" name="name" value={data.name} onChange={update} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Mother Name" name="motherName" value={data.motherName} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="Date of Birth" name="dob" value={data.dob} onChange={update} />
          <Input label="Place of Birth" name="placeOfBirth" value={data.placeOfBirth} onChange={update} />

          <hr className="my-4" />

          <Input label="Advocate Location & State" name="advocateLocation" value={data.advocateLocation} onChange={update} />
          <Input label="Notary Location & State" name="notaryLocation" value={data.notaryLocation} onChange={update} />

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

        {/* ================= PDF PREVIEW ================= */}
        <div className="bg-gray-100 rounded shadow overflow-hidden flex justify-center h-screen">
          <div className="flex justify-center"
            style={{
              width: "100%",
              maxWidth: "100%",
            }}>
            <div style={{
              width: "100%",
              maxWidth: "820px",
              aspectRatio: "210 / 297",
              display: "flex",
              justifyContent: "center",
            }}>

              <div
                ref={pdfRef}
                style={{
                  width: "210mm",
                  height: "297mm",
                  backgroundColor: "#fff",
                  color: "#000",
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: "12pt",
                  lineHeight: "1.55",
                  padding: "25px",
                  boxSizing: "border-box",
                  overflow: "hidden",
                }}
              >
                {/* TITLE */}
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "14pt",
                    fontWeight: "bold",
                    marginBottom: "18px",
                  }}
                >
                  BIRTH CERTIFICATE AFFIDAVIT
                </div>

                {/* INTRO */}
                <p style={{ textAlign: "justify", marginBottom: "14px" }}>
                  I, <b>{data.name || "____________________"}</b> S/o{" "}
                  <b>{data.fatherName || "____________________"}</b> residing at{" "}
                  <b>{data.address || "____________________"}</b>, do solemnly
                  affirm and state on oath as under:
                </p>

                {/* POINTS */}
                <div style={{ marginLeft: "18px" }}>
                  <p style={{ textIndent: "-18px", margin: "8px 0" }}>
                    1. That my date of birth is <b>{data.dob || "__________"}</b>.
                  </p>

                  <p style={{ textIndent: "-18px", margin: "8px 0" }}>
                    2. That my place of birth is{" "}
                    <b>{data.placeOfBirth || "____________________"}</b>.
                  </p>

                  <p style={{ textIndent: "-18px", margin: "8px 0" }}>
                    3. That name of my father is{" "}
                    <b>{data.fatherName || "____________________"}</b>.
                  </p>

                  <p style={{ textIndent: "-18px", margin: "8px 0" }}>
                    4. That name of my mother is{" "}
                    <b>{data.motherName || "____________________"}</b>.
                  </p>

                  <p style={{ textIndent: "-18px", margin: "8px 0" }}>
                    5. That address of my parents is{" "}
                    <b>{data.address || "____________________"}</b>.
                  </p>

                  <p style={{ textIndent: "-18px", margin: "8px 0" }}>
                    6. That permanent address of my parents is{" "}
                    <b>{data.address || "____________________"}</b>.
                  </p>
                </div>

                {/* DECLARATION */}
                <p style={{ textAlign: "justify", marginTop: "14px" }}>
                  I, <b>{data.name || "____________________"}</b> do hereby solemnly
                  affirm that the contents of this affidavit from paragraph 1 to 6
                  are true and correct to the best of my personal knowledge and
                  belief. I do understand that if the above affirmation is proved to
                  be false, my admission in this company would be cancelled for
                  which I solely will be responsible.
                </p>

                <p style={{ marginTop: "14px" }}>Identified by,</p>

                {/* SIGNATURES */}
                <div style={{ marginTop: "18px" }}>
                  <p>DEPONENT</p>
                  <p>ADVOCATE’s signature with seal</p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "18px",
                    }}
                  >
                    <div>
                      Location and state
                      <br />
                      <b>{data.advocateLocation || "__________"}</b>
                    </div>
                    <div>
                      Notary seal and signature
                      <br />
                      Location and State
                      <br />
                      <b>{data.notaryLocation || "__________"}</b>
                    </div>
                  </div>

                  <p style={{ marginTop: "20px" }}>Sworn before me</p>

                  <div style={{ marginTop: "25px", fontWeight:"bold"  }}>DEPONENT</div>
                </div>
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
          onClose={handlePaymentClose}
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