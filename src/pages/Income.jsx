import { useRef, useState, useContext } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";

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
        documentType: 'income-affidavit',   // Recommended document type
        formData: data,
        paymentAmount: 1, // Set to 1 for testing, change to 500 in production
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
        filename: "Income_Affidavit.pdf",
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
            Income Affidavit
          </h2>

          <Input label="Your Name" name="name" value={data.name} onChange={update} />
          <Input label="Relation Type (S/O, D/O)" name="relationType" value={data.relationType} onChange={update} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="Child Name" name="childName" value={data.childName} onChange={update} />
          <Input label="Child Gender (Son/Daughter)" name="childGender" value={data.childGender} onChange={update} />
          <Input label="Date of Birth" name="dob" value={data.dob} onChange={update} />
          <Input label="Class" name="className" value={data.className} onChange={update} />
          <Input label="Section" name="section" value={data.section} onChange={update} />
          <Input label="School Name" name="schoolName" value={data.schoolName} onChange={update} />

          <hr className="my-4" />

          <Input label="Annual Family Income (Rs.)" name="income" value={data.income} onChange={update} />
          <Input label="Category (SC/ST/OBC)" name="category" value={data.category} onChange={update} />
          <Input
            label="Verification Date (e.g. 08th January 2021)"
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
                2. That above said address is my permanent address.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                3. That my {data.childGender.toLowerCase()}{" "}
                <b>{data.childName || "____________________"}</b> and his/her
                correct date of birth is <b>{data.dob || "__________"}</b>,
                he/she is studying in class{" "}
                <b>{data.className || "__"}</b> Sec-
                <b>{data.section || "_"}</b> from{" "}
                <b>{data.schoolName || "____________________"}</b>.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                4. That my total family income from all sources is{" "}
                <b>Rs.{data.income || "________"}/-</b> per annum.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                5. That I belongs to <b>{data.category} CATEGORY</b>.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                6. That I am getting benefits only for two childrens.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "10px" }}>
                7. That it is my true and correct statement.
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
                <b>{data.verificationDate || "__________"}</b> that the contents
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