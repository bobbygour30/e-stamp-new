import { useRef, useState, useContext } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";

const initialData = {
  applicantName: "",
  relationType: "D/O",
  fatherName: "",
  age: "",
  occupation: "",
  address: "",
  childName: "",
  dob: "",
  className: "",
  admissionGuidelines: "KVS Admission Guidelines 2020",
  contact1: "",
  contact2: "",
  verificationPlace: "Delhi",
  verificationDate: "",
};

export default function SingleGirl() {
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
        documentType: 'single-girl',
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
        filename: "Single_Girl_Child_Affidavit.pdf",
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

        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Single Girl Child Affidavit
          </h2>

          <Input label="Applicant Name" name="applicantName" value={data.applicantName} onChange={update} />
          <Input label="Relation Type (D/O)" name="relationType" value={data.relationType} onChange={update} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={update} />
          <Input label="Age" name="age" value={data.age} onChange={update} />
          <Input label="Occupation" name="occupation" value={data.occupation} onChange={update} />
          <Input label="Residential Address" name="address" value={data.address} onChange={update} />

          <hr className="my-4" />

          <Input label="Girl Child Name" name="childName" value={data.childName} onChange={update} />
          <Input label="Date of Birth" name="dob" value={data.dob} onChange={update} />
          <Input label="Class Applied For" name="className" value={data.className} onChange={update} />

          <hr className="my-4" />

          <Input label="Contact Number 1" name="contact1" value={data.contact1} onChange={update} />
          <Input label="Contact Number 2" name="contact2" value={data.contact2} onChange={update} />
          <Input label="Verification Date (DD/MM/YYYY)" name="verificationDate" value={data.verificationDate} onChange={update} />

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
              {loading ? 'Processing...' : 'Proceed to Payment (₹500)'}
            </button>
          </div>
        </div>

        {/* PDF Preview Section */}
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
                marginBottom: "20px",
              }}
            >
              SINGLE GIRL CHILD
            </div>

            {/* BODY */}
            <p style={{ textAlign: "justify", marginBottom: "16px" }}>
              I, <b>{data.applicantName || "____________________"}</b>{" "}
              <b>{data.relationType}</b>{" "}
              <b>{data.fatherName || "____________________"}</b>{" "}
              aged <b>{data.age || "__"}</b> years, Indian Inhabitant, occupation{" "}
              <b>{data.occupation || "____________________"}</b>, Service
              Resident of <b>{data.address || "____________________"}</b> is
              mother/father of{" "}
              <b>{data.childName || "____________________"}</b> Date of Birth{" "}
              <b>{data.dob || "__________"}</b> submitting my undertaking to the
              Head of the Institution in Class{" "}
              <b>{data.className || "__"}</b>th vide{" "}
              <b>{data.admissionGuidelines}</b>.
            </p>

            <div style={{ marginTop: "18px" }}>
              <p style={{ marginBottom: "12px" }}>
                1) I hereby declare that Miss{" "}
                <b>{data.childName || "____________________"}</b> is the only
                girl child in my family (with no male/female sibling). I
                understand that it shall be my sole responsibility to inform
                you about any change in status of single girl child in the
                family immediately, if and when it occurs.
              </p>

              <p style={{ marginBottom: "12px" }}>
                2) I am also aware that in case it is detected at any time that
                the affidavit sworn by me is false, appropriate action will be
                taken by the school authorities and KVS against me.
              </p>
            </div>

            {/* SIGNATURES */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "35px",
              }}
            >
              <div>Signature of father</div>
              <div>Signature of mother</div>
            </div>

            {/* ADDRESS & CONTACT */}
            <p style={{ marginTop: "25px" }}>
              Residential address with{" "}
              <b>{data.address || "____________________"}</b>
            </p>
            <p>
              with Contact number:{" "}
              <b>{data.contact1 || "__________"}</b>{" "}
              {data.contact2 && ` / ${data.contact2}`}
            </p>

            {/* VERIFICATION */}
            <div style={{ marginTop: "25px" }}>
              <p>
                Solemnly affirmed at <b>{data.verificationPlace}</b>
              </p>
              <p>This 1st day of December 2020.</p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "18px",
                  fontWeight: "bold",
                }}
              >
                <div>VERIFICATION:-</div>
                <div>DEPONENT</div>
              </div>

              <p style={{ marginTop: "10px" }}>
                Verified at <b>{data.verificationPlace}</b> on this{" "}
                <b>{data.verificationDate || "__/__/____"}</b>, that the contents
                of this affidavit are true and correct to the best of my
                knowledge and belief.
              </p>

              <div style={{ textAlign: "right", marginTop: "25px", fontWeight: "bold" }}>
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
          amount={500}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}

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