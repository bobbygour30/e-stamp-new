import { useRef, useState, useContext } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { documentAPI } from "../services/api";
import PaymentModal from "../components/PaymentModal";
import { uploadPDFToCloudinary } from "../utils/cloudinary";

const initialData = {
  groomName: "",
  groomFather: "",
  groomAddress: "",
  brideName: "",
  brideFather: "",
  brideAddress: "",
  marriageDate: "",
  marriagePlace: "",
  dob: "",
  ageAtMarriage: "",
  verificationPlace: "Delhi",
  verificationDate: "",
};

export default function MarriageRegister() {
  const [data, setData] = useState(initialData);
  const [showPayment, setShowPayment] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const pdfRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const update = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  // FIXED: Generate PDF as Blob using html2pdf with proper method
  const generatePDFBlob = () => {
    return new Promise((resolve, reject) => {
      const element = pdfRef.current;
      const opt = {
        margin: 0,
        filename: "Marriage_Registration_Affidavit.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, scrollY: 0, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: [] },
      };
      
      // Create a temporary div to clone the content
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '210mm';
      container.style.backgroundColor = '#fff';
      document.body.appendChild(container);
      
      // Clone the element and append to container
      const clone = element.cloneNode(true);
      container.appendChild(clone);
      
      // Generate PDF from the clone
      html2pdf().set(opt).from(container).outputPdf('blob').then((pdfBlob) => {
        // Clean up
        document.body.removeChild(container);
        resolve(pdfBlob);
      }).catch((error) => {
        document.body.removeChild(container);
        reject(error);
      });
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      // Step 1: Generate PDF Blob
      setUploading(true);
      const pdfBlob = await generatePDFBlob();
      
      console.log('PDF Blob generated:', pdfBlob);
      console.log('PDF Blob size:', pdfBlob.size);
      console.log('PDF Blob type:', pdfBlob.type);
      
      // Step 2: Create document request in backend
      const response = await documentAPI.createRequest({
        documentType: 'marriage-register',
        formData: data,
        paymentAmount: 1,
      });
      
      const requestId = response.data.requestId;
      
      // Step 3: Upload PDF to Cloudinary
      const uploadResult = await uploadPDFToCloudinary(pdfBlob, 'marriage-register', requestId);
      
      // Step 4: Update request with PDF URL
      await documentAPI.updatePDFUrl(requestId, {
        pdfUrl: uploadResult.url,
        cloudinaryPublicId: uploadResult.publicId
      });
      
      setRequestId(requestId);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request. Please try again.');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    navigate('/dashboard');
  };


  return (
    <div className="min-h-screen bg-[#f3f1fa] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Marriage Registration Affidavit
          </h2>

          <Input label="Groom Name" name="groomName" value={data.groomName} onChange={update} />
          <Input label="Groom Father Name" name="groomFather" value={data.groomFather} onChange={update} />
          <Input label="Groom Address" name="groomAddress" value={data.groomAddress} onChange={update} />

          <hr className="my-4" />

          <Input label="Bride Name" name="brideName" value={data.brideName} onChange={update} />
          <Input label="Bride Father Name" name="brideFather" value={data.brideFather} onChange={update} />
          <Input label="Bride Address" name="brideAddress" value={data.brideAddress} onChange={update} />

          <hr className="my-4" />

          <Input label="Marriage Date" name="marriageDate" value={data.marriageDate} onChange={update} />
          <Input label="Marriage Place" name="marriagePlace" value={data.marriagePlace} onChange={update} />
          <Input label="Your Date of Birth" name="dob" value={data.dob} onChange={update} />
          <Input label="Age at Marriage" name="ageAtMarriage" value={data.ageAtMarriage} onChange={update} />

          <Input
            label="Verification Date (e.g. 22nd October 2019)"
            name="verificationDate"
            value={data.verificationDate}
            onChange={update}
          />

          <div className="flex gap-3 mt-6">
           
            <button
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-lg font-medium disabled:opacity-50 transition"
            >
              {uploading ? 'Generating PDF...' : loading ? 'Processing...' : 'Proceed to Payment (₹1)'}
            </button>
          </div>
        </div>

        {/* PDF Preview Section - Keep the same */}
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
            {/* Your existing PDF content here - same as before */}
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

            <p style={{ textAlign: "justify", marginBottom: "16px" }}>
              I, <b>{data.groomName || "____________________"}</b> Son of Shri{" "}
              <b>{data.groomFather || "____________________"}</b> R/O{" "}
              <b>{data.groomAddress || "____________________"}</b>, do hereby
              take oath and solemnly affirm and declare as under:-
            </p>

            <div style={{ marginLeft: "20px" }}>
              <p style={{ textIndent: "-20px", marginBottom: "12px" }}>
                I. That I got married to{" "}
                <b>{data.brideName || "____________________"}</b> D/O Shri{" "}
                <b>{data.brideFather || "____________________"}</b> R/O{" "}
                <b>{data.brideAddress || "____________________"}</b> on{" "}
                <b>{data.marriageDate || "__________"}</b> at{" "}
                <b>{data.marriagePlace || "____________________"}</b>.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "12px" }}>
                II. That my date of Birth is <b>{data.dob || "__________"}</b>{" "}
                and I have completed <b>{data.ageAtMarriage || "__"}</b> years
                of age at the time of marriage.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "12px" }}>
                III. That I was unmarried till the time of marriage on{" "}
                <b>{data.marriageDate || "__________"}</b> and I did not have a
                spouse living at the time of marriage.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "12px" }}>
                IV. That the marriage was conducted as per <b>Hindu</b> Rites.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "12px" }}>
                V. That I belong to <b>Hindu</b> religion.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "12px" }}>
                VI. That at the time of marriage, I was capable of giving valid
                consent and of sound mind, not suffering from any mental
                disorder/insanity.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "12px" }}>
                VII. That until the time of marriage I was not related to{" "}
                <b>{data.brideName || "____________________"}</b> D/O Shri{" "}
                <b>{data.brideFather || "____________________"}</b> within the
                prohibited degree of relationship and not spinals as per{" "}
                <b>Hindu Marriage Act</b>.
              </p>

              <p style={{ textIndent: "-20px", marginBottom: "12px" }}>
                VIII. That I am an Indian citizen.
              </p>
            </div>

            <div style={{ marginTop: "40px", textAlign: "right", fontWeight: "bold" }}>
              DEPONENT
            </div>

            <div style={{ marginTop: "30px" }}>
              <p>
                <b>Verification:-</b>
              </p>
              <p style={{ textAlign: "justify", marginTop: "10px" }}>
                Verified at <b>{data.verificationPlace}</b> on{" "}
                <b>{data.verificationDate || "__________"}</b> that the above
                content are true and correct to the best of my knowledge and
                belief and nothing has been concealed therein.
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